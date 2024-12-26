import { PoolConnection } from "mysql2/promise";

export const tweet = (conn: PoolConnection) => ({
  create: (userId: number, text: string) =>
    conn
      .execute(
        "INSERT INTO tweets(text, video, image, good, userId, createdAt, updatedAt) \
        VALUES(?, ?, ?, ?, ?, ?, ?)",
        [text, "", "", 0, userId, new Date(), new Date()]
      )
      .then((result: any[]) => result[0].insertId as number),
  findByUserId: (userId: number) =>
    conn
      .execute("SELECT id FROM tweets WHERE userId = ?", [userId])
      .then((result: any[]) => result[0][0] && (result[0][0].id as number)),
  numsOfGoodById: (tweetId: number) =>
    conn
      .execute("SELECT good FROM tweets WHERE id = ?", [tweetId])
      .then((result: any[]) => result[0][0] && (result[0][0].good as number)),
});

export const user = (conn: PoolConnection) => ({
  findByUsername: (username: string) =>
    conn
      .execute("SELECT id FROM users WHERE username = ?", [username])
      .then((result: any[]) => result[0][0] && (result[0][0].id as number)),
  create: (username: string) =>
    conn
      .execute(
        "INSERT INTO users(username, password, name, email, url, socialLogin) \
        VALUES (?, ?, ?, ?, ?, ?)",
        [username, "pw", "name", username + "@", "", false]
      )
      .then((result: any[]) => result[0].insertId as number),
  delete: (userId: number) =>
    conn.execute("DELETE FROM users WHERE id = ?", [userId]),
});

export const goodAboutTweet = (conn: PoolConnection) => ({
  click: {
    whoDid: (userId: number, tweetId: number) =>
      conn.execute("INSERT INTO goodTweets(userId, tweetId) VALUES(?, ?)", [
        userId,
        tweetId,
      ]),
    nums: (tweetId: number) =>
      conn.execute("UPDATE tweets SET good = good + 1 WHERE id = ?", [tweetId]),
  },
  undo: {
    whoDid: (userId: number, tweetId: number) =>
      conn.execute("DELETE FROM goodTweets WHERE userId = ? AND tweetId = ?", [
        userId,
        tweetId,
      ]),
    nums: (tweetId: number) =>
      conn.execute("UPDATE tweets SET good = good - 1 WHERE id = ?", [tweetId]),
  },
  init: {
    whoDid: (tweetId: number) =>
      conn.execute("DELETE FROM goodTweets WHERE tweetId = ?", [tweetId]),
    nums: (tweetId: number) =>
      conn.execute("UPDATE tweets SET good = 0 WHERE id = ?", [tweetId]),
  },
  findWhoDid: (userId: number, tweetId: number) =>
    conn
      .execute("SELECT * FROM goodTweets WHERE userId = ? AND tweetId = ?", [
        userId,
        tweetId,
      ])
      .then((result: any[]) => result[0][0]),
});
