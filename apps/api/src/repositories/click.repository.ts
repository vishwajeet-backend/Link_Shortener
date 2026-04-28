import { HydratedDocument } from "mongoose";
import { ClickLogModel, type ClickLogDocument } from "../models/click-log.model";

type ClickLogEntity = HydratedDocument<ClickLogDocument>;

export class ClickRepository {
  async createClickLog(payload: Partial<ClickLogDocument>): Promise<ClickLogEntity> {
    return ClickLogModel.create(payload);
  }

  async countClicksByOwner(ownerId: string): Promise<number> {
    return ClickLogModel.countDocuments({ ownerId }).exec();
  }

  async countClicksTotal(): Promise<number> {
    return ClickLogModel.countDocuments({}).exec();
  }

  async getDailyClicks(input: { ownerId?: string; days: number }): Promise<Array<{ date: string; count: number }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.max(1, input.days));

    const match: Record<string, unknown> = { timestamp: { $gte: startDate } };
    if (input.ownerId) {
      match.ownerId = input.ownerId;
    }

    const rows = await ClickLogModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    return rows.map((row) => ({
      date: `${row._id.year}-${String(row._id.month).padStart(2, "0")}-${String(row._id.day).padStart(2, "0")}`,
      count: row.count as number
    }));
  }
}

export const clickRepository = new ClickRepository();
