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
import { Server } from "http";

const app = express();
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

app.use(csrfCheck);
app.use("/", tweetsRouter);
app.use("/auth", authRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(404);
});

app.use((req: Request, error: any, res: Response, next: NextFunction) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize
  .sync()
  .then(() => {
    const server: Server = app.listen(config.port);
    initSocket(server);
  })
  .catch((err: Error) => console.error(err));
