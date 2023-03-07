import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { sequelize } from "./db/database.js";
import { csrfCheck } from "./middleware/csrf.js";
import { getSocketIO } from "./connection/socket.js";
import { TweetRepository } from "./data/tweet.js";
import { Tweet, User } from "./db/database.js";
import { TweetController } from "./controller/tweet.js";
import OauthController from "./controller/auth/oauth.js";
import TokenRepository from "./controller/auth/token.js";
import UserRepository from "./data/auth.js";
import AuthController from "./controller/auth/auth.js";
import AuthValidator from "./middleware/auth.js";

const app = express();
const tweetRepository = new TweetRepository(Tweet, User);
const tweetController = new TweetController(tweetRepository, getSocketIO);
const tokenController = new TokenRepository(config);
const userRepository = new UserRepository(User);
const authValidator = new AuthValidator(config, userRepository);
const oauthController = new OauthController(
  config,
  tokenController,
  userRepository
);
const authController = new AuthController(
  config,
  userRepository,
  tokenController
);

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control-Allow-Credentials
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(csrfCheck);
app.use("/", tweetsRouter(authValidator, tweetController));
app.use(
  "/auth",
  authRouter(authValidator, authController, oauthController, tokenController)
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(404);
});

app.use((req: Request, error: any, res: Response, next: NextFunction) => {
  console.error("Something wrong with app\n", error);
  res.sendStatus(500).json({ message: "something went wrong!" });
});

sequelize
  .sync()
  .then(() => {
    const server = app.listen(config.port);
    initSocket(server);
  })
  .catch((err) => {
    console.error("The problem of connecting DB\n", err);
  });
