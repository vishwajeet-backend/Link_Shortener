import { FilterQuery, HydratedDocument, isValidObjectId } from "mongoose";
import { ShortUrlModel, type ShortUrlDocument } from "../models/short-url.model";
import { URL_STATUS, type UrlStatus } from "../types/common";

type ShortUrlEntity = HydratedDocument<ShortUrlDocument>;

export class UrlRepository {
  async findByShortCode(shortCode: string): Promise<ShortUrlEntity | null> {
    return ShortUrlModel.findOne({ shortCode }).exec();
  }

  async existsByShortCode(shortCode: string): Promise<boolean> {
    const exists = await ShortUrlModel.exists({ shortCode });
    return Boolean(exists);
  }

  async createOne(input: {
    ownerId: string;
    shortCode: string;
    originalUrl: string;
    normalizedUrl: string;
    title?: string;
    description?: string;
    expiresAt?: Date;
  }): Promise<ShortUrlEntity> {
    return ShortUrlModel.create({
      ownerId: input.ownerId,
      shortCode: input.shortCode,
      originalUrl: input.originalUrl,
      normalizedUrl: input.normalizedUrl,
      title: input.title,
      description: input.description,
      expiresAt: input.expiresAt
    });
  }

  async findByOwnerWithFilters(input: {
    ownerId: string;
    page: number;
    limit: number;
    status?: UrlStatus;
    search?: string;
  }): Promise<{ data: ShortUrlEntity[]; total: number }> {
    const filter: FilterQuery<ShortUrlDocument> = { ownerId: input.ownerId };

    if (input.status) {
      filter.status = input.status;
    }

    if (input.search) {
      const regex = new RegExp(input.search, "i");
      filter.$or = [{ shortCode: regex }, { originalUrl: regex }, { title: regex }];
    }

    const skip = (input.page - 1) * input.limit;
    const [data, total] = await Promise.all([
      ShortUrlModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(input.limit).exec(),
      ShortUrlModel.countDocuments(filter)
    ]);

    return { data, total };
  }

  async listAllWithFilters(input: {
    page: number;
    limit: number;
    status?: UrlStatus;
    search?: string;
    ownerId?: string;
  }): Promise<{ data: ShortUrlEntity[]; total: number }> {
    const filter: FilterQuery<ShortUrlDocument> = {};
    if (input.status) {
      filter.status = input.status;
    }
    if (input.ownerId) {
      filter.ownerId = input.ownerId;
    }
    if (input.search) {
      const regex = new RegExp(input.search, "i");
      filter.$or = [{ shortCode: regex }, { originalUrl: regex }, { title: regex }];
    }

    const skip = (input.page - 1) * input.limit;
    const [data, total] = await Promise.all([
      ShortUrlModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(input.limit).exec(),
      ShortUrlModel.countDocuments(filter)
    ]);
    return { data, total };
  }

  async findByIdAndOwner(urlId: string, ownerId: string): Promise<ShortUrlEntity | null> {
    if (!isValidObjectId(urlId)) return null;
    return ShortUrlModel.findOne({ _id: urlId, ownerId }).exec();
  }

  async findById(urlId: string): Promise<ShortUrlEntity | null> {
    if (!isValidObjectId(urlId)) return null;
    return ShortUrlModel.findById(urlId).exec();
  }

  async updateStatus(urlId: string, status: UrlStatus): Promise<ShortUrlEntity | null> {
    if (!isValidObjectId(urlId)) return null;
    return ShortUrlModel.findByIdAndUpdate(
      urlId,
      { $set: { status, deletedAt: status === URL_STATUS.DELETED ? new Date() : undefined } },
      { new: true }
    ).exec();
  }

  async incrementClickForActiveShortCode(shortCode: string): Promise<ShortUrlEntity | null> {
    return ShortUrlModel.findOneAndUpdate(
      { shortCode, status: URL_STATUS.ACTIVE },
      { $inc: { clickCount: 1 }, $set: { lastClickedAt: new Date() } },
      { new: true }
    ).exec();
  }
}

export const urlRepository = new UrlRepository();
