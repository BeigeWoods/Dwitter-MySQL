import express, { ErrorRequestHandler } from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import tweetsRouter from "./router/tweets.js";
import commentsRouter from "./router/comments.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { db } from "./db/database.js";
import { initSocket, getSocketIO } from "./connection/socket.js";
import { csrfCheck } from "./middleware/csrf.js";
import { TweetRepository } from "./data/tweet.js";
import { TweetController } from "./controller/tweet.js";
import { GoodRepository } from "./data/good.js";
import { GoodMiddleWare } from "./middleware/good.js";
import { CommentRepository } from "./data/comments.js";
import { CommentController } from "./controller/comments.js";
import UserRepository from "./data/auth.js";
import TokenRepository from "./controller/auth/token.js";
import AuthValidator from "./middleware/auth.js";
import AuthController from "./controller/auth/auth.js";
import OauthController from "./controller/auth/oauth.js";

const app = express();
const userRepository = new UserRepository();
const authValidator = new AuthValidator(config, userRepository);
const tokenController = new TokenRepository(config);
const authController = new AuthController(
  config,
  userRepository,
  tokenController
);
const oauthController = new OauthController(
  config,
  tokenController,
  userRepository
);
const tweetRepository = new TweetRepository();
const tweetController = new TweetController(tweetRepository, getSocketIO);
const commentRepository = new CommentRepository();
const commentController = new CommentController(
  commentRepository,
  userRepository,
  getSocketIO
);
const goodRepository = new GoodRepository();
const goodMiddleWare = new GoodMiddleWare(
  tweetRepository,
  commentRepository,
  goodRepository
);

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control-Allow-Credentials
};

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.error("Something wrong with app\n", err);
  res.sendStatus(500);
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(csrfCheck);
app.use("/", [
  tweetsRouter(authValidator, tweetController, goodMiddleWare),
  commentsRouter(authValidator, commentController, goodMiddleWare),
]);
app.use(
  "/auth",
  authRouter(authValidator, authController, oauthController, tokenController)
);

app.use((req, res) => {
  res.sendStatus(404);
});
app.use(errorHandler);

db.getConnection()
  .then(() => {
    const server = app.listen(config.port);
    initSocket(server);
  })
  .catch((err) => console.error("the problem of db connect\n", err));
