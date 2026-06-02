import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PayloadValidationError, validatePayload } from "./validator";

const app = new Hono();

app.get("/", (ctx) => {
  return ctx.html(`<h1>Usage Instructions</h1>
Make a post request to <code>/replace</code> and include your JSON payload in the body as the <code>input</code> field. You can include an optional <code>maxReplacements</code> field to limit how many replacements are made. By default, it will replace all occurences.`);
});

app.post("/replace", async (ctx) => {
  const payload = await ctx.req.json();
  const { input, maxReplacements } = validatePayload(payload);
  return ctx.json({ hello: "World!" });
});

app.onError((err, c) => {
  if (err instanceof SyntaxError) {
    return c.json({ error: "Malformed JSON payload" }, 400);
  }

  if (err instanceof PayloadValidationError) {
    return c.json(
      { error: "Inavlid payload, please provide an input property" },
      400,
    );
  }

  return c.json({ error: "Internal Server Error" }, 500);
});

serve(app, (info) => console.log(`Server running at localhost:${info.port}`));
