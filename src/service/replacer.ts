import { Json } from "../types";

class MaxReplacementsReached extends Error {
  constructor() {
    super();
    this.name = "MaxReplacementsReached";
  }
}

/**
 * Recurses through a valid json-serializable object and replaces instances
 * of a string with another.
 */
function replacerInner(
  input: Json,
  match: string,
  replacement: string,
  maxReplacements?: number,
  // State as an object so our count is a stable reference
  state: { count: number } = { count: 0 },
): Json {
  if (maxReplacements !== undefined && state.count >= maxReplacements) {
    // Short circuit and break out of the recursion loop
    throw new MaxReplacementsReached();
  }

  if (Array.isArray(input)) {
    for (const [i, val] of input.entries()) {
      input[i] = replacerInner(val, match, replacement, maxReplacements, state);
    }
    return input;
  }

  if (input !== null && typeof input === "object") {
    for (const [i, val] of Object.entries(input)) {
      input[i] = replacerInner(val, match, replacement, maxReplacements, state);
    }
    return input;
  }

  if (input === match) {
    state.count++;
    return replacement;
  }

  return input;
}

export function replacer(
  input: Json,
  match: string,
  replacement: string,
  maxReplacements?: number,
) {
  try {
    return replacerInner(input, match, replacement, maxReplacements);
  } catch (err) {
    // We've hit the max replacements limit, return the Json as is
    if (err instanceof MaxReplacementsReached) {
      return input;
    }
  }
}

export function replaceDogWithCat(input: Json, maxReplacements?: number) {
  return replacer(input, "dog", "cat", maxReplacements);
}
