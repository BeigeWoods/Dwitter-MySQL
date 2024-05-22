import { db } from "../../db/database";

describe("UserRepository", () => {
  const errorCallback = jest.fn((err: any) => err);
  let userId: number;

  beforeAll(async () => {
    await db
      .getConnection()
      .then(() => console.log("DB connected"))
      .catch((error) => console.error("Failed Connection\n", error));
  });

  afterAll(async () => {
    try {
      await db.end().then(() => console.log("DB disconnected"));
    } catch (err) {
      console.error("Failed disconnection\n", err);
    }
  });

  describe("createUser", () => {
    let sql =
      "INSERT INTO users(username, password, name, email, url, socialLogin) VALUES (?, ?, ?, ?, ?, ?)";
    const user = ["smith", "123", "smith", "@", "", true];

    test("returns creadted user data", async () => {
      try {
        await db.execute(sql, user).then((result: any) => {
          expect(result).toHaveLength(2);
          // [
          //   ResultSetHeader {
          //     fieldCount: 0,
          //     affectedRows: 1,
          //     insertId: 1,
          //     info: '',
          //     serverStatus: 2,
          //     warningStatus: 0
          //   },
          //   undefined
          // ]
          userId = result[0].insertId;
        });
      } catch (error: any) {
        expect(error.message).toBe([]);
        return errorCallback(error);
      }
      expect(errorCallback).not.toHaveBeenCalled();
    });

    test("returns error by duplicate data", async () => {
      // await db
      //   .execute(sql, user)
      //   .then((result) => expect(result).toEqual([]))
      //   .catch((error: any) => {
      //     expect(error.message).toBe(
      //       "Duplicate entry 'smith' for key 'users.username'"
      //     );
      //     return errorCallback(error);
      //   });
      // expect(errorCallback).toHaveBeenCalled();
      try {
        await db
          .execute(sql, user)
          .then((result) => expect(result).toEqual([]));
      } catch (error: any) {
        expect(error.message).toBe(
          "Duplicate entry 'smith' for key 'users.username'"
        );
        return errorCallback(error);
      }
      expect(db).toHaveLastReturnedWith(errorCallback);
    });
  });

  describe("getUser", () => {
    test("succeeds to get user by userId", async () => {
      await db
        .execute("SELECT * FROM users WHERE id = ?", [userId])
        .then((result: any[]) => expect(typeof result[0][0]).toBe("object"))
        .catch((error) => expect(error.message).toBe([]));
    });

    test("returns undefined when gets user by NaN", async () => {
      await db
        .execute("SELECT * FROM users WHERE id = ?", [NaN])
        .then((result: any[]) => expect(result[0][0]).toBeUndefined())
        .catch((error) => expect(error.message).toBe([]));
    });

    test("returns undefined when user doesn't exist", async () => {
      await db
        .execute("SELECT * FROM users WHERE id = ?", [1])
        .then((result: any[]) => expect(result[0][0]).toBeUndefined())
        .catch((error) => expect(error.message).toBe([]));
    });

    test("returns error by wrong type of data", async () => {
      await db
        .execute("SELECT * FROM users WHERE id = ?", ["userId"])
        .then((result: any[]) => expect(result[0][0]).toBeUndefined())
        .catch((error) =>
          expect(error.message).toBe(
            "Truncated incorrect INTEGER value: 'userId'"
          )
        );
    });

    describe("updateUser", () => {
      test("returns error when null is provided", async () => {
        await db
          .execute("UPDATE users SET username = ? WHERE id = ?", [null, userId])
          .catch((error) =>
            expect(error.message).toBe("Column 'username' cannot be null")
          );
      });

      test("returns '' when '' is provided", async () => {
        await db.execute("UPDATE users SET username = ? WHERE id = ?", [
          "",
          userId,
        ]);

        await db
          .execute("SELECT username FROM users WHERE id = ?", [userId])
          .then((result: any[]) => expect(result[0][0].username).toBe(""))
          .catch((error) => expect(error.message).toBe([]));
      });

      test("returns 'mr.smith' when 'mr.smith' is provided", async () => {
        await db.execute("UPDATE users SET username = ? WHERE id = ?", [
          "mr.smith",
          userId,
        ]);

        await db
          .execute("SELECT username FROM users WHERE id = ?", [userId])
          .then((result: any[]) =>
            expect(result[0][0].username).toBe("mr.smith")
          )
          .catch((error) => expect(error.message).toBe([]));
      });
    });

    test("returns error by wrong query", async () => {
      await db
        .execute("SELECT * FROM userss")
        .then((result: any[]) => expect(result[0]).toBeUndefined())
        .catch((error) =>
          expect(error.message).toBe("Table 'dwitter.userss' doesn't exist")
        );
    });
  });

  describe("deleteUser", () => {
    let sql = "DELETE FROM users WHERE id = ?";

    test("returns error by wrong type of data", async () => {
      try {
        await db.execute(sql, ["userId"]);
      } catch (error: any) {
        expect(error.message).toBe(
          "Truncated incorrect INTEGER value: 'userId'"
        );
        return errorCallback(error);
      }
      expect(db).toHaveReturnedWith(errorCallback);
      expect(errorCallback).toHaveBeenCalled();
    });

    test("will success delete if value of userId is NaN", async () => {
      try {
        await db.execute(sql, [NaN]);
      } catch (error: any) {
        expect(error.message).toBe([]);
        return errorCallback(error);
      }
      expect(errorCallback).not.toHaveBeenCalled();
    });

    test("will success delete if value of userId is null", async () => {
      await db.execute(sql, [null]).catch((error: any) => {
        expect(error.message).toBe([]);
        return errorCallback(error);
      });
      expect(errorCallback).not.toHaveBeenCalled();
    });

    test("succeeds to delete user by userId", async () => {
      try {
        await db.execute(sql, [userId]);
      } catch (error: any) {
        expect(error.message).toBe([]);
        return errorCallback(error);
      }
      expect(errorCallback).not.toHaveBeenCalled();
    });
  });
});
