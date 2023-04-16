import SQ from "sequelize";
import { UserModel } from "../db/database.js";

export declare type UserEmail = {
  email: string;
};

export declare type UserProfile = {
  username: string;
  name: string;
  url?: string;
};

export declare type UserInfo = UserProfile &
  UserEmail & {
    password: string;
    socialLogin: boolean;
  };

export interface UserDataHandler {
  findById(id: number): Promise<UserModel | null | void>;
  findByUsername(username: string): Promise<UserModel | null | void>;
  findByUserEmail(email: string): Promise<UserModel | null | void>;
  updateUser(id: number, user: UserProfile & UserEmail): Promise<void>;
  updatePassword(id: number, password: string): Promise<void>;
  createUser(user: UserInfo): Promise<number | void>;
  deleteUser(id: number): void;
}

export default class UserRepository implements UserDataHandler {
  private user;
  constructor(user: SQ.ModelStatic<UserModel>);
  findById: (id: number) => Promise<UserModel | null | void>;
  findByUsername: (username: string) => Promise<UserModel | null | void>;
  findByUserEmail: (email: string) => Promise<UserModel | null | void>;
  updateUser: (id: number, user: UserProfile & UserEmail) => Promise<void>;
  updatePassword: (id: number, password: string) => Promise<void>;
  createUser: (user: UserInfo) => Promise<number | void>;
  deleteUser: (id: number) => void;
}
export {};
