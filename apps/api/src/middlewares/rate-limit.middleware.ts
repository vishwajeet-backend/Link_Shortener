import { rateLimit } from "express-rate-limit";

export const globalRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this client, please try again later"
  },
  skip: (req) => req.path.startsWith("/api/v1/r/")
});

export const authRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please retry later"
  }
});

export const redirectRateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many redirect requests, please retry later"
  }
});
