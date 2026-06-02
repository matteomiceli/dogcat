import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (ctx) => {
  return ctx.html(`<h1>Usage Instructions</h1>
Make a post request to <code>/replace</code> and include your JSON payload in the body as the <code>input</code> field. You can include an optional <code>maxReplacements</code> field to limit how many replacements are made. By default, it will replace all occurences.`);
});

app.post("/replace", async (ctx) => {
  return ctx.json({ hello: "World!" });
});

serve(app, (info) => console.log(`Server running at localhost:${info.port}`));
