import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { campaignService } from "./campaign.service";
import type { CreateCampaignInput, ListCampaignsQuery, UpdateCampaignInput } from "./campaign.types";

export class CampaignController {
  async createCampaign(req: Request, res: Response): Promise<void> {
    const payload = req.body as CreateCampaignInput;
    const data = await campaignService.createCampaign(
      req.authUser!.userId,
      req.authUser!.role,
      payload
    );
    res.status(StatusCodes.CREATED).json({ success: true, data });
  }

  async listCampaigns(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ListCampaignsQuery;
    const data = await campaignService.listOwnCampaigns(req.authUser!.userId, query);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async getCampaign(req: Request, res: Response): Promise<void> {
    const data = await campaignService.getOwnCampaign(req.authUser!.userId, String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async updateCampaign(req: Request, res: Response): Promise<void> {
    const payload = req.body as UpdateCampaignInput;
    const data = await campaignService.updateOwnCampaign(
      req.authUser!.userId,
      String(req.params.id),
      payload
    );
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async pauseCampaign(req: Request, res: Response): Promise<void> {
    const data = await campaignService.pauseCampaign(req.authUser!.userId, String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async resumeCampaign(req: Request, res: Response): Promise<void> {
    const data = await campaignService.resumeCampaign(req.authUser!.userId, String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const campaignController = new CampaignController();
