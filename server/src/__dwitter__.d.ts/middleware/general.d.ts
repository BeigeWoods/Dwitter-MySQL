import { NextFunction, Response, Request } from "express";

declare type GeneralMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Response<any, Record<string, any>> | NextFunction | void;

export default GeneralMiddleware;
