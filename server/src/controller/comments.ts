import { Request, Response } from "express";
import { Server } from "socket.io";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";
import { CommentHandler } from "../__dwitter__.d.ts/controller/comments";

export class CommentController implements CommentHandler {
  constructor(
    private commentRepository: CommentDataHandler,
    private getSocketIO: () => Server
  ) {}

  getComments = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await this.commentRepository.getAll(id);
    return res.status(200).json(data);
  };

  createComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text }: { text?: string } = req.body;
    const comment = await this.commentRepository.create(req.userId!, id, text);
    this.getSocketIO().emit("main comments", comment);
    return res.status(201).json(comment);
  };

  updateComment = async (req: Request, res: Response) => {
    const { id, main } = req.params;
    const { text }: { text?: string } = req.body;
    const updated = await this.commentRepository.update(id, main, text);
    return res.status(200).json(updated);
  };

  deleteComment = async (req: Request, res: Response) => {
    const { main } = req.params;
    await this.commentRepository.remove(main);
    return res.sendStatus(204);
  };
}
