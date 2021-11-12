import { User, UserModel } from "../db/database.js";

interface UserInfo {
  username: string;
  password: string;
  name: string;
  email: string;
  url?: string;
}

export async function findByUsername(username: string): Promise<UserModel> {
  return await User.findOne({ where: { username } });
}

export async function findById(id: number): Promise<UserModel> {
  return await User.findByPk(id);
}

export async function createUser(user: UserInfo): Promise<number> {
  const { username, password, name, email, url } = user;
  const userData = await User.create({
    username,
    password,
    name,
    email,
    url,
  });
  return userData.dataValues.id;
}
