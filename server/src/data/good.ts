import db from "../db/database.js";
import exceptHandler from "../exception/data.js";
import GoodDataHandler from "../__dwitter__.d.ts/data/good";

const goodRepository: GoodDataHandler = {
  tweet: {
    async click(userId: number, tweetId: string) {
      await db
        .execute("INSERT INTO goodTweets(userId, tweetId) VALUES(?, ?)", [
          userId,
          tweetId,
        ])
        .catch((error) => exceptHandler(error).good.tweet("click"));
    },
    async unClick(userId: number, tweetId: string) {
      await db
        .execute("DELETE FROM goodTweets WHERE userId = ? AND tweetId = ?", [
          userId,
          tweetId,
        ])
        .catch((error) => exceptHandler(error).good.tweet("unClick"));
    },
  },
  comment: {
    async click(userId: number, commentId: string) {
      await db
        .execute("INSERT INTO goodComments(userId, commentId) VALUES(?, ?)", [
          userId,
          commentId,
        ])
        .catch((error) => exceptHandler(error).good.comment("click"));
    },
    async unClick(userId: number, commentId: string) {
      await db
        .execute(
          "DELETE FROM goodComments WHERE userId = ? AND commentId = ?",
          [userId, commentId]
        )
        .catch((error) => exceptHandler(error).good.comment("unClick"));
    },
  },
};

export default goodRepository;
