import SQ from "sequelize";
import { UserModel } from "../db/database.js";
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
  findById(id: number): Promise<UserModel | void | null>;
  findByUsername(username: string): Promise<UserModel | void | null>;
  findByUserEmail(email: string): Promise<UserModel | void | null>;
  updateUser(id: number, user: UserInfo): Promise<UserModel | void>;
  updatePassword(id: number, password: string): Promise<UserModel | void>;
  createUser(user: AllUserInfo): Promise<number | void>;
  deleteUser(id: number): void;
}

export default class UserRepository implements UserDataHandler {
  private user;
  constructor(user: SQ.ModelCtor<UserModel>);
  findById: (id: number) => Promise<UserModel | void | null>;
  findByUsername: (username: string) => Promise<UserModel | void | null>;
  findByUserEmail: (email: string) => Promise<UserModel | void | null>;
  updateUser: (id: number, user: UserInfo) => Promise<UserModel | void>;
  updatePassword: (id: number, password: string) => Promise<UserModel | void>;
  createUser: (user: AllUserInfo) => Promise<number | void>;
  deleteUser: (id: number) => void;
}
export {};
