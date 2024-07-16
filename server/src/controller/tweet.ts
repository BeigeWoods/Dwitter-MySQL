import "express-async-errors";
import { Request, Response } from "express";
import { Server } from "socket.io";
import awsS3 from "../middleware/awsS3.js";
import { throwErrorOfController as throwError } from "../exception/controller.js";
import TweetHandler from "../__dwitter__.d.ts/controller/tweet";
import TweetDataHandler from "../__dwitter__.d.ts/data/tweet";

export default class TweetController implements TweetHandler {
  private readonly urlRegex =
    /(?!(youtu\.be\/)|(youtube\.com\/((watch\?v\=)|(embed\/))))[a-zA-Z0-9-_]{11}/;
  constructor(
    private tweetRepository: TweetDataHandler,
    private getSocketIO: () => Server
  ) {}

  private handleUrl(video: string) {
    const match = video.match(this.urlRegex)![0];
    return match ? `https://www.youtube.com/embed/${match}` : "";
  }

  getAll = async (req: Request, res: Response) => {
    const { username } = req.query;
    const data = await (username
      ? this.tweetRepository
          .getAllByUsername(req.user!.id, username as string)
          .catch((error) => throwError.tweet("getAll", error))
      : this.tweetRepository
          .getAll(req.user!.id)
          .catch((error) => throwError.tweet("getAll", error)));
    return res.status(200).json(data);
  };

  getById = async (req: Request, res: Response) => {
    const tweet = await this.tweetRepository
      .getById(req.params.tweetId, req.user!.id)
      .catch((error) => throwError.tweet("getById", error));
    return tweet
      ? res.status(200).json(tweet)
      : res.status(404).json({ message: `Tweet not found` });
  };

  create = async (req: Request, res: Response) => {
    // const image = req.file ? req.file.path : "";
    const newImage = req.file?.location;
    const { video }: { video?: string } = req.body;
    const tweet = await this.tweetRepository
      .create(req.user!.id, {
        text: req.body.text,
        video: video && this.handleUrl(video),
        image: newImage ? newImage : "",
      })
      .catch((error) => throwError.tweet("create", error));
    this.getSocketIO().emit("tweets", tweet);
    return res.status(201).json(tweet);
  };

  update = async (req: Request, res: Response) => {
    // const image = req.file?.path;
    const newImage = req.file?.location;
    const { video, image }: { video?: string; image?: string } = req.body;
    if (image) {
      if (!newImage)
        return res
          .status(400)
          .json({ message: "Invalid values to convert image" });
      await awsS3
        .deleteImage(image)
        .catch((error) => throwError.tweet("update", error));
    }
    const updated = await this.tweetRepository
      .update(req.params.tweetId, req.user!.id, {
        text: req.body.text,
        video: video && this.handleUrl(video),
        image: newImage,
      })
      .catch((error) => throwError.tweet("update", error));
    return res.status(200).json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const { image }: { image?: string } = req.body;
    if (image)
      await awsS3
        .deleteImage(image)
        .catch((error) => throwError.tweet("delete", error));
    await this.tweetRepository
      .delete(req.params.tweetId)
      .catch((error) => throwError.tweet("delete", error));
    return res.sendStatus(204);
  };
}
