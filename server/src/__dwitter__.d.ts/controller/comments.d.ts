import { Request, Response } from "express";
import { CommentDataHandler } from "../data/comments";

export interface CommentHandler {
  getComments(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  createComment(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  updateComment(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  deleteComment(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
}
export declare class CommentController implements CommentHandler {
  private commentRepository;
  constructor(commentRepository: CommentDataHandler);
  getComments: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  createComment: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  updateComment: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  deleteComment: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
}
