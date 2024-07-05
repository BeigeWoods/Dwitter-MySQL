import { body, check } from "express-validator";
import expressValidator from "./validator.js";

const about = {
  name: (title: string, capital: string) => [
    body(title, `Invaild ${title}`)
      .notEmpty()
      .withMessage(`Invalid ${title}_0`)
      .bail()
      .exists({ values: "falsy" })
      .withMessage(`Invalid ${title}_X`)
      .bail()
      .trim()
      .isString()
      .bail()
      .isLength({ min: 2 })
      .withMessage(`${capital} should be at least 2 characters`),
  ],
  password: (title: string, subtitle = title) => [
    body(title, `Invaild ${subtitle}`)
      .notEmpty()
      .withMessage(`Invalid ${subtitle}_0`)
      .bail()
      .exists({ values: "falsy" })
      .withMessage(`Invalid ${subtitle}_X`)
      .bail()
      .trim()
      .isString()
      .bail()
      .isLength({ min: 4 })
      .withMessage("Password should be at least 4 characters"),
  ],
  nameOfProfile: (title: string, capital: string) => [
    body(title, `Invaild ${title}`)
      .optional({ values: "falsy" })
      .trim()
      .isString()
      .bail()
      .isLength({ min: 2 })
      .withMessage(`${capital} should be at least 2 characters`),
  ],
};

const user = {
  username: about.name("username", "Username"),
  password: about.password("password"),
  userContents: [
    ...about.name("name", "Name"),
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
  profileContents: [
    ...about.nameOfProfile("username", "Username"),
    ...about.nameOfProfile("name", "Name"),
    body("email", "Invaild email")
      .optional({ values: "falsy" })
      .trim()
      .isEmail()
      .normalizeEmail(),
  ],
  avatarUrl: [
    body("url", "Invalid profile image url")
      .optional({ values: "falsy" })
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
    ...user.userContents,
    ...user.avatarUrl,
    expressValidator,
  ],
  login: [...user.username, ...user.password, expressValidator],
  updateUser: [
    ...user.profileContents,
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
