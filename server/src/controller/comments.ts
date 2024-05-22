import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";
import { CommentHandler } from "../__dwitter__.d.ts/controller/comments";
import { UserDataHandler, OutputUserInfo } from "../__dwitter__.d.ts/data/user";

export default class CommentController implements CommentHandler {
  constructor(
    private commentRepository: CommentDataHandler,
    private userRepository: UserDataHandler,
    private getSocketIO: () => Server
  ) {}

  getComments = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.commentRepository.getAll(
      req.params.tweetId,
      req.user!.id
    );
    return data
      ? res.status(200).json(data)
      : next(new Error("getComments : from commentRepository.getAll"));
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    let user: OutputUserInfo | number | void = undefined;
    const { recipient }: { recipient?: string } = req.body;
    if (recipient) {
      user = await this.userRepository.findByUsername(recipient);
      switch (user) {
        case 1:
          return next(
            new Error("createComment : from userRepository.findByUsername")
          );
        case undefined:
          return res.status(409).json({ message: "Replied user not found" });
      }
    }
    const comment = await this.commentRepository.create(
      req.user!.id,
      req.params.tweetId,
      req.body.text,
      user ? (user as OutputUserInfo).username : ""
    );
    if (!comment) {
      return next(new Error("createComment : from commentRepository.create"));
    }
    this.getSocketIO().emit("comments", comment);
    return res.status(201).json(comment);
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    const updated = await this.commentRepository.update(
      req.params.tweetId,
      req.params.commentId,
      req.user!.id,
      req.body.text
    );
    return updated
      ? res.status(200).json(updated)
      : next(new Error("updateComment : from commentRepository.update"));
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    return await this.commentRepository.remove(req.params.commentId, (error) =>
      error ? next(error) : res.sendStatus(204)
    );
  };
}
