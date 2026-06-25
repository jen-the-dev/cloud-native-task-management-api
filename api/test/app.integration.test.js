import assert from "node:assert/strict";
import test from "node:test";
import { createTaskApiApp } from "../src/app.js";

function createRedisStub() {
  return {
    isOpen: false,
    ping: async () => "PONG",
    get: async () => null,
    set: async () => undefined,
    del: async () => undefined
  };
}

test("task API supports create/list/update task flow", async (t) => {
  const app = createTaskApiApp({ redisClient: createRedisStub() });
  const server = app.listen(0);

  t.after(() => {
    server.close();
  });

  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const createResponse = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "Complete coding sample" })
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.status, "todo");

  const listResponse = await fetch(`${baseUrl}/tasks`);
  assert.equal(listResponse.status, 200);
  const listPayload = await listResponse.json();
  assert.equal(listPayload.length, 1);

  const patchResponse = await fetch(`${baseUrl}/tasks/${created.id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "in_progress" })
  });
  assert.equal(patchResponse.status, 200);
  const updated = await patchResponse.json();
  assert.equal(updated.status, "in_progress");
});
