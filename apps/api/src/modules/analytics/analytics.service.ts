import { ShortUrlModel } from "../../models/short-url.model";
import { UserModel } from "../../models/user.model";
import { clickRepository } from "../../repositories/click.repository";
import { URL_STATUS, USER_STATUS } from "../../types/common";

export class AnalyticsService {
  async getUserOverview(userId: string, days: number): Promise<{
    totals: {
      urls: number;
      active: number;
      paused: number;
      deleted: number;
      clicks: number;
    };
    trends: {
      clicksByDay: Array<{ date: string; count: number }>;
    };
  }> {
    const [urls, active, paused, deleted, clicks, clicksByDay] = await Promise.all([
      ShortUrlModel.countDocuments({ ownerId: userId }),
      ShortUrlModel.countDocuments({ ownerId: userId, status: URL_STATUS.ACTIVE }),
      ShortUrlModel.countDocuments({ ownerId: userId, status: URL_STATUS.PAUSED }),
      ShortUrlModel.countDocuments({ ownerId: userId, status: URL_STATUS.DELETED }),
      clickRepository.countClicksByOwner(userId),
      clickRepository.getDailyClicks({ ownerId: userId, days })
    ]);

    return {
      totals: { urls, active, paused, deleted, clicks },
      trends: { clicksByDay }
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
      deletedUrls: number;
      clicks: number;
    };
    trends: {
      clicksByDay: Array<{ date: string; count: number }>;
    };
  }> {
    const [
      users,
      activeUsers,
      bannedUsers,
      urls,
      activeUrls,
      pausedUrls,
      deletedUrls,
      clicks,
      clicksByDay
    ] = await Promise.all([
      UserModel.countDocuments({}),
      UserModel.countDocuments({ status: USER_STATUS.ACTIVE }),
      UserModel.countDocuments({ status: USER_STATUS.BANNED }),
      ShortUrlModel.countDocuments({}),
      ShortUrlModel.countDocuments({ status: URL_STATUS.ACTIVE }),
      ShortUrlModel.countDocuments({ status: URL_STATUS.PAUSED }),
      ShortUrlModel.countDocuments({ status: URL_STATUS.DELETED }),
      clickRepository.countClicksTotal(),
      clickRepository.getDailyClicks({ days })
    ]);

    return {
      totals: {
        users,
        activeUsers,
        bannedUsers,
        urls,
        activeUrls,
        pausedUrls,
        deletedUrls,
        clicks
      },
      trends: { clicksByDay }
    };
  }
}

export const analyticsService = new AnalyticsService();
