import { test } from "node:test";
import assert from "node:assert";
import { replacer } from "./replacer";
import { Json } from "./types";

const cases = [
  {
    input: {},
    maxReplacements: undefined,
    expected: {},
  },
  {
    input: null,
    maxReplacements: undefined,
    expected: null,
  },
  {
    input: 12,
    maxReplacements: undefined,
    expected: 12,
  },
  {
    input: "dog",
    maxReplacements: undefined,
    expected: "cat",
  },
  {
    input: "Dog",
    maxReplacements: undefined,
    expected: "Dog",
  },
  {
    input: "cat",
    maxReplacements: undefined,
    expected: "cat",
  },
  {
    input: { test: "dog" },
    maxReplacements: undefined,
    expected: { test: "cat" },
  },
  {
    input: { test: "dog", nested: ["dog", "doggo"] },
    maxReplacements: undefined,
    expected: { test: "cat", nested: ["cat", "doggo"] },
  },
  {
    input: { test: "dog", nested: ["dog", "doggo"] },
    maxReplacements: undefined,
    expected: { test: "cat", nested: ["cat", "doggo"] },
  },
  {
    input: {
      test: "dog",
      nested: ["dog", "doggo", [[["deep nesting", "dog"]]]],
    },
    maxReplacements: undefined,
    expected: {
      test: "cat",
      nested: ["cat", "doggo", [[["deep nesting", "cat"]]]],
    },
  },
];

cases.forEach((c) => {
  test("replacer", () => {
    assert.deepEqual(
      replacer(c.input as Json, "dog", "cat", c.maxReplacements),
      c.expected,
    );
  });
});
