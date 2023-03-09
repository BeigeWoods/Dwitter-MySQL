import SQ from "sequelize";
import { TweetModel, UserModel } from "../db/database.js";
export interface TweetDataHandler {
  getAll(): Promise<TweetModel[]>;
  getAllByUsername(username: string): Promise<TweetModel[]>;
  getById(id: string): Promise<TweetModel | null>;
  create(
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ): Promise<TweetModel | null>;
  update(
    id: string,
    text?: string,
    video?: string,
    image?: string
  ): Promise<TweetModel>;
  remove(id: string): Promise<void>;
}
export declare class TweetRepository implements TweetDataHandler {
  private tweet;
  private user;
  private readonly INCLUDE_USER;
  private readonly ORDER_DESC;
  constructor(tweet: SQ.ModelCtor<TweetModel>, user: SQ.ModelCtor<UserModel>);
  getAll: () => Promise<TweetModel[]>;
  getAllByUsername: (username: string) => Promise<TweetModel[]>;
  getById: (id: string) => Promise<TweetModel | null>;
  create: (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetModel | null>;
  update: (
    id: string,
    text?: string,
    video?: string,
    image?: string
  ) => Promise<TweetModel>;
  remove: (id: string) => Promise<void>;
}
