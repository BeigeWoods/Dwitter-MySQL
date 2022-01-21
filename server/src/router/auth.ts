import express from "express";
import {} from "express-async-errors";
import { body, ValidationChain } from "express-validator";
import { Validate, validate } from "../middleware/validator.js";
import { AuthValidateHandler } from "../middleware/auth.js";
import { AuthDataHandler } from "../controller/auth/auth.js";
import { GithubOauth } from "../controller/auth/oauth.js";
import { TokenHandler } from "../controller/auth/token.js";

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
  validate,
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
  validate,
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
  validate,
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
    authController.password
  );

  router.post("/withdrawal", authValidator.isAuth, authController.withdrawal);

  return router;
}
