import mysql, { PoolConnection } from "mysql2/promise.js";
import config from "../config.js";
import DB from "../__dwitter__.d.ts/db/database.js";

const { database, user, password, host } = config.db;
const pool = mysql.createPool({ host, user, password, database });

const db: DB = {
  getConnection: async () =>
    pool.getConnection().catch((error) => {
      throw `Error of DB connection : ${error}`;
    }),
  releaseConnection: (conn: PoolConnection) => pool.releaseConnection(conn),
  beginTransaction: async (conn: PoolConnection) =>
    conn.beginTransaction().catch((error) => {
      throw `Error to start transaction : ${error}`;
    }),
  rollback: async (conn: PoolConnection) =>
    conn.rollback().catch((error) => {
      throw `Error to rollback : ${error}`;
    }),
  commit: async (conn: PoolConnection) =>
    conn.commit().catch((error) => {
      throw `Error to commit : ${error}`;
    }),
};

export default db;
