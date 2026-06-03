import { test, describe } from "node:test";
import assert from "node:assert";
import { app } from "./server";

describe("server API tests", () => {
  test("returns replaced JSON on valid request", async () => {
    const res = await app.request("/replace", {
      method: "POST",
      body: JSON.stringify({ input: { vals: ["dog", "human", "hamster"] } }),
    });
    assert.equal(res.status, 200);
    const result = await res.json();
    assert.deepEqual(result, { vals: ["cat", "human", "hamster"] });
  });

  test("returns bad request for invalid json", async () => {
    const res = await app.request("/replace", {
      method: "POST",
      // Does not serialize to JSON
      body: '{"input": }',
    });
    assert.equal(res.status, 400);
    const result = await res.json();
    assert.deepEqual(result, { error: "Malformed JSON payload" });
  });

  test("returns bad request for invalid payload", async () => {
    const res = await app.request("/replace", {
      method: "POST",
      // Valid JSON but does not conform to the expected payload shape
      body: JSON.stringify({
        jsonPayload: { vals: ["cat", "human", "hamster"] },
      }),
    });
    assert.equal(res.status, 400);
    const result = await res.json();
    assert.deepEqual(result, { error: "Inavlid payload, please provide an input property" });
  });
});
