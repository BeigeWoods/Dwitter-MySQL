import "express-async-errors";
import { Request, Response } from "express";
import { Server } from "socket.io";
import { throwErrorOfController as throwError } from "../exception/controller.js";
import CommentHandler from "../__dwitter__.d.ts/controller/comments";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";
import { UserDataHandler, OutputUser } from "../__dwitter__.d.ts/data/user";

export default class CommentController implements CommentHandler {
  constructor(
    private commentRepository: CommentDataHandler,
    private userRepository: UserDataHandler,
    private getSocketIO: () => Server
  ) {}

  getAll = async (req: Request, res: Response) => {
    const data = await this.commentRepository
      .getAll(req.params.tweetId, req.user!.id)
      .catch((error) => throwError.comment("getAll", error));
    return res.status(200).json(data);
  };

  create = async (req: Request, res: Response) => {
    const { recipient }: { recipient?: string } = req.body;
    let findUser = "";
    if (recipient) {
      if (recipient === req.user?.username) findUser = req.user?.username;

      const result = await this.userRepository
        .findByUsername(recipient)
        .catch((error) => throwError.comment("create", error));
      if (!result)
        return res.status(409).json({ message: "Replied user not found" });

      findUser = (result as OutputUser).username;
    }

    const comment = await this.commentRepository
      .create(req.user!.id, req.params.tweetId, req.body.text, findUser)
      .catch((error) => throwError.comment("create", error));
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
      .catch((error) => throwError.comment("update", error));
    return res.status(200).json(updated);
  };

  delete = async (req: Request, res: Response) => {
    await this.commentRepository
      .delete(req.params.commentId)
      .catch((error) => throwError.comment("delete", error));
    return res.sendStatus(204);
  };
}
