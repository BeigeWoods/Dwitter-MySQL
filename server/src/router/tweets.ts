import express from "express";
import "express-async-errors";
import { TweetHandler } from "../controller/tweet.js";
import { body, ValidationChain } from "express-validator";
import { Validate, validate } from "../middleware/validator.js";
import { AuthValidateHandler } from "../middleware/auth.js";

const validateTweet: Array<ValidationChain | Validate> = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("text should be at least 3 characters"),
  validate,
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
    validateTweet,
    tweetController.createTweet
  );

  // PUT /tweets/:id
  router.put(
    "/:id",
    authValidator.isAuth,
    validateTweet,
    tweetController.updateTweet
  );

  // DELETE /tweets/:id
  router.delete("/:id", authValidator.isAuth, tweetController.deleteTweet);

  return router;
}
