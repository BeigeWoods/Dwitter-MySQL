import ExceptionHandler from "../exception/exception.js";
import UserDataHandler, {
  UserForCreate,
  UserForUpdate,
  OutputUser,
} from "../__dwitter__.d.ts/data/user";
import DB from "../__dwitter__.d.ts/db/database";
import { KindOfRepository } from "../__dwitter__.d.ts/exception/exception";

export default class UserRepository implements UserDataHandler {
  constructor(
    private readonly db: DB,
    private readonly exc: ExceptionHandler<
      KindOfRepository,
      keyof UserDataHandler
    >
  ) {}

  private queryToUpdateUser = (user: UserForUpdate) => {
    let result = "";
    let key: keyof UserForUpdate;
    for (key in user) {
      if (user[key]) {
        if (result) result += ", ";
        result += key + " = ?";
      }
    }
    return result;
  };

  private valuesToUpdateUser = (user: UserForUpdate) => {
    let result: string[] = [];
    let key: keyof UserForUpdate;
    for (key in user) {
      if (user[key]) result.push(key);
    }
    return result;
  };

  findById = async (userId: number) => {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute("SELECT * FROM users WHERE id = ?", [userId])
        .then((result: any[]) => result[0][0] as OutputUser);
    } catch (e) {
      this.exc.throw(e, "findById");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  findByUsername = async (username: string) => {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute("SELECT * FROM users WHERE username = ?", [username])
        .then((result: any[]) => result[0][0] as OutputUser);
    } catch (e) {
      this.exc.throw(e, "findByUsername");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  findByEmail = async (email: string) => {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute("SELECT * FROM users WHERE email = ?", [email])
        .then((result: any[]) => result[0][0] as OutputUser);
    } catch (e) {
      this.exc.throw(e, "findByEmail");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  create = async (user: UserForCreate) => {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
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
        .then((result: any[]) => result[0].insertId as number);
    } catch (e) {
      this.exc.throw(e, "create");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  update = async (userId: number, user: UserForUpdate) => {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute(
        `UPDATE users SET ${this.queryToUpdateUser(user)} WHERE id = ?`,
        [...this.valuesToUpdateUser(user), userId]
      );
    } catch (e) {
      this.exc.throw(e, "update");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  updatePassword = async (userId: number, password: string) => {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute("UPDATE users SET password = ? WHERE id = ?", [
        password,
        userId,
      ]);
    } catch (e) {
      this.exc.throw(e, "updatePassword");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  delete = async (userId: number) => {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute("DELETE FROM users WHERE id = ?", [userId]);
    } catch (e) {
      this.exc.throw(e, "delete");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };
}
