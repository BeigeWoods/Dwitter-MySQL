import { Request, Response } from "express";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";
import { GoodDataHandler } from "../__dwitter__.d.ts/data/good";
import { GoodHandler } from "../__dwitter__.d.ts/middleware/good";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";

export class GoodController implements GoodHandler {
  private count?: number;
  constructor(
    private tweetRepository: TweetDataHandler,
    private commentRepository: CommentDataHandler,
    private goodRepository: GoodDataHandler
  ) {}
  goodTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { clicked }: { clicked: boolean } = req.body;
    this.count = req.body.good as number;
    if (typeof clicked !== "boolean") {
      return res.sendStatus(409);
    }
    if (clicked && this.count > 0) {
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
      clicked: clicked ? null : req.userId,
    });
  };

  goodComment = async (req: Request, res: Response) => {
    const { main } = req.params;
    const { clicked }: { clicked: boolean } = req.body;
    this.count = req.body.good as number;
    if (typeof clicked !== "boolean") {
      return res.sendStatus(409);
    }
    if (clicked && this.count > 0) {
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
      clicked: clicked ? null : req.userId,
    });
  };
}
