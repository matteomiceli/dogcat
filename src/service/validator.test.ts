import {
  isValidPayload,
  validatePayload,
} from "./validator.js";
import { test } from "node:test";
import assert from "node:assert";

const cases = [
  { payload: "strings are invalid", isValid: false },
  { payload: 12, isValid: false },
  { payload: null, isValid: false },
  { payload: {}, isValid: false },
  { payload: { input: null }, isValid: true },
  { payload: { input: 12 }, isValid: true },
  { payload: { input: { withObject: true } }, isValid: true },
  { payload: { input: { nested: [{ data: "structure" }] } }, isValid: true },
  { payload: { input: undefined }, isValid: true },
];

cases.forEach((c) => {
  test(`isValidPayload: ${c.payload} -- ${c.isValid}`, () => {
    assert.equal(isValidPayload(c.payload), c.isValid);
  });
});

test("validatePayload returns valid Payload object", () => {
  const p = validatePayload({ input: { test: "input" }, maxReplacements: 10 });
  assert.deepEqual(p.input, { test: "input" });
  assert.equal(p.maxReplacements, 10);
});

test("validatePayload throws for invalid Payload", () => {
  assert.throws(
    () => {
      validatePayload({ invalidKey: 1 });
    },
    { name: "PayloadValidationError" },
  );
});
