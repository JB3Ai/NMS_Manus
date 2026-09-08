import "dotenv/config";
import express, { type Request, type Response } from "express";
import { createServer } from "http";
import path from "path";
import { createExpressMiddleware, type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";

for (const variable of ["JWT_SECRET"] as const) {
  if (!process.env[variable]) {
    throw new Error(`${variable} must be configured before the cPanel portal starts.`);
  }
}

function createStandaloneContext({ req, res }: CreateExpressContextOptions) {
  return { req, res, user: null };
}

const app = express();
const server = createServer(app);
app.set("trust proxy", 1);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.get("/healthz", (_req, res) => res.json({ ok: true, service: "nms-executive-portal" }));

// Add error handling middleware to ensure all errors return JSON
app.use((err: any, req: Request, res: Response, next: () => void) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const publicRoot = path.resolve(import.meta.dirname, "public");
app.use("/manus-storage", express.static(path.join(publicRoot, "manus-storage"), {
  fallthrough: true,
  index: false,
  maxAge: "1h",
}));

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: createStandaloneContext,
  }),
);

app.use(express.static(publicRoot));
app.use("*", (_req, res) => res.sendFile(path.join(publicRoot, "index.html")));

const port = Number.parseInt(process.env.PORT || "3000", 10);
if (process.env.NMS_EMBEDDED !== "1" && !process.env.VERCEL) {
  server.listen(port, "0.0.0.0", () => {
    console.log(`NMS portal listening on port ${port}`);
  });
}

export { app };
