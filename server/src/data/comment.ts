import db from "../db/database.js";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";

export default class CommentRepository implements CommentDataHandler {
  private readonly Select_Feild =
    "SELECT J.id, text, good, tweetId, recipient, J.userId, username, name, url, G.userId AS clicked, createdAt, updatedAt";
  private readonly With_User_Reply =
    "SELECT C.id, text, good, tweetId, R.username AS recipient, C.userId, U.username, U.name, U.url, createdAt, updatedAt \
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
        FROM (${this.With_User_Reply}
              WHERE tweetId = ?) J \
        ${this.With_Good}
        ${this.Order_By}`,
        [tweetId, userId]
      )
      .then((result: any[]) => result[0])
      .catch((error) => {
        throw `commentRepository.getAll\n ${error}`;
      });
  };

  getById = async (tweetId: string, commentId: string, userId: number) => {
    return await db
      .execute(
        `${this.Select_Feild}
        FROM (${this.With_User_Reply}
              WHERE C.id = ? AND tweetId = ?) J \
        ${this.With_Good}
        ${this.Order_By}`,
        [commentId, tweetId, userId]
      )
      .then((result: any[]) => result[0][0])
      .catch((error) => {
        throw `commentRepository.getById\n ${error}`;
      });
  };

  create = async (
    userId: number,
    tweetId: string,
    text: string,
    recipient?: string
  ) => {
    return await db
      .execute(
        "INSERT INTO comments (text, good, userId, tweetId, createdAt, updatedAt) \
        VALUES(?, ?, ?, ?, ?, ?)",
        [text, 0, userId, tweetId, new Date(), new Date()]
      )
      .then(async (result: any[]) => {
        if (recipient) {
          await this.createReply(result[0].insertId, recipient);
        }
        return await this.getById(tweetId, result[0].insertId, userId);
      })
      .catch((error) => {
        throw `commentRepository.create\n ${error}`;
      });
  };

  createReply = async (commentId: string, username: string) => {
    await db
      .execute(
        "INSERT INTO replies (commentId, username) \
        VALUES(?, ?)",
        [commentId, username]
      )
      .catch((error) => {
        throw `commentRepository.createReply\n ${error}`;
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
      .then(async () => await this.getById(tweetId, commentId, userId))
      .catch((error) => {
        throw `commentRepository.update\n ${error}`;
      });
  };

  updateGood = async (commentId: string, good: number) => {
    await db
      .execute("UPDATE comments SET good = ? WHERE id = ?", [good, commentId])
      .catch((error) => {
        throw `commentRepository.updateGood\n ${error}`;
      });
  };

  remove = async (commentId: string) => {
    await db
      .execute("DELETE FROM comments WHERE id = ?", [commentId])
      .catch((error) => {
        throw `commentRepository.remove\n ${error}`;
      });
  };
}
