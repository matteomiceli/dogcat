import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { bodyLimit } from "hono/body-limit";
import { PayloadValidationError, validatePayload } from "./service/validator";
import { replaceDogWithCat } from "./service/replacer";

const KILOBYTES = 1024;

export const app = new Hono();

app.get("/", (ctx) => {
  return ctx.html(`<h1>Usage Instructions</h1>
Make a post request to <code>/replace</code> and include your JSON payload in the body as the <code>input</code> field. 
You can include an optional <code>maxReplacements</code> field to limit how many replacements are made. By default, it will replace all occurences.`);
});

app.post("/replace", bodyLimit({ maxSize: 50 * KILOBYTES }), async (ctx) => {
  const payload = await ctx.req.json();
  const { input, maxReplacements } = validatePayload(payload);
  const replaced = replaceDogWithCat(input, maxReplacements);
  return ctx.json(replaced);
});

app.onError((err, ctx) => {
  if (err instanceof SyntaxError) {
    return ctx.json({ error: "Malformed JSON payload" }, 400);
  }

  if (err instanceof PayloadValidationError) {
    return ctx.json(
      { error: "Inavlid payload, please provide an input property" },
      400,
    );
  }

  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  return ctx.json({ error: "Internal Server Error" }, 500);
});
