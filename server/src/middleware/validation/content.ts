import { body, check, param, query } from "express-validator";
import { expressValidator } from "./validator";

const content = {
  tweetId: [
    param("tweetId", "Invalid tweet")
      .notEmpty()
      .withMessage("Invalid tweet_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid tweet_X")
      .bail()
      .trim()
      .isNumeric(),
  ],
  commentId: [
    param("commentId", "Invalid comment")
      .notEmpty()
      .withMessage("Invalid comment_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid comment_X")
      .bail()
      .trim()
      .isNumeric(),
  ],
  username: [
    query("username", "Invalid username")
      .if((value, { req }) => "username" in req.query!)
      .notEmpty()
      .withMessage("Invalid username_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid username_X")
      .bail()
      .trim()
      .isLength({ min: 2 }),
  ],
  recipient: [
    body("recipient", "Invalid reply")
      .if((value, { req }) => "recipient" in req.body!)
      .notEmpty()
      .withMessage("Invalid reply_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid reply_X")
      .bail()
      .trim()
      .isLength({ min: 2 }),
  ],
  tweetContents: [
    body("text", "Invalid text")
      .optional({ values: "falsy" })
      .trim()
      .isLength({ min: 1 })
      .withMessage("Text should be at least 1 characters"),
    body("video", "Invalid video")
      .optional({ values: "falsy" })
      .trim()
      .matches(
        /((?:\bhttp(?:s)?\b\:\/\/)?(?:\bwww\b\.)?(?:\byoutube\b\.\bcom\b\/(?:\bwatch\b\?v\=|\bembed\b\/))\b[a-zA-Z0-9-_]{11}\b)|((?:\bhttp(?:s)?\b\:\/\/)?(?:\bwww\b\.)?(?:\byoutu\b\.\bbe\b\/\b)\b[a-zA-Z0-9-_]{11}\b)/
      )
      .withMessage("Invalid youtube video url"),
  ],
  commentContent: [
    body("text", "Invalid text")
      .notEmpty()
      .withMessage("Invalid text_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid text_X")
      .bail()
      .isString()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Text should be at least 1 characters"),
  ],
  isAllEmpty: [
    check("body").custom((value, { req }) => {
      const image =
        req.file && "location" in req.file ? req.file.location : false;
      if (!req.body.text && !req.body.video && !image) {
        throw new Error("Should provide at least one value");
      }
      return true;
    }),
  ],
  aboutGood: [
    body("clicked", "Invalid click about good")
      .notEmpty()
      .withMessage("Invalid click about good_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid click about good_X")
      .bail()
      .trim()
      .isBoolean(),
    body("good", "Invalid good")
      .notEmpty()
      .withMessage("Invalid good_0")
      .bail()
      .exists({ values: "null" })
      .withMessage("Invalid good_X")
      .bail()
      .trim()
      .isNumeric(),
  ],
};

export const tweetValidator = {
  tweetId: [...content.tweetId, expressValidator],
  username: [...content.username, expressValidator],
  creation: [...content.tweetContents, ...content.isAllEmpty, expressValidator],
  update: [
    ...content.tweetId,
    ...content.tweetContents,
    ...content.isAllEmpty,
    expressValidator,
  ],
};

export const commentValidator = {
  tweetId: [...content.tweetId, expressValidator],
  commentId: [...content.commentId, expressValidator],
  creation: [
    ...content.tweetId,
    ...content.recipient,
    ...content.commentContent,
    expressValidator,
  ],
  update: [
    ...content.tweetId,
    ...content.commentId,
    ...content.commentContent,
    expressValidator,
  ],
};

export const goodValidator = {
  tweet: [...content.tweetId, ...content.aboutGood, expressValidator],
  comment: [...content.commentId, ...content.aboutGood, expressValidator],
};
