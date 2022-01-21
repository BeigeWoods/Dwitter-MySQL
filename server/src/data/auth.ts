import SQ from "sequelize";
import { TweetModel, UserModel } from "../db/database.js";

type UserInfo = {
  username: string;
  name: string;
  email: string;
  url?: string;
};

type AllUserInfo = UserInfo & {
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
  constructor(
    private tweet: SQ.ModelCtor<TweetModel>,
    private user: SQ.ModelCtor<UserModel>
  ) {}

  findById = async (id: number) => {
    return await this.user.findByPk(id);
  };

  findByUsername = async (username: string) => {
    return await this.user.findOne({ where: { username } });
  };

  findByUserEmail = async (email: string) => {
    return await this.user.findOne({ where: { email } });
  };

  updateUser = async (id: number, user: UserInfo) => {
    const { username, name, email, url } = user;
    return await this.user.findByPk(id).then((data) => {
      data!.set({ username, name, email, url });
      return data!.save();
    });
  };

  updatePassword = async (id: number, password: string) => {
    return await this.user.findByPk(id).then((pw) => {
      pw!.password = password;
      return pw!.save();
    });
  };

  createUser = async (user: AllUserInfo) => {
    const { username, password, name, email, url, socialLogin } = user;
    const userData = await this.user.create({
      username,
      password,
      name,
      email,
      url,
      socialLogin,
    });
    return userData.dataValues.id;
  };

  deleteUser = async (id: number) => {
    return await this.user.findByPk(id).then((user) => {
      user!.destroy();
      this.tweet.destroy({ where: { userId: id } });
    });
  };
}
