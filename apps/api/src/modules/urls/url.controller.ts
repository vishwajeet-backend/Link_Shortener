import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { urlService } from "./url.service";
import type { CreateShortUrlInput, ListUserUrlsQuery } from "./url.types";

export class UrlController {
  async createOwnUrl(req: Request, res: Response): Promise<void> {
    const payload = req.body as CreateShortUrlInput;
    const data = await urlService.createUrl(req.authUser!.userId, payload);
    res.status(StatusCodes.CREATED).json({ success: true, data });
  }

  async listOwnUrls(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ListUserUrlsQuery;
    const data = await urlService.listOwnUrls(req.authUser!.userId, query);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async getOwnUrlById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const data = await urlService.getOwnUrlById(req.authUser!.userId, id);
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const urlController = new UrlController();
