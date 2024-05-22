import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { TweetHandler } from "../__dwitter__.d.ts/controller/tweet";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";

export default class TweetController implements TweetHandler {
  private readonly idRegex =
    /(?:(?:youtu\.be\/)|(?:youtube\.com\/(?:(?:watch\?v\=)|(?:embed\/))))([a-zA-Z0-9-_]{11})/;
  constructor(
    private tweetRepository: TweetDataHandler,
    private getSocketIO: () => Server
  ) {}

  private handleUrl(video?: string) {
    const match = video?.match(this.idRegex);
    return video ? `https://www.youtube.com/embed/${match && match[1]}` : "";
  }

  getTweets = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.query;
    const data = await (username
      ? this.tweetRepository.getAllByUsername(
          req.user!.userId,
          username as string
        )
      : this.tweetRepository.getAll(req.user!.userId));
    return data
      ? res.status(200).json(data)
      : next(new Error("getTweets : from tweetRepository.getAll(ByUsername)"));
  };

  getTweet = async (req: Request, res: Response) => {
    const tweet = await this.tweetRepository.getById(
      req.params.tweetId,
      req.user!.userId
    );
    if (!tweet) {
      return res.status(404).json({ message: `Tweet not found` });
    }
    return res.status(200).json(tweet);
  };

  createTweet = async (req: Request, res: Response, next: NextFunction) => {
    // const image = req.file ? req.file.path : "";
    const { video }: { video?: string } = req.body;
    const tweet = await this.tweetRepository.create(
      req.user!.userId,
      req.body.text,
      this.handleUrl(video),
      req.file?.location
    );
    if (!tweet) {
      return next(new Error("createTweet : from tweetRepository.create"));
    }
    this.getSocketIO().emit("tweets", tweet);
    return res.status(201).json(tweet);
  };

  updateTweet = async (req: Request, res: Response, next: NextFunction) => {
    // const image = req.file?.path;
    const image = req.file?.location;
    const { video, oldImg }: { video?: string; oldImg: string } = req.body;
    const updated = await this.tweetRepository.update(
      req.params.tweetId,
      req.user!.userId,
      req.body.text,
      this.handleUrl(video),
      image ? image : oldImg ? oldImg : ""
    );
    return updated
      ? res.status(200).json(updated)
      : next(new Error("updateTweet : from tweetRepository.update"));
  };

  deleteTweet = async (req: Request, res: Response, next: NextFunction) => {
    return await this.tweetRepository.remove(req.params.tweetId, (error) =>
      error ? next(error) : res.sendStatus(204)
    );
  };
}
