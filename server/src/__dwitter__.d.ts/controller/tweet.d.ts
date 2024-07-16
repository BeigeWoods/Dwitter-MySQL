import TweetDataHandler from "../data/tweet";
import { Request, Response } from "express";
import { Server } from "socket.io";

declare interface TweetHandler {
  getAll(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  getById(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  create(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  update(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  delete(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
}

export declare class TweetController implements TweetHandler {
  private readonly urlRegex;
  private tweetRepository;
  private getSocketIO;

  constructor(tweetRepository: TweetDataHandler, getSocketIO: () => Server);

  private handleUrl(video?: string): string;
  getAll: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  getById: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  create: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  update: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  delete: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
}

export default TweetHandler;
