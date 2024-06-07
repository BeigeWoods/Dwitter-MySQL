declare type Config = {
  cors: {
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
  oauth: {
    state: {
      plain: string;
      saltRounds: number;
    };
    github: {
      clientId: string;
      clientSecret: string;
    };
  };
  awsS3: {
    id: string;
    secret: string;
    region: string;
  };
};

export default Config;
