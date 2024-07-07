import express from "express";
import "express-async-errors";
import userValidator from "../middleware/validation/user.js";
import AuthValidateHandler from "../__dwitter__.d.ts/middleware/auth";
import TokenHandler from "../__dwitter__.d.ts/controller/auth/token";
import AuthDataHandler from "../__dwitter__.d.ts/controller/auth/auth";
import GithubOauthHandler from "../__dwitter__.d.ts/controller/auth/oauth";

export default function authRouter(
  authValidator: AuthValidateHandler,
  authController: AuthDataHandler,
  oauthController: GithubOauthHandler,
  tokenController: TokenHandler
) {
  const router = express.Router();

  router.post("/signup", userValidator.signUp, authController.signup);

  router.post("/login", userValidator.login, authController.login);

  router.get("/o-github/start", oauthController.githubStart);

  router.get("/o-github/finish", oauthController.githubFinish);

  router.post("/logout", authValidator.isAuth, authController.logout);

  router.get("/csrf-token", tokenController.csrfToken);

  router.get("/me", authValidator.isAuth, authController.me);

  router.get("/profile", authValidator.isAuth, authController.getUser);

  router.put(
    "/profile",
    authValidator.isAuth,
    userValidator.updateUser,
    authController.updateUser
  );

  router.post(
    "/change-password",
    authValidator.isAuth,
    userValidator.updatePassword,
    authController.updatePassword
  );

  router.post("/withdrawal", authValidator.isAuth, authController.withdrawal);

  return router;
}
