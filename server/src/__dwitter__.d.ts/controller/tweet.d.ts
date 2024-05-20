import { TweetDataHandler } from "../data/tweet";
import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { Callback } from "../data/callback";

export declare interface TweetHandler {
  getTweets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
  getTweet(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  createTweet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
  updateTweet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
  deleteTweet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Callback | unknown[] | void>;
}

export declare class TweetController implements TweetHandler {
  private readonly idRegex;
  private tweetRepository;
  private getSocketIO;

  constructor(tweetRepository: TweetDataHandler, getSocketIO: () => Server);

  private handleUrl(video?: string): string;
  getTweets: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
  getTweet: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  createTweet: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
  updateTweet: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
  deleteTweet: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Callback | unknown[] | void>;
}
