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
export declare class TweetController implements TweetHandler {
    private tweetRepository;
    private getSocketIO;
    private readonly idRegex;
    constructor(tweetRepository: TweetDataHandler, getSocketIO: () => Server);
    getTweets: (req: Request, res: Response) => Promise<void>;
    getTweet: (req: Request, res: Response) => Promise<void>;
    private readonly handleUrl;
    createTweet: (req: Request, res: Response) => Promise<void>;
    updateTweet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteTweet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
