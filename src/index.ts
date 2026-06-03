import { serve } from "@hono/node-server";
import { app } from "./server";

serve(app, (info) => console.log(`Server running at localhost:${info.port}`));
