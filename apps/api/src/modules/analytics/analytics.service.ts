import { StatusCodes } from "http-status-codes";
import { ShortUrlModel } from "../../models/short-url.model";
import { UserModel } from "../../models/user.model";
import { clickRepository } from "../../repositories/click.repository";
import { urlRepository } from "../../repositories/url.repository";
import { URL_STATUS, USER_STATUS } from "../../types/common";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

export class AnalyticsService {
  async getUserOverview(userId: string, days: number): Promise<{
    totals: {
      urls: number;
      active: number;
      paused: number;
      hidden: number;
      deleted: number;
      clicks: number;
      uniqueClicks: number;
    };
    trends: {
      clicksByDay: Array<{ date: string; count: number }>;
      uniqueClicksByDay: Array<{ date: string; count: number }>;
    };
  }> {
    const [urls, active, paused, hidden, deleted, clicks, uniqueClicks, clicksByDay, uniqueClicksByDay] = await Promise.all([
      ShortUrlModel.countDocuments({ ownerId: userId }),
      ShortUrlModel.countDocuments({ ownerId: userId, status: URL_STATUS.ACTIVE }),
      ShortUrlModel.countDocuments({ ownerId: userId, status: URL_STATUS.PAUSED }),
      ShortUrlModel.countDocuments({ ownerId: userId, status: URL_STATUS.HIDDEN }),
      ShortUrlModel.countDocuments({ ownerId: userId, status: URL_STATUS.DELETED }),
      clickRepository.countClicksByOwner(userId),
      clickRepository.countUniqueClicksByOwner(userId),
      clickRepository.getDailyClicks({ ownerId: userId, days }),
      clickRepository.getDailyClicks({ ownerId: userId, days, uniqueOnly: true })
    ]);

    return {
      totals: { urls, active, paused, hidden, deleted, clicks, uniqueClicks },
      trends: { clicksByDay, uniqueClicksByDay }
    };
  }

  async getAdminOverview(days: number): Promise<{
    totals: {
      users: number;
      activeUsers: number;
      bannedUsers: number;
      urls: number;
      activeUrls: number;
      pausedUrls: number;
      hiddenUrls: number;
      deletedUrls: number;
      clicks: number;
      uniqueClicks: number;
    };
    trends: {
      clicksByDay: Array<{ date: string; count: number }>;
      uniqueClicksByDay: Array<{ date: string; count: number }>;
    };
  }> {
    const [
      users,
      activeUsers,
      bannedUsers,
      urls,
      activeUrls,
      pausedUrls,
      hiddenUrls,
      deletedUrls,
      clicks,
      uniqueClicks,
      clicksByDay,
      uniqueClicksByDay
    ] = await Promise.all([
      UserModel.countDocuments({}),
      UserModel.countDocuments({ status: USER_STATUS.ACTIVE }),
      UserModel.countDocuments({ status: USER_STATUS.BANNED }),
      ShortUrlModel.countDocuments({}),
      ShortUrlModel.countDocuments({ status: URL_STATUS.ACTIVE }),
      ShortUrlModel.countDocuments({ status: URL_STATUS.PAUSED }),
      ShortUrlModel.countDocuments({ status: URL_STATUS.HIDDEN }),
      ShortUrlModel.countDocuments({ status: URL_STATUS.DELETED }),
      clickRepository.countClicksTotal(),
      clickRepository.countUniqueClicksTotal(),
      clickRepository.getDailyClicks({ days }),
      clickRepository.getDailyClicks({ days, uniqueOnly: true })
    ]);

    return {
      totals: {
        users,
        activeUsers,
        bannedUsers,
        urls,
        activeUrls,
        pausedUrls,
        hiddenUrls,
        deletedUrls,
        clicks,
        uniqueClicks
      },
      trends: { clicksByDay, uniqueClicksByDay }
    };
  }

  async getUserTopLinks(userId: string, days: number, limit: number): Promise<{
    items: Array<{
      urlId: string;
      shortCode: string;
      totalClicks: number;
      uniqueClicks: number;
      originalUrl?: string;
      title?: string;
    }>;
  }> {
    const items = await clickRepository.getTopLinks({ ownerId: userId, days, limit });
    return { items };
  }

  async getAdminTopLinks(days: number, limit: number): Promise<{
    items: Array<{
      urlId: string;
      shortCode: string;
      totalClicks: number;
      uniqueClicks: number;
      originalUrl?: string;
      title?: string;
    }>;
  }> {
    const items = await clickRepository.getTopLinks({ days, limit });
    return { items };
  }

