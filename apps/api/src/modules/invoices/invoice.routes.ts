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
import { invoiceController } from "./invoice.controller";
import { listInvoicesSchema } from "./invoice.validation";

const invoiceRouter = Router();

invoiceRouter.get(
  "/me",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  validationMiddleware(listInvoicesSchema),
  asyncHandler((req, res) => invoiceController.listMyInvoices(req, res))
);

invoiceRouter.get(
  "/admin",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  requireRoles(ROLES.ADMIN),
  validationMiddleware(listInvoicesSchema),
  asyncHandler((req, res) => invoiceController.listAllInvoices(req, res))
);

export { invoiceRouter };
