import express from "express";
import "express-async-errors";
import {
  goodValidator,
  tweetValidator,
} from "../middleware/validation/content.js";
import handleFormData from "../middleware/formData.js";
import AuthValidateHandler from "../__dwitter__.d.ts/middleware/auth";
import TweetHandler from "../__dwitter__.d.ts/controller/tweet";
import GoodHandler from "../__dwitter__.d.ts/controller/good";

export default function tweetsRouter(
  authValidator: AuthValidateHandler,
  tweetController: TweetHandler,
  goodController: GoodHandler
) {
  const router = express.Router();
  router.get(
    "/",
    authValidator.isAuth,
    tweetValidator.username,
    tweetController.getAll
  );

  router.get(
    "/:tweetId",
    authValidator.isAuth,
    tweetValidator.tweetId,
    tweetController.getById
  );

  router.post(
    "/",
    authValidator.isAuth,
    handleFormData,
    tweetValidator.creation,
    tweetController.create
  );

  router.put(
    "/:tweetId",
    authValidator.isAuth,
    handleFormData,
    tweetValidator.update,
    tweetController.update
  );

  router.delete(
    "/:tweetId",
    authValidator.isAuth,
    tweetValidator.delete,
    tweetController.delete
  );

  router.put(
    "/:tweetId/good",
    authValidator.isAuth,
    goodValidator.tweet,
    goodController.tweet
  );

  return router;
}
