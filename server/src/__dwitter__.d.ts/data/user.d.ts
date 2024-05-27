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

export declare type InputUserProf = {
  username?: string | null;
  name?: string | null;
  email?: string | null;
  url?: string | null;
};

export declare type InputUserInfo = UserProfile & {
  email: string;
  password: string;
  socialLogin: boolean;
};

export declare type OutputUser = InputUserInfo & { id: number };

export declare interface UserDataHandler {
  findById(userId: number): Promise<OutputUser | void>;
  findByUsername(username: string): Promise<OutputUser | number | void>;
  findByUserEmail(email: string): Promise<OutputUser | number | void>;
  createUser(user: InputUserInfo): Promise<number | void>;
  updateUser(
    userId: number,
    user: InputUserProf,
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

  private handleUpdateQuery(user: InputUserProf): string;
  private handleUpdateValues(user: InputUserProf): string[];
  findById: (userId: number) => Promise<OutputUser | void>;
  findByUsername: (username: string) => Promise<OutputUser | number | void>;
  findByUserEmail: (email: string) => Promise<OutputUser | number | void>;
  createUser: (user: InputUserInfo) => Promise<number | void>;
  updateUser: (
    userId: number,
    user: InputUserProf,
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
