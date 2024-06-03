import { NextFunction, Request, Response } from "express";
import { GoodHandler } from "../__dwitter__.d.ts/controller/good";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";
import { GoodDataHandler } from "../__dwitter__.d.ts/data/good";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";

export default class GoodController implements GoodHandler {
  constructor(
    private tweetRepository: TweetDataHandler,
    private commentRepository: CommentDataHandler,
    private goodRepository: GoodDataHandler
  ) {}

  goodTweet = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { tweetId } = req.params;
    const clicked = Number(req.body.clicked);
    let good = Number(req.body.good);
    let error: Error | void = undefined;

    if (clicked && good > 0) {
      good -= 1;
      error = await this.goodRepository.unClickTweet(userId, tweetId);
    } else {
      good += 1;
      error = await this.goodRepository.clickTweet(userId, tweetId);
    }
    if (error) {
      return next(error);
    }
    error = await this.tweetRepository.updateGood(tweetId, good);

    return error
      ? next(error)
      : res.status(201).json({
          id: Number(tweetId),
          good,
          clicked: clicked ? 0 : userId,
        });
  };

  goodComment = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { commentId } = req.params;
    const clicked = Number(req.body.clicked);
    let good = Number(req.body.good);
    let error: Error | void = undefined;

    if (clicked && good > 0) {
      good -= 1;
      error = await this.goodRepository.unClickComment(userId, commentId);
    } else {
      good += 1;
      error = await this.goodRepository.clickComment(userId, commentId);
    }
    if (error) {
      return next(error);
    }
    error = await this.commentRepository.updateGood(commentId, good);

    return error
      ? next(error)
      : res.status(201).json({
          id: Number(commentId),
          good,
          clicked: clicked ? 0 : userId,
        });
  };
}
