import throwError from "../exception/data.js";
import GoodDataHandler from "../__dwitter__.d.ts/data/good";
import DB from "../__dwitter__.d.ts/db/database";

export default class GoodRepository implements GoodDataHandler {
  constructor(private readonly db: DB) {}

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
    } catch (error) {
      isTweet
        ? throwError(error).good.tweet("click")
        : throwError(error).good.comment("click");
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
    } catch (error) {
      isTweet
        ? throwError(error).good.tweet("unClick")
        : throwError(error).good.comment("unClick");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }
}
