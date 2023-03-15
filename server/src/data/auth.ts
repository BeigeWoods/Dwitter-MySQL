import { db } from "../db/database.js";
import {
  InputUserInfo,
  UserDataHandler,
  UserEmail,
  UserProfile,
} from "../__dwitter__.d.ts/data/auth";

export default class UserRepository implements UserDataHandler {
  constructor() {}

  findById = async (id: number) => {
    if (!id) {
      return;
    }
    return await db
      .execute("SELECT * FROM users WHERE id = ?", [id])
      .then((result: any) => {
        return result[0][0];
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  findByUsername = async (username: string) => {
    return await db
      .execute("SELECT * FROM users WHERE username = ?", [username])
      .then((result: any) => {
        return result[0][0];
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  findByUserEmail = async (email: string) => {
    return await db
      .execute("SELECT * FROM users WHERE email = ?", [email])
      .then((result: any) => {
        return result[0][0];
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  updateUser = async (id: number, user: UserProfile & UserEmail) => {
    if (!id) {
      return;
    }
    await db
      .execute(
        "UPDATE users SET username = ?, name = ?, email = ?, url = ? WHERE id = ?",
        [user.username, user.name, user.email, user.url, id]
      )
      .catch((err) => {
        throw Error(err);
      });
  };

  updatePassword = async (id: number, password: string) => {
    if (!id) {
      return;
    }
    await db
      .execute("UPDATE users SET password = ? WHERE id = ?", [password, id])
      .catch((err) => {
        throw Error(err);
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
      .then((result: any) => {
        return result[0].insertId;
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  deleteUser = async (id: number) => {
    if (!id) {
      return;
    }
    return await db
      .execute("DELETE FROM users WHERE id = ?", [id])
      .catch((err) => {
        throw Error(err);
      });
  };
}
