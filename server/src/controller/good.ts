import "express-async-errors";
import { Request, Response } from "express";
import ExceptionHandler from "../exception/exception.js";
import GoodHandler from "../__dwitter__.d.ts/controller/good";
import TweetDataHandler from "../__dwitter__.d.ts/data/tweet";
import GoodDataHandler from "../__dwitter__.d.ts/data/good";
import CommentDataHandler from "../__dwitter__.d.ts/data/comments";
import { KindOfController } from "../__dwitter__.d.ts/exception/exception.js";

export default class GoodController implements GoodHandler {
  constructor(
    private tweetRepository: TweetDataHandler,
    private commentRepository: CommentDataHandler,
    private goodRepository: GoodDataHandler,
    private readonly exc: ExceptionHandler<KindOfController, keyof GoodHandler>
  ) {}

  tweet = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { tweetId } = req.params;
    const clicked = Number(req.body.clicked);
    let good = Number(req.body.good);

    if (clicked) {
      if (!good) {
        return res.sendStatus(400);
      }
      good -= 1;
      await this.goodRepository.unClick(userId, tweetId, true);
    } else {
      good += 1;
      await this.goodRepository.click(userId, tweetId, true);
    }
    await this.tweetRepository.updateGood(tweetId, good);

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
        return res.sendStatus(400);
      }
      good -= 1;
      await this.goodRepository.unClick(userId, commentId, false);
    } else {
      good += 1;
      await this.goodRepository.click(userId, commentId, false);
    }

    await this.commentRepository.updateGood(commentId, good);

    return res.status(201).json({
      id: Number(commentId),
      good,
      clicked: clicked ? 0 : userId,
    });
  };
}
