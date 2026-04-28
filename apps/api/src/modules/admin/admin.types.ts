import type { UrlStatus } from "../../types/common";

export type AdminUrlActionResult = {
  id: string;
  shortCode: string;
  ownerId: string;
  ownerEmail: string;
  status: UrlStatus;
  clickCount: number;
  updatedAt: Date;
};

export type AdminListUsersQuery = {
  page: number;
  limit: number;
  status?: "ACTIVE" | "BANNED" | "DELETED";
  search?: string;
};

export type AdminListUrlsQuery = {
  page: number;
  limit: number;
  status?: UrlStatus;
  search?: string;
  ownerId?: string;
};
