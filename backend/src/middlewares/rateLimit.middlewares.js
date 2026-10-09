import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.email || ""}`;
  },
  skip: (req, res) => {
    return res.statusCode < 400;
  },
  message: {
    success: false,
    statusCode: 429,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 100 : 5,
  skipFailedRequests: true,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  },
  message: {
    success: false,
    statusCode: 429,
    message: "Upload limit exceeded. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const voteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  },
  message: {
    success: false,
    statusCode: 429,
    message: "Too many votes. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const introLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  },
  message: {
    success: false,
    statusCode: 429,
    message: "Introduction request limit reached. Please try again tomorrow.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
