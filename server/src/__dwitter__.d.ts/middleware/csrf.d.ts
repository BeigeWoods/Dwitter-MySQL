import { NextFunction, Request, Response } from "express";

export declare const csrfCheck: (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Response<any, Record<string, any>>;
