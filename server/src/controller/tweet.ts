import "express-async-errors";
import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import TweetHandler from "../__dwitter__.d.ts/controller/tweet";
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
      ? this.tweetRepository
          .getAllByUsername(req.user!.id, username as string)
          .catch((error) => {
            throw `Error! tweetController.getTweets < ${error}`;
          })
      : this.tweetRepository.getAll(req.user!.id).catch((error) => {
          throw `Error! tweetController.getTweets < ${error}`;
        }));
    return res.status(200).json(data);
  };

  getTweet = async (req: Request, res: Response, next: NextFunction) => {
    const tweet = await this.tweetRepository
      .getById(req.params.tweetId, req.user!.id)
      .catch((error) => {
        throw `Error! tweetController.getTweet < ${error}`;
      });
    return tweet
      ? res.status(200).json(tweet)
      : res.status(404).json({ message: `Tweet not found` });
  };

  createTweet = async (req: Request, res: Response, next: NextFunction) => {
    // const image = req.file ? req.file.path : "";
    const image = req.file?.location;
    const { text, video }: { text?: string; video?: string } = req.body;
    const tweet = await this.tweetRepository
      .create(
        req.user!.id,
        text ? text : "",
        video ? this.handleUrl(video) : "",
        image ? image : ""
      )
      .catch((error) => {
        throw `Error! tweetController.createTweet < ${error}`;
      });
    this.getSocketIO().emit("tweets", tweet);
    return res.status(201).json(tweet);
  };

  updateTweet = async (req: Request, res: Response, next: NextFunction) => {
    // const image = req.file?.path;
    const { video }: { video?: string } = req.body;
    const updated = await this.tweetRepository
      .update(req.params.tweetId, req.user!.id, {
        text: req.body.text,
        video: video ? this.handleUrl(video) : "",
        image: req.file?.location,
      })
      .catch((error) => {
        throw `Error! tweetController.updateTweet < ${error}`;
      });
    return res.status(200).json(updated);
  };

  deleteTweet = async (req: Request, res: Response, next: NextFunction) => {
    await this.tweetRepository.remove(req.params.tweetId).catch((error) => {
      throw `Error! tweetController.deleteTweet < ${error}`;
    });
    return res.sendStatus(204);
  };
}
