import { db } from "../db/database.js";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";

export class TweetRepository implements TweetDataHandler {
  private readonly Select_Feild =
    "SELECT id, text, video, image, good, createdAt, updatedAt, J.userId, name, username, url, G.userId AS clicked";
  private readonly Sub_Select_From =
    "SELECT T.id, text, video, image, good, createdAt, updatedAt, userId, name, username, url \
    FROM tweets T, users U";
  private readonly Left_Join_On =
    "LEFT JOIN (SELECT * FROM goodTweets WHERE userId = ?) G \
    ON G.tweetId = J.id";
  private readonly Order_By = "ORDER BY createdAt DESC";

  constructor() {}

  getAll = async (userId: number) => {
    return await db
      .execute(
        `${this.Select_Feild}\
          FROM (${this.Sub_Select_From}
                WHERE T.userId = U.id) J\
        ${this.Left_Join_On}
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
    return await db
      .execute(
        `${this.Select_Feild}
          FROM (${this.Sub_Select_From}
                WHERE T.userId = U.id AND U.username = ?) J
        ${this.Left_Join_On}
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
    return await db
      .execute(
        `${this.Select_Feild}
          FROM (${this.Sub_Select_From}
                WHERE T.userId = U.id AND T.id = ?) J
        ${this.Left_Join_On}
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
    await db
      .execute("UPDATE tweets SET good = ? WHERE id = ?", [good, id])
      .catch((err) => {
        throw Error(err);
      });
  };

  remove = async (id: string) => {
    await db.execute("DELETE FROM tweets WHERE id = ?", [id]).catch((err) => {
      throw Error(err);
    });
  };
}
