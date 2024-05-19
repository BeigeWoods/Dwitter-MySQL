import express from "express";
import { AuthValidateHandler } from "../middleware/auth";
import { AuthDataHandler } from "../controller/auth/auth";
import { GithubOauth } from "../controller/auth/oauth";
import { TokenHandler } from "../controller/auth/token";
export default function authRouter(
  authValidator: AuthValidateHandler,
  authController: AuthDataHandler,
  oauthController: GithubOauth,
  tokenController: TokenHandler
): express.IRouter;
