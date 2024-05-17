import { db } from "../db/database";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";
import { Callback } from "../__dwitter__.d.ts/data/callback";

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

  getAll = async (userId: number) => {
    return await db
      .execute(
        `${this.Select_Feild}\
          FROM (${this.With_User}
                WHERE T.userId = U.id) J\
        ${this.With_Good}
        ${this.Order_By}`,
        [userId]
      )
      .then((result: any[]) => result[0])
      .catch((error) => console.error("tweetRepository.getAll\n", error));
  };

  getAllByUsername = async (userId: number, username: string) => {
    return await db
      .execute(
        `${this.Select_Feild}
          FROM (${this.With_User}
                WHERE T.userId = U.id AND U.username = ?) J
        ${this.With_Good}
        ${this.Order_By}`,
        [username, userId]
      )
      .then((result: any[]) => result[0])
      .catch((error) =>
        console.error("tweetRepository.getAllByUsername\n", error)
      );
  };

  getById = async (tweetId: string | number, userId: number) => {
    return await db
      .execute(
        `${this.Select_Feild}
          FROM (${this.With_User}
                WHERE T.userId = U.id AND T.id = ?) J
        ${this.With_Good}
        ${this.Order_By}`,
        [tweetId, userId]
      )
      .then((result: any[]) => result[0][0])
      .catch((error) => console.error("tweetRepository.getById\n", error));
  };

  create = async (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => {
    return await db
      .execute(
        "INSERT INTO tweets(text, video, image, good, userId, createdAt, updatedAt) \
        VALUES(?, ?, ?, ?, ?, ?, ?)",
        [text, video, image, 0, userId, new Date(), new Date()]
      )
      .then(
        async (result: any[]) => await this.getById(result[0].insertId, userId)
      )
      .catch((error) => console.error("tweetRepository.create\n", error));
  };

  update = async (
    tweetId: string,
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => {
    return await db
      .execute(
        "UPDATE tweets \
        SET text = ? , video = ?, image = ?, updatedAt = ? \
        WHERE id = ?",
        [text, video, image, new Date(), tweetId]
      )
      .then(async () => await this.getById(tweetId, userId))
      .catch((error) => console.error("tweetRepository.update\n", error));
  };

  updateGood = async (tweetId: string, good: number, callback: Callback) => {
    return await db
      .execute("UPDATE tweets SET good = ? WHERE id = ?", [good, tweetId])
      .catch((error) => {
        console.error("tweetRepository.updateGood\n", error);
        return callback(error);
      });
  };

  remove = async (tweetId: string, callback: Callback) => {
    return await db
      .execute("DELETE FROM tweets WHERE id = ?", [tweetId])
      .catch((error) => {
        console.error("tweetRepository.remove\n", error);
        return callback(error);
      });
  };
}
