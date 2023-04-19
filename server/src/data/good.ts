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
}
