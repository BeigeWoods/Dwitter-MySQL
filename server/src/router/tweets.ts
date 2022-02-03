import express from "express";
import "express-async-errors";
import { TweetHandler } from "../controller/tweet.js";
import { body, ValidationChain } from "express-validator";
import {
  Validate,
  expressValidate,
  tweetFormDataValidate,
} from "../middleware/validator.js";
import { AuthValidateHandler } from "../middleware/auth.js";
import { imageUploading } from "../middleware/multer.js";

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
];

export default function tweetsRouter(
  authValidator: AuthValidateHandler,
  tweetController: TweetHandler
): express.IRouter {
  const router = express.Router();
  // GET /tweet
  // GET /tweets?username=:username
  router.get("/", authValidator.isAuth, tweetController.getTweets);

  // GET /tweets/:id
  router.get("/:id", authValidator.isAuth, tweetController.getTweet);

  // POST /tweeets
  router.post(
    "/",
    authValidator.isAuth,
    imageUploading,
    validateTweet,
    tweetFormDataValidate,
    tweetController.createTweet
  );

  // PUT /tweets/:id
  router.put(
    "/:id",
    authValidator.isAuth,
    imageUploading,
    validateTweet,
    tweetFormDataValidate,
    tweetController.updateTweet
  );

  // DELETE /tweets/:id
  router.delete("/:id", authValidator.isAuth, tweetController.deleteTweet);

  return router;
}
