import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { withdrawalService } from "./withdrawal.service";
import type { CreateWithdrawalInput, ListWithdrawalsQuery } from "./withdrawal.types";

export class WithdrawalController {
  async createWithdrawal(req: Request, res: Response): Promise<void> {
    const payload = req.body as CreateWithdrawalInput;
    const data = await withdrawalService.requestWithdrawal(req.authUser!.userId, payload);
    res.status(StatusCodes.CREATED).json({ success: true, data });
  }

  async listWithdrawals(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ListWithdrawalsQuery;
    const data = await withdrawalService.listMyWithdrawals(req.authUser!.userId, query);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async listAll(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ListWithdrawalsQuery;
    const data = await withdrawalService.listAllWithdrawals(query);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const data = await withdrawalService.updateStatus(String(req.params.id), req.body.status, req.body.memo);
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const withdrawalController = new WithdrawalController();
