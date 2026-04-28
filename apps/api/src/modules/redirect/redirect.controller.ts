import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { redirectService } from "./redirect.service";

const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0];
  }

  return req.ip || "0.0.0.0";
};

export class RedirectController {
  async redirectByShortCode(req: Request, res: Response): Promise<void> {
    const referrerHeader = req.headers.referer;
    const referrer =
      typeof referrerHeader === "string"
        ? referrerHeader
        : Array.isArray(referrerHeader)
          ? referrerHeader[0]
          : undefined;

    const result = await redirectService.resolveShortCode({
      shortCode: String(req.params.shortCode),
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"] ?? "unknown",
      referrer
    });

    if (result.outcome === "ACTIVE") {
      res.redirect(302, result.targetUrl);
      return;
    }

    if (result.outcome === "PAUSED") {
      res.status(StatusCodes.GONE).json({
        success: false,
        status: "PAUSED",
        message: result.message
      });
      return;
    }

    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      status: "NOT_FOUND",
      message: result.message
    });
  }
}

export const redirectController = new RedirectController();
