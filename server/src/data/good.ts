import ExceptionHandler from "../exception/exception.js";
import GoodDataHandler from "../__dwitter__.d.ts/data/good";
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

  async click(userId: number, contentId: string, isTweet: boolean) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute(
        isTweet
          ? "INSERT INTO goodTweets(userId, tweetId) VALUES(?, ?)"
          : "INSERT INTO goodComments(userId, commentId) VALUES(?, ?)",
        [userId, contentId]
      );
    } catch (e) {
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async unClick(userId: number, contentId: string, isTweet: boolean) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute(
        isTweet
          ? "DELETE FROM goodTweets WHERE userId = ? AND tweetId = ?"
          : "DELETE FROM goodComments WHERE userId = ? AND commentId = ?",
        [userId, contentId]
      );
    } catch (e) {
    } finally {
      this.db.releaseConnection(conn!);
    }
  }
}
