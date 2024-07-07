export declare type PasswordInfo = {
  password: string;
  newPassword: string;
  checkPassword: string;
};

export declare type UserProfile = {
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
  findByUsername(username: string): Promise<OutputUser | void>;
  findByEmail(email: string): Promise<OutputUser | void>;
  create(user: InputUserInfo): Promise<number | void>;
  update(userId: number, user: InputUserProf): Promise<void>;
  updatePassword(userId: number, password: string): Promise<void>;
  delete(userId: number): Promise<void>;
}

export declare class UserRepository implements UserDataHandler {
  constructor();

  private handleUpdateQuery(user: InputUserProf): string;
  private handleUpdateValues(user: InputUserProf): string[];
  findById: (userId: number) => Promise<OutputUser | void>;
  findByUsername: (username: string) => Promise<OutputUser | void>;
  findByEmail: (email: string) => Promise<OutputUser | void>;
  create: (user: InputUserInfo) => Promise<number | void>;
  update: (userId: number, user: InputUserProf) => Promise<void>;
  updatePassword: (userId: number, password: string) => Promise<void>;
  delete: (userId: number) => Promise<void>;
}
