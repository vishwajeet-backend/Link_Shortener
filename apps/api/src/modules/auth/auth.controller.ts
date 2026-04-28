import { Request, Response } from "express";
import { env } from "../../config/env";
import { created, ok } from "../../utils/http-response";
import { authService } from "./auth.service";
import type {
  GoogleLoginInput,
  LoginInput,
  LogoutInput,
  RefreshInput,
  RegisterInput
} from "./auth.types";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const payload = req.body as RegisterInput;
    const result = await authService.register(payload);
    created(res, result);
  }

  async login(req: Request, res: Response): Promise<void> {
    const payload = req.body as LoginInput;
    const result = await authService.login(payload);
    ok(res, result);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const payload = req.body as RefreshInput;
    const tokens = await authService.refresh(payload);
    ok(res, tokens);
  }

  async logout(req: Request, res: Response): Promise<void> {
    const payload = req.body as LogoutInput;
    await authService.logout(req.authUser!.userId, payload);
    ok(res, null, "Logged out successfully");
  }

  async me(req: Request, res: Response): Promise<void> {
    const user = await authService.me(req.authUser!.userId);
    ok(res, user);
  }

  async handleGoogleLoginSuccess(profile: GoogleLoginInput, res: Response): Promise<void> {
    const result = await authService.loginWithGoogle(profile);
    const encoded = encodeURIComponent(JSON.stringify(result));
    res.redirect(`${env.CLIENT_ORIGIN}/auth/google/callback?payload=${encoded}`);
  }

  redirectGoogleFailure(res: Response): void {
    res.redirect(`${env.CLIENT_ORIGIN}/login?error=google_auth_failed`);
  }
}

export const authController = new AuthController();
