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
  findById(userId: number): Promise<OutputUser | never | void>;
  findByUsername(username: string): Promise<OutputUser | never | void>;
  findByUserEmail(email: string): Promise<OutputUser | never | void>;
  createUser(user: InputUserInfo): Promise<number | never | void>;
  updateUser(userId: number, user: InputUserProf): Promise<never | void>;
  updatePassword(userId: number, password: string): Promise<never | void>;
  deleteUser(userId: number): Promise<never | void>;
}

export declare class UserRepository implements UserDataHandler {
  constructor();

  private handleUpdateQuery(user: InputUserProf): string;
  private handleUpdateValues(user: InputUserProf): string[];
  findById: (userId: number) => Promise<OutputUser | never | void>;
  findByUsername: (username: string) => Promise<OutputUser | never | void>;
  findByUserEmail: (email: string) => Promise<OutputUser | never | void>;
  createUser: (user: InputUserInfo) => Promise<number | never | void>;
  updateUser: (userId: number, user: InputUserProf) => Promise<never | void>;
  updatePassword: (userId: number, password: string) => Promise<never | void>;
  deleteUser: (userId: number) => Promise<never | void>;
}
