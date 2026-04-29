import type { CampaignStatus, CampaignType, TargetDevice } from "../../types/common";

export type CreateCampaignInput = {
  name: string;
  type: CampaignType;
  targetDevice: TargetDevice;
  targetCountries?: string[];
  targetExcludeCountries?: string[];
  targetBrowsers?: string[];
  targetOs?: string[];
  targetLanguages?: string[];
  budgetTotal: number;
  landingUrl?: string;
  creativeTitle?: string;
  creativeBody?: string;
  creativeCta?: string;
  creativeImageUrl?: string;
  creativeVideoUrl?: string;
  startsAt?: string;
  endsAt?: string;
};

export type UpdateCampaignInput = {
  name?: string;
  targetDevice?: TargetDevice;
  targetCountries?: string[];
  targetExcludeCountries?: string[];
  targetBrowsers?: string[];
  targetOs?: string[];
  targetLanguages?: string[];
  budgetTotal?: number;
  landingUrl?: string;
  creativeTitle?: string;
  creativeBody?: string;
  creativeCta?: string;
  creativeImageUrl?: string;
  creativeVideoUrl?: string;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type ListCampaignsQuery = {
  page: number;
  limit: number;
  status?: CampaignStatus;
};

export type CampaignListItem = {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  targetDevice: TargetDevice;
  targetCountries?: string[];
  targetExcludeCountries?: string[];
  targetBrowsers?: string[];
  targetOs?: string[];
  targetLanguages?: string[];
  budgetTotal: number;
  budgetSpent: number;
  landingUrl?: string;
  creativeTitle?: string;
  creativeBody?: string;
  creativeCta?: string;
  creativeImageUrl?: string;
  creativeVideoUrl?: string;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
