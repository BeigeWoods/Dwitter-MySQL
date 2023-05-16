import { db } from "../db/database.js";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";

export class CommentRepository implements CommentDataHandler {
  private readonly Select_Feild =
    "SELECT J.id, text, good, tweetId, repliedUser, J.userId, username, name, url, G.userId AS clicked, createdAt, updatedAt";
  private readonly With_User =
    "SELECT C.id, text, good, tweetId, R.username AS repliedUser, C.userId, U.username, U.name, U.url, createdAt, updatedAt \
    FROM comments C \
    JOIN users U \
    ON C.userId = U.id \
    LEFT JOIN replies R \
    ON C.id = R.commentId";
  private readonly With_Good =
    "LEFT JOIN (SELECT * FROM goodComments WHERE userId = ?) G \
    ON G.commentId = J.id";
  private readonly Order_By = "ORDER BY createdAt DESC";

  constructor() {}

  getAll = async (tweetId: string, userId: number) => {
    return await db
      .execute(
        `${this.Select_Feild}
        FROM (${this.With_User}
              WHERE tweetId = ?) J \
        ${this.With_Good}
        ${this.Order_By}`,
        [tweetId, userId]
      )
      .then((result: any) => {
        return result[0];
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  getById = async (tweetId: string, commentId: string, userId: number) => {
    return await db
      .execute(
        `${this.Select_Feild}
        FROM (${this.With_User}
              WHERE C.id = ? AND tweetId = ?) J \
        ${this.With_Good}
        ${this.Order_By}`,
        [commentId, tweetId, userId]
      )
      .then((result: any) => {
        return result[0][0];
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  create = async (
    userId: number,
    tweetId: string,
    text: string,
    repliedUser?: string
  ) => {
    return await db
      .execute(
        "INSERT INTO comments (text, good, userId, tweetId, createdAt, updatedAt) \
        VALUES(?, ?, ?, ?, ?, ?)",
        [text, 0, userId, tweetId, new Date(), new Date()]
      )
      .then(async (result: any) => {
        if (repliedUser) {
          await this.createReply(result[0].insertId, repliedUser);
        }
        return this.getById(tweetId, result[0].insertId, userId);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  createReply = async (commentId: string, username: string) => {
    await db
      .execute(
        "INSERT INTO replies (commentId, username) \
        VALUES(?, ?)",
        [commentId, username]
      )
      .catch((err) => {
        throw new Error(err);
      });
  };

  update = async (
    tweetId: string,
    commentId: string,
    userId: number,
    text?: string
  ) => {
    return await db
      .execute(
        "UPDATE comments \
        SET text = ? , updatedAt = ? \
        WHERE id = ?",
        [text, new Date(), commentId]
      )
      .then(() => {
        return this.getById(tweetId, commentId, userId);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  updateGood = async (id: string, good: number) => {
    await db
      .execute("UPDATE comments SET good = ? WHERE id = ?", [good, id])
      .catch((err) => {
        throw new Error(err);
      });
  };

  remove = async (commentId: string) => {
    await db
      .execute("DELETE FROM comments WHERE id = ?", [commentId])
      .catch((err) => {
        throw new Error(err);
      });
  };
}
