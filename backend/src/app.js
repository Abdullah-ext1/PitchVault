/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 */

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { globalLimiter } from "./middlewares/rateLimit.middlewares.js";

const app = express();

// Trust proxy for rate limiting behind reverse proxies (Render, Vercel)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      // Allow exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (origin.endsWith(".vercel.app") && origin.includes("pitch-vault")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Allow cookies
  })
);

// Body parsing middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie parser
app.use(cookieParser());

// Serve static files
app.use(express.static("public"));

app.use("/api/v1", globalLimiter);

// Health check endpoint (excluded from rate limiting)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pitch Vault API is running",
    timestamp: new Date().toISOString(),
  });
});

import userRouter from "./routes/user.routes.js";
import pitchRouter from "./routes/pitch.routes.js";
import voteRouter from "./routes/vote.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/pitches", pitchRouter);
app.use("/api/v1/votes", voteRouter);

import {
  notFoundHandler,
  globalErrorHandler,
} from "./middlewares/error.middlewares.js";

app.use(notFoundHandler);
app.use(globalErrorHandler);

export { app };
