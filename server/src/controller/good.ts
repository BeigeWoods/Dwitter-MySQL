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
    let error: Error | void;
    const userId = req.user!.id;
    const { tweetId } = req.params;
    let { clicked, good }: { clicked: boolean; good: number } = req.body;
    if (clicked && good > 0) {
      good -= 1;
      error = await this.goodRepository.unClickTweet(userId, tweetId);
    } else {
      good += 1;
      error = await this.goodRepository.clickTweet(userId, tweetId);
    }
    return error
      ? next(error)
      : await this.tweetRepository.updateGood(tweetId, good, (error) =>
          error
            ? next(error)
            : res.status(201).json({
                id: tweetId,
                good,
                clicked: clicked ? false : true,
              })
        );
  };

  goodComment = async (req: Request, res: Response, next: NextFunction) => {
    let error: Error | void;
    const userId = req.user!.id;
    const { commentId } = req.params;
    let { clicked, good }: { clicked: boolean; good: number } = req.body;
    if (clicked && good > 0) {
      good -= 1;
      error = await this.goodRepository.unClickComment(userId, commentId);
    } else {
      good += 1;
      error = await this.goodRepository.clickComment(userId, commentId);
    }
    return error
      ? next(error)
      : await this.commentRepository.updateGood(commentId, good, (error) =>
          error
            ? next(error)
            : res.status(201).json({
                id: commentId,
                good,
                clicked: clicked ? false : true,
              })
        );
  };
}
