import { UserProfile } from "./auth";

declare type TweetData = UserProfile & {
  id: string;
  text: string;
  video: string;
  image: string;
  createdAt: object;
  userId: number;
};

export interface TweetDataHandler {
  getAll(): Promise<TweetData[] | void>;
  getAllByUsername(username: string): Promise<TweetData[] | void>;
  getById(id: string | number): Promise<TweetData | void>;
  create(
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ): Promise<TweetData | void>;
  update(
    id: string,
    text?: string,
    video?: string,
    image?: string
  ): Promise<TweetData | void>;
  remove(id: string): Promise<void>;
}
export declare class TweetRepository implements TweetDataHandler {
  private readonly All_Tweet;
  private readonly Order_By;
  constructor();
  getAll: () => Promise<TweetData[] | void>;
  getAllByUsername: (username: string) => Promise<TweetData[] | void>;
  getById: (id: string | number) => Promise<TweetData | void>;
  create: (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetData | void>;
  update: (
    id: string,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetData | void>;
  remove: (id: string) => Promise<void>;
}
