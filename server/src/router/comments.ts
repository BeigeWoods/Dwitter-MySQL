import express from "express";
import "express-async-errors";
import {
  commentValidator,
  goodValidator,
} from "../middleware/validation/content.js";
import AuthValidateHandler from "../__dwitter__.d.ts/middleware/auth";
import CommentHandler from "../__dwitter__.d.ts/controller/comments";
import GoodHandler from "../__dwitter__.d.ts/controller/good";

export default function commentsRouter(
  authValidator: AuthValidateHandler,
  commentController: CommentHandler,
  goodController: GoodHandler
) {
  const router = express.Router();

  router.get(
    "/:tweetId/comments",
    authValidator.isAuth,
    commentValidator.tweetId,
    commentController.getComments
  );

  router.post(
    "/:tweetId/comments",
    authValidator.isAuth,
    commentValidator.creation,
    commentController.createComment
  );

  router.put(
    "/:tweetId/comments/:commentId",
    authValidator.isAuth,
    commentValidator.update,
    commentController.updateComment
  );

  router.delete(
    "/:tweetId/comments/:commentId",
    authValidator.isAuth,
    commentValidator.commentId,
    commentController.deleteComment
  );

  router.put(
    "/:tweetId/comments/:commentId/good",
    authValidator.isAuth,
    goodValidator.comment,
    goodController.goodComment
  );

  return router;
}
