import express from "express";
import "express-async-errors";
import { TweetHandler } from "../controller/tweet";
import { AuthValidateHandler } from "../middleware/auth";
export default function tweetsRouter(
  authValidator: AuthValidateHandler,
  tweetController: TweetHandler
): express.IRouter;
