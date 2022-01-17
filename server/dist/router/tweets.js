import { getSocketIO } from "../connection/socket.js";
import { TweetRepository } from "../data/tweet.js";
import { Tweet, User } from "../db/database.js";
import express from "express";
import "express-async-errors";
import { body } from "express-validator";
import { TweetController } from "../controller/tweet.js";
import { isAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validator.js";
const router = express.Router();
const tweetRepository = new TweetRepository(Tweet, User);
const tweetController = new TweetController(tweetRepository, getSocketIO);
const validateTweet = [
    body("text")
        .trim()
        .isLength({ min: 3 })
        .withMessage("text should be at least 3 characters"),
    validate,
];
router.get("/", isAuth, tweetController.getTweets);
router.get("/:id", isAuth, tweetController.getTweet);
router.post("/", isAuth, validateTweet, tweetController.createTweet);
router.put("/:id", isAuth, validateTweet, tweetController.updateTweet);
router.delete("/:id", isAuth, tweetController.deleteTweet);
export default router;
//# sourceMappingURL=tweets.js.map