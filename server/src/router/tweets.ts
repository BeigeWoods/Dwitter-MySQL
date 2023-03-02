import express from "express";
import "express-async-errors";
import { body, ValidationChain } from "express-validator";
import {
  expressValidate,
  tweetFormDataValidate,
} from "../middleware/validator.js";
import { imageUploading } from "../middleware/multer.js";
import { AuthValidateHandler } from "../__dwitter__.d.ts/middleware/auth.js";
import { Validate } from "../__dwitter__.d.ts/middleware/validator.js";
import { TweetHandler } from "../__dwitter__.d.ts/controller/tweet.js";

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
  tweetController: TweetHandler
): express.IRouter {
  const router = express.Router();
  router.get("/", authValidator.isAuth, tweetController.getTweets);

  router.get("/:id", authValidator.isAuth, tweetController.getTweet);

  router.post(
    "/",
    authValidator.isAuth,
    imageUploading,
    validateTweet,
    tweetController.createTweet
  );

  router.put(
    "/:id",
    authValidator.isAuth,
    imageUploading,
    validateTweet,
    tweetController.updateTweet
  );

  router.delete("/:id", authValidator.isAuth, tweetController.deleteTweet);

  return router;
}
