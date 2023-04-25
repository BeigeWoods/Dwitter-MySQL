import express from "express";
import "express-async-errors";
import { AuthValidateHandler } from "../middleware/auth.js";
import { CommentHandler } from "../controller/comments.js";
export default function commentsRouter(
  authValidator: AuthValidateHandler,
  commentController: CommentHandler
): express.IRouter;
