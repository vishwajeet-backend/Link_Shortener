import { HydratedDocument, isValidObjectId } from "mongoose";
import { PlanModel, type PlanDocument } from "../models/plan.model";

type PlanEntity = HydratedDocument<PlanDocument>;

export class PlanRepository {
  async listAll(): Promise<PlanEntity[]> {
    return PlanModel.find().sort({ price: 1 }).exec();
  }

  async listActive(): Promise<PlanEntity[]> {
    return PlanModel.find({ isActive: true }).sort({ price: 1 }).exec();
  }

  async findById(planId: string): Promise<PlanEntity | null> {
    if (!isValidObjectId(planId)) return null;
    return PlanModel.findById(planId).exec();
  }

  async findDefault(): Promise<PlanEntity | null> {
    return PlanModel.findOne({ isDefault: true, isActive: true }).exec();
  }

  async createPlan(input: PlanDocument): Promise<PlanEntity> {
    return PlanModel.create(input);
  }

  async updatePlan(planId: string, update: Partial<PlanDocument>): Promise<PlanEntity | null> {
    if (!isValidObjectId(planId)) return null;
    return PlanModel.findByIdAndUpdate(planId, { $set: update }, { new: true }).exec();
  }
}

export const planRepository = new PlanRepository();
