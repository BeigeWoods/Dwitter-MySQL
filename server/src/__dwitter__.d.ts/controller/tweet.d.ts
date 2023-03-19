import { TweetDataHandler } from "../data/tweet.js";
import { Request, Response } from "express";
import { Server } from "socket.io";
export interface TweetHandler {
  getTweets(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  getTweet(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  createTweet(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  updateTweet(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  deleteTweet(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
}
export declare class TweetController implements TweetHandler {
  private tweetRepository;
  private getSocketIO;
  private readonly idRegex;
  constructor(tweetRepository: TweetDataHandler, getSocketIO: () => Server);
  getTweets: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  getTweet: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  private readonly handleUrl;
  createTweet: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  updateTweet: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  deleteTweet: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
}
