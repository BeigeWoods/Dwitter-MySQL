import { NextFunction, Request, Response } from "express";
import { TweetData, TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";

export class GoodMiddleWare {
  constructor(
    private tweetRepository: TweetDataHandler<TweetData>,
    private goodRepository: any
  ) {}
  goodTweet = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { good, clicked }: { good: number; clicked: boolean } = req.body;
    if (typeof good !== "number") {
      return next();
    }
    if (clicked) {
      good - 1;
      await this.goodRepository.unClickTweet(req.userId, id);
    } else {
      good + 1;
      await this.goodRepository.clickTweet(req.userId, id);
    }
    const tweet = await this.tweetRepository.updateGood(id, good);
    return res.status(201).json({
      ...tweet,
      clicked: clicked ? false : true,
    });
  };
}
