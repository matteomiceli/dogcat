// Hono's JSON parser handles incoming JSON validation for us, but this type
// gives us something to work with in code beyond `any`.
type JsonPrimitive = string | boolean | null | number;
// Using interfaces avoids a circular type
interface JsonArray extends Array<Json> {}
interface JsonObject {
  [key: string]: Json;
}
export type Json = JsonPrimitive | JsonArray | JsonObject;
