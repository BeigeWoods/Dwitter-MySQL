import SQ from "sequelize";
import {
  AllUserInfo,
  UserDataHandler,
  UserInfo,
} from "../__dwitter__.d.ts/data/auth";
import { UserModel } from "../__dwitter__.d.ts/db/database";

export default class UserRepository implements UserDataHandler {
  constructor(private user: SQ.ModelCtor<UserModel>) {}

  findById = async (id: number) => {
    return await this.user.findByPk(id).catch((err) => console.error(err));
  };

  findByUsername = async (username: string) => {
    return await this.user
      .findOne({ where: { username } })
      .catch((err) => console.error(err));
  };

  findByUserEmail = async (email: string) => {
    return await this.user
      .findOne({ where: { email } })
      .catch((err) => console.error(err));
  };

  updateUser = async (id: number, user: UserInfo) => {
    const { username, name, email, url } = user;
    return await this.user
      .findByPk(id)
      .then(async (data) => {
        data!.set({ username, name, email, url });
        return await data!.save();
      })
      .catch((err) => console.error(err));
  };

  updatePassword = async (id: number, password: string) => {
    return await this.user
      .findByPk(id)
      .then(async (pw) => {
        pw!.password = password;
        return await pw!.save();
      })
      .catch((err) => console.error(err));
  };

  createUser = async (user: AllUserInfo) => {
    const { username, password, name, email, url, socialLogin } = user;
    const userData = await this.user
      .create({
        username,
        password,
        name,
        email,
        url,
        socialLogin,
      })
      .catch((err) => console.error(err));
    if (userData) {
      return userData.dataValues.id;
    }
  };

  deleteUser = async (id: number) => {
    return await this.user.destroy({ where: { id } }).catch((err) => {
      console.error(err);
    });
  };
}
