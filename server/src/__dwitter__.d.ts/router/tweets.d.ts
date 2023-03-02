import express from "express";
import "express-async-errors";
import { TweetHandler } from "../controller/tweet.js";
import { AuthValidateHandler } from "../middleware/auth.js";
export default function tweetsRouter(authValidator: AuthValidateHandler, tweetController: TweetHandler): express.IRouter;
