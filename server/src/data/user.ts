import { db } from "../db/database.js";
import {
  InputUserInfo,
  InputUserProf,
  UserDataHandler,
} from "../__dwitter__.d.ts/data/user";
import { Callback } from "../__dwitter__.d.ts/data/callback";

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
    username ? result.push(username) : false;
    name ? result.push(name) : false;
    email ? result.push(email) : false;
    url ? result.push(url) : false;
    return result;
  };

  findById = async (userId: number) => {
    return await db
      .execute("SELECT * FROM users WHERE id = ?", [userId])
      .then((result: any[]) => result[0][0])
      .catch((error) => console.error("userRepository.findById\n", error));
  };

  findByUsername = async (username: string) => {
    return await db
      .execute("SELECT * FROM users WHERE username = ?", [username])
      .then((result: any[]) => result[0][0])
      .catch((error) => {
        console.error("userRepository.findByUsername\n", error);
        return 1;
      });
  };

  findByUserEmail = async (email: string) => {
    return await db
      .execute("SELECT * FROM users WHERE email = ?", [email])
      .then((result: any[]) => result[0][0])
      .catch((error) => {
        console.error("userRepository.findByUserEmail\n", error);
        return 1;
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
      .catch((error) => console.error("userRepository.createUser\n", error));
  };

  updateUser = async (
    userId: number,
    user: InputUserProf,
    callback: Callback
  ) => {
    return await db
      .execute(
        `UPDATE users SET ${this.handleUpdateQuery(user)} WHERE id = ?`,
        [...this.handleUpdateValues(user), userId]
      )
      .catch((error) => {
        console.error("userRepository.updateUser\n", error);
        return callback(error);
      });
  };

  updatePassword = async (
    userId: number,
    password: string,
    callback: Callback
  ) => {
    return await db
      .execute("UPDATE users SET password = ? WHERE id = ?", [password, userId])
      .catch((error) => {
        console.error("userRepository.updatePassword\n", error);
        return callback(error);
      });
  };

  deleteUser = async (userId: number, callback: Callback) => {
    return await db
      .execute("DELETE FROM users WHERE id = ?", [userId])
      .catch((error) => {
        console.error("userRepository.deleteUser\n", error);
        return callback(error);
      });
  };
}
