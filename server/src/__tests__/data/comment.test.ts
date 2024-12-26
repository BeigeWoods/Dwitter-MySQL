import { pool } from "../../db/database";
import { PoolConnection } from "mysql2/promise";
import { tweet, user } from "../__temporary__/repositories";

describe("Comment Repository", () => {
  const createComment = async (
    userId: number,
    tweetId: number,
    text: string,
    recipient?: string
  ) => {
    let conn: PoolConnection, replyId: number;
    try {
      conn = await pool.getConnection();
      if (recipient) await conn.beginTransaction();
      const commentId = await conn
        .execute(
          "INSERT INTO comments (text, good, userId, tweetId, createdAt, updatedAt) \
            VALUES(?, ?, ?, ?, ?, ?)",
          [text, 0, userId, tweetId, new Date(), new Date()]
        )
        .then((result: any[]) => result[0].insertId as number);
      if (recipient) {
        replyId = await conn
          .execute("INSERT INTO replies (commentId, username) VALUES(?, ?)", [
            commentId,
            recipient,
          ])
          .then((result: any[]) => result[0].insertId as number);
        await conn.commit();
      }
      return { commentId, replyId: replyId! };
    } catch (e) {
      if (recipient) await conn!.rollback();
      throw e;
    } finally {
      conn!.release();
    }
  };
  const deleteComment = async (commentId: number) => {
    let conn: PoolConnection;
    try {
      conn = await pool.getConnection();
      await conn.execute("DELETE FROM comments WHERE id = ?", [commentId]);
    } catch (e) {
      console.error(e);
    } finally {
      conn!.release();
    }
  };
  let AUserId: number | undefined,
    ATweetId: number | undefined,
    BUserId: number | undefined;

  beforeAll(async () => {
    let conn: PoolConnection;
    try {
      conn = await pool.getConnection();
      AUserId =
        (await user(conn).findByUsername("A")) ||
        (await user(conn).create("A"));
      ATweetId =
        (await tweet(conn).findByUserId(AUserId!)) ||
        (await tweet(conn).create(AUserId!, "A tweet"));
      BUserId =
        (await user(conn).findByUsername("B")) ||
        (await user(conn).create("B"));
    } catch (e) {
      throw e;
    } finally {
      conn!.release();
    }
  });

  afterAll(async () => {
    await pool
      .end()
      .then(() => console.log("DB disconnected"))
      .catch((e) => console.error("Fail to disconnect\n", e));
  });

  test("operation to create comment would be committed", async () => {
    const result = await createComment(BUserId!, ATweetId!, "A comment").catch(
      (e) => console.error("Fail to create A comment\n", e)
    );

    expect(typeof result!.commentId).toBe("number");
    expect(result!.replyId).toBeUndefined();

    await deleteComment(result!.commentId);
  });

  describe("create reply", () => {
    test("the operation with wrong recipient would be faild", async () => {
      const result = await createComment(
        BUserId!,
        ATweetId!,
        "X reply",
        "X"
      ).catch((e: any) => expect(e.code).toBe("ER_NO_REFERENCED_ROW_2"));

      expect(result!).toBeUndefined();
    });

    test("the operation with right recipient would be committed", async () => {
      const result = await createComment(
        BUserId!,
        ATweetId!,
        "A reply",
        "A"
      ).catch((e) => console.error(e));

      expect(typeof result!.commentId).toBe("number");
      expect(typeof result!.replyId).toBe("number");

      await deleteComment(result!.commentId);
    });
  });
});
