import { User } from "../db/database.js";

export async function findByUsername(username) {
  return await User.findOne({ where: { username } });
}

export async function findById(id) {
  return await User.findByPk(id);
}

export async function createUser(user) {
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
