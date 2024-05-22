import { Callback } from "./callback";

export type PasswordInfo = {
  password: string;
  newPassword: string;
  checkPassword: string;
};

export type UserProfile = {
  username: string;
  name: string;
  url?: string;
};

export declare type InputUserInfo = UserProfile & {
  email: string;
  password: string;
  socialLogin: boolean;
};

export declare type OutputUserInfo = InputUserInfo & { id: number };

export declare interface UserDataHandler {
  findById(userId: number): Promise<OutputUserInfo | void>;
  findByUsername(username: string): Promise<OutputUserInfo | number | void>;
  findByUserEmail(email: string): Promise<OutputUserInfo | number | void>;
  createUser(user: InputUserInfo): Promise<number | void>;
  updateUser(
    userId: number,
    user: UserProfile & { email: string },
    callback: Callback
  ): Promise<Callback | unknown[] | void>;
  updatePassword(
    userId: number,
    password: string,
    callback: Callback
  ): Promise<Callback | unknown[] | void>;
  deleteUser(
    userId: number,
    callback: Callback
  ): Promise<Callback | unknown[] | void>;
}

export declare class UserRepository implements UserDataHandler {
  constructor();

  findById: (userId: number) => Promise<OutputUserInfo | void>;
  findByUsername: (username: string) => Promise<OutputUserInfo | number | void>;
  findByUserEmail: (email: string) => Promise<OutputUserInfo | number | void>;
  createUser: (user: InputUserInfo) => Promise<number | void>;
  updateUser: (
    userId: number,
    user: UserProfile & { email: string },
    callback: Callback
  ) => Promise<Callback | unknown[] | void>;
  updatePassword: (
    userId: number,
    password: string,
    callback: Callback
  ) => Promise<Callback | unknown[] | void>;
  deleteUser: (
    userId: number,
    callback: Callback
  ) => Promise<Callback | unknown[] | void>;
}
