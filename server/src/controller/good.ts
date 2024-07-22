import "express-async-errors";
import { Request, Response } from "express";
import {
  throwErrorOfController as throwError,
  printExceptionOfController as printException,
} from "../exception/controller.js";
import GoodHandler from "../__dwitter__.d.ts/controller/good";
import TweetDataHandler from "../__dwitter__.d.ts/data/tweet";
import GoodDataHandler from "../__dwitter__.d.ts/data/good";
import CommentDataHandler from "../__dwitter__.d.ts/data/comments";

export default class GoodController implements GoodHandler {
  constructor(
    private tweetRepository: TweetDataHandler,
    private commentRepository: CommentDataHandler,
    private goodRepository: GoodDataHandler
  ) {}

  tweet = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { tweetId } = req.params;
    const clicked = Number(req.body.clicked);
    let good = Number(req.body.good);

    if (clicked) {
      if (!good) {
        console.warn(
          printException.good("tweet", "Number of clicked good is 0", true)
        );
        return res.sendStatus(400);
      }
      good -= 1;
      await this.goodRepository
        .unClick(userId, tweetId, true)
        .catch((error) => throwError.good("tweet", error));
    } else {
      good += 1;
      await this.goodRepository
        .click(userId, tweetId, true)
        .catch((error) => throwError.good("tweet", error));
    }
    await this.tweetRepository
      .updateGood(tweetId, good)
      .catch((error) => throwError.good("tweet", error));

    return res.status(201).json({
      id: Number(tweetId),
      good,
      clicked: clicked ? 0 : userId,
    });
  };

  comment = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { commentId } = req.params;
    const clicked = Number(req.body.clicked);
    let good = Number(req.body.good);

    if (clicked) {
      if (!good) {
        console.warn(
          printException.good("comment", "Number of clicked good is 0", true)
        );
        return res.sendStatus(400);
      }
      good -= 1;
      await this.goodRepository
        .unClick(userId, commentId, false)
        .catch((error) => throwError.good("comment", error));
    } else {
      good += 1;
      await this.goodRepository
        .click(userId, commentId, false)
        .catch((error) => throwError.good("comment", error));
    }

    await this.commentRepository
      .updateGood(commentId, good)
      .catch((error) => throwError.good("comment", error));

    return res.status(201).json({
      id: Number(commentId),
      good,
      clicked: clicked ? 0 : userId,
    });
  };
}
