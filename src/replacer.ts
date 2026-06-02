import { Json } from "./types";

/**
 * Recurses through a valid json-serializable object and replaces instances
 * of a string with another.
 */
export function replacer(
  input: Json,
  match: string,
  replacement: string,
  // TODO implement maxReplacements
  maxReplacements?: number,
): Json {
  if (Array.isArray(input)) {
    for (const [i, val] of input.entries()) {
      input[i] = replacer(val, match, replacement, maxReplacements);
    }
    return input;
  }

  if (input !== null && typeof input === "object") {
    for (const [i, val] of Object.entries(input)) {
      input[i] = replacer(val, match, replacement, maxReplacements);
    }
    return input;
  }

  if (input === match) {
    return replacement;
  }

  return input;
}
