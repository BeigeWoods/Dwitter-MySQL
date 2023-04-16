import { Model, Sequelize } from "sequelize";
export declare const sequelize: Sequelize;
export interface UserModel extends Model {
  readonly id: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  url?: string;
  socialLogin: boolean;
  readonly dataValues: any;
}
export interface TweetModel extends Model {
  readonly userId?: number;
  readonly id: number;
  text?: string;
  video?: string;
  image?: string;
  readonly dataValues: any;
}
export interface GoodModel extends Model {}
export declare const User: UserModel;
export declare const Tweet: TweetModel;
export declare const GoodTweet: GoodModel;
