import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createTaskStore } from "./taskStore.js";

export function createTaskApiApp({
  redisClient,
  taskStore = createTaskStore()
} = {}) {
  const app = express();
  const redis = redisClient || {
    isOpen: false,
    ping: async () => "PONG",
    get: async () => null,
    set: async () => undefined,
    del: async () => undefined
  };

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

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

    const payload = taskStore.list();

    if (redis.isOpen) {
      await redis.set(cacheKey, JSON.stringify(payload), { EX: 30 });
    }

    return res.json(payload);
  });

  app.post("/tasks", async (req, res) => {
    const result = taskStore.create(req.body?.title);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    if (redis.isOpen) {
      await redis.del("tasks:all");
    }

    return res.status(201).json(result.task);
  });

  app.patch("/tasks/:id/status", async (req, res) => {
    const result = taskStore.updateStatus(req.params.id, req.body?.status);
    if (result.error) {
      return res.status(result.code || 400).json({ error: result.error });
    }

    if (redis.isOpen) {
      await redis.del("tasks:all");
    }

    return res.json(result.task);
  });

  return app;
}
