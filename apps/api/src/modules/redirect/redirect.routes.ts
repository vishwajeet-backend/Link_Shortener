import { Router } from "express";
import { redirectRateLimitMiddleware } from "../../middlewares/rate-limit.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { redirectController } from "./redirect.controller";

const redirectRouter = Router();

redirectRouter.get(
  "/:shortCode",
  redirectRateLimitMiddleware,
  asyncHandler((req, res) => redirectController.redirectByShortCode(req, res))
);

export { redirectRouter };
