import { Json } from "./types";

/**
 * Recurses through a valid json-serializable object and replaces instances
 * of a string with another.
 */
export function replacer(
  input: Json,
  match: string,
  replacement: string,
  maxReplacements?: number,
  // State as an object so our count is a stable reference
  state: { count: number } = { count: 0 },
): Json {
  if (maxReplacements !== undefined && state.count >= maxReplacements) {
    return input;
  }

  if (Array.isArray(input)) {
    for (const [i, val] of input.entries()) {
      input[i] = replacer(val, match, replacement, maxReplacements, state);
    }
    return input;
  }

  if (input !== null && typeof input === "object") {
    for (const [i, val] of Object.entries(input)) {
      input[i] = replacer(val, match, replacement, maxReplacements, state);
    }
    return input;
  }

  if (input === match) {
    state.count++;
    return replacement;
  }

  return input;
}
