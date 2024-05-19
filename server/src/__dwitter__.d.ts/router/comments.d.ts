import express from "express";
import "express-async-errors";
import { AuthValidateHandler } from "../middleware/auth";
import { CommentHandler } from "../controller/comments";
export default function commentsRouter(
  authValidator: AuthValidateHandler,
  commentController: CommentHandler
): express.IRouter;
