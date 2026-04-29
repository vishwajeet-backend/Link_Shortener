import type { CampaignStatus, Role, UrlStatus, UserStatus } from "../../types/common";

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
  status?: UserStatus;
  role?: Role;
  search?: string;
};

export type AdminListUrlsQuery = {
  page: number;
  limit: number;
  status?: UrlStatus;
  search?: string;
  ownerId?: string;
};

export type AdminListCampaignsQuery = {
  page: number;
  limit: number;
  status?: CampaignStatus;
  ownerId?: string;
  search?: string;
};
