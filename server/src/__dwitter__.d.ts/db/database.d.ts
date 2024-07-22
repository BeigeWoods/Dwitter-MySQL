import { PoolConnection } from "mysql2/promise.js";

declare interface DB {
  getConnection: () => Promise<PoolConnection>;
  releaseConnection: (conn: PoolConnection) => void;
  beginTransaction: (conn: PoolConnection) => Promise<void>;
  rollback: (conn: PoolConnection) => Promise<void>;
  commit: (conn: PoolConnection) => Promise<void>;
}

export default DB;
