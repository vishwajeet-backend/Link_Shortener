import { Router } from "express";
import {
  authMiddleware,
  ensureActiveUser,
  ensureVerifiedUser,
  requireAuthenticatedUser
} from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { subscriptionController } from "./subscription.controller";

const subscriptionRouter = Router();

subscriptionRouter.get(
  "/me",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  asyncHandler((req, res) => subscriptionController.getCurrent(req, res))
);

export { subscriptionRouter };
