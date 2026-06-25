import assert from "node:assert/strict";
import test from "node:test";
import { createTaskStore } from "../src/taskStore.js";

test("createTaskStore rejects empty task titles", () => {
  const store = createTaskStore();
  const result = store.create("  ");
  assert.equal(result.error, "title is required");
});

test("createTaskStore creates and updates task status", () => {
  const store = createTaskStore();
  const created = store.create("Prepare interview demo");
  assert.ok(created.task?.id);
  assert.equal(created.task.status, "todo");

  const updated = store.updateStatus(created.task.id, "done");
  assert.equal(updated.task.status, "done");
});
