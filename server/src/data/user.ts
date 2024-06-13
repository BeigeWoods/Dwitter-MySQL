import db from "../db/database.js";
import {
  InputUserInfo,
  InputUserProf,
  UserDataHandler,
} from "../__dwitter__.d.ts/data/user";

export default class UserRepository implements UserDataHandler {
  constructor() {}

  private handleUpdateQuery = (user: InputUserProf) => {
    const { username, name, email, url } = user;
    let result = "";
    result = username ? result + "username = ?" : result;
    result = name
      ? result
        ? result + ", name = ?"
        : result + "name = ?"
      : result;
    result = email
      ? result
        ? result + ", email = ?"
        : result + "email = ?"
      : result;
    result = url
      ? result
        ? result + ", url = ?"
        : result + "url = ?"
      : result;
    return result;
  };

  private handleUpdateValues = (user: InputUserProf) => {
    const { username, name, email, url } = user;
    let result: string[] = [];
    username && result.push(username);
    name && result.push(name);
    email && result.push(email);
    url && result.push(url);
    return result;
  };

  findById = async (userId: number) => {
    return await db
      .execute("SELECT * FROM users WHERE id = ?", [userId])
      .then((result: any[]) => result[0][0])
      .catch((error) => {
        throw `userRepository.findById\n ${error}`;
      });
  };

  findByUsername = async (username: string) => {
    return await db
      .execute("SELECT * FROM users WHERE username = ?", [username])
      .then((result: any[]) => result[0][0])
      .catch((error) => {
        throw `userRepository.findByUsername\n ${error}`;
      });
  };

  findByEmail = async (email: string) => {
    return await db
      .execute("SELECT * FROM users WHERE email = ?", [email])
      .then((result: any[]) => result[0][0])
      .catch((error) => {
        throw `userRepository.findByUserEmail\n ${error}`;
      });
  };

  createUser = async (user: InputUserInfo) => {
    return await db
      .execute(
        "INSERT INTO users(username, password, name, email, url, socialLogin) \
        VALUES (?, ?, ?, ?, ?, ?)",
        [
          user.username,
          user.password,
          user.name,
          user.email,
          user.url,
          user.socialLogin,
        ]
      )
      .then((result: any[]) => result[0].insertId)
      .catch((error) => {
        throw `userRepository.createUser\n ${error}`;
      });
  };

  updateUser = async (userId: number, user: InputUserProf) => {
    await db
      .execute(
        `UPDATE users SET ${this.handleUpdateQuery(user)} WHERE id = ?`,
        [...this.handleUpdateValues(user), userId]
      )
      .catch((error) => {
        throw `userRepository.updateUser\n ${error}`;
      });
  };

  updatePassword = async (userId: number, password: string) => {
    await db
      .execute("UPDATE users SET password = ? WHERE id = ?", [password, userId])
      .catch((error) => {
        throw `userRepository.updatePassword\n ${error}`;
      });
  };

  deleteUser = async (userId: number) => {
    await db
      .execute("DELETE FROM users WHERE id = ?", [userId])
      .catch((error) => {
        throw `userRepository.deleteUser\n ${error}`;
      });
  };
}
