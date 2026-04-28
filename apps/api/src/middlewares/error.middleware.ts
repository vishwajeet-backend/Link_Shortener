import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { isApiError } from "../utils/api-error";

type AppError = Error & {
  statusCode?: number;
  code?: string;
  details?: unknown;
};

export const errorMiddleware = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = isApiError(error)
    ? error.statusCode
    : error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const isSafeMessage = statusCode < StatusCodes.INTERNAL_SERVER_ERROR;
  const requestId = _req.requestId;
  const message = isSafeMessage ? error.message : "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.code ? { code: error.code } : {}),
    ...(isApiError(error) && error.details ? { details: error.details } : {}),
    ...(requestId ? { requestId } : {})
  });
};
