import throwError from "../exception/data.js";
import UserDataHandler, {
  UserForCreate,
  UserForUpdate,
  OutputUser,
} from "../__dwitter__.d.ts/data/user";
import DB from "../__dwitter__.d.ts/db/database";

export default class UserRepository implements UserDataHandler {
  constructor(private readonly db: DB) {}

  private queryToUpdateUser(user: UserForUpdate) {
    let result = "";
    let key: keyof UserForUpdate;
    for (key in user) {
      if (user[key]) {
        if (result) result += ", ";
        result += key + " = ?";
      }
    }
    return result;
  }

  private valuesToUpdateUser(user: UserForUpdate) {
    let result: string[] = [];
    let key: keyof UserForUpdate;
    for (key in user) {
      if (user[key]) result.push(key);
    }
    return result;
  }

  async findById(userId: number) {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute("SELECT * FROM users WHERE id = ?", [userId])
        .then((result: any[]) => result[0][0] as OutputUser);
    } catch (error) {
      throwError(error).user("findById");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async findByUsername(username: string) {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute("SELECT * FROM users WHERE username = ?", [username])
        .then((result: any[]) => result[0][0] as OutputUser);
    } catch (error) {
      throwError(error).user("findByUsername");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async findByEmail(email: string) {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute("SELECT * FROM users WHERE email = ?", [email])
        .then((result: any[]) => result[0][0] as OutputUser);
    } catch (error) {
      throwError(error).user("findByEmail");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async create(user: UserForCreate) {
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
    } catch (error) {
      throwError(error).user("create");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async update(userId: number, user: UserForUpdate) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute(
        `UPDATE users SET ${this.queryToUpdateUser(user)} WHERE id = ?`,
        [...this.valuesToUpdateUser(user), userId]
      );
    } catch (error) {
      throwError(error).user("update");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async updatePassword(userId: number, password: string) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute("UPDATE users SET password = ? WHERE id = ?", [
        password,
        userId,
      ]);
    } catch (error) {
      throwError(error).user("updatePassword");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async delete(userId: number) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute("DELETE FROM users WHERE id = ?", [userId]);
    } catch (error) {
      throwError(error).user("delete");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }
}
