import { Model } from "sequelize";
export declare const sequelize: any;
export interface UserModel extends Model {
  readonly id: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  url?: string;
  socialLogin: boolean;
  readonly dataValues?: any;
}
export interface TweetModel extends Model {
  readonly userId?: number;
  readonly id: number;
  text?: string;
  video?: string;
  image?: string;
  readonly dataValues?: any;
}
export declare const User: any;
export declare const Tweet: any;
