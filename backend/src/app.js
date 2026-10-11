/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 */

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { globalLimiter } from "./middlewares/rateLimit.middlewares.js";
import userRouter from "./routes/user.routes.js";
import pitchRouter from "./routes/pitch.routes.js";
import voteRouter from "./routes/vote.routes.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middlewares/error.middlewares.js";

const app = express();

// 1. Trust proxy for rate limiting and secure cookies behind reverse proxies (Render, Vercel)
app.set("trust proxy", 1);

// 2. CORS configuration (must be the very first middleware)
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/+$/, "");

    if (
      allowedOrigins.includes(normalizedOrigin) ||
      (normalizedOrigin.endsWith(".vercel.app") &&
        (normalizedOrigin.includes("pitchvault") || normalizedOrigin.includes("pitch-vault")))
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Explicit preflight handling
try {
  app.options("*", cors(corsOptions));
} catch {
  app.options(/(.*)/, cors(corsOptions));
}

// 3. Security headers with cross-origin resource policy
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 4. Body parsing middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 5. Cookie parser
app.use(cookieParser());

// 6. Serve static files
app.use(express.static("public"));

// 7. Health check endpoints (excluded from rate limiting)
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// 8. Rate limiting on API routes
app.use("/api/v1", globalLimiter);

// 9. API routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/pitches", pitchRouter);
app.use("/api/v1/votes", voteRouter);

// 10. 404 and global error handlers (mounted after routes)
app.use(notFoundHandler);
app.use(globalErrorHandler);

export { app };
