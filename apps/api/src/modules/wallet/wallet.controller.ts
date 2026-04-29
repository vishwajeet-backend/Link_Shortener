import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { walletService } from "./wallet.service";
import type { WalletLedgerQuery } from "./wallet.types";

export class WalletController {
  async getSummary(req: Request, res: Response): Promise<void> {
    const data = await walletService.getSummary(req.authUser!.userId);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async listLedger(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as WalletLedgerQuery;
    const data = await walletService.listLedger(req.authUser!.userId, query);
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const walletController = new WalletController();
