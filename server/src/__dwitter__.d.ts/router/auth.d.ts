import express from "express";
import { AuthValidateHandler } from "../middleware/auth.js";
import { AuthDataHandler } from "../controller/auth/auth.js";
import { GithubOauth } from "../controller/auth/oauth.js";
import { TokenHandler } from "../controller/auth/token.js";
export default function authRouter(authValidator: AuthValidateHandler, authController: AuthDataHandler, oauthController: GithubOauth, tokenController: TokenHandler): express.IRouter;
