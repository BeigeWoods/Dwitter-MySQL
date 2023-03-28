import dotenv from "dotenv";
import { Config } from "./__dwitter__.d.ts/config";
dotenv.config();

function required<V extends string | number>(
  key: string,
  defaultValue?: number
): V {
  const value = defaultValue ? Number(process.env[key]) : process.env[key];
  if (!value) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value as V;
}

export const config: Config = {
  cors: {
    allowedOrigin: required("ALLOWED_ORIGIN"),
  },
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: required("JWT_EXPIRES_SEC", 86400),
  },
  bcrypt: {
    saltRounds: required("BCRYPT_SALT_ROUNDS", 12),
    randomWords: required("BCRYPT_RANDOM_WORDS"),
  },
  port: required("HOST_PORT", 8080),
  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    database: required("DB_DATABASE"),
    password: required("DB_PASSWORD"),
  },
  csrf: {
    plainToken: required("CSRF_SECRET_KEY"),
  },
  ghOauth: {
    clientId: required("GH_CLIENT_ID"),
    clientSecret: required("GH_CLIENT_SECRETS"),
  },
  awsS3: {
    region: required("AWS_S3_REGION"),
    id: required("AWS_S3_ID"),
    secret: required("AWS_S3_SECRET"),
  },
};
