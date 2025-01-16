import { UserForTweet } from "./user";

export declare type InputTweet = {
  text?: string;
  video?: string;
  image?: string;
};

export declare type OutputTweet = UserForTweet &
  Required<InputTweet> & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    good: number;
    clicked: boolean;
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
  delete(tweetId: string): Promise<void>;
}

export default TweetDataHandler;
