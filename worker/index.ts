import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import { createExpressMiddleware, type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "../server/routers";
import { hasPinAccess } from "../server/pinAccess";

type WorkerBindings = {
  ASSETS: Fetcher;
  DATABASE_URL?: string;
  JWT_SECRET?: string;
  NMS_PORTAL_PIN?: string;
};

const bindings = env as WorkerBindings;

for (const name of ["DATABASE_URL", "JWT_SECRET", "NMS_PORTAL_PIN"] as const) {
  const value = bindings[name];
  if (value) process.env[name] = value;
}

function createContext({ req, res }: CreateExpressContextOptions) {
  return { req, res, user: null };
}

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, service: "nms-cloudflare-worker" });
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get("/manus-storage/*", async (req, res) => {
  if (!(await hasPinAccess(req))) {
    res.status(401).json({
      error: "NMS portal access required",
      code: "NMS_PORTAL_AUTH_REQUIRED",
    });
    return;
  }

  const assetUrl = new URL(req.originalUrl, `${req.protocol}://${req.get("host")}`);
  const assetResponse = await bindings.ASSETS.fetch(new Request(assetUrl));
  res.status(assetResponse.status);
  assetResponse.headers.forEach((value, name) => res.setHeader(name, value));
  res.send(Buffer.from(await assetResponse.arrayBuffer()));
});

app.listen(3000);

export default httpServerHandler({ port: 3000 });
