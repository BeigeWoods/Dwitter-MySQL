import { NextFunction, Request, Response } from "express";
import { CommentDataHandler } from "../data/comments";

export declare interface CommentHandler {
  getComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
  createComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
  updateComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
  deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
}

export declare class CommentController implements CommentHandler {
  private commentRepository;

  constructor(commentRepository: CommentDataHandler);

  getComments: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
  createComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
  updateComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
  deleteComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
}
