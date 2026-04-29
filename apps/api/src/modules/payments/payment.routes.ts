import { Router } from "express";
import {
  authMiddleware,
  ensureActiveUser,
  ensureVerifiedUser,
  requireAuthenticatedUser
} from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { paymentController } from "./payment.controller";
import { createOrderSchema, verifyRazorpaySchema } from "./payment.validation";

const paymentRouter = Router();

paymentRouter.post(
  "/razorpay/order",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  validationMiddleware(createOrderSchema),
  asyncHandler((req, res) => paymentController.createRazorpayOrder(req, res))
);

paymentRouter.post(
  "/razorpay/verify",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  ensureVerifiedUser,
  validationMiddleware(verifyRazorpaySchema),
  asyncHandler((req, res) => paymentController.verifyRazorpayPayment(req, res))
);

export { paymentRouter };
