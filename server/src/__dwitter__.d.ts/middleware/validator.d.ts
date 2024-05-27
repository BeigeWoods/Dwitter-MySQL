import { NextFunction, Response, Request } from "express";

export declare const expressValidate: (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Response<any, Record<string, any>>;
