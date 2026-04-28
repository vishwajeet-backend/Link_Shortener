import { clickRepository } from "../../repositories/click.repository";
import { urlRepository } from "../../repositories/url.repository";
import { URL_STATUS } from "../../types/common";
import type { RedirectResolution } from "./redirect.types";

type ResolveInput = {
  shortCode: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
};

export class RedirectService {
  async resolveShortCode(input: ResolveInput): Promise<RedirectResolution> {
    const url = await urlRepository.findByShortCode(input.shortCode);
    if (!url || url.status === URL_STATUS.DELETED) {
      return {
        outcome: "NOT_FOUND",
        message: "This short link does not exist."
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

    await clickRepository.createClickLog({
      urlId: updatedUrl._id,
      shortCode: updatedUrl.shortCode,
      ownerId: updatedUrl.ownerId,
      timestamp: new Date(),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      referrer: input.referrer
    });

    return {
      outcome: "ACTIVE",
      targetUrl: updatedUrl.normalizedUrl
    };
  }
}

export const redirectService = new RedirectService();
