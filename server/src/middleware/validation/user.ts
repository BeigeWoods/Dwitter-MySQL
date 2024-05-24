import { body } from "express-validator";
import { expressValidator } from "./validator";

const user = {
  username: [
    body("username", "Invaild username")
      .notEmpty()
      .withMessage("Invalid username_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid username_X")
      .bail()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Username should be at least 2 characters"),
  ],
  password: [
    body("password", "Invaild password")
      .notEmpty()
      .withMessage("Invalid password_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid password_X")
      .bail()
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password should be at least 4 characters"),
  ],
  userContents: [
    body("name", "Invalid name")
      .notEmpty()
      .withMessage("Invalid name_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid name_X")
      .bail()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Password should be at least 2 characters"),
    body("email", "Invaild email")
      .notEmpty()
      .withMessage("Invalid email_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid email_X")
      .bail()
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("url", "Invalid profile image url")
      .trim()
      .isURL()
      .optional({ values: "falsy" }),
  ],
  passwordContents: [
    body("newPassword", "Invalid new password")
      .notEmpty()
      .withMessage("Invalid new password_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid new password_X")
      .bail()
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password should be at least 4 characters"),
    body("checkPassword", "Invalid check password")
      .notEmpty()
      .withMessage("Invalid check password_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid check password_X")
      .bail()
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password should be at least 4 characters"),
  ],
};

export const userValidator = {
  signUp: [
    ...user.username,
    ...user.password,
    ...user.userContents,
    expressValidator,
  ],
  login: [...user.username, ...user.password, expressValidator],
  updateUser: [...user.username, ...user.userContents, expressValidator],
  updatePassword: [
    ...user.password,
    ...user.passwordContents,
    expressValidator,
  ],
};
