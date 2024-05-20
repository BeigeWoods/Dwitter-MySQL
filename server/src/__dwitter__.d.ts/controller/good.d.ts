import { NextFunction, Request, Response } from "express";
import { GoodDataHandler } from "../data/good";
import { TweetDataHandler } from "../data/tweet";
import { CommentDataHandler } from "../data/comments";
import { Callback } from "../data/callback";

export declare interface GoodHandler {
  goodTweet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Callback | unknown[] | void>;
  goodComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Callback | unknown[] | void>;
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

  goodTweet: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Callback | unknown[] | void>;
  goodComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Callback | unknown[] | void>;
}
