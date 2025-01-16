import ExceptionHandler from "../exception/exception.js";
import { PoolConnection } from "mysql2/promise.js";
import TweetDataHandler, {
  InputTweet,
  OutputTweet,
} from "../__dwitter__.d.ts/data/tweet";
import DB from "../__dwitter__.d.ts/db/database";
import { KindOfRepository } from "../__dwitter__.d.ts/exception/exception";

export default class TweetRepository implements TweetDataHandler {
  protected readonly Select =
    "SELECT T.id, text, video, image, good, createdAt, updatedAt, T.userId, name, username, url, clicked FROM tweets T\
    JOIN users U ON T.userId = U.id\
    LEFT JOIN (SELECT tweetId, IF(userId = ?, true, false) AS clicked FROM goodTweets) G ON G.tweetId = T.id";
  protected readonly Order_By = "ORDER BY createdAt DESC";
  protected readonly Get_By_Id = `${this.Select} WHERE T.id = ? ${this.Order_By}`;

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
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute(this.Select, [userId])
        .then((result) => result[0] as OutputTweet[]);
    } catch (e) {
      this.exc.throw(e, "getAll");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async getAllByUsername(userId: number, username: string) {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute(`${this.Select} WHERE U.username = ? ${this.Order_By}`, [
          userId,
          username,
        ])
        .then((result) => result[0] as OutputTweet[]);
    } catch (e) {
      this.exc.throw(e, "getAllByUsername");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async getById(tweetId: string | number, userId: number) {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute(this.Get_By_Id, [userId, tweetId])
        .then((result: any[]) => result[0][0] as OutputTweet);
    } catch (e) {
      this.exc.throw(e, "getById");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async create(userId: number, tweetContents: InputTweet) {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();
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
      return await conn
        .execute(this.Get_By_Id, [userId, tweetId])
        .then((result: any[]) => result[0][0] as OutputTweet);
    } catch (e) {
      this.exc.throw(e, "create");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async update(tweetId: string, userId: number, tweetContents: InputTweet) {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();
      await conn.execute(
        `UPDATE tweets SET ${this.queryToUpdateTweet(
          tweetContents
        )} updatedAt = ? WHERE id = ?`,
        [...this.valuesToUpdateTweet(tweetContents), new Date(), tweetId]
      );
      return await conn
        .execute(this.Get_By_Id, [userId, tweetId])
        .then((result: any[]) => result[0][0] as OutputTweet);
    } catch (e) {
      this.exc.throw(e, "update");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async delete(tweetId: string) {
    let conn: PoolConnection;
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
