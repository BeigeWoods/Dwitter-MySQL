import express from "express";
import "express-async-errors";
import { ValidationChain, body } from "express-validator";
import { Validate } from "../__dwitter__.d.ts/middleware/validator";
import { AuthValidateHandler } from "../__dwitter__.d.ts/middleware/auth";
import { CommentHandler } from "../__dwitter__.d.ts/controller/comments";
import { GoodHandler } from "../__dwitter__.d.ts/middleware/good";
import { expressValidate, paramsValidate } from "../middleware/validator.js";

const validateComment: Array<ValidationChain | Validate> = [
  body("text")
    .notEmpty()
    .trim()
    .isLength({ min: 1 })
    .withMessage("text should be at least 1 characters"),
  expressValidate,
];

export default function commentsRouter(
  authValidator: AuthValidateHandler,
  commentController: CommentHandler,
  goodController: GoodHandler
): express.IRouter {
  const router = express.Router();

  router.get(
    "/:tweetId/comments",
    authValidator.isAuth,
    paramsValidate,
    commentController.getComments
  );

  router.post(
    "/:tweetId/comments",
    authValidator.isAuth,
    paramsValidate,
    validateComment,
    commentController.createComment
  );

  router.put(
    "/:tweetId/comments/:commentId",
    authValidator.isAuth,
    paramsValidate,
    validateComment,
    commentController.updateComment
  );

  router.delete(
    "/:tweetId/comments/:commentId",
    authValidator.isAuth,
    paramsValidate,
    commentController.deleteComment
  );

  router.put(
    "/:tweetId/comments/:commentId/good",
    authValidator.isAuth,
    paramsValidate,
    goodController.goodComment
  );

  return router;
}