import mysql from "mysql2";
import { config } from "../config";

const { database, user, password, host } = config.db;

export const pool = mysql.createPool({ host, user, password, database });
export const db = pool.promise();
