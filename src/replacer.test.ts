import { test } from "node:test";
import assert from "node:assert";
import { replacer } from "./replacer";
import { Json } from "./types";

const replacerCases = [
  {
    input: {},
    expected: {},
  },
  {
    input: null,
    expected: null,
  },
  {
    input: 12,
    expected: 12,
  },
  {
    input: "dog",
    expected: "cat",
  },
  {
    input: "Dog",
    expected: "Dog",
  },
  {
    input: "cat",
    expected: "cat",
  },
  {
    input: { test: "dog" },
    expected: { test: "cat" },
  },
  {
    input: { test: "dog", nested: ["dog", "doggo"] },
    expected: { test: "cat", nested: ["cat", "doggo"] },
  },
  {
    input: {
      test: "dog",
      nested: ["dog", "doggo", [[["deep nesting", "dog"]]]],
    },
    expected: {
      test: "cat",
      nested: ["cat", "doggo", [[["deep nesting", "cat"]]]],
    },
  },
];

replacerCases.forEach((c) => {
  test(`replacer ${JSON.stringify(c.input)} becomes ${JSON.stringify(c.expected)}`, () => {
    assert.deepEqual(replacer(c.input as Json, "dog", "cat"), c.expected);
  });
});

const replacerWithMaxReplacementsCases = [
  {
    input: {},
    maxReplacements: 12,
    expected: {},
  },
  {
    input: "dog",
    maxReplacements: 2,
    expected: "cat",
  },
  {
    input: "dog",
    maxReplacements: 0,
    expected: "dog",
  },
  {
    input: { test: "dog", nested: ["dog", "doggo"] },
    maxReplacements: 1,
    expected: { test: "cat", nested: ["dog", "doggo"] },
  },
  {
    input: { test: "dog", nested: ["dog", "doggo"] },
    maxReplacements: 2,
    expected: { test: "cat", nested: ["cat", "doggo"] },
  },
  {
    input: { test: "dog", nested: ["dog", "doggo"] },
    maxReplacements: 0,
    expected: { test: "dog", nested: ["dog", "doggo"] },
  },
  {
    input: {
      test: "dog",
      nested: ["dog", "doggo", [[["deep nesting", "dog"]]]],
    },
    maxReplacements: 2,
    expected: {
      test: "cat",
      nested: ["cat", "doggo", [[["deep nesting", "dog"]]]],
    },
  },
];

replacerWithMaxReplacementsCases.forEach((c) => {
  test(`replacer with maxReplacements ${JSON.stringify(c.input)} becomes ${JSON.stringify(c.expected)}`, () => {
    assert.deepEqual(
      replacer(c.input as Json, "dog", "cat", c.maxReplacements),
      c.expected,
    );
  });
});
