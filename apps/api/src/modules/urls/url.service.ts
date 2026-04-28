import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import { urlRepository } from "../../repositories/url.repository";
import { URL_STATUS } from "../../types/common";
import { generateShortCode } from "../../utils/nanoid";
import { isValidPublicUrl, normalizeUrl } from "../../utils/url";
import type { CreateShortUrlInput, ListUserUrlsQuery, UrlListItem } from "./url.types";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

type ShortUrlEntity = Awaited<ReturnType<typeof urlRepository.findByShortCode>>;

export class UrlService {
  async createUrl(userId: string, input: CreateShortUrlInput): Promise<UrlListItem> {
    const normalizedUrl = normalizeUrl(input.originalUrl);
    if (!isValidPublicUrl(normalizedUrl)) {
      throw buildServiceError("Please provide a valid public URL", StatusCodes.BAD_REQUEST);
    }

    const shortCode = await this.generateUniqueShortCode();
    const expiresAt = input.expiresAt ? new Date(input.expiresAt) : undefined;
    if (expiresAt && Number.isNaN(expiresAt.getTime())) {
      throw buildServiceError("Invalid expiry date", StatusCodes.BAD_REQUEST);
    }

    const created = await urlRepository.createOne({
      ownerId: userId,
      shortCode,
      originalUrl: input.originalUrl.trim(),
      normalizedUrl,
      title: input.title,
      description: input.description,
      expiresAt
    });

    return this.toUrlListItem(created);
  }

  async listOwnUrls(
    userId: string,
    query: ListUserUrlsQuery
  ): Promise<{
    items: UrlListItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    filters: { status?: string; search?: string };
  }> {
    const { data, total } = await urlRepository.findByOwnerWithFilters({
      ownerId: userId,
      page: query.page,
      limit: query.limit,
      status: query.status,
      search: query.search
    });

    return {
      items: data.map((item) => this.toUrlListItem(item)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      },
      filters: {
        status: query.status,
        search: query.search
      }
    };
  }

  async getOwnUrlById(userId: string, urlId: string): Promise<UrlListItem> {
    const url = await urlRepository.findByIdAndOwner(urlId, userId);
    if (!url) {
      throw buildServiceError("URL not found", StatusCodes.NOT_FOUND);
    }

    return this.toUrlListItem(url);
  }

  private async generateUniqueShortCode(): Promise<string> {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const candidate = generateShortCode();
      const exists = await urlRepository.existsByShortCode(candidate);
      if (!exists) {
        return candidate;
      }
    }

    throw buildServiceError(
      "Unable to generate unique short code. Please retry.",
      StatusCodes.SERVICE_UNAVAILABLE
    );
  }

  private toUrlListItem(
    doc: NonNullable<ShortUrlEntity>
  ): UrlListItem {
    return {
      id: doc.id,
      shortCode: doc.shortCode,
      shortUrl: `${env.APP_PUBLIC_URL}/r/${doc.shortCode}`,
      originalUrl: doc.originalUrl,
      normalizedUrl: doc.normalizedUrl,
      status: doc.status ?? URL_STATUS.ACTIVE,
      clickCount: doc.clickCount,
      title: doc.title,
      description: doc.description,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}

export const urlService = new UrlService();
