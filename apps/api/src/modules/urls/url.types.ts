import type { UrlStatus } from "../../types/common";

export type CreateShortUrlInput = {
  originalUrl: string;
  title?: string;
  description?: string;
  expiresAt?: string;
};

export type ListUserUrlsQuery = {
  page: number;
  limit: number;
  status?: UrlStatus;
  search?: string;
};

export type UrlListItem = {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  normalizedUrl: string;
  status: UrlStatus;
  clickCount: number;
  title?: string;
  description?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
