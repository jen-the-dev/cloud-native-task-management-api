import dotenv from "dotenv";
import { createClient } from "redis";
import { createTaskApiApp } from "./app.js";

dotenv.config();

const port = Number(process.env.PORT || 4000);
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = createClient({ url: redisUrl });
redis.on("error", (error) => {
  console.error("Redis unavailable. Continuing without cache.", error.message);
});
redis.connect().catch(() => {});

const app = createTaskApiApp({ redisClient: redis });

app.listen(port, () => {
  console.log(`Task API listening on port ${port}`);
});
