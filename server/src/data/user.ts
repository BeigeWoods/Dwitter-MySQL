import db from "../db/database.js";
import throwError from "../exception/data.js";
import {
  InputUserInfo,
  InputUserProf,
  UserDataHandler,
} from "../__dwitter__.d.ts/data/user";

export default class UserRepository implements UserDataHandler {
  constructor() {}

  private handleUpdateQuery(user: InputUserProf) {
    const { username, name, email, url } = user;
    let result = "";
    if (username) result += " username = ?,";
    if (name) result += " name = ?,";
    if (email) result += " email = ?,";
    if (url) result += " url = ?,";
    return result?.trim();
  }

  private handleUpdateValues(user: InputUserProf) {
    const { username, name, email, url } = user;
    let result: string[] = [];
    username && result.push(username);
    name && result.push(name);
    email && result.push(email);
    url && result.push(url);
    return result;
  }

  findById = async (userId: number) =>
    db
      .execute("SELECT * FROM users WHERE id = ?", [userId])
      .then((result: any[]) => result[0][0])
      .catch((error) => throwError(error).user("findById"));

  findByUsername = async (username: string) =>
    db
      .execute("SELECT * FROM users WHERE username = ?", [username])
      .then((result: any[]) => result[0][0])
      .catch((error) => throwError(error).user("findByUsername"));

  findByEmail = async (email: string) =>
    db
      .execute("SELECT * FROM users WHERE email = ?", [email])
      .then((result: any[]) => result[0][0])
      .catch((error) => throwError(error).user("findByEmail"));

  create = async (user: InputUserInfo) =>
    db
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
      .catch((error) => throwError(error).user("create"));

  async update(userId: number, user: InputUserProf) {
    await db
      .execute(
        `UPDATE users SET ${this.handleUpdateQuery(user)} WHERE id = ?`,
        [...this.handleUpdateValues(user), userId]
      )
      .catch((error) => throwError(error).user("update"));
  }

  async updatePassword(userId: number, password: string) {
    await db
      .execute("UPDATE users SET password = ? WHERE id = ?", [password, userId])
      .catch((error) => throwError(error).user("updatePassword"));
  }

  async delete(userId: number) {
    await db
      .execute("DELETE FROM users WHERE id = ?", [userId])
      .catch((error) => throwError(error).user("delete"));
  }
}
