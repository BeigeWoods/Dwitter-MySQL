import express from "express";
import "express-async-errors";
import { imageUploading } from "../middleware/multer";
import {
  goodValidator,
  tweetValidator,
} from "../middleware/validation/content.js";
import { AuthValidateHandler } from "../__dwitter__.d.ts/middleware/auth";
import { TweetHandler } from "../__dwitter__.d.ts/controller/tweet";
import { GoodHandler } from "../__dwitter__.d.ts/controller/good";

export default function tweetsRouter(
  authValidator: AuthValidateHandler,
  tweetController: TweetHandler,
  goodController: GoodHandler
): express.IRouter {
  const router = express.Router();
  router.get(
    "/",
    authValidator.isAuth,
    tweetValidator.username,
    tweetController.getTweets
  );

  router.get(
    "/:tweetId",
    authValidator.isAuth,
    tweetValidator.tweetId,
    tweetController.getTweet
  );

  router.post(
    "/",
    authValidator.isAuth,
    imageUploading,
    tweetValidator.creation,
    tweetController.createTweet
  );

  router.put(
    "/:tweetId",
    authValidator.isAuth,
    imageUploading,
    tweetValidator.update,
    tweetController.updateTweet
  );

  router.delete(
    "/:tweetId",
    authValidator.isAuth,
    tweetValidator.tweetId,
    tweetController.deleteTweet
  );

  router.put(
    "/:tweetId/good",
    authValidator.isAuth,
    goodValidator.tweet,
    goodController.goodTweet
  );

  return router;
}
