import { Request, Response } from "express";

declare interface CommentHandler {
  getAll(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  create(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  update(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  delete(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
}

export default CommentHandler;
