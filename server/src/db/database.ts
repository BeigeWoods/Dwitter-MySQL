import mysql, { PoolConnection } from "mysql2/promise.js";
import config from "../config.js";
import DB from "../__dwitter__.d.ts/db/database.js";

const { database, user, password, host } = config.db;
const pool = mysql.createPool({ host, user, password, database });

const db: DB = {
  getConnection: async () =>
    pool.getConnection().catch((e) => {
      e.name += "from getConnection";
      throw e;
    }),
  releaseConnection: (conn: PoolConnection) => pool.releaseConnection(conn),
  beginTransaction: async (conn: PoolConnection) =>
    conn.beginTransaction().catch((e) => {
      e.name += "from beginTransaction";
      throw e;
    }),
  rollback: async (conn: PoolConnection) =>
    conn.rollback().catch((e) => {
      e.name += "from rollback";
      throw e;
    }),
  commit: async (conn: PoolConnection) =>
    conn.commit().catch((e) => {
      e.name += "from commit";
      throw e;
    }),
};

export default db;
