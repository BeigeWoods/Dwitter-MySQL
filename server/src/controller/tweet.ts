import { TweetDataHandler } from "../data/tweet.js";
import { Request, Response } from "express";
import { Server } from "socket.io";

export interface TweetHandler {
  getTweets(req: Request, res: Response): void;
  getTweet(req: Request, res: Response): void;
  createTweet(req: Request, res: Response): void;
  updateTweet(req: Request, res: Response): void;
  deleteTweet(req: Request, res: Response): void;
}

export class TweetController implements TweetHandler {
  constructor(
    private tweetRepository: TweetDataHandler,
    private getSocketIO: () => Server
  ) {}

  getTweets = async (req: Request, res: Response) => {
    const username = req.query.username! as string;
    const data = await (username
      ? this.tweetRepository.getAllByUsername(username)
      : this.tweetRepository.getAll());
    res.status(200).json(data);
  };

  getTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tweet = await this.tweetRepository.getById(id);
    if (tweet) {
      res.status(200).json(tweet);
    } else {
      res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
  };

  createTweet = async (req: Request, res: Response) => {
    const text = req.body.text! as string;
    const tweet = await this.tweetRepository.create(text, req.userId as number);
    res.status(201).json(tweet);
    this.getSocketIO().emit("tweets", tweet);
  };

  updateTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const text = req.body.text! as string;
    const tweet = await this.tweetRepository.getById(id);
    if (!tweet) {
      return res.status(404).json({ message: `Tweet not found: ${id}` });
    }
    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    const updated = await this.tweetRepository.update(id, text);
    res.status(200).json(updated);
  };

  deleteTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tweet = await this.tweetRepository.getById(id);
    if (!tweet) {
      return res.status(404).json({ message: `Tweet not found: ${id}` });
    }
    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    await this.tweetRepository.remove(id);
    res.sendStatus(204);
  };
}
