import mysql from "mysql2";
import config from "../config.js";

const { database, user, password, host } = config.db;
const pool = mysql.createPool({ host, user, password, database });
const db = pool.promise();

export default db;
