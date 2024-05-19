import express from "express";
import "express-async-errors";
import { body, ValidationChain } from "express-validator";
import {
  expressValidate,
  tweetFormDataValidate,
  paramsValidate,
} from "../middleware/validator";
import { imageUploading } from "../middleware/multer";
import { AuthValidateHandler } from "../__dwitter__.d.ts/middleware/auth";
import { Validate } from "../__dwitter__.d.ts/middleware/validator";
import { TweetHandler } from "../__dwitter__.d.ts/controller/tweet";
import { GoodHandler } from "../__dwitter__.d.ts/controller/good";

const validateTweet: Array<ValidationChain | Validate> = [
  body("text")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage("text should be at least 1 characters"),
  body("video")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("invalid url"),
  expressValidate,
  tweetFormDataValidate,
];

export default function tweetsRouter(
  authValidator: AuthValidateHandler,
  tweetController: TweetHandler,
  goodController: GoodHandler
): express.IRouter {
  const router = express.Router();
  router.get("/", authValidator.isAuth, tweetController.getTweets);

  router.get(
    "/:tweetId",
    authValidator.isAuth,
    paramsValidate,
    tweetController.getTweet
  );

  router.post(
    "/",
    authValidator.isAuth,
    imageUploading,
    validateTweet,
    tweetController.createTweet
  );

  router.put(
    "/:tweetId",
    authValidator.isAuth,
    imageUploading,
    paramsValidate,
    validateTweet,
    tweetController.updateTweet
  );

  router.delete(
    "/:tweetId",
    authValidator.isAuth,
    paramsValidate,
    tweetController.deleteTweet
  );

  router.put(
    "/:tweetId/good",
    authValidator.isAuth,
    paramsValidate,
    goodController.goodTweet
  );

  return router;
}
