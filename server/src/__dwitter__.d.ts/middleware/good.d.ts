import { NextFunction, Request, Response } from "express";
import { GoodDataHandler } from "../data/good";
import { TweetDataHandler } from "../data/tweet";

export interface GoodHandler {
  goodTweet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
}

export declare class GoodMiddleWare {
  private tweetRepository;
  private goodRepository;
  constructor(
    tweetRepository: TweetDataHandler,
    goodRepository: GoodDataHandler
  );
  goodTweet: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
}
