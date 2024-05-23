import { Callback } from "./callback";
import { UserProfile } from "./user";

declare type TweetData = UserProfile & {
  id: number;
  text: string;
  video: string;
  image: string;
  good: number;
  createdAt: object;
  userId: number;
};

export declare interface TweetDataHandler {
  getAll(userId: number): Promise<TweetData[] | void>;
  getAllByUsername(
    userId: number,
    username: string
  ): Promise<TweetData[] | void>;
  getById(tweetId: string | number, userId: number): Promise<TweetData | void>;
  create(
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ): Promise<TweetData | void>;
  update(
    tweetId: string,
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ): Promise<TweetData | void>;
  updateGood(
    tweetId: string,
    good: number,
    callback: Callback
  ): Promise<Callback | unknown[] | void>;
  remove(
    tweetId: string,
    callback: Callback
  ): Promise<Callback | unknown[] | void>;
}

export declare class TweetRepository implements TweetDataHandler {
  private readonly Select_Feild;
  private readonly With_User;
  private readonly With_Good;
  private readonly Order_By;

  constructor();

  getAll: (userId: number) => Promise<TweetData[] | void>;
  getAllByUsername: (
    userId: number,
    username: string
  ) => Promise<TweetData[] | void>;
  getById: (
    tweetId: string | number,
    userId: number
  ) => Promise<TweetData | void>;
  create: (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetData | void>;
  update: (
    tweetId: string,
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetData | void>;
  updateGood(
    tweetId: string,
    good: number,
    callback: Callback
  ): Promise<Callback | unknown[] | void>;
  remove: (
    tweetId: string,
    callback: Callback
  ) => Promise<Callback | unknown[] | void>;
}
