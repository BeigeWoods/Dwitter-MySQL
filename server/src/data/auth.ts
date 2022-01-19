import { Tweet, User, UserModel } from "../db/database";

interface UserInfo {
  username: string;
  password?: string;
  name: string;
  email: string;
  url?: string;
}

interface AllUserInfo extends UserInfo {
  socialLogin: boolean;
}

export async function findById(id: number): Promise<UserModel> {
  return await User.findByPk(id);
}

export async function findByUsername(username: string): Promise<UserModel> {
  return await User.findOne({ where: { username } });
}

export async function findByUserEmail(email: string): Promise<UserModel> {
  return await User.findOne({ where: { email } });
}

export async function updateUser(
  id: number,
  user: UserInfo
): Promise<UserModel> {
  const { username, name, email, url } = user;
  return await User.findByPk(id).then((data) => {
    data.set({ username, name, email, url });
    return data.save();
  });
}

export async function updatePassword(id: number, password: string) {
  return await User.findByPk(id).then((pw) => {
    pw.password = password;
    return pw.save();
  });
}

export async function createUser(user: AllUserInfo): Promise<number> {
  const { username, password, name, email, url, socialLogin } = user;
  const userData = await User.create({
    username,
    password,
    name,
    email,
    url,
    socialLogin,
  });
  return userData.dataValues.id;
}

export async function deleteUser(id: number) {
  return await User.findByPk(id).then((user) => {
    user.destroy();
    Tweet.destroy({ where: { userId: id } });
  });
}
