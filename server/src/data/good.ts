import ExceptionHandler from "../exception/exception.js";
import { PoolConnection } from "mysql2/promise.js";
import GoodDataHandler, { OutputGood } from "../__dwitter__.d.ts/data/good";
import DB from "../__dwitter__.d.ts/db/database";
import { KindOfRepository } from "../__dwitter__.d.ts/exception/exception";

export default class GoodRepository implements GoodDataHandler {
  constructor(
    private readonly db: DB,
    private readonly exc: ExceptionHandler<
      KindOfRepository,
      keyof GoodDataHandler
    >
  ) {}

  click = async (userId: number, contentId: string, isTweet: boolean) => {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();

      await this.db.beginTransaction(conn);
      await conn.execute(
        `UPDATE ${
          isTweet ? "tweets" : "comments"
        } SET good = good + 1 WHERE id = ?`,
        [contentId]
      );
      await conn
        .execute(
          `INSERT INTO ${isTweet ? "goodTweets" : "goodComments"}(userId, ${
            isTweet ? "tweetId" : "commentId"
          }) VALUES(?, ?)`,
          [userId, contentId]
        )
        .then(async () => await this.db.commit(conn));

      return await conn
        .execute(
          `SELECT id, good FROM ${
            isTweet ? "tweets" : "comments"
          } WHERE id = ?`,
          [contentId]
        )
        .then((result: any[]) => result[0][0] as OutputGood);
    } catch (e) {
      await this.db.rollback(conn!);
      this.exc.throw(e, "click");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  undo = async (userId: number, contentId: string, isTweet: boolean) => {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();

      await this.db.beginTransaction(conn);
      await conn.execute(
        `UPDATE ${
          isTweet ? "tweets" : "comments"
        } SET good = good - 1 WHERE id = ?`,
        [contentId]
      );
      await conn
        .execute(
          `DELETE FROM ${
            isTweet ? "goodTweets" : "goodComments"
          } WHERE userId = ? AND ${isTweet ? "tweetId" : "commentId"} = ?`,
          [userId, contentId]
        )
        .then(async () => await this.db.commit(conn));

      return await conn
        .execute(
          `SELECT id, good FROM ${
            isTweet ? "tweets" : "comments"
          } WHERE id = ?`,
          [contentId]
        )
        .then((result: any[]) => result[0][0] as OutputGood);
    } catch (e) {
      await this.db.rollback(conn!);
      this.exc.throw(e, "undo");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };
}
