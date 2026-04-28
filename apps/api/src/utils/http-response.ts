import { Response } from "express";

export const ok = <T>(res: Response, data: T, message?: string): void => {
  res.status(200).json({
    success: true,
    ...(message ? { message } : {}),
    data
  });
};

export const created = <T>(res: Response, data: T, message?: string): void => {
  res.status(201).json({
    success: true,
    ...(message ? { message } : {}),
    data
  });
};

export const fail = (
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {})
  });
};
