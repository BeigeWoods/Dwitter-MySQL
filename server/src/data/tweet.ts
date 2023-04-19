import { db } from "../db/database.js";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";

export class TweetRepository implements TweetDataHandler {
  // private readonly All_Tweet =
  // "SELECT T.id, text, video, image, createdAt, userId, name, username, url \
  // FROM tweets T \
  // JOIN users U \
  // ON U.id = T.userId";

  private readonly Order_By = "ORDER BY createdAt DESC";

  constructor() {}

  getAll = async (userId: number) => {
    return await db
      .execute(
        `SELECT id, text, video, image, good, createdAt, updatedAt, J.userId, name, username, url, G.userId AS clicked\
          FROM (SELECT T.id, text, video, image, good, createdAt, updatedAt, userId, name, username, url\
                FROM tweets T, users U\
                WHERE T.userId = U.id) J\
          LEFT JOIN (SELECT * FROM goodTweets WHERE userId = ?) G\
          ON G.tweetId = J.id
      ${this.Order_By}`,
        [userId]
      )
      .then((result: any) => {
        return result[0];
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  getAllByUsername = async (userId: number, username: string) => {
    if (!username && !userId) {
      return [];
    }
    return await db
      .execute(
        `SELECT id, text, video, image, good, createdAt, updatedAt, J.userId, name, username, url, G.userId AS clicked
          FROM (SELECT T.id, text, video, image, good, createdAt, updatedAt, userId, name, username, url
                FROM tweets T, users U
                WHERE T.userId = U.id AND U.username = ?) J
          LEFT JOIN (SELECT * FROM goodTweets WHERE userId = ?) G
          ON G.tweetId = J.id
      ${this.Order_By}`,
        [username, userId]
      )
      .then((result: any) => {
        return result[0];
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  getById = async (id: string | number, userId: number) => {
    if (!id && !userId) {
      return;
    }
    return await db
      .execute(
        `SELECT id, text, video, image, good, createdAt, updatedAt, J.userId, name, username, url, G.userId AS clicked
          FROM (SELECT T.id, text, video, image, good, createdAt, updatedAt, userId, name, username, url
                FROM tweets T, users U
                WHERE T.userId = U.id AND T.id = ?) J
          LEFT JOIN (SELECT * FROM goodTweets WHERE userId = ?) G
          ON G.tweetId = J.id
      ${this.Order_By}`,
        [id, userId]
      )
      .then((result: any) => {
        return result[0][0];
      })
      .catch((err) => {
        if (err.message === "Column 'id' in where clause is ambiguous") {
          return;
        }
        throw Error(err);
      });
  };

  create = async (
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => {
    if (!userId) {
      return;
    }
    return await db
      .execute(
        "INSERT INTO tweets(text, video, image, good, userId, createdAt, updatedAt) \
        VALUES(?, ?, ?, ?, ?, ?, ?)",
        [text, video, image, 0, userId, new Date(), new Date()]
      )
      .then((result: any) => this.getById(result[0].insertId, userId))
      .catch((err) => {
        throw Error(err);
      });
  };

  update = async (
    id: string,
    userId: number,
    text?: string,
    video?: string,
    image?: string
  ) => {
    if (!id && !userId) {
      return;
    }
    return await db
      .execute(
        "UPDATE tweets \
        SET text = ? , video = ?, image = ?, updatedAt = ? \
        WHERE id = ?",
        [text, video, image, new Date(), id]
      )
      .then(() => {
        return this.getById(id, userId);
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  updateGood = async (id: string, userId: number, good: number) => {
    if (!id && !userId) {
      return;
    }
    await db
      .execute("UPDATE tweets SET good = ? WHERE id = ?", [good, id])
      // .then(() => {
      //   return this.getById(id, userId);
      // })
      .catch((err) => {
        throw Error(err);
      });
  };

  remove = async (id: string) => {
    if (!id) {
      return;
    }
    await db.execute("DELETE FROM tweets WHERE id = ?", [id]).catch((err) => {
      throw Error(err);
    });
  };
}