  async getUserLinkDetails(userId: string, urlId: string, days: number): Promise<{
    link: {
      id: string;
      shortCode: string;
      originalUrl: string;
      status: string;
    };
    totals: {
      clicks: number;
      uniqueClicks: number;
    };
    trends: {
      clicksByDay: Array<{ date: string; count: number }>;
      uniqueClicksByDay: Array<{ date: string; count: number }>;
    };
    breakdowns: {
      browsers: Array<{ label: string; count: number }>;
      os: Array<{ label: string; count: number }>;
      devices: Array<{ label: string; count: number }>;
      countries: Array<{ label: string; count: number }>;
      referrers: Array<{ label: string; count: number }>;
    };
  }> {
    const link = await urlRepository.findByIdAndOwner(urlId, userId);
    if (!link) {
      throw buildServiceError("URL not found", StatusCodes.NOT_FOUND);
    }

    const [clicks, uniqueClicks, clicksByDay, uniqueClicksByDay, browsers, os, devices, countries, referrers] =
      await Promise.all([
        clickRepository.countClicksByUrl(urlId),
        clickRepository.countUniqueClicksByUrl(urlId),
        clickRepository.getDailyClicks({ ownerId: userId, urlId, days }),
        clickRepository.getDailyClicks({ ownerId: userId, urlId, days, uniqueOnly: true }),
        clickRepository.getFieldBreakdown({ ownerId: userId, urlId, days, field: "browser", limit: 10 }),
        clickRepository.getFieldBreakdown({ ownerId: userId, urlId, days, field: "os", limit: 10 }),
        clickRepository.getFieldBreakdown({ ownerId: userId, urlId, days, field: "deviceType", limit: 10 }),
        clickRepository.getFieldBreakdown({ ownerId: userId, urlId, days, field: "country", limit: 10 }),
        clickRepository.getFieldBreakdown({ ownerId: userId, urlId, days, field: "referrer", limit: 10 })
      ]);

    return {
      link: {
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        status: link.status
      },
      totals: {
        clicks,
        uniqueClicks
      },
      trends: {
        clicksByDay,
        uniqueClicksByDay
      },
      breakdowns: {
        browsers,
        os,
        devices,
        countries,
        referrers
      }
    };
  }

  async getUserExport(userId: string, days: number, type: string): Promise<string> {
    const uniqueOnly = type === "unique";
    const rows = await clickRepository.getDailyClicks({ ownerId: userId, days, uniqueOnly });
    return this.buildCsv(rows, uniqueOnly ? "unique_clicks" : "clicks");
  }

  async getAdminExport(days: number, type: string): Promise<string> {
    const uniqueOnly = type === "unique";
    const rows = await clickRepository.getDailyClicks({ days, uniqueOnly });
    return this.buildCsv(rows, uniqueOnly ? "unique_clicks" : "clicks");
  }

  async getUserPresets(
    userId: string,
    input: { period: "monthly" | "yearly"; year?: number; months?: number; years?: number }
  ): Promise<{
    period: "monthly" | "yearly";
    clicks: Array<{ period: string; count: number }>;
    uniqueClicks: Array<{ period: string; count: number }>;
  }> {
    const [clicks, uniqueClicks] = await Promise.all([
      clickRepository.getPeriodClicks({ ownerId: userId, ...input }),
      clickRepository.getPeriodClicks({ ownerId: userId, ...input, uniqueOnly: true })
    ]);

    return {
      period: input.period,
      clicks,
      uniqueClicks
    };
  }

  async getAdminPresets(input: {
    period: "monthly" | "yearly";
    year?: number;
    months?: number;
    years?: number;
  }): Promise<{
    period: "monthly" | "yearly";
    clicks: Array<{ period: string; count: number }>;
    uniqueClicks: Array<{ period: string; count: number }>;
  }> {
    const [clicks, uniqueClicks] = await Promise.all([
      clickRepository.getPeriodClicks(input),
      clickRepository.getPeriodClicks({ ...input, uniqueOnly: true })
    ]);

    return {
      period: input.period,
      clicks,
      uniqueClicks
    };
  }

  private buildCsv(rows: Array<{ date: string; count: number }>, header: string): string {
    const lines = ["date," + header, ...rows.map((row) => `${row.date},${row.count}`)];
    return lines.join("\n");
  }
}

export const analyticsService = new AnalyticsService();
