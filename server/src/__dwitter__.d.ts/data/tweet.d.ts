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
  getById(tweetId: string, userId: number): Promise<OutputTweet | void>;
  create(
    userId: number,
    tweetContents: InputTweetContents
  ): Promise<OutputTweet | void>;
  update(
    tweetId: string,
    userId: number,
    tweetContents: InputTweetContents
  ): Promise<OutputTweet | void>;
  updateGood(tweetId: string, good: number): Promise<void>;
  delete(tweetId: string): Promise<void>;
}

export declare class TweetRepository implements TweetDataHandler {
  private readonly Select_Feild;
  private readonly With_User;
  private readonly With_Good;
  private readonly Order_By;

  constructor();

  private handleUpdateQuery(tweetContents: InputTweetContents): string;
  private handleUpdateValues(tweetContents: InputTweetContents): string[];
  getAll: (userId: number) => Promise<OutputTweet[] | void>;
  getAllByUsername: (
    userId: number,
    username: string
  ) => Promise<OutputTweet[] | void>;
  getById: (tweetId: string, userId: number) => Promise<OutputTweet | void>;
  create: (
    userId: number,
    tweetContents: InputTweetContents
  ) => Promise<OutputTweet | void>;
  update: (
    tweetId: string,
    userId: number,
    tweetContents: InputTweetContents
  ) => Promise<OutputTweet | void>;
  updateGood(tweetId: string, good: number): Promise<void>;
  delete: (tweetId: string) => Promise<void>;
}
