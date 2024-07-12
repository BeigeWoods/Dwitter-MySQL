import db, { getConnection } from "../db/database.js";
import throwError from "../exception/data.js";
import GoodDataHandler from "../__dwitter__.d.ts/data/good";

const goodRepository: GoodDataHandler = {
  tweet: {
    async click(userId: number, tweetId: string) {
      let conn;
      try {
        conn = await getConnection();
        await conn.execute(
          "INSERT INTO goodTweets(userId, tweetId) VALUES(?, ?)",
          [userId, tweetId]
        );
      } catch (error) {
        throwError(error).good.tweet("click");
      } finally {
        db.releaseConnection(conn!);
      }
    },
    async unClick(userId: number, tweetId: string) {
      let conn;
      try {
        conn = await getConnection();
        await conn.execute(
          "DELETE FROM goodTweets WHERE userId = ? AND tweetId = ?",
          [userId, tweetId]
        );
      } catch (error) {
        throwError(error).good.tweet("unClick");
      } finally {
        db.releaseConnection(conn!);
      }
    },
  },
  comment: {
    async click(userId: number, commentId: string) {
      let conn;
      try {
        conn = await getConnection();
        await conn.execute(
          "INSERT INTO goodComments(userId, commentId) VALUES(?, ?)",
          [userId, commentId]
        );
      } catch (error) {
        throwError(error).good.comment("click");
      } finally {
        db.releaseConnection(conn!);
      }
    },
    async unClick(userId: number, commentId: string) {
      let conn;
      try {
        conn = await getConnection();
        await conn.execute(
          "DELETE FROM goodComments WHERE userId = ? AND commentId = ?",
          [userId, commentId]
        );
      } catch (error) {
        throwError(error).good.comment("unClick");
      } finally {
        db.releaseConnection(conn!);
      }
    },
  },
};

export default goodRepository;
