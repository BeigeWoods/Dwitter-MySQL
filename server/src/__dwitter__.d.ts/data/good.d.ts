import SQ from "sequelize";
import { GoodModel } from "../db/database";

export interface GoodDataHandler {
  clickTweet(userId: string, tweetId: string): Promise<GoodModel | void>;
  unClickTweet(userId: string, tweetId: string): Promise<void>;
}

export declare class GoodRepository implements GoodDataHandler {
  constructor(goodTweet: SQ.ModelStatic<GoodModel>);
  clickTweet(userId: string, tweetId: string): Promise<GoodModel | void>;
  unClickTweet(userId: string, tweetId: string): Promise<void>;
}
