import { body, check } from "express-validator";
import expressValidator from "./validator.js";

const about = {
  name: (title: string) => [
    body(title, `Invaild ${title}`)
      .notEmpty()
      .withMessage(`Invalid ${title}_0`)
      .bail()
      .exists({ values: "falsy" })
      .withMessage(`Invalid ${title}_X`)
      .bail()
      .isString()
      .bail()
      .trim()
      .isLength({ min: 2 })
      .withMessage(`${title} should be at least 2 characters`),
  ],
  password: (title: string, subtitle = title) => [
    body(title, `Invaild ${subtitle}`)
      .notEmpty()
      .withMessage(`Invalid ${subtitle}_0`)
      .bail()
      .exists({ values: "falsy" })
      .withMessage(`Invalid ${subtitle}_X`)
      .bail()
      .isString()
      .bail()
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password should be at least 4 characters"),
  ],
  nameToUpdate: (title: string) => [
    body(title, `Invaild ${title}`)
      .notEmpty()
      .withMessage(`Invalid ${title}_0`)
      .bail()
      .replace([null, false], "")
      .isString()
      .bail()
      .trim()
      .isLength({ min: 2 })
      .withMessage(`${title} should be at least 2 characters`),
  ],
};

const user = {
  username: about.name("username"),
  password: about.password("password"),
  userForSignup: [
    ...about.name("name"),
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
  ],
  userForUpdate: [
    ...about.nameToUpdate("username"),
    ...about.nameToUpdate("name"),
    body("email", "Invaild email")
      .notEmpty()
      .withMessage("Invalid email_0")
      .bail()
      .replace([null, false], "")
      .trim()
      .isEmail()
      .normalizeEmail(),
  ],
  avatarUrl: [
    body("url", "Invalid profile image url")
      .notEmpty()
      .withMessage("Invalid url_0")
      .bail()
      .replace([null, false], "")
      .trim()
      .isURL(),
  ],
  isAllEmpty: [
    check("body").custom((value, { req }) => {
      if (
        !req.body.username &&
        !req.body.name &&
        !req.body.email &&
        !req.body.url
      )
        throw "Should provide at least one value";
      return true;
    }),
  ],
  passwordContents: [
    ...about.password("newPassword", "new password"),
    ...about.password("checkPassword", "check password"),
  ],
};

const userValidator = {
  signUp: [
    ...user.username,
    ...user.password,
    ...user.userForSignup,
    ...user.avatarUrl,
    expressValidator,
  ],
  login: [...user.username, ...user.password, expressValidator],
  updateUser: [
    ...user.userForUpdate,
    ...user.avatarUrl,
    ...user.isAllEmpty,
    expressValidator,
  ],
  updatePassword: [
    ...user.password,
    ...user.passwordContents,
    expressValidator,
  ],
};

export default userValidator;
