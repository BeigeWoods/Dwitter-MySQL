import { db } from "../db/database.js";
import { TweetDataHandler } from "../__dwitter__.d.ts/data/tweet";

export class TweetRepository implements TweetDataHandler {
  private readonly All_Tweet =
    "SELECT T.id, text, video, image, createdAt, userId, name, username, url \
    FROM tweets T \
    JOIN users U \
    ON U.id = T.userId";

  private readonly Order_By = "ORDER BY createdAt DESC";

  constructor() {}

  getAll = async () => {
    return await db
      .execute(`${this.All_Tweet} ${this.Order_By}`)
      .then((result: any) => {
        return result[0];
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  getAllByUsername = async (username: string) => {
    if (!username) {
      return [];
    }
    return await db
      .execute(`${this.All_Tweet} WHERE username = ? ${this.Order_By}`, [
        username,
      ])
      .then((result: any) => {
        return result[0];
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  getById = async (id: string | number) => {
    if (!id) {
      return;
    }
    return await db
      .execute(`${this.All_Tweet} WHERE T.id = ?`, [id])
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
        "INSERT INTO tweets(text, video, image, userId, createdAt, updatedAt) \
        VALUES(?, ?, ?, ?, ?, ?)",
        [text, video, image, userId, new Date(), new Date()]
      )
      .then((result: any) => this.getById(result[0].insertId))
      .catch((err) => {
        throw Error(err);
      });
  };

  update = async (
    id: string,
    text?: string,
    video?: string,
    image?: string
  ) => {
    if (!id) {
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
        return this.getById(id);
      })
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
