import { randomUUID } from "node:crypto";

export const VALID_STATUSES = new Set(["todo", "in_progress", "done"]);

export function createTaskStore() {
  const tasks = new Map();

  return {
    list() {
      return Array.from(tasks.values());
    },
    create(title) {
      const normalized = String(title || "").trim();
      if (!normalized) {
        return { error: "title is required" };
      }

      const now = new Date().toISOString();
      const task = {
        id: randomUUID(),
        title: normalized,
        status: "todo",
        createdAt: now,
        updatedAt: now
      };

      tasks.set(task.id, task);
      return { task };
    },
    updateStatus(id, status) {
      const existing = tasks.get(id);
      if (!existing) {
        return { error: "task not found", code: 404 };
      }

      const normalizedStatus = String(status || "");
      if (!VALID_STATUSES.has(normalizedStatus)) {
        return { error: "invalid status", code: 400 };
      }

      const updated = {
        ...existing,
        status: normalizedStatus,
        updatedAt: new Date().toISOString()
      };

      tasks.set(id, updated);
      return { task: updated };
    }
  };
}
