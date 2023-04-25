import { db } from "../db/database.js";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";

export class CommentRepository implements CommentDataHandler {
  private readonly Order_By = "ORDER BY createdAt DESC";
  private readonly Select_From =
    "SELECT M.id, text, good, createdAt, updatedAt, tweetId, userId, username, name, url \
    FROM mainComments M, users U";

  constructor() {}

  getAll = async (tweetId: string) => {
    return await db
      .execute(
        `${this.Select_From}
        WHERE M.userId = U.id AND tweetId = ?\ 
        ${this.Order_By}`,
        [tweetId]
      )
      .then((result: any) => {
        return result[0];
      })
      .catch((err) => {
        if (err.message === "Column 'id' in field list is ambiguous") {
          return;
        }
        throw Error(err);
      });
  };

  getById = async (tweetId: string, mainId: string) => {
    return await db
      .execute(
        `${this.Select_From}
        WHERE M.userId = U.id AND M.id = ? AND tweetId = ?
        ${this.Order_By}`,
        [mainId, tweetId]
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

  create = async (userId: number, tweetId: string, text: string) => {
    return await db
      .execute(
        "INSERT INTO mainComments (text, good, userId, tweetId, createdAt, updatedAt) \
        VALUES(?, ?, ?, ?, ?, ?)",
        [text, 0, userId, tweetId, new Date(), new Date()]
      )
      .then((result: any) => {
        return this.getById(tweetId, result[0].insertId);
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  update = async (tweetId: string, mainId: string, text?: string) => {
    return await db
      .execute(
        "UPDATE mainComments \
        SET text = ? , updatedAt = ? \
        WHERE id = ?",
        [text, new Date(), mainId]
      )
      .then(() => {
        return this.getById(tweetId, mainId);
      })
      .catch((err) => {
        throw Error(err);
      });
  };

  remove = async (mainId: string) => {
    await db
      .execute("DELETE FROM mainComments WHERE id = ?", [mainId])
      .catch((err) => {
        throw Error(err);
      });
  };
}
