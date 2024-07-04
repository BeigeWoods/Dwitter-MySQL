import { body, check, param, query } from "express-validator";
import expressValidator from "./validator.js";
import config from "../../config.js";

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
      .isNumeric()
      .isInt({ allow_leading_zeroes: false, min: 1 }),
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
      .isNumeric()
      .isInt({ allow_leading_zeroes: false, min: 1 }),
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
      .isString()
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
      .isString()
      .isLength({ min: 2 }),
  ],
  tweetContents: [
    body("text", "Invalid text")
      .optional({ values: "falsy" })
      .default("")
      .trim()
      .isString()
      .bail()
      .isLength({ min: 1 })
      .withMessage("Text should be at least 1 characters"),
    body("video", "Invalid video")
      .optional({ values: "falsy" })
      .default("")
      .trim()
      .matches(
        /(https\:\/\/(www\.)?)?((youtube\.com\/(watch\?v\=|embed\/))|(youtu\.be\/))[a-zA-Z0-9-_]{11}/
      )
      .withMessage("Invalid youtube video url"),
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
  isAllEmpty: [
    check("body").custom((value, { req }) => {
      const newImage =
        req.file && "location" in req.file ? req.file.location : false;
      if (!req.body.text && !req.body.video && !newImage)
        throw "Should provide at least one value";
      return true;
    }),
  ],
  aboutGood: [
    body("clicked", "Invalid to click good")
      .notEmpty()
      .withMessage("Invalid to click good_0")
      .bail()
      .exists({ values: "null" })
      .withMessage("Invalid to click good_X")
      .bail()
      .trim()
      .isNumeric()
      .isInt({ allow_leading_zeroes: true, min: 0 }),
    body("good", "Invalid good")
      .notEmpty()
      .withMessage("Invalid good_0")
      .bail()
      .exists({ values: "null" })
      .withMessage("Invalid good_X")
      .bail()
      .trim()
      .isNumeric()
      .isInt({ allow_leading_zeroes: true, min: 0 }),
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
  tweet: [...content.tweetId, ...content.aboutGood, expressValidator],
  comment: [...content.commentId, ...content.aboutGood, expressValidator],
};
