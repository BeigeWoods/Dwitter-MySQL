import { Request, Response } from "express";
import GoodDataHandler from "../data/good";
import TweetDataHandler from "../data/tweet";
import CommentDataHandler from "../data/comments";

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

export declare class GoodController {
  private tweetRepository;
  private commentRepository;
  private goodRepository;

  constructor(
    tweetRepository: TweetDataHandler,
    commentRepository: CommentDataHandler,
    goodRepository: GoodDataHandler
  );

  tweet: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  comment: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
}

export default GoodHandler;
