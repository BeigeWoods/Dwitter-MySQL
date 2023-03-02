import SQ from "sequelize";
import {
  AllUserInfo,
  UserDataHandler,
  UserInfo,
} from "../__dwitter__.d.ts/data/auth";
import { TweetModel, UserModel } from "../__dwitter__.d.ts/db/database";

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
