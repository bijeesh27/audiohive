import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import { env } from "./config/env.js";

import authRoute from "./modules/auth/interface/auth.routes.js";

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
  }

  app.use("/api", globalRateLimiter);

  app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "AudioHive API is running",
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
    });
  });

  app.use("/api/auth", authRoute);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route ${_req.method} ${_req.originalUrl} not found`,
    });
  });

  app.use(errorHandler);

  return app;
}
