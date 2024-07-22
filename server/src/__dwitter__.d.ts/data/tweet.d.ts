import { UserForTweet } from "./user";

export declare type InputTweet = {
  text?: string;
  video?: string;
  image?: string;
};

export declare type OutputTweet = UserForTweet &
  Required<InputTweet> & {
    id: number;
    createdAt: typeof Date;
    updatedAt: typeof Date;
    good: number;
    clicked: number;
    userId: number;
  };

declare interface TweetDataHandler {
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
    tweetContents: InputTweet
  ): Promise<OutputTweet | void>;
  update(
    tweetId: string,
    userId: number,
    tweetContents: InputTweet
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

  private handleUpdateQuery(tweetContents: InputTweet): string;
  private handleUpdateValues(tweetContents: InputTweet): string[];
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
    tweetContents: InputTweet
  ) => Promise<OutputTweet | void>;
  update: (
    tweetId: string | number,
    userId: number,
    tweetContents: InputTweet
  ) => Promise<OutputTweet | void>;
  updateGood(tweetId: string, good: number): Promise<void>;
  delete: (tweetId: string) => Promise<void>;
}

export default TweetDataHandler;
