import { Request, Response } from "express";

declare interface GoodHandler {
  tweet(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  comment: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
}

export default GoodHandler;
