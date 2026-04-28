import { Router } from "express";
import {
  authMiddleware,
  ensureActiveUser,
  requireAuthenticatedUser
} from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { urlController } from "./url.controller";
import { createUrlSchema, getMyUrlByIdSchema, listUrlsSchema } from "./url.validation";

const urlRouter = Router();

urlRouter.use(authMiddleware, requireAuthenticatedUser, ensureActiveUser);

urlRouter.post(
  "/",
  validationMiddleware(createUrlSchema),
  asyncHandler((req, res) => urlController.createOwnUrl(req, res))
);
urlRouter.get(
  "/",
  validationMiddleware(listUrlsSchema),
  asyncHandler((req, res) => urlController.listOwnUrls(req, res))
);
urlRouter.get(
  "/:id",
  validationMiddleware(getMyUrlByIdSchema),
  asyncHandler((req, res) => urlController.getOwnUrlById(req, res))
);

export { urlRouter };
