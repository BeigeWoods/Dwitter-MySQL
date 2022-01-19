import express from "express";
import "express-async-errors";
import { TweetHandler } from "controller/tweet.js";
import { body, ValidationChain } from "express-validator";
import { isAuth } from "../middleware/auth.js";
import { Validate, validate } from "../middleware/validator.js";

const validateTweet: Array<ValidationChain | Validate> = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("text should be at least 3 characters"),
  validate,
];

export default function tweetsRouter(
  tweetController: TweetHandler
): express.IRouter {
  const router = express.Router();
  // GET /tweet
  // GET /tweets?username=:username
  router.get("/", isAuth, tweetController.getTweets);

  // GET /tweets/:id
  router.get("/:id", isAuth, tweetController.getTweet);

  // POST /tweeets
  router.post("/", isAuth, validateTweet, tweetController.createTweet);

  // PUT /tweets/:id
  router.put("/:id", isAuth, validateTweet, tweetController.updateTweet);

  // DELETE /tweets/:id
  router.delete("/:id", isAuth, tweetController.deleteTweet);

  return router;
}
