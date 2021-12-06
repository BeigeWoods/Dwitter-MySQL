import express from "express";
import {} from "express-async-errors";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import * as authController from "../controller/auth/auth.js";
import * as oauthController from "../controller/auth/oauth.js";
import { isAuth } from "../middleware/auth.js";
import * as tokenController from "../controller/auth/token.js";

const router = express.Router();

const validateCredential: Array<any> = [
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

const validateInformation: Array<any> = [
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

const validateSignup: Array<any> = [
  ...validateCredential,
  ...validateInformation,
];

const validateProfile: Array<any> = [
  body("username")
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("username should be at least 3 characters"),
  ...validateInformation,
];

const validatePassword: Array<any> = [
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

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateCredential, authController.login);

router.get("/github/start", oauthController.githubStart);

router.get("/github/finish", oauthController.githubFinish);

router.post("/logout", isAuth, authController.logout);

router.get("/csrf-token", tokenController.csrfToken);

router.get("/me", isAuth, authController.me);

router.get("/profile", isAuth, authController.getUser);

router.put("/profile", isAuth, validateProfile, authController.updateUser);

router.post(
  "/change-password",
  isAuth,
  validatePassword,
  authController.password
);

router.post("/withdrawal", isAuth, authController.withdrawal);

export default router;
