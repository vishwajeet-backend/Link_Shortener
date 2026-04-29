import { HydratedDocument, isValidObjectId } from "mongoose";
import { CampaignModel, type CampaignDocument } from "../models/campaign.model";
import { CAMPAIGN_STATUS, type CampaignStatus, type CampaignType, type Role, type TargetDevice } from "../types/common";

type CampaignEntity = HydratedDocument<CampaignDocument>;

export class CampaignRepository {
  async createCampaign(input: {
    ownerId: string;
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
    startsAt?: Date;
    endsAt?: Date;
    createdByRole: Role;
  }): Promise<CampaignEntity> {
    return CampaignModel.create({
      ownerId: input.ownerId,
      name: input.name,
      type: input.type,
      targetDevice: input.targetDevice,
      targetCountries: input.targetCountries,
      targetExcludeCountries: input.targetExcludeCountries,
      targetBrowsers: input.targetBrowsers,
      targetOs: input.targetOs,
      targetLanguages: input.targetLanguages,
      budgetTotal: input.budgetTotal,
      landingUrl: input.landingUrl,
      creativeTitle: input.creativeTitle,
      creativeBody: input.creativeBody,
      creativeCta: input.creativeCta,
      creativeImageUrl: input.creativeImageUrl,
      creativeVideoUrl: input.creativeVideoUrl,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      createdByRole: input.createdByRole
    });
  }

  async listByOwner(input: {
    ownerId: string;
    page: number;
    limit: number;
    status?: CampaignStatus;
  }): Promise<{ data: CampaignEntity[]; total: number }> {
    const filter: Record<string, unknown> = { ownerId: input.ownerId };
    if (input.status) {
      filter.status = input.status;
    }

    const skip = (input.page - 1) * input.limit;
    const [data, total] = await Promise.all([
      CampaignModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(input.limit).exec(),
      CampaignModel.countDocuments(filter)
    ]);

    return { data, total };
  }

  async findByIdAndOwner(campaignId: string, ownerId: string): Promise<CampaignEntity | null> {
    if (!isValidObjectId(campaignId)) return null;
    return CampaignModel.findOne({ _id: campaignId, ownerId }).exec();
  }

  async updateStatus(
    campaignId: string,
    ownerId: string,
    status: CampaignStatus
  ): Promise<CampaignEntity | null> {
    if (!isValidObjectId(campaignId)) return null;
    return CampaignModel.findOneAndUpdate(
      { _id: campaignId, ownerId },
      { $set: { status } },
      { new: true }
    ).exec();
  }

  async listAll(input: {
    page: number;
    limit: number;
    status?: CampaignStatus;
    ownerId?: string;
    search?: string;
  }): Promise<{ data: CampaignEntity[]; total: number }> {
    const filter: Record<string, unknown> = {};
    if (input.status) {
      filter.status = input.status;
    }
    if (input.ownerId) {
      filter.ownerId = input.ownerId;
    }
    if (input.search) {
      const regex = new RegExp(input.search, "i");
      filter.$or = [{ name: regex }];
    }

    const skip = (input.page - 1) * input.limit;
    const [data, total] = await Promise.all([
      CampaignModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(input.limit).exec(),
      CampaignModel.countDocuments(filter)
    ]);

    return { data, total };
  }

  async findById(campaignId: string): Promise<CampaignEntity | null> {
    if (!isValidObjectId(campaignId)) return null;
    return CampaignModel.findById(campaignId).exec();
  }

  async updateStatusById(campaignId: string, status: CampaignStatus, input?: {
    moderationNote?: string;
    moderatedBy?: string;
    moderatedAt?: Date;
  }): Promise<CampaignEntity | null> {
    if (!isValidObjectId(campaignId)) return null;

    const update: Record<string, unknown> = { status };
    if (input?.moderationNote) update.moderationNote = input.moderationNote;
    if (input?.moderatedBy) update.moderatedBy = input.moderatedBy;
    if (input?.moderatedAt) update.moderatedAt = input.moderatedAt;

    return CampaignModel.findByIdAndUpdate(
      campaignId,
      { $set: update },
      { new: true }
    ).exec();
  }

  async updateCampaign(
    campaignId: string,
    ownerId: string,
    update: Partial<CampaignDocument>
  ): Promise<CampaignEntity | null> {
    if (!isValidObjectId(campaignId)) return null;
    return CampaignModel.findOneAndUpdate(
      { _id: campaignId, ownerId },
      { $set: update },
      { new: true }
    ).exec();
  }

  /** After a paid CAMPAIGN invoice: activate draft campaigns; top up budget on active campaigns. */
  async applyFundingAfterPayment(
    campaignId: string,
    ownerId: string,
    paidAmount: number
  ): Promise<CampaignEntity | null> {
    if (!isValidObjectId(campaignId)) return null;
    const existing = await CampaignModel.findOne({ _id: campaignId, ownerId }).exec();
    if (!existing) return null;

    if (existing.status === CAMPAIGN_STATUS.DRAFT) {
      return CampaignModel.findOneAndUpdate(
        { _id: campaignId, ownerId },
        { $set: { status: CAMPAIGN_STATUS.ACTIVE } },
        { new: true }
      ).exec();
    }

    if (existing.status === CAMPAIGN_STATUS.ACTIVE && paidAmount > 0) {
      return CampaignModel.findOneAndUpdate(
        { _id: campaignId, ownerId },
        { $inc: { budgetTotal: paidAmount } },
        { new: true }
      ).exec();
    }

    return existing;
  }
}

export const campaignRepository = new CampaignRepository();
