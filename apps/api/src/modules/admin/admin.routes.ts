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
import { adminController } from "./admin.controller";
import {
  adminListUrlsQuerySchema,
  adminListUsersQuerySchema,
  adminUrlActionParamsSchema,
  adminUserActionParamsSchema
} from "./admin.validation";

const adminRouter = Router();

adminRouter.use(authMiddleware, requireAuthenticatedUser, ensureActiveUser, requireRoles(ROLES.ADMIN));

adminRouter.get(
  "/users",
  validationMiddleware(adminListUsersQuerySchema),
  asyncHandler((req, res) => adminController.listUsers(req, res))
);
adminRouter.post(
  "/users/:id/ban",
  validationMiddleware(adminUserActionParamsSchema),
  asyncHandler((req, res) => adminController.banUser(req, res))
);
adminRouter.delete(
  "/users/:id",
  validationMiddleware(adminUserActionParamsSchema),
  asyncHandler((req, res) => adminController.deleteUser(req, res))
);
adminRouter.get(
  "/urls",
  validationMiddleware(adminListUrlsQuerySchema),
  asyncHandler((req, res) => adminController.listUrls(req, res))
);
adminRouter.post(
  "/urls/:id/pause",
  validationMiddleware(adminUrlActionParamsSchema),
  asyncHandler((req, res) => adminController.pauseUrl(req, res))
);
adminRouter.post(
  "/urls/:id/activate",
  validationMiddleware(adminUrlActionParamsSchema),
  asyncHandler((req, res) => adminController.activateUrl(req, res))
);
adminRouter.delete(
  "/urls/:id",
  validationMiddleware(adminUrlActionParamsSchema),
  asyncHandler((req, res) => adminController.deleteUrl(req, res))
);

export { adminRouter };
