import { NextFunction, Request, Response } from "express";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";
import { GoodDataHandler } from "../__dwitter__.d.ts/data/good";
import { GoodHandler } from "../__dwitter__.d.ts/middleware/good";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";

export class GoodMiddleWare implements GoodHandler {
  private count?: number;
  private click?: number;
  constructor(
    private tweetRepository: TweetDataHandler,
    private commentRepository: CommentDataHandler,
    private goodRepository: GoodDataHandler
  ) {}
  goodTweet = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    this.click = Number(req.body.clicked);
    this.count = Number(req.body.good);
    if (Number.isNaN(this.count)) {
      return next();
    }
    if (this.click > 0) {
      if (this.count < 1) {
        return res.status(409);
      }
      this.count -= 1;
      await this.goodRepository.unClickTweet(req.userId!, id);
    } else {
      this.count += 1;
      await this.goodRepository.clickTweet(req.userId!, id);
    }
    await this.tweetRepository.updateGood(id, this.count);
    return res.status(201).json({
      id: Number(id),
      good: this.count,
      clicked: this.click ? 0 : req.userId,
    });
  };

  goodComment = async (req: Request, res: Response, next: NextFunction) => {
    const { main } = req.params;
    this.click = Number(req.body.clicked);
    this.count = Number(req.body.good);
    if (Number.isNaN(this.count)) {
      return next();
    }
    if (this.click > 0) {
      if (this.count < 1) {
        return res.status(409);
      }
      this.count -= 1;
      await this.goodRepository.unClickComment(req.userId!, main);
    } else {
      this.count += 1;
      await this.goodRepository.clickComment(req.userId!, main);
    }
    await this.commentRepository.updateGood(main, this.count);
    return res.status(201).json({
      id: Number(main),
      good: this.count,
      clicked: this.click ? 0 : req.userId,
    });
  };
}
