import { Request, Response } from "express";
import { Server } from "socket.io";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";
import { CommentHandler } from "../__dwitter__.d.ts/controller/comments";
import { UserDataHandler } from "../__dwitter__.d.ts/data/auth";
import { OutputUserInfo } from "../__dwitter__.d.ts/data/auth";

export class CommentController implements CommentHandler {
  private user?: OutputUserInfo | void;
  constructor(
    private commentRepository: CommentDataHandler,
    private userRepository: UserDataHandler,
    private getSocketIO: () => Server
  ) {}

  getComments = async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    const data = await this.commentRepository.getAll(tweetId, req.userId!);
    return res.status(200).json(data);
  };

  createComment = async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    const { text, repliedUser }: { text: string; repliedUser?: string } =
      req.body;
    if (repliedUser) {
      this.user = await this.userRepository.findByUsername(repliedUser);
      if (!this.user) {
        return res.status(400).json({ message: "Replied user not found" });
      }
    }
    const comment = await this.commentRepository.create(
      req.userId!,
      tweetId,
      text,
      this.user ? this.user.username : ""
    );
    this.getSocketIO().emit("comments", comment);
    return res.status(201).json(comment);
  };

  updateComment = async (req: Request, res: Response) => {
    const { tweetId, commentId } = req.params;
    const { text }: { text: string } = req.body;
    const updated = await this.commentRepository.update(
      tweetId,
      commentId,
      req.userId!,
      text
    );
    return res.status(200).json(updated);
  };

  deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    await this.commentRepository.remove(commentId);
    return res.sendStatus(204);
  };
}
