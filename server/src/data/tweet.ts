import db, { getConnection } from "../db/database.js";
import throwError from "../exception/data.js";
import TweetDataHandler, {
  InputTweet,
  OutputTweet,
} from "../__dwitter__.d.ts/data/tweet";

export default class TweetRepository implements TweetDataHandler {
  private readonly Select_Feild =
    "SELECT id, text, video, image, good, createdAt, updatedAt, J.userId, name, username, url, G.userId AS clicked";
  private readonly With_User =
    "SELECT T.id, text, video, image, good, createdAt, updatedAt, userId, name, username, url \
    FROM tweets T, users U";
  private readonly With_Good =
    "LEFT JOIN (SELECT * FROM goodTweets WHERE userId = ?) G \
    ON G.tweetId = J.id";
  private readonly Order_By = "ORDER BY createdAt DESC";

  constructor() {}

  private handleUpdateQuery(tweetContents: InputTweet) {
    const { text, video, image } = tweetContents;
    let result = "";
    if (text) result += " text = ?,";
    if (video) result += " video = ?,";
    if (image) result += " image = ?,";
    return result?.trim();
  }

  private handleUpdateValues(tweetContents: InputTweet) {
    const { text, video, image } = tweetContents;
    let result: string[] = [];
    text && result.push(text);
    video && result.push(video);
    image && result.push(image);
    return result;
  }

  async getAll(userId: number) {
    let conn;
    try {
      conn = await getConnection();
      return await conn
        .execute(
          `${this.Select_Feild} FROM (${this.With_User} WHERE T.userId = U.id) J \
          ${this.With_Good} ${this.Order_By}`,
          [userId]
        )
        .then((result) => result[0] as OutputTweet[]);
    } catch (error) {
      throwError(error).tweet("getAll");
    } finally {
      db.releaseConnection(conn!);
    }
  }

  async getAllByUsername(userId: number, username: string) {
    let conn;
    try {
      conn = await getConnection();
      return await conn
        .execute(
          `${this.Select_Feild} FROM (${this.With_User} WHERE T.userId = U.id AND U.username = ?) J \
          ${this.With_Good} ${this.Order_By}`,
          [username, userId]
        )
        .then((result) => result[0] as OutputTweet[]);
    } catch (error) {
      throwError(error).tweet("getAllByUsername");
    } finally {
      db.releaseConnection(conn!);
    }
  }

  async getById(tweetId: string, userId: number) {
    let conn;
    try {
      conn = await getConnection();
      return await conn
        .execute(
          `${this.Select_Feild} FROM (${this.With_User} WHERE T.userId = U.id AND T.id = ?) J \
          ${this.With_Good} ${this.Order_By}`,
          [tweetId, userId]
        )
        .then((result: any[]) => result[0][0] as OutputTweet);
    } catch (error) {
      throwError(error).tweet("getById");
    } finally {
      db.releaseConnection(conn!);
    }
  }

  async create(userId: number, tweetContents: InputTweet) {
    let conn;
    try {
      conn = await getConnection();
      return await conn
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
        .then(
          async (result: any[]) =>
            await this.getById(result[0].insertId, userId)
        );
    } catch (error) {
      throwError(error).tweet("create");
    } finally {
      db.releaseConnection(conn!);
    }
  }

  async update(tweetId: string, userId: number, tweetContents: InputTweet) {
    let conn;
    try {
      conn = await getConnection();
      return await conn
        .execute(
          `UPDATE tweets SET ${this.handleUpdateQuery(
            tweetContents
          )} updatedAt = ? WHERE id = ?`,
          [...this.handleUpdateValues(tweetContents), new Date(), tweetId]
        )
        .then(async () => await this.getById(tweetId, userId));
    } catch (error) {
      throwError(error).tweet("update");
    } finally {
      db.releaseConnection(conn!);
    }
  }

  async updateGood(tweetId: string, good: number) {
    let conn;
    try {
      conn = await getConnection();
      await conn.execute("UPDATE tweets SET good = ? WHERE id = ?", [
        good,
        tweetId,
      ]);
    } catch (error) {
      throwError(error).tweet("updateGood");
    } finally {
      db.releaseConnection(conn!);
    }
  }

  async delete(tweetId: string) {
    let conn;
    try {
      conn = await getConnection();
      await conn.execute("DELETE FROM tweets WHERE id = ?", [tweetId]);
    } catch (error) {
      throwError(error).tweet("delete");
    } finally {
      db.releaseConnection(conn!);
    }
  }
}
