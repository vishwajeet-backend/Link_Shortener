import { Router } from "express";
import {
  authMiddleware,
  ensureActiveUser,
  ensureVerifiedUser,
  requireAuthenticatedUser
} from "../../middlewares/auth.middleware";
import { requireRoles } from "../../middlewares/rbac.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { ROLES } from "../../types/common";
import { asyncHandler } from "../../utils/async-handler";
import { planController } from "./plan.controller";
import { createPlanSchema, planIdParamsSchema, updatePlanSchema } from "./plan.validation";

const planRouter = Router();

planRouter.get(
  "/admin",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  requireRoles(ROLES.ADMIN),
  asyncHandler((req, res) => planController.listAllPlansAdmin(req, res))
);

planRouter.get("/", asyncHandler((req, res) => planController.listPlans(req, res)));

planRouter.post(
  "/",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  requireRoles(ROLES.ADMIN),
  validationMiddleware(createPlanSchema),
  asyncHandler((req, res) => planController.createPlan(req, res))
);

planRouter.patch(
  "/:id",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  requireRoles(ROLES.ADMIN),
  validationMiddleware({ ...planIdParamsSchema, ...updatePlanSchema }),
  asyncHandler((req, res) => planController.updatePlan(req, res))
);

export { planRouter };
