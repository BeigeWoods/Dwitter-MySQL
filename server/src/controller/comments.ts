import "express-async-errors";
import { Request, Response } from "express";
import { Server } from "socket.io";
import ExceptionHandler from "../exception/exception.js";
import CommentHandler from "../__dwitter__.d.ts/controller/comments";
import CommentDataHandler from "../__dwitter__.d.ts/data/comments";
import UserDataHandler, { OutputUser } from "../__dwitter__.d.ts/data/user";
import { KindOfController } from "../__dwitter__.d.ts/exception/exception.js";

export default class CommentController implements CommentHandler {
  constructor(
    private readonly commentRepository: CommentDataHandler,
    private readonly userRepository: UserDataHandler,
    private readonly getSocketIO: () => Server,
    private readonly exc: ExceptionHandler<
      KindOfController,
      keyof CommentHandler
    >
  ) {}

  getAll = async (req: Request, res: Response) => {
    const data = await this.commentRepository
      .getAll(req.params.tweetId, req.user!.id)
      .catch((e) => this.exc.throw(e, "getAll"));
    return res.status(200).json(data);
  };

  create = async (req: Request, res: Response) => {
    const { recipient }: { recipient?: string } = req.body;
    let findUser = "";
    if (recipient) {
      if (recipient === req.user?.username) findUser = req.user?.username;

      const result = await this.userRepository
        .findByUsername(recipient)
        .catch((e) => this.exc.throw(e, "create"));
      if (!result)
        return res.status(409).json({ message: "Replied user not found" });

      findUser = (result as OutputUser).username;
    }

    const comment = await this.commentRepository
      .create(req.user!.id, req.params.tweetId, req.body.text, findUser)
      .catch((e) => this.exc.throw(e, "create"));
    this.getSocketIO().emit("comments", comment);
    return res.status(201).json(comment);
  };

  update = async (req: Request, res: Response) => {
    const updated = await this.commentRepository
      .update(
        req.params.tweetId,
        req.params.commentId,
        req.user!.id,
        req.body.text
      )
      .catch((e) => this.exc.throw(e, "update"));
    return res.status(200).json(updated);
  };

  delete = async (req: Request, res: Response) => {
    await this.commentRepository
      .delete(req.params.commentId)
      .catch((e) => this.exc.throw(e, "delete"));
    return res.sendStatus(204);
  };
}
