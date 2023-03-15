export declare type UserId = {
  id: number;
};

export declare type UserEmail = {
  email: string;
};

export declare type UserProfile = {
  username: string;
  name: string;
  url?: string;
};

export declare type InputUserInfo = UserProfile &
  UserEmail & {
    password: string;
    socialLogin: boolean;
  };

export declare type OutputUserInfo = InputUserInfo & UserId;

export interface UserDataHandler {
  findById(id: number): Promise<OutputUserInfo | void>;
  findByUsername(username: string): Promise<OutputUserInfo | void>;
  findByUserEmail(email: string): Promise<OutputUserInfo | void>;
  updateUser(id: number, user: UserProfile & UserEmail): Promise<void>;
  updatePassword(id: number, password: string): Promise<void>;
  createUser(user: InputUserInfo): Promise<number | void>;
  deleteUser(id: number): void;
}

export default class UserRepository implements UserDataHandler {
  private user;
  constructor();
  findById: (id: number) => Promise<OutputUserInfo | void>;
  findByUsername: (username: string) => Promise<OutputUserInfo | void>;
  findByUserEmail: (email: string) => Promise<OutputUserInfo | void>;
  updateUser: (id: number, user: UserProfile & UserEmail) => Promise<void>;
  updatePassword: (id: number, password: string) => Promise<void>;
  createUser: (user: InputUserInfo) => Promise<number | void>;
  deleteUser: (id: number) => void;
}
export {};
