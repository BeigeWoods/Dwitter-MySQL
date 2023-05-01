import { UserProfile } from "./auth";

declare type TweetData = UserProfile & {
  id: string;
  text: string;
  video: string;
  image: string;
  good: number;
  createdAt: object;
  userId: number;
};

export interface TweetDataHandler {
  getAll(userId: number): Promise<TweetData[] | void>;
  getAllByUsername(
    userId: number,
    username: string
  ): Promise<TweetData[] | void>;
  getById(id: string | number, userId: number): Promise<TweetData | void>;
  create(
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ): Promise<TweetData | void>;
  update(
    id: string,
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ): Promise<TweetData | void>;
  updateGood(id: string, good: number): Promise<void>;
  remove(id: string): Promise<void>;
}
export declare class TweetRepository implements TweetDataHandler {
  private readonly Select_Feild;
  private readonly Sub_Select_From;
  private readonly Left_Join_On;
  private readonly Order_By;
  constructor();
  getAll: (userId: number) => Promise<TweetData[] | void>;
  getAllByUsername: (
    userId: number,
    username: string
  ) => Promise<TweetData[] | void>;
  getById: (id: string | number, userId: number) => Promise<TweetData | void>;
  create: (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetData | void>;
  update: (
    id: string,
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetData | void>;
  updateGood(id: string, good: number): Promise<void>;
  remove: (id: string) => Promise<void>;
}
