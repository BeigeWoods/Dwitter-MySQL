import SQ from "sequelize";
import { TweetModel, UserModel } from "../db/database.js";
import { UserInfo } from "./auth.js";

export declare type TweetData = TweetModel & any;

export interface TweetDataHandler<T extends TweetModel> {
  getAll(): Promise<T[] | void>;
  getAllByUsername(username: string): Promise<T[] | void>;
  getById(id: string): Promise<T | null | void>;
  create(
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ): Promise<T | null | void>;
  update(
    id: string,
    text?: string,
    video?: string,
    image?: string
  ): Promise<T | void>;
  remove(id: string): Promise<void>;
}
export declare class TweetRepository implements TweetDataHandler<TweetData> {
  private tweet;
  private user;
  private readonly INCLUDE_USER;
  private readonly ORDER_DESC;
  constructor(tweet: SQ.ModelCtor<TweetModel>, user: SQ.ModelCtor<UserModel>);
  getAll: () => Promise<TweetData[] | void>;
  getAllByUsername: (username: string) => Promise<TweetData[] | void>;
  getById: (id: string) => Promise<TweetData | null | void>;
  create: (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetData | null | void>;
  update: (
    id: string,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetData | void>;
  remove: (id: string) => Promise<void>;
}
