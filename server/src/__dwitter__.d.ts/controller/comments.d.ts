import { NextFunction, Request, Response } from "express";
import { CommentDataHandler } from "../data/comments";
import { Callback } from "../data/callback";

export declare interface CommentHandler {
  getComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
  createComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
  updateComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
  deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Callback | unknown[] | void>;
}

export declare class CommentController implements CommentHandler {
  private commentRepository;

  constructor(commentRepository: CommentDataHandler);

  getComments: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
  createComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
  updateComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
  deleteComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Callback | unknown[] | void>;
}
