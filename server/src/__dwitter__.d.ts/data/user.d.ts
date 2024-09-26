declare type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  url?: string;
  socialLogin: boolean;
};

export declare type Password = {
  password: string;
  newPassword: string;
  checkPassword: string;
};

export declare type UserForTweet = Omit<User, "id" | "email" | "socialLogin">;

export declare type UserForUpdate = Partial<Omit<User, "id" | "socialLogin">>;

export declare type UserForCreate = Omit<User, "id"> &
  Pick<Password, "password">;

export declare type OutputUser = User & Pick<Password, "password">;

declare interface UserDataHandler {
  findById(userId: number): Promise<OutputUser | void>;
  findByUsername(username: string): Promise<OutputUser | void>;
  findByEmail(email: string): Promise<OutputUser | void>;
  create(user: UserForCreate): Promise<number | void>;
  update(userId: number, user: UserForUpdate): Promise<void>;
  updatePassword(userId: number, password: string): Promise<void>;
  delete(userId: number): Promise<void>;
}

export declare class UserRepository implements UserDataHandler {
  constructor();

  private queryToUpdateUser(user: UserForUpdate): string;
  private valuesToUpdateUser(user: UserForUpdate): string[];
  findById: (userId: number) => Promise<OutputUser | void>;
  findByUsername: (username: string) => Promise<OutputUser | void>;
  findByEmail: (email: string) => Promise<OutputUser | void>;
  create: (user: UserForCreate) => Promise<number | void>;
  update: (userId: number, user: UserForUpdate) => Promise<void>;
  updatePassword: (userId: number, password: string) => Promise<void>;
  delete: (userId: number) => Promise<void>;
}

export default UserDataHandler;
