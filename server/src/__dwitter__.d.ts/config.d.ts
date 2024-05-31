export declare type Config = {
  cors: {
    baseUri: string;
    allowedOrigin: string;
  };
  jwt: {
    secretKey: string;
    expiresInSec: number;
  };
  bcrypt: {
    saltRounds: number;
    randomWords: string;
  };
  port: number;
  db: {
    host: string;
    user: string;
    database: string;
    password: string;
  };
  csrf: {
    plainToken: string;
    saltRounds: number;
  };
  ghOauth: {
    clientId: string;
    clientSecret: string;
  };
  awsS3: {
    id: string;
    secret: string;
    region: string;
  };
};
