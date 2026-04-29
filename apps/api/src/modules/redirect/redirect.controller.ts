import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getGeoFromHeaders } from "../../utils/geo";
import { parseUserAgent } from "../../utils/user-agent";
import { hashToken } from "../../utils/hash";
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

    const ipAddress = getClientIp(req);
    const userAgent = req.headers["user-agent"] ?? "unknown";
    const { browser, os, deviceType } = parseUserAgent(String(userAgent));
    const geo = getGeoFromHeaders(req.headers);

    const result = await redirectService.resolveShortCode({
      shortCode: String(req.params.shortCode),
      ipAddress,
      ipHash: hashToken(ipAddress),
      userAgent: String(userAgent),
      browser,
      os,
      deviceType,
      referrer,
      country: geo.country,
      city: geo.city
    });

    if (result.outcome === "ACTIVE") {
      res.redirect(302, result.targetUrl);
      return;
    }

    if (result.outcome === "PAUSED") {
      res
        .status(StatusCodes.GONE)
        .type("html")
        .send(buildRedirectStatusPage("Paused", result.message));
      return;
    }

    if (result.outcome === "HIDDEN") {
      res
        .status(StatusCodes.NOT_FOUND)
        .type("html")
        .send(buildRedirectStatusPage("Hidden", result.message));
      return;
    }

    if (result.outcome === "DELETED") {
      res
        .status(StatusCodes.GONE)
        .type("html")
        .send(buildRedirectStatusPage("Deleted", result.message));
      return;
    }

    res
      .status(StatusCodes.NOT_FOUND)
      .type("html")
      .send(buildRedirectStatusPage("Not Found", result.message));
  }
}

const buildRedirectStatusPage = (title: string, message: string): string => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - Link Shortener</title>
    <style>
      body { margin: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(160deg, #f1f5f9, #e2e8f0); color: #0f172a; }
      .wrapper { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 32px; }
      .card { max-width: 560px; background: #ffffff; border-radius: 20px; padding: 36px; box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12); border: 1px solid #e2e8f0; }
      .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #0f172a; color: #f8fafc; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px; }
      h1 { margin: 0 0 12px; font-size: 28px; }
      p { margin: 0; font-size: 16px; line-height: 1.5; }
      .hint { margin-top: 22px; font-size: 13px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card">
        <span class="badge">Link Status</span>
        <h1>${title}</h1>
        <p>${message}</p>
        <p class="hint">If you believe this is an error, contact the link owner or try again later.</p>
      </div>
    </div>
  </body>
</html>`;
};

export const redirectController = new RedirectController();
