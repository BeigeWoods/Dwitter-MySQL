import { NextFunction, Request, Response } from "express";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";
import { GoodDataHandler } from "../__dwitter__.d.ts/data/good";
import { GoodHandler } from "../__dwitter__.d.ts/middleware/good";

export class GoodMiddleWare implements GoodHandler {
  private count?: number;
  private click?: number;
  constructor(
    private tweetRepository: TweetDataHandler,
    private goodRepository: GoodDataHandler
  ) {}
  goodTweet = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    this.click = Number(req.body.clicked);
    this.count = Number(req.body.good);
    if (Number.isNaN(this.count)) {
      return next();
    }
    if (!this.click) {
      this.count += 1;
      await this.goodRepository.clickTweet(req.userId!, id);
    } else {
      if (this.count <= 0) {
        return res.status(409);
      }
      this.count -= 1;
      await this.goodRepository.unClickTweet(req.userId!, id);
    }
    await this.tweetRepository.updateGood(id, req.userId!, this.count);
    return res.status(201).json({
      id: Number(id),
      good: this.count,
      clicked: this.click ? 0 : req.userId,
    });
  };
}
