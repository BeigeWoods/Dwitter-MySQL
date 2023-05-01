import { db } from "../db/database.js";
import { GoodDataHandler } from "../__dwitter__.d.ts/data/good";

export class GoodRepository implements GoodDataHandler {
  constructor() {}

  clickTweet = async (userId: number, tweetId: string) => {
    await db
      .execute("INSERT INTO goodTweets(userId, tweetId) VALUES(?, ?)", [
        userId,
        tweetId,
      ])
      .catch((err) => {
        throw Error(err);
      });
  };

  unClickTweet = async (userId: number, tweetId: string) => {
    await db
      .execute("DELETE FROM goodTweets WHERE userId = ? AND tweetId = ?", [
        userId,
        tweetId,
      ])
      .catch((err) => {
        throw Error(err);
      });
  };

  clickComment = async (userId: number, commentId: string) => {
    await db
      .execute("INSERT INTO goodComments(userId, commentId) VALUES(?, ?)", [
        userId,
        commentId,
      ])
      .catch((err) => {
        throw Error(err);
      });
  };

  unClickComment = async (userId: number, commentId: string) => {
    await db
      .execute("DELETE FROM goodComments WHERE userId = ? AND commentId = ?", [
        userId,
        commentId,
      ])
      .catch((err) => {
        throw Error(err);
      });
  };
}
