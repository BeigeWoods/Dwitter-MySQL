import throwError from "../exception/data.js";
import CommentDataHandler, {
  OutputComment,
} from "../__dwitter__.d.ts/data/comments";
import DB from "../__dwitter__.d.ts/db/database";

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
  private readonly Get_By_Id = `${this.Select_Feild} FROM (${this.With_User_Reply} WHERE C.id = ? AND tweetId = ?) J ${this.With_Good} ${this.Order_By}`;

  constructor(private readonly db: DB) {}

  async getAll(tweetId: string, userId: number) {
    let conn;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute(
          `${this.Select_Feild} FROM (${this.With_User_Reply} WHERE tweetId = ?) J \
          ${this.With_Good} ${this.Order_By}`,
          [tweetId, userId]
        )
        .then((result) => result[0] as OutputComment[]);
    } catch (error) {
      throwError(error).comment("getAll");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async create(
    userId: number,
    tweetId: string,
    text: string,
    recipient?: string
  ) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await this.db.beginTransaction(conn);
      const commentId = await conn
        .execute(
          "INSERT INTO comments (text, good, userId, tweetId, createdAt, updatedAt) \
          VALUES(?, ?, ?, ?, ?, ?)",
          [text, 0, userId, tweetId, new Date(), new Date()]
        )
        .then((result: any[]) => result[0].insertId as number);
      if (recipient) {
        await conn.execute(
          "INSERT INTO replies (commentId, username) VALUES(?, ?)",
          [commentId, recipient]
        );
      }
      const result = await conn
        .execute(this.Get_By_Id, [commentId, tweetId, userId])
        .then((result: any[]) => result[0][0] as OutputComment);
      await this.db.commit(conn);
      return result;
    } catch (error) {
      await this.db.rollback(conn!);
      throwError(error).comment("create");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async update(
    tweetId: string,
    commentId: string,
    userId: number,
    text?: string
  ) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await this.db.beginTransaction(conn);
      await conn.execute(
        "UPDATE comments SET text = ? , updatedAt = ? WHERE id = ?",
        [text, new Date(), commentId]
      );
      const result = await conn
        .execute(this.Get_By_Id, [commentId, tweetId, userId])
        .then((result: any[]) => result[0][0] as OutputComment);
      await this.db.commit(conn);
      return result;
    } catch (error) {
      await this.db.rollback(conn!);
      throwError(error).comment("update");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async updateGood(commentId: string, good: number) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute("UPDATE comments SET good = ? WHERE id = ?", [
        good,
        commentId,
      ]);
    } catch (error) {
      throwError(error).comment("updateGood");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }

  async delete(commentId: string) {
    let conn;
    try {
      conn = await this.db.getConnection();
      await conn.execute("DELETE FROM comments WHERE id = ?", [commentId]);
    } catch (error) {
      throwError(error).comment("delete");
    } finally {
      this.db.releaseConnection(conn!);
    }
  }
}
