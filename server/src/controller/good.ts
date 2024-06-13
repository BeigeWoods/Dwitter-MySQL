import "express-async-errors";
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

    if (clicked) {
      if (!good) {
        console.warn(
          "Warn! goodController.goodTweet\n number of clicked good is 0"
        );
        return res.sendStatus(400);
      }
      good -= 1;
      await this.goodRepository.unClickTweet(userId, tweetId).catch((error) => {
        throw `Error! goodController.goodTweet < ${error}`;
      });
    } else {
      good += 1;
      await this.goodRepository.clickTweet(userId, tweetId).catch((error) => {
        throw `Error! goodController.goodTweet < ${error}`;
      });
    }
    await this.tweetRepository.updateGood(tweetId, good).catch((error) => {
      throw `Error! goodController.goodTweet < ${error}`;
    });

    return res.status(201).json({
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

    if (clicked) {
      if (!good) {
        console.warn(
          "Warn! goodController.goodComment\n number of clicked good is 0"
        );
        return res.sendStatus(400);
      }
      good -= 1;
      await this.goodRepository
        .unClickComment(userId, commentId)
        .catch((error) => {
          throw `Error! goodController.goodComment < ${error}`;
        });
    } else {
      good += 1;
      await this.goodRepository
        .clickComment(userId, commentId)
        .catch((error) => {
          throw `Error! goodController.goodComment < ${error}`;
        });
    }

    await this.commentRepository.updateGood(commentId, good).catch((error) => {
      throw `Error! goodController.goodComment < ${error}`;
    });

    return res.status(201).json({
      id: Number(commentId),
      good,
      clicked: clicked ? 0 : userId,
    });
  };
}
