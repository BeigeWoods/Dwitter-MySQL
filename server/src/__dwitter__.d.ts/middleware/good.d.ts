import { NextFunction, Request, Response } from "express";
import { TweetData, TweetDataHandler } from "../data/tweet";
import { GoodDataHandler } from "../data/good";

export interface GoodMidHandler {
  goodTweet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
}

export default class GoodMiddleWare implements GoodMidHandler {
  constructor(
    tweetRepository: TweetDataHandler<TweetData>,
    goodRepository: GoodDataHandler
  );
  goodTweet: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
}
