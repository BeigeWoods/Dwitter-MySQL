import db from "../db/database.js";
import {
  InputTweetContents,
  TweetDataHandler,
} from "../__dwitter__.d.ts/data/tweet";

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

  private handleUpdateQuery = (tweetContents: InputTweetContents) => {
    const { text, video, image } = tweetContents;
    let result = "";
    if (text) result += " text = ?,";
    if (video) result += " video = ?,";
    if (image) result += " image = ?,";
    return result?.trim();
  };

  private handleUpdateValues = (tweetContents: InputTweetContents) => {
    const { text, video, image } = tweetContents;
    let result: string[] = [];
    text && result.push(text);
    video && result.push(video);
    image && result.push(image);
    return result;
  };

  getAll = async (userId: number) => {
    return await db
      .execute(
        `${this.Select_Feild} \
        FROM (${this.With_User} \
        WHERE T.userId = U.id) J \
        ${this.With_Good} \
        ${this.Order_By}`,
        [userId]
      )
      .then((result: any[]) => result[0])
      .catch((error) => {
        throw `tweetRepository.getAll\n ${error}`;
      });
  };

  getAllByUsername = async (userId: number, username: string) => {
    return await db
      .execute(
        `${this.Select_Feild} \
        FROM (${this.With_User} \
        WHERE T.userId = U.id AND U.username = ?) J \
        ${this.With_Good} \
        ${this.Order_By}`,
        [username, userId]
      )
      .then((result: any[]) => result[0])
      .catch((error) => {
        throw `tweetRepository.getAllByUsername\n ${error}`;
      });
  };

  getById = async (tweetId: string, userId: number) => {
    return await db
      .execute(
        `${this.Select_Feild} \
        FROM (${this.With_User} \
        WHERE T.userId = U.id AND T.id = ?) J \
        ${this.With_Good} \
        ${this.Order_By}`,
        [tweetId, userId]
      )
      .then((result: any[]) => result[0][0])
      .catch((error) => {
        throw `tweetRepository.getById\n ${error}`;
      });
  };

  create = async (userId: number, tweetContents: InputTweetContents) => {
    return await db
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
      .then(
        async (result: any[]) => await this.getById(result[0].insertId, userId)
      )
      .catch((error) => {
        throw `tweetRepository.create\n ${error}`;
      });
  };

  update = async (
    tweetId: string,
    userId: number,
    tweetContents: InputTweetContents
  ) => {
    return await db
      .execute(
        `UPDATE tweets \
        SET ${this.handleUpdateQuery(
          tweetContents
        )} updatedAt = ? WHERE id = ?`,
        [...this.handleUpdateValues(tweetContents), new Date(), tweetId]
      )
      .then(async () => await this.getById(tweetId, userId))
      .catch((error) => {
        throw `tweetRepository.update\n ${error}`;
      });
  };

  updateGood = async (tweetId: string, good: number) => {
    await db
      .execute("UPDATE tweets SET good = ? WHERE id = ?", [good, tweetId])
      .catch((error) => {
        throw `tweetRepository.updateGood\n ${error}`;
      });
  };

  remove = async (tweetId: string) => {
    await db
      .execute("DELETE FROM tweets WHERE id = ?", [tweetId])
      .catch((error) => {
        throw `tweetRepository.remove\n ${error}`;
      });
  };
}
