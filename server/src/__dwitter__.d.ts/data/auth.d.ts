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
  findById(id: number): Promise<UserModel | null>;
  findByUsername(username: string): Promise<UserModel | null>;
  findByUserEmail(email: string): Promise<UserModel | null>;
  updateUser(id: number, user: UserInfo): Promise<UserModel>;
  updatePassword(id: number, password: string): Promise<UserModel>;
  createUser(user: AllUserInfo): Promise<number>;
  deleteUser(id: number): void;
}

export default class UserRepository implements UserDataHandler {
  private user;
  constructor(user: SQ.ModelCtor<UserModel>);
  findById: (id: number) => Promise<UserModel | null>;
  findByUsername: (username: string) => Promise<UserModel | null>;
  findByUserEmail: (email: string) => Promise<UserModel | null>;
  updateUser: (id: number, user: UserInfo) => Promise<UserModel>;
  updatePassword: (id: number, password: string) => Promise<UserModel>;
  createUser: (user: AllUserInfo) => Promise<number>;
  deleteUser: (id: number) => void;
}
export {};
