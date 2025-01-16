import { body, check, param, query } from "express-validator";
import expressValidator from "./validator.js";
import config from "../../config.js";

const about = {
  id: (title: string) => [
    param(`${title}Id`, `Invalid ${title}`)
      .notEmpty()
      .withMessage(`Invalid ${title}_0`)
      .bail()
      .trim()
      .isNumeric()
      .isInt({ allow_leading_zeroes: false, min: 1 }),
  ],
  clicked: (subtitle: string) => [
    body("clicked", `Invalid ${subtitle}`)
      .notEmpty()
      .withMessage(`Invalid ${subtitle}_0`)
      .bail()
      .exists({ values: "undefined" })
      .withMessage(`Invalid ${subtitle}_X`)
      .bail()
      .isBoolean(),
  ],
};

const content = {
  tweetId: about.id("tweet"),
  commentId: about.id("comment"),
  username: [
    query("username", "Invalid username")
      .if((value, { req }) => "username" in req.query!)
      .notEmpty()
      .withMessage("Invalid username_0")
      .bail()
      .isString()
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
      .isString()
      .bail()
      .trim()
      .isLength({ min: 2 }),
  ],
  tweetContents: [
    body("text", "Invalid text")
      .notEmpty()
      .withMessage(`Invalid text_0`)
      .bail()
      .replace([null, false], "")
      .isString()
      .bail()
      .trim(),
    body("video", "Invalid video")
      .optional({ values: "falsy" })
      .trim()
      .matches(
        /(https\:\/\/(www\.)?)?((youtube\.com\/(watch\?v\=|embed\/))|(youtu\.be\/))[a-zA-Z0-9-_]{11}/
      ),
  ],
  existingImage: [
    body("image", "Invalid image")
      .optional({ values: "falsy" })
      .trim()
      .matches(
        RegExp(
          `https:\/\/${config.awsS3.bucket}.s3.${config.awsS3.region}.amazonaws.com\/\\d{13}_`
        )
      ),
  ],
  isAllEmpty: [
    check("body").custom((value, { req }) => {
      const newImage =
        req.file && "location" in req.file ? req.file.location : false;
      if (!req.body.text && !req.body.video && !newImage)
        throw "Should provide at least one value";
      return true;
    }),
  ],
  commentContent: [
    body("text", "Invalid text")
      .notEmpty()
      .withMessage("Invalid text_0")
      .bail()
      .exists({ values: "falsy" })
      .withMessage("Invalid text_X")
      .bail()
      .trim()
      .isString()
      .bail()
      .isLength({ min: 1 })
      .withMessage("Text should be at least 1 characters"),
  ],
};

export const tweetValidator = {
  tweetId: [...content.tweetId, expressValidator],
  username: [...content.username, expressValidator],
  creation: [...content.tweetContents, ...content.isAllEmpty, expressValidator],
  update: [
    ...content.tweetId,
    ...content.tweetContents,
    ...content.existingImage,
    ...content.isAllEmpty,
    expressValidator,
  ],
  delete: [...content.tweetId, ...content.existingImage, expressValidator],
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
  tweet: [
    ...content.tweetId,
    ...about.clicked("to click good"),
    expressValidator,
  ],
  comment: [
    ...content.commentId,
    ...about.clicked("to click good"),
    expressValidator,
  ],
};
