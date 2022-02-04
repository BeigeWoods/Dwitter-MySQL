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
  idRegex: RegExp;
  constructor(
    private tweetRepository: TweetDataHandler,
    private getSocketIO: () => Server
  ) {
    this.idRegex =
      /(?:(?:youtu\.be\/)|(?:youtube\.com\/(?:(?:watch\?v\=)|(?:embed\/))))([a-zA-Z0-9-_]{11})/;
  }

  getTweets = async (req: Request, res: Response) => {
    const username = req.query.username! as string | undefined;
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
    const image = req.file?.path;
    const { text, video }: { text?: string; video?: string } = req.body;
    const match = video?.match(this.idRegex);
    const videoUrl = `https://www.youtube.com/embed/${match && match[1]}`;
    const tweet = await this.tweetRepository.create(
      req.userId as number,
      text,
      match ? videoUrl : undefined,
      image
    );
    res.status(201).json(tweet);
    this.getSocketIO().emit("tweets", tweet);
  };

  updateTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const imageFile = req.file?.path;
    const {
      text,
      video,
      image,
    }: { text?: string; video?: string; image?: string } = req.body;
    const tweet = await this.tweetRepository.getById(id);
    if (!tweet) {
      return res.status(404).json({ message: `Tweet not found: ${id}` });
    }
    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    const match = video?.match(this.idRegex);
    const videoUrl = `https://www.youtube.com/embed/${match && match[1]}`;
    console.log(tweet.image);
    const updated = await this.tweetRepository.update(
      id,
      text,
      match ? videoUrl : "",
      image === "No Image" ? "" : imageFile ? imageFile : tweet.image
    );
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
