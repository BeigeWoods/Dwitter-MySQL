import SQ from "sequelize";
import { TweetModel, UserModel } from "../db/database.js";
export declare type UserInfo = {
  username: string;
  name: string;
  email: string;
  url?: string;
};
export declare type AllUserInfo = UserInfo & {
  password: string;
  socialLogin: boolean;
};
export interface UserDataHandler {
  findById(id: number): Promise<UserModel | null>;
  findByUsername(username: string): Promise<UserModel | null>;
  findByUserEmail(email: string): Promise<UserModel | null>;
  updateUser(id: number, user: UserInfo): Promise<UserModel>;
  updatePassword(id: number, password: string): Promise<UserModel>;
  createUser(user: AllUserInfo): Promise<number>;
  deleteUser(id: number): Promise<void>;
}
export default class UserRepository implements UserDataHandler {
  private tweet;
  private user;
  constructor(tweet: SQ.ModelCtor<TweetModel>, user: SQ.ModelCtor<UserModel>);
  findById: (id: number) => Promise<any>;
  findByUsername: (username: string) => Promise<any>;
  findByUserEmail: (email: string) => Promise<any>;
  updateUser: (id: number, user: UserInfo) => Promise<any>;
  updatePassword: (id: number, password: string) => Promise<any>;
  createUser: (user: AllUserInfo) => Promise<any>;
  deleteUser: (id: number) => Promise<any>;
}
export {};
