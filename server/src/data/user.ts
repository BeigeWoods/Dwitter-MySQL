import throwError from "../exception/data.js";
import UserDataHandler, {
  UserForCreate,
  UserForUpdate,
  OutputUser,
} from "../__dwitter__.d.ts/data/user";
import DB from "../__dwitter__.d.ts/db/database";

export default class UserRepository implements UserDataHandler {
  constructor(private readonly db: DB) {}

  private handleUpdateQuery(user: UserForUpdate) {
    const { username, name, email, url } = user;
    let result = "";
    if (username) result += "username = ?";
    if (name) result += result ? ", name = ?" : "name = ?";
    if (email) result += result ? ", email = ?" : "email = ?";
    if (url) result += result ? ", url = ?" : "url = ?";
    return result;
  }

  private handleUpdateValues(user: UserForUpdate) {
    const { username, name, email, url } = user;
    let result: string[] = [];
    username && result.push(username);
    name && result.push(name);
    email && result.push(email);
    url && result.push(url);
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
        `UPDATE users SET ${this.handleUpdateQuery(user)} WHERE id = ?`,
        [...this.handleUpdateValues(user), userId]
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
