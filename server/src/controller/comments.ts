import "express-async-errors";
import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import CommentHandler from "../__dwitter__.d.ts/controller/comments";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";
import { UserDataHandler, OutputUser } from "../__dwitter__.d.ts/data/user";

export default class CommentController implements CommentHandler {
  constructor(
    private commentRepository: CommentDataHandler,
    private userRepository: UserDataHandler,
    private getSocketIO: () => Server
  ) {}

  getComments = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.commentRepository
      .getAll(req.params.tweetId, req.user!.id)
      .catch((error) => {
        throw `Error! commentContoller.getComments < ${error}`;
      });
    return res.status(200).json(data);
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    const { recipient }: { recipient?: string } = req.body;
    let findUser = "";
    if (recipient) {
      if (recipient === req.user?.username) findUser = req.user?.username;

      const result = await this.userRepository
        .findByUsername(recipient)
        .catch((error) => {
          throw `Error! commentContoller.createComment < ${error}`;
        });
      if (!result)
        return res.status(409).json({ message: "Replied user not found" });

      findUser = (result as OutputUser).username;
    }

    const comment = await this.commentRepository
      .create(req.user!.id, req.params.tweetId, req.body.text, findUser)
      .catch((error) => {
        throw `Error! commentContoller.createComment < ${error}`;
      });
    this.getSocketIO().emit("comments", comment);
    return res.status(201).json(comment);
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    const updated = await this.commentRepository
      .update(
        req.params.tweetId,
        req.params.commentId,
        req.user!.id,
        req.body.text
      )
      .catch((error) => {
        throw `Error! commentContoller.updateComment < ${error}`;
      });
    return res.status(200).json(updated);
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    await this.commentRepository.remove(req.params.commentId).catch((error) => {
      throw `Error! commentContoller.deleteComment < ${error}`;
    });
    return res.sendStatus(204);
  };
}
