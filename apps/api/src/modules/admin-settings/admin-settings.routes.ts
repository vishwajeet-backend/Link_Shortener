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
import { adminSettingsController } from "./admin-settings.controller";
import { updateAdminSettingsSchema } from "./admin-settings.validation";

const adminSettingsRouter = Router();

adminSettingsRouter.use(
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  requireRoles(ROLES.ADMIN)
);

adminSettingsRouter.get(
  "/",
  asyncHandler((req, res) => adminSettingsController.getSettings(req, res))
);

adminSettingsRouter.patch(
  "/",
  validationMiddleware(updateAdminSettingsSchema),
  asyncHandler((req, res) => adminSettingsController.updateSettings(req, res))
);

export { adminSettingsRouter };
