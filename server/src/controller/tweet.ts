import { Request, Response } from "express";
import { Server } from "socket.io";
import { TweetHandler } from "../__dwitter__.d.ts/controller/tweet";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";

export class TweetController implements TweetHandler {
  private readonly idRegex: RegExp;
  constructor(
    private tweetRepository: TweetDataHandler,
    private getSocketIO: () => Server
  ) {
    this.idRegex =
      /(?:(?:youtu\.be\/)|(?:youtube\.com\/(?:(?:watch\?v\=)|(?:embed\/))))([a-zA-Z0-9-_]{11})/;
  }

  getTweets = async (req: Request, res: Response) => {
    const username = req.query.username! as string;
    const data = await (username
      ? this.tweetRepository.getAllByUsername(req.userId!, username)
      : this.tweetRepository.getAll(req.userId!));
    return res.status(200).json(data);
  };

  getTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tweet = await this.tweetRepository.getById(id, req.userId!);
    if (!tweet) {
      return res.status(404).json({ message: `Tweet not found` });
    }
    return res.status(200).json(tweet);
  };

  private readonly handleUrl = (video?: string) => {
    const match = video?.match(this.idRegex);
    return video ? `https://www.youtube.com/embed/${match && match[1]}` : "";
  };

  createTweet = async (req: Request, res: Response) => {
    // const image = req.file ? req.file.path : "";
    const image = req.file?.location;
    const { text, video }: { text?: string; video?: string } = req.body;
    const videoUrl = this.handleUrl(video);
    const tweet = await this.tweetRepository.create(
      req.userId!,
      text ? text : "",
      videoUrl,
      image ? image : ""
    );
    this.getSocketIO().emit("tweets", tweet);
    return res.status(201).json(tweet);
  };

  updateTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const image = req.file?.location;
    // const image = req.file?.path;
    const {
      text,
      video,
      oldImg,
    }: { text?: string; video?: string; oldImg: string } = req.body;
    const videoUrl = this.handleUrl(video);
    const updated = await this.tweetRepository.update(
      id,
      req.userId!,
      text,
      videoUrl,
      image ? image : oldImg ? oldImg : ""
    );
    return res.status(200).json(updated);
  };

  deleteTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.tweetRepository.remove(id);
    return res.sendStatus(204);
  };
}
