import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { randomUUID } from "node:crypto";
import { createClient } from "redis";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

app.use(helmet());
app.use(cors());
app.use(express.json());

const tasks = new Map();
const validStatuses = new Set(["todo", "in_progress", "done"]);

const redis = createClient({ url: redisUrl });
redis.on("error", (error) => {
  console.error("Redis unavailable. Continuing without cache.", error.message);
});
redis.connect().catch(() => {});

app.get("/health", async (_req, res) => {
  let cache = "disconnected";

  try {
    if (redis.isOpen) {
      await redis.ping();
      cache = "connected";
    }
  } catch (_error) {
    cache = "degraded";
  }

  res.json({
    service: "cloud-native-task-management-api",
    status: "ok",
    cache
  });
});

app.get("/tasks", async (_req, res) => {
  const cacheKey = "tasks:all";

  if (redis.isOpen) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  }

  const payload = Array.from(tasks.values());

  if (redis.isOpen) {
    await redis.set(cacheKey, JSON.stringify(payload), { EX: 30 });
  }

  return res.json(payload);
});

app.post("/tasks", async (req, res) => {
  const title = String(req.body?.title || "").trim();
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const task = {
    id: randomUUID(),
    title,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.set(task.id, task);
  if (redis.isOpen) {
    await redis.del("tasks:all");
  }

  return res.status(201).json(task);
});

app.patch("/tasks/:id/status", async (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "task not found" });
  }

  const status = String(req.body?.status || "");
  if (!validStatuses.has(status)) {
    return res.status(400).json({ error: "invalid status" });
  }

  const updated = {
    ...task,
    status,
    updatedAt: new Date().toISOString()
  };

  tasks.set(task.id, updated);
  if (redis.isOpen) {
    await redis.del("tasks:all");
  }

  return res.json(updated);
});

app.listen(port, () => {
  console.log(`Task API listening on port ${port}`);
});
