import { Callback } from "./callback";
import { UserProfile } from "./user";

export declare type InputTweetContents = {
  text?: string | null;
  video?: string | null;
  image?: string | null;
};

declare type OutputTweet = UserProfile & {
  id: number;
  text: string;
  video: string;
  image: string;
  createdAt: object;
  updatedAt: object;
  good: number;
  clicked: number;
  userId: number;
};

export declare interface TweetDataHandler {
  getAll(userId: number): Promise<OutputTweet[] | void>;
  getAllByUsername(
    userId: number,
    username: string
  ): Promise<OutputTweet[] | void>;
  getById(
    tweetId: string | number,
    userId: number
  ): Promise<OutputTweet | void>;
  create(
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ): Promise<OutputTweet | void>;
  update(
    tweetId: string,
    userId: number,
    tweetContents: InputTweetContents
  ): Promise<OutputTweet | void>;
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

  private handleUpdateQuery(tweet: InputTweetContents): string;
  private handleUpdateValues(tweet: InputTweetContents): string[];
  getAll: (userId: number) => Promise<OutputTweet[] | void>;
  getAllByUsername: (
    userId: number,
    username: string
  ) => Promise<OutputTweet[] | void>;
  getById: (
    tweetId: string | number,
    userId: number
  ) => Promise<OutputTweet | void>;
  create: (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<OutputTweet | void>;
  update: (
    tweetId: string,
    userId: number,
    tweetContents: InputTweetContents
  ) => Promise<OutputTweet | void>;
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
