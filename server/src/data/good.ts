import { db } from "../db/database.js";
import { GoodDataHandler } from "../__dwitter__.d.ts/data/good";

export default class GoodRepository implements GoodDataHandler {
  private readonly errorMessage = "DB at GoodRepository\n";

  constructor() {}

  clickTweet = async (userId: number, tweetId: string) => {
    return await db
      .execute("INSERT INTO goodTweets(userId, tweetId) VALUES(?, ?)", [
        userId,
        tweetId,
      ])
      .catch((error) => {
        console.error(this.errorMessage, error);
        return error;
      });
  };

  unClickTweet = async (userId: number, tweetId: string) => {
    return await db
      .execute("DELETE FROM goodTweets WHERE userId = ? AND tweetId = ?", [
        userId,
        tweetId,
      ])
      .catch((error) => {
        console.error(this.errorMessage, error);
        return error;
      });
  };

  clickComment = async (userId: number, commentId: string) => {
    return await db
      .execute("INSERT INTO goodComments(userId, commentId) VALUES(?, ?)", [
        userId,
        commentId,
      ])
      .catch((error) => {
        console.error(this.errorMessage, error);
        return error;
      });
  };

  unClickComment = async (userId: number, commentId: string) => {
    return await db
      .execute("DELETE FROM goodComments WHERE userId = ? AND commentId = ?", [
        userId,
        commentId,
      ])
      .catch((error) => {
        console.error(this.errorMessage, error);
        return error;
      });
  };
}
