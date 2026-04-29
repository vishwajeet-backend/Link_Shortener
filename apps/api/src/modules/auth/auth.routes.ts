import { Router } from "express";
import { passport, type GoogleProfile } from "../../config/passport";
import {
  authRateLimitMiddleware
} from "../../middlewares/rate-limit.middleware";
import {
  authMiddleware,
  ensureActiveUser,
  requireAuthenticatedUser
} from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { authController } from "./auth.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema
} from "./auth.validation";

const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);
authRouter.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    async (error: unknown, profile: GoogleProfile | false) => {
      if (error || !profile) {
        authController.redirectGoogleFailure(res);
        return;
      }

      try {
        await authController.handleGoogleLoginSuccess(profile, res);
      } catch (_authError) {
        authController.redirectGoogleFailure(res);
      }
    }
  )(req, res, next);
});

authRouter.post(
  "/register",
  authRateLimitMiddleware,
  validationMiddleware(registerSchema),
  asyncHandler((req, res) => authController.register(req, res))
);
authRouter.post(
  "/verify-email",
  authRateLimitMiddleware,
  validationMiddleware(verifyEmailSchema),
  asyncHandler((req, res) => authController.verifyEmail(req, res))
);
authRouter.post(
  "/resend-verification",
  authRateLimitMiddleware,
  validationMiddleware(resendVerificationSchema),
  asyncHandler((req, res) => authController.resendVerification(req, res))
);
authRouter.post(
  "/login",
  authRateLimitMiddleware,
  validationMiddleware(loginSchema),
  asyncHandler((req, res) => authController.login(req, res))
);
authRouter.post(
  "/forgot-password",
  authRateLimitMiddleware,
  validationMiddleware(forgotPasswordSchema),
  asyncHandler((req, res) => authController.forgotPassword(req, res))
);
authRouter.post(
  "/reset-password",
  authRateLimitMiddleware,
  validationMiddleware(resetPasswordSchema),
  asyncHandler((req, res) => authController.resetPassword(req, res))
);
authRouter.post(
  "/refresh",
  authRateLimitMiddleware,
  validationMiddleware(refreshSchema),
  asyncHandler((req, res) => authController.refresh(req, res))
);
authRouter.post(
  "/logout",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  validationMiddleware(logoutSchema),
  asyncHandler((req, res) => authController.logout(req, res))
);
authRouter.get(
  "/me",
  authMiddleware,
  requireAuthenticatedUser,
  ensureActiveUser,
  asyncHandler((req, res) => authController.me(req, res))
);

export { authRouter };
