import { UNIQUE_CLICK_WINDOW_HOURS } from "../../config/constants";
import { clickRepository } from "../../repositories/click.repository";
import { urlRepository } from "../../repositories/url.repository";
import { URL_STATUS } from "../../types/common";
import type { RedirectResolution } from "./redirect.types";

type ResolveInput = {
  shortCode: string;
  ipAddress: string;
  ipHash: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: string;
  referrer?: string;
  country?: string;
  city?: string;
};

export class RedirectService {
  async resolveShortCode(input: ResolveInput): Promise<RedirectResolution> {
    const url = await urlRepository.findByShortCode(input.shortCode);
    if (!url) {
      return {
        outcome: "NOT_FOUND",
        message: "This short link does not exist."
      };
    }

    if (url.status === URL_STATUS.DELETED) {
      return {
        outcome: "DELETED",
        message: "This short link has been deleted by its owner."
      };
    }

    if (url.status === URL_STATUS.HIDDEN) {
      return {
        outcome: "HIDDEN",
        message: "This short link is hidden by its owner."
      };
    }

    if (url.status === URL_STATUS.PAUSED) {
      return {
        outcome: "PAUSED",
        message: "This short link has been paused by the owner or admin."
      };
    }

    const updatedUrl = await urlRepository.incrementClickForActiveShortCode(input.shortCode);
    if (!updatedUrl) {
      return {
        outcome: "PAUSED",
        message: "This short link is currently unavailable."
      };
    }

    const windowStart = new Date();
    windowStart.setHours(windowStart.getHours() - UNIQUE_CLICK_WINDOW_HOURS);
    const alreadyCounted = await clickRepository.existsRecentUniqueClick({
      shortCode: updatedUrl.shortCode,
      ipHash: input.ipHash,
      since: windowStart
    });
    const isUnique = !alreadyCounted;

    await clickRepository.createClickLog({
      urlId: updatedUrl._id,
      shortCode: updatedUrl.shortCode,
      ownerId: updatedUrl.ownerId,
      timestamp: new Date(),
      ipAddress: input.ipAddress,
      ipHash: input.ipHash,
      userAgent: input.userAgent,
      browser: input.browser,
      os: input.os,
      deviceType: input.deviceType,
      referrer: input.referrer,
      country: input.country,
      city: input.city,
      isUnique
    });

    return {
      outcome: "ACTIVE",
      targetUrl: updatedUrl.normalizedUrl
    };
  }
}

export const redirectService = new RedirectService();
