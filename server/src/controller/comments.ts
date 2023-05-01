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
    const { id } = req.params;
    const data = await this.commentRepository.getAll(id, req.userId!);
    return res.status(200).json(data);
  };

  createComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text, repliedUser }: { text: string; repliedUser?: string } =
      req.body;
    if (repliedUser) {
      this.user = await this.userRepository.findByUsername(repliedUser);
      if (!this.user) {
        return res.status(409).json({ message: "Replied user not found" });
      }
    }
    const comment = await this.commentRepository.create(
      req.userId!,
      id,
      text,
      this.user ? this.user.username : ""
    );
    this.getSocketIO().emit("comments", comment);
    return res.status(201).json(comment);
  };

  updateComment = async (req: Request, res: Response) => {
    const { id, main } = req.params;
    const { text }: { text: string } = req.body;
    const updated = await this.commentRepository.update(
      id,
      main,
      req.userId!,
      text
    );
    return res.status(200).json(updated);
  };

  deleteComment = async (req: Request, res: Response) => {
    const { main } = req.params;
    await this.commentRepository.remove(main);
    return res.sendStatus(204);
  };
}
