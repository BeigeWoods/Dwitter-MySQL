import { Request, Response } from "express";
import CommentDataHandler from "../data/comments";

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

export declare class CommentController implements CommentHandler {
  private commentRepository;

  constructor(commentRepository: CommentDataHandler);

  getAll: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  create: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  update: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  delete: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
}

export default CommentHandler;
