import { Router } from "express";
import {
  authMiddleware,
  ensureActiveUser,
  requireAuthenticatedUser
} from "../../middlewares/auth.middleware";
import { requireRoles } from "../../middlewares/rbac.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { ROLES } from "../../types/common";
import { asyncHandler } from "../../utils/async-handler";
import { analyticsController } from "./analytics.controller";
import { analyticsOverviewQuerySchema } from "./analytics.validation";

const analyticsRouter = Router();

analyticsRouter.get(
  "/me/overview",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  validationMiddleware(analyticsOverviewQuerySchema),
  asyncHandler((req, res) => analyticsController.userOverview(req, res))
);
analyticsRouter.get(
  "/admin/overview",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  requireRoles(ROLES.ADMIN),
  validationMiddleware(analyticsOverviewQuerySchema),
  asyncHandler((req, res) => analyticsController.adminOverview(req, res))
);

export { analyticsRouter };
