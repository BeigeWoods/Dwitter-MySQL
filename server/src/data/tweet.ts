import ExceptionHandler from "../exception/exception.js";
import TweetDataHandler, {
  InputTweet,
  OutputTweet,
} from "../__dwitter__.d.ts/data/tweet";
import DB from "../__dwitter__.d.ts/db/database";
import { KindOfRepository } from "../__dwitter__.d.ts/exception/exception";

export default class TweetRepository implements TweetDataHandler {
  protected readonly Select_Feild =
    "SELECT id, text, video, image, good, createdAt, updatedAt, J.userId, name, username, url, G.userId AS clicked";
  protected readonly With_User =
    "SELECT T.id, text, video, image, good, createdAt, updatedAt, userId, name, username, url \
    FROM tweets T, users U";
  protected readonly With_Good =
    "LEFT JOIN (SELECT * FROM goodTweets WHERE userId = ?) G \
    ON G.tweetId = J.id";
  protected readonly Order_By = "ORDER BY createdAt DESC";
  protected readonly Get_By_Id = `${this.Select_Feild} FROM (${this.With_User} WHERE T.userId = U.id AND T.id = ?) J ${this.With_Good} ${this.Order_By}`;

  constructor(
    private readonly db: DB,
    private readonly exc: ExceptionHandler<
      KindOfRepository,
      keyof TweetDataHandler
    >
  ) {}

  private queryToUpdateTweet(tweetContents: InputTweet) {
    let result = "";
    let key: keyof InputTweet;
    for (key in tweetContents) {
      if (tweetContents[key]) {
        if (result) result += ", ";
        result += key + " = ?";
      }
    }
    return result;
  }

  private valuesToUpdateTweet(tweetContents: InputTweet) {
    let result: string[] = [];
    let key: keyof InputTweet;
    for (key in tweetContents) {
      if (tweetContents[key]) result.push(key);
    }
    return result;
  }

  async getAll(userId: number) {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute(
          `${this.Select_Feild} FROM (${this.With_User} WHERE T.userId = U.id) J \
          ${this.With_Good} ${this.Order_By}`,
          [userId]
        )
        .then((result) => result[0] as OutputTweet[]);
    } catch (e) {
      this.exc.throw(e, "getAll");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async getAllByUsername(userId: number, username: string) {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute(
          `${this.Select_Feild} FROM (${this.With_User} WHERE T.userId = U.id AND U.username = ?) J \
          ${this.With_Good} ${this.Order_By}`,
          [username, userId]
        )
        .then((result) => result[0] as OutputTweet[]);
    } catch (e) {
      this.exc.throw(e, "getAllByUsername");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async getById(tweetId: string | number, userId: number) {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute(this.Get_By_Id, [tweetId, userId])
        .then((result: any[]) => result[0][0] as OutputTweet);
    } catch (e) {
      this.exc.throw(e, "getById");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async create(userId: number, tweetContents: InputTweet) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await this.db.beginTransaction(conn);
      const tweetId = await conn
        .execute(
          "INSERT INTO tweets(text, video, image, good, userId, createdAt, updatedAt) \
          VALUES(?, ?, ?, ?, ?, ?, ?)",
          [
            tweetContents.text,
            tweetContents.video,
            tweetContents.image,
            0,
            userId,
            new Date(),
            new Date(),
          ]
        )
        .then((result: any[]) => result[0].insertId as number);
      const result = await conn
        .execute(this.Get_By_Id, [tweetId, userId])
        .then((result: any[]) => result[0][0] as OutputTweet);
      await this.db.commit(conn);
      return result;
    } catch (e) {
      await this.db.rollback(conn!);
      this.exc.throw(e, "create");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async update(tweetId: string, userId: number, tweetContents: InputTweet) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await this.db.beginTransaction(conn);
      await conn.execute(
        `UPDATE tweets SET ${this.queryToUpdateTweet(
          tweetContents
        )} updatedAt = ? WHERE id = ?`,
        [...this.valuesToUpdateTweet(tweetContents), new Date(), tweetId]
      );
      const result = await conn
        .execute(this.Get_By_Id, [tweetId, userId])
        .then((result: any[]) => result[0][0] as OutputTweet);
      await this.db.commit(conn);
      return result;
    } catch (e) {
      await this.db.rollback(conn!);
      this.exc.throw(e, "update");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async updateGood(tweetId: string, good: number) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute("UPDATE tweets SET good = ? WHERE id = ?", [
        good,
        tweetId,
      ]);
    } catch (e) {
      this.exc.throw(e, "updateGood");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async delete(tweetId: string) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute("DELETE FROM tweets WHERE id = ?", [tweetId]);
    } catch (e) {
      this.exc.throw(e, "delete");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }
}
