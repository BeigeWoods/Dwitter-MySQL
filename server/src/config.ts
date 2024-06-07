import dotenv from "dotenv";
import Config from "./__dwitter__.d.ts/config";
dotenv.config();

function required(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

const config: Config = {
  cors: {
    allowedOrigin: required("ALLOWED_ORIGIN"),
  },
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: Number(required("JWT_EXPIRES_SEC")),
  },
  bcrypt: {
    randomWords: required("BCRYPT_RANDOM_WORDS"),
    saltRounds: Number(required("BCRYPT_SALT_ROUNDS")),
  },
  port: Number(required("HOST_PORT")),
  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    database: required("DB_DATABASE"),
    password: required("DB_PASSWORD"),
  },
  csrf: {
    plainToken: required("CSRF_SECRET_KEY"),
    saltRounds: Number(required("CSRF_SALT_ROUNDS")),
  },
  oauth: {
    state: {
      plain: required("OAUTH_STATE"),
      saltRounds: Number(required("OAUTH_STATE_SALT_ROUNDS")),
    },
    github: {
      clientId: required("GH_CLIENT_ID"),
      clientSecret: required("GH_CLIENT_SECRETS"),
    },
  },
  awsS3: {
    region: required("AWS_S3_REGION"),
    id: required("AWS_S3_ID"),
    secret: required("AWS_S3_SECRET"),
  },
};

export default config;
