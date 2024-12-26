import { PoolConnection } from "mysql2/promise";
import { pool } from "../../db/database";
import { goodAboutTweet, tweet, user } from "../__temporary__/repositories";

describe("Good Repository : controll concurrency", () => {
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
      console.log(`AUserId : ${AUserId}, BUserId : ${BUserId}`);
    }
  });

  afterAll(async () => {
    await pool
      .end()
      .then(() => console.log("DB disconnected"))
      .catch((e) => console.error("Fail to disconnect\n", e));
  });

  describe("relation -> nums", () => {
    test("click : would be failed by deadlock", async () => {
      let connA: PoolConnection, connB: PoolConnection;
      let errorName: string;
      try {
        await Promise.all([
          (connA = await pool.getConnection()),
          (connB = await pool.getConnection()),
        ]);
        console.log(
          `click_RN\nA thread : ${connA.threadId}, B thread : ${connB.threadId}`
        );

        await Promise.all([connA.beginTransaction(), connB.beginTransaction()]);

        await Promise.all([
          goodAboutTweet(connA)
            .click.whoDid(AUserId!, ATweetId!)
            .catch((e) => {
              e.name = "whoDid_AUser";
              throw e;
            }),
          goodAboutTweet(connB)
            .click.whoDid(BUserId!, ATweetId!)
            .catch((e) => {
              e.name = "whoDid_BUser";
              throw e;
            }),
        ]);

        await Promise.all([
          goodAboutTweet(connB)
            .click.nums(ATweetId!)
            .then(() => connB.commit())
            .catch((e) => {
              e.name = "nums_BUser";
              throw e;
            }),
          goodAboutTweet(connA)
            .click.nums(ATweetId!)
            .then(() => connA.commit())
            .catch((e) => {
              e.name = "nums_AUser";
              throw e;
            }),
        ]);
      } catch (e: any) {
        errorName = e.name;
        expect(e.errno).toBe(1213);
        expect(e.code).toBe("ER_LOCK_DEADLOCK");
        await Promise.all([connA!.rollback(), connB!.rollback()]);
      } finally {
        connA!.release();
        connB!.release();
      }

      let conn: PoolConnection;
      try {
        conn = await pool.getConnection();
        const result = await Promise.all([
          tweet(conn).numsOfGoodById(ATweetId!),
          goodAboutTweet(conn).findWhoDid(AUserId!, ATweetId!),
          goodAboutTweet(conn).findWhoDid(BUserId!, ATweetId!),
        ]);

        expect(result[0]).toBe(1);
        if (errorName! === "nums_AUser") {
          expect(result[1]).not.toBeDefined();
          expect(result[2]).toBeDefined();
        } else {
          expect(result[1]).toBeDefined();
          expect(result[2]).not.toBeDefined();
        }
      } catch (e) {
        console.error(e);
      } finally {
        conn!.release();
      }
    });

    test("undo", async () => {
      let connA: PoolConnection, connB: PoolConnection;
      try {
        await Promise.all([
          (connA = await pool.getConnection()),
          (connB = await pool.getConnection()),
        ]);
        console.log(
          `undo_RN\nA thread : ${connA.threadId}, B thread : ${connB.threadId}`
        );

        await Promise.all([connA.beginTransaction(), connB.beginTransaction()]);

        await Promise.all([
          goodAboutTweet(connA)
            .undo.whoDid(AUserId!, ATweetId!)
            .catch((e) => {
              e.name = "whoDid_AUser";
              throw e;
            }),
          goodAboutTweet(connB)
            .undo.whoDid(BUserId!, ATweetId!)
            .catch((e) => {
              e.name = "whoDid_BUser";
              throw e;
            }),
        ]);

        await Promise.all([
          goodAboutTweet(connB)
            .undo.nums(ATweetId!)
            .then(() => connB.commit())
            .catch((e) => {
              e.name = "nums_BUser";
              throw e;
            }),
          goodAboutTweet(connA)
            .undo.nums(ATweetId!)
            .then(() => connA.commit())
            .catch((e) => {
              e.name = "nums_AUser";
              throw e;
            }),
        ]);
      } catch (e: any) {
        e.name === "nums_AUser"
          ? await Promise.all([connA!.commit(), connB!.rollback()])
          : await Promise.all([connB!.commit(), connA!.rollback()]);
        expect(e.errno).toBe(3819);
        expect(e.code).toBe("ER_CHECK_CONSTRAINT_VIOLATED");
      } finally {
        connA!.release();
        connB!.release();
      }

      let conn: PoolConnection;
      try {
        conn = await pool.getConnection();
        const result = await Promise.all([
          tweet(conn).numsOfGoodById(ATweetId!),
          goodAboutTweet(conn).findWhoDid(AUserId!, ATweetId!),
          goodAboutTweet(conn).findWhoDid(BUserId!, ATweetId!),
        ]);

        expect(result[0]).toBe(0);
        expect(result[1]).not.toBeDefined();
        expect(result[2]).not.toBeDefined();
      } catch (e) {
        console.error(e);
      } finally {
        conn!.release();
      }
    });
  });

  describe("nums -> relation", () => {
    test("click : would be fail by lock wait timeout exceeded", async () => {
      let connA: PoolConnection, connB: PoolConnection;
      try {
        await Promise.all([
          (connA = await pool.getConnection()),
          (connB = await pool.getConnection()),
        ]);
        console.log(
          `click_NR : fail\nA thread : ${connA.threadId}, B thread : ${connB.threadId}`
        );

        await Promise.all([
          connA.query("SET SESSION innodb_lock_wait_timeout = 5"),
          connB.query("SET SESSION innodb_lock_wait_timeout = 5"),
        ]);
        await Promise.all([connA.beginTransaction(), connB.beginTransaction()]);

        await Promise.all([
          goodAboutTweet(connA)
            .click.nums(ATweetId!)
            .catch((e) => {
              e.name = "nums_AUser";
              throw e;
            }),
          goodAboutTweet(connB)
            .click.nums(ATweetId!)
            .catch((e) => {
              e.name = "nums_BUser";
              throw e;
            }),
        ]);

        await Promise.all([
          goodAboutTweet(connA)
            .click.whoDid(AUserId!, ATweetId!)
            .then(() => connA.commit())
            .catch((e) => {
              e.name = "whoDid_AUser";
              throw e;
            }),
          goodAboutTweet(connB)
            .click.whoDid(BUserId!, ATweetId!)
            .then(() => connB.commit())
            .catch((e) => {
              e.name = "whoDid_BUser";
              throw e;
            }),
        ]);
      } catch (e: any) {
        await Promise.all([connA!.rollback(), connB!.rollback()]);
        expect(e.errno).toBe(1205);
        expect(e.code).toBe("ER_LOCK_WAIT_TIMEOUT");
      } finally {
        connA!.release();
        connB!.release();
      }
    }, 30000);

    test("click", async () => {
      let connA: PoolConnection, connB: PoolConnection;
      try {
        await Promise.all([
          (connA = await pool.getConnection()),
          (connB = await pool.getConnection()),
        ]);
        console.log(
          `click_NR\nA thread : ${connA.threadId}, B thread : ${connB.threadId}`
        );

        await Promise.all([connA.beginTransaction(), connB.beginTransaction()]);

        await Promise.race([
          goodAboutTweet(connA)
            .click.nums(ATweetId!)
            .catch((e) => {
              e.name = "nums_AUser";
              throw e;
            }),
          goodAboutTweet(connB)
            .click.nums(ATweetId!)
            .catch((e) => {
              e.name = "nums_BUser";
              throw e;
            }),
        ]);

        await Promise.all([
          goodAboutTweet(connA)
            .click.whoDid(AUserId!, ATweetId!)
            .then(() => connA.commit())
            .catch((e) => {
              e.name = "whoDid_AUser";
              throw e;
            }),
          goodAboutTweet(connB)
            .click.whoDid(BUserId!, ATweetId!)
            .then(() => connB.commit())
            .catch((e) => {
              e.name = "whoDid_BUser";
              throw e;
            }),
        ]);
      } catch (e: any) {
        await Promise.all([connA!.rollback(), connB!.rollback()]);
        console.error(e);
      } finally {
        connA!.release();
        connB!.release();
      }

      let conn: PoolConnection;
      try {
        conn = await pool.getConnection();
        const result = await Promise.all([
          tweet(conn).numsOfGoodById(ATweetId!),
          goodAboutTweet(conn).findWhoDid(AUserId!, ATweetId!),
          goodAboutTweet(conn).findWhoDid(BUserId!, ATweetId!),
        ]);

        expect(result[0]).toBe(2);
        expect(result[1]).toBeDefined();
        expect(result[2]).toBeDefined();
      } catch (e) {
        console.error(e);
      } finally {
        conn!.release();
      }
    }, 30000);

    test("undo", async () => {
      let connA: PoolConnection, connB: PoolConnection;
      try {
        await Promise.all([
          (connA = await pool.getConnection()),
          (connB = await pool.getConnection()),
        ]).then(() =>
          console.log(
            `undo_NR\nA thread : ${connA.threadId}, B thread : ${connB.threadId}`
          )
        );
        await Promise.all([connA.beginTransaction(), connB.beginTransaction()]);

        await Promise.all([
          goodAboutTweet(connA)
            .undo.nums(ATweetId!)
            .then(async () => await connA.commit())
            .catch((e) => {
              e.name = "nums_AUser";
              throw e;
            }),
          goodAboutTweet(connB)
            .undo.nums(ATweetId!)
            .then(async () => await connB.commit())
            .catch((e) => {
              e.name = "nums_BUser";
              throw e;
            }),
        ]);

        await Promise.all([
          goodAboutTweet(connA)
            .undo.whoDid(AUserId!, ATweetId!)
            .catch((e) => {
              e.name = "whoDid_AUser";
              throw e;
            }),
          goodAboutTweet(connB)
            .undo.whoDid(BUserId!, ATweetId!)
            .catch((e) => {
              e.name = "whoDid_BUser";
              throw e;
            }),
        ]);
      } catch (e: any) {
        await Promise.all([connA!.rollback(), connB!.rollback()]);
        console.error(e);
      } finally {
        connA!.release();
        connB!.release();
      }
    });
  });
});
