import "express-async-errors";
import { Request, Response } from "express";
import ExceptionHandler from "../exception/exception.js";
import GoodHandler from "../__dwitter__.d.ts/controller/good";
import GoodDataHandler, { OutputGood } from "../__dwitter__.d.ts/data/good";
import { KindOfController } from "../__dwitter__.d.ts/exception/exception.js";

export default class GoodController implements GoodHandler {
  constructor(
    private readonly goodRepository: GoodDataHandler,
    private readonly exc: ExceptionHandler<KindOfController, keyof GoodHandler>
  ) {}
  tweet = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { tweetId } = req.params;
    const clicked = req.body.clicked;
    let result: OutputGood | void;
    try {
      result = clicked
        ? await this.goodRepository.undo(userId, tweetId, true)
        : await this.goodRepository.click(userId, tweetId, true);
    } catch (e: any) {
      switch (e.errno) {
        case 3819:
          return res.status(400);
        case 1213:
          return res.status(409).json({ message: "Please try again" });
        default:
          this.exc.throw(e, "tweet");
      }
    }
    return res.status(201).json({
      ...result!,
      clicked: clicked ? 0 : 1,
    });
  };

  comment = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { commentId } = req.params;
    const clicked = req.body.clicked;
    let result: OutputGood | void;
    try {
      result = clicked
        ? await this.goodRepository.undo(userId, commentId, false)
        : await this.goodRepository.click(userId, commentId, false);
    } catch (e: any) {
      switch (e.errno) {
        case 3819:
          return res.status(400);
        case 1213:
          return res.status(409).json({ message: "Please try again" });
        default:
          this.exc.throw(e, "comment");
      }
    }
    return res.status(201).json({
      ...result!,
      clicked: clicked ? 0 : 1,
    });
  };
}
