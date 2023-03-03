import express from "express";
import {} from "express-async-errors";
import { body, ValidationChain } from "express-validator";
import { expressValidate } from "../middleware/validator.js";
import { Validate } from "../__dwitter__.d.ts/middleware/validator.js";
import { AuthValidateHandler } from "../__dwitter__.d.ts/middleware/auth.js";
import { TokenHandler } from "../__dwitter__.d.ts/controller/auth/token.js";
import { AuthDataHandler } from "../__dwitter__.d.ts/controller/auth/auth.js";
import { GithubOauth } from "../__dwitter__.d.ts/controller/auth/oauth.js";

const validateCredential: Array<ValidationChain | Validate> = [
  body("username")
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("username should be at least 3 characters"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("password should be at least 8 characters"),
  expressValidate,
];

const validateInformation: Array<ValidationChain | Validate> = [
  body("name").notEmpty().withMessage("name is missing"),
  body("email")
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
  expressValidate,
];

const validateSignup: Array<ValidationChain | Validate> = [
  ...validateCredential,
  ...validateInformation,
];

const validateProfile: Array<ValidationChain | Validate> = [
  body("username")
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("username should be at least 3 characters"),
  ...validateInformation,
];

const validatePassword: Array<ValidationChain | Validate> = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("password should be at least 8 characters"),
  body("newPassword")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("password should be at least 8 characters"),
  body("checkPassword")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("password should be at least 8 characters"),
  expressValidate,
];

export default function authRouter(
  authValidator: AuthValidateHandler,
  authController: AuthDataHandler,
  oauthController: GithubOauth,
  tokenController: TokenHandler
): express.IRouter {
  const router = express.Router();

  router.post("/signup", validateSignup, authController.signup);

  router.post("/login", validateCredential, authController.login);

  router.get("/github/start", oauthController.githubStart);

  router.get("/github/finish", oauthController.githubFinish);

  router.post("/logout", authValidator.isAuth, authController.logout);

  router.get("/csrf-token", tokenController.csrfToken);

  router.get("/me", authValidator.isAuth, authController.me);

  router.get("/profile", authValidator.isAuth, authController.getUser);

  router.put(
    "/profile",
    authValidator.isAuth,
    validateProfile,
    authController.updateUser
  );

  router.post(
    "/change-password",
    authValidator.isAuth,
    validatePassword,
    authController.updatePassword
  );

  router.post("/withdrawal", authValidator.isAuth, authController.withdrawal);

  return router;
}
