export class PayloadValidationError extends Error {
  constructor(msg?: string) {
    super(msg)
    this.name = "PayloadValidationError";
  }
}

// Hono's JSON parser handles incoming JSON validation for us, but this type
// gives us something to work with beyond `any`.
type JsonPrimitive = string | boolean | null | number;
type JsonArray = JsonPrimitive[];
type JsonObject = Record<string, JsonPrimitive>;
type Json = JsonPrimitive | JsonArray | JsonObject;

interface Payload {
  input: Json;
  maxReplacements?: number;
}

/**
 * Ensures the payload is the correct shape for the replacement service.
 */
export function isValidPayload(payload: any): boolean {
  if (typeof payload !== "object") {
    return false;
  }
  if (payload === null) {
    return false;
  }
  if (!("input" in payload)) {
    return false;
  }

  return true;
}

export function validatePayload(payload: any): Payload {
  if (!isValidPayload(payload)) {
    throw new PayloadValidationError();
  }
  return payload as Payload;
}
