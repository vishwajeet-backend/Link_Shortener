import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodTypeAny } from "zod";

type ValidationSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validationMiddleware =
  ({ body, query, params }: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const bodyResult = body?.safeParse(req.body);
    const queryResult = query?.safeParse(req.query);
    const paramsResult = params?.safeParse(req.params);

    const failedResult = [bodyResult, queryResult, paramsResult].find(
      (result) => result && !result.success
    );

    if (failedResult && !failedResult.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        issues: failedResult.error.issues
      });
      return;
    }

    if (bodyResult?.success) req.body = bodyResult.data;
    if (queryResult?.success) {
      req.query = queryResult.data as Request["query"];
    }
    if (paramsResult?.success) {
      req.params = paramsResult.data as Request["params"];
    }

    next();
  };
