import mysql from "mysql2/promise.js";
import config from "../config.js";

const { database, user, password, host } = config.db;
const db = mysql.createPool({ host, user, password, database });

export const getConnection = async () => {
  return db.getConnection().catch((error) => {
    throw `## Connection with MySQL ##\n ${error}`;
  });
};

export default db;
