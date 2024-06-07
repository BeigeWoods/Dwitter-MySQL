import express, { Response } from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import tweetsRouter from "./router/tweets.js";
import commentsRouter from "./router/comments.js";
import authRouter from "./router/auth.js";
import config from "./config.js";
import db from "./db/database.js";
import { initSocket, getSocketIO } from "./connection/socket.js";
import { csrfCheck } from "./middleware/csrf.js";
import TweetRepository from "./data/tweet.js";
import TweetController from "./controller/tweet.js";
import GoodRepository from "./data/good.js";
import GoodController from "./controller/good.js";
import CommentRepository from "./data/comment.js";
import CommentController from "./controller/comments.js";
import UserRepository from "./data/user.js";
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
const goodContoller = new GoodController(
  tweetRepository,
  commentRepository,
  goodRepository
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
// app.use("/uploads", express.static("uploads"));

app.use(csrfCheck);
app.use("/", [
  tweetsRouter(authValidator, tweetController, goodContoller),
  commentsRouter(authValidator, commentController, goodContoller),
]);
app.use(
  "/auth",
  authRouter(authValidator, authController, oauthController, tokenController)
);

app.use((res: Response) => {
  return res.status(404).json({ message: "Bad Access" });
});
app.use((err: Error | unknown, res: Response) => {
  console.error("Something go wrong\n", err);
  return res.status(500).json({ message: "Sorry, Something wrong" });
});

db.getConnection()
  .then(() => {
    console.log("Success connect with DB");
    const server = app.listen(config.port, () =>
      console.log(`Server listening on port ${config.port}`)
    );
    initSocket(server);
  })
  .catch((err) => console.error("The problem of DB connection\n", err));
