import db from "../db/database.js";
import throwError from "../exception/data.js";
import { CommentDataHandler } from "../__dwitter__.d.ts/data/comments";

export default class CommentRepository implements CommentDataHandler {
  private readonly Select_Feild =
    "SELECT J.id, text, good, tweetId, recipient, J.userId, username, name, url, G.userId AS clicked, createdAt, updatedAt";
  private readonly With_User_Reply =
    "SELECT C.id, text, good, tweetId, R.username AS recipient, C.userId, U.username, U.name, U.url, createdAt, updatedAt \
    FROM comments C \
    JOIN users U ON C.userId = U.id \
    LEFT JOIN replies R ON C.id = R.commentId";
  private readonly With_Good =
    "LEFT JOIN (SELECT * FROM goodComments WHERE userId = ?) G ON G.commentId = J.id";
  private readonly Order_By = "ORDER BY createdAt DESC";

  constructor() {}

  getAll = async (tweetId: string, userId: number) =>
    db
      .execute(
        `${this.Select_Feild} FROM (${this.With_User_Reply} WHERE tweetId = ?) J \
        ${this.With_Good} ${this.Order_By}`,
        [tweetId, userId]
      )
      .then((result: any[]) => result[0])
      .catch((error) => throwError(error).comment("getAll"));

  getById = async (tweetId: string, commentId: string, userId: number) =>
    db
      .execute(
        `${this.Select_Feild} FROM (${this.With_User_Reply} WHERE C.id = ? AND tweetId = ?) J \
        ${this.With_Good} ${this.Order_By}`,
        [commentId, tweetId, userId]
      )
      .then((result: any[]) => result[0][0])
      .catch((error) => throwError(error).comment("getById"));

  create = async (
    userId: number,
    tweetId: string,
    text: string,
    recipient?: string
  ) =>
    db
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
      .catch((error) => throwError(error).comment("create"));

  async createReply(commentId: string, username: string) {
    await db
      .execute("INSERT INTO replies (commentId, username) VALUES(?, ?)", [
        commentId,
        username,
      ])
      .catch((error) => throwError(error).comment("createReply"));
  }

  update = async (
    tweetId: string,
    commentId: string,
    userId: number,
    text?: string
  ) =>
    db
      .execute("UPDATE comments SET text = ? , updatedAt = ? WHERE id = ?", [
        text,
        new Date(),
        commentId,
      ])
      .then(async () => await this.getById(tweetId, commentId, userId))
      .catch((error) => throwError(error).comment("update"));

  async updateGood(commentId: string, good: number) {
    await db
      .execute("UPDATE comments SET good = ? WHERE id = ?", [good, commentId])
      .catch((error) => throwError(error).comment("updateGood"));
  }

  async delete(commentId: string) {
    await db
      .execute("DELETE FROM comments WHERE id = ?", [commentId])
      .catch((error) => throwError(error).comment("delete"));
  }
}
