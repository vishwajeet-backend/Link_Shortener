import { StatusCodes } from "http-status-codes";
import { notificationService } from "../notifications/notification.service";
import { userRepository } from "../../repositories/user.repository";
import { urlRepository } from "../../repositories/url.repository";
import { EMAIL_EVENT_TYPE, URL_STATUS, USER_STATUS } from "../../types/common";
import type { AdminListUrlsQuery, AdminListUsersQuery, AdminUrlActionResult } from "./admin.types";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

export class AdminService {
  async listUsers(query: AdminListUsersQuery): Promise<{
    items: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data, total } = await userRepository.listUsers(query);
    return {
      items: data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    };
  }

  async banUser(userId: string): Promise<{ id: string; status: string }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw buildServiceError("User not found", StatusCodes.NOT_FOUND);
    }
    const updated = await userRepository.updateStatus(userId, USER_STATUS.BANNED);
    if (!updated) {
      throw buildServiceError("Unable to ban user", StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return { id: updated.id, status: updated.status };
  }

  async deleteUser(userId: string): Promise<{ id: string; status: string }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw buildServiceError("User not found", StatusCodes.NOT_FOUND);
    }
    const updated = await userRepository.updateStatus(userId, USER_STATUS.DELETED);
    if (!updated) {
      throw buildServiceError("Unable to delete user", StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return { id: updated.id, status: updated.status };
  }

  async listUrls(query: AdminListUrlsQuery): Promise<{
    items: Array<{
      id: string;
      ownerId: string;
      shortCode: string;
      originalUrl: string;
      status: string;
      clickCount: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data, total } = await urlRepository.listAllWithFilters(query);
    return {
      items: data.map((url) => ({
        id: url.id,
        ownerId: String(url.ownerId),
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        status: url.status,
        clickCount: url.clickCount,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    };
  }

  async pauseUrl(urlId: string): Promise<AdminUrlActionResult> {
    return this.changeUrlStatus(urlId, URL_STATUS.PAUSED);
  }

  async activateUrl(urlId: string): Promise<AdminUrlActionResult> {
    return this.changeUrlStatus(urlId, URL_STATUS.ACTIVE);
  }

  async deleteUrl(urlId: string): Promise<AdminUrlActionResult> {
    return this.changeUrlStatus(urlId, URL_STATUS.DELETED);
  }

  private async changeUrlStatus(urlId: string, targetStatus: typeof URL_STATUS[keyof typeof URL_STATUS]) {
    const url = await urlRepository.findById(urlId);
    if (!url) {
      throw buildServiceError("URL not found", StatusCodes.NOT_FOUND);
    }

    const owner = await userRepository.findById(String(url.ownerId));
    if (!owner) {
      throw buildServiceError("URL owner not found", StatusCodes.NOT_FOUND);
    }

    if (url.status === URL_STATUS.DELETED && targetStatus !== URL_STATUS.DELETED) {
      throw buildServiceError("Deleted URLs cannot be modified", StatusCodes.BAD_REQUEST);
    }

    const updated =
      url.status === targetStatus ? url : await urlRepository.updateStatus(url.id, targetStatus);
    if (!updated) {
      throw buildServiceError("Unable to update URL status", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const eventType =
      targetStatus === URL_STATUS.PAUSED
        ? EMAIL_EVENT_TYPE.URL_PAUSED
        : targetStatus === URL_STATUS.ACTIVE
          ? EMAIL_EVENT_TYPE.URL_ACTIVATED
          : EMAIL_EVENT_TYPE.URL_DELETED;

    await notificationService.notifyUrlStatusChange({
      userId: owner.id,
      recipientEmail: owner.email,
      recipientName: owner.name,
      shortCode: updated.shortCode,
      originalUrl: updated.originalUrl,
      eventType,
      status: updated.status
    });

    return {
      id: updated.id,
      shortCode: updated.shortCode,
      ownerId: owner.id,
      ownerEmail: owner.email,
      status: updated.status,
      clickCount: updated.clickCount,
      updatedAt: updated.updatedAt
    };
  }
}

export const adminService = new AdminService();
