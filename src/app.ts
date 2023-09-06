import "dotenv/config";
import { join } from "node:path";

import express, { Express, Request, Response } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { engine } from "express-handlebars";
import helmet from "helmet";

import expressLogger from "./loggers/http.ts";
import logger from "./loggers/app.ts";

import { initDatabase } from "./models/index.ts";

import accountManagementPages from "./pageRoutes.ts";
import subscribeEndpoints from "./endpoints/subscribe.ts";

const app: Express = express();
const port: number = parseInt(process.env.HTTP_PORT as string) || 3000;

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 requests per IP over windowMs
  standardHeaders: true
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": "'unsafe-inline'" // ??
      }
    }
  })
);

// app.use(limiter);
app.use(express.json());
app.use(expressLogger);

// Configure handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", join(__dirname, "pages"));

// Static subscription management pages.
accountManagementPages(app);

// API (un)subscription endpoints
subscribeEndpoints(app);

// Health endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "online" });
});

// Static assets
app.use("/assets", express.static("public"));

// Start database
(async () => {
  await initDatabase();
})();

app.listen(port, () => {
  logger.info(`📬 Hermes up and running on port ${port}`);
});
