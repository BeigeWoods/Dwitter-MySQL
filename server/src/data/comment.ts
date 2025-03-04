import ExceptionHandler from "../exception/exception.js";
import { PoolConnection } from "mysql2/promise.js";
import CommentDataHandler, {
  OutputComment,
} from "../__dwitter__.d.ts/data/comments";
import DB from "../__dwitter__.d.ts/db/database";
import { KindOfRepository } from "../__dwitter__.d.ts/exception/exception";

export default class CommentRepository implements CommentDataHandler {
  protected readonly Select =
    "SELECT C.id, text, good, tweetId, R.username AS recipient, C.userId, U.username, U.name, url, createdAt, updatedAt, clicked FROM comments C\
    JOIN users U ON C.userId = U.id\
    LEFT JOIN replies R ON R.commentId = C.id\
    LEFT JOIN (SELECT commentId, IF(userId = ?, true, false) AS clicked FROM goodComments) G ON G.commentId = C.id";
  protected readonly Order_By = "ORDER BY createdAt DESC";
  protected readonly Get_By_Id = `${this.Select} WHERE C.id = ? AND tweetId = ? ${this.Order_By}`;

  constructor(
    private readonly db: DB,
    private readonly exc: ExceptionHandler<
      KindOfRepository,
      keyof CommentDataHandler
    >
  ) {}

  getAll = async (tweetId: string, userId: number) => {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();
      return await conn
        .execute(`${this.Select} WHERE tweetId = ? ${this.Order_By}`, [
          userId,
          tweetId,
        ])
        .then((result) => result[0] as OutputComment[]);
    } catch (e) {
      this.exc.throw(e, "getAll");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  create = async (
    userId: number,
    tweetId: string,
    text: string,
    recipient?: string
  ) => {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();

      if (recipient) await this.db.beginTransaction(conn);
      const commentId = await conn
        .execute(
          "INSERT INTO comments (text, good, userId, tweetId, createdAt, updatedAt) \
          VALUES(?, ?, ?, ?, ?, ?)",
          [text, 0, userId, tweetId, new Date(), new Date()]
        )
        .then((result: any[]) => result[0].insertId as number);
      if (recipient) {
        await conn
          .execute("INSERT INTO replies (commentId, username) VALUES(?, ?)", [
            commentId,
            recipient,
          ])
          .then(async () => await this.db.commit(conn));
      }

      return await conn
        .execute(this.Get_By_Id, [userId, commentId, tweetId])
        .then((result: any[]) => result[0][0] as OutputComment);
    } catch (e) {
      if (recipient) await this.db.rollback(conn!);
      this.exc.throw(e, "create");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  update = async (
    tweetId: string,
    commentId: string,
    userId: number,
    text?: string
  ) => {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();
      await conn.execute(
        "UPDATE comments SET text = ? , updatedAt = ? WHERE id = ?",
        [text, new Date(), commentId]
      );
      return await conn
        .execute(this.Get_By_Id, [userId, commentId, tweetId])
        .then((result: any[]) => result[0][0] as OutputComment);
    } catch (e) {
      this.exc.throw(e, "update");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };

  delete = async (commentId: string) => {
    let conn: PoolConnection;
    try {
      conn = await this.db.getConnection();
      await conn.execute("DELETE FROM comments WHERE id = ?", [commentId]);
    } catch (e) {
      this.exc.throw(e, "delete");
    } finally {
      this.db.releaseConnection(conn!);
    }
  };
}
