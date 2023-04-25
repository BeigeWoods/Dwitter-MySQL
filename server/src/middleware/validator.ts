import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import { Validate } from "../__dwitter__.d.ts/middleware/validator";

export const expressValidate: Validate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

export const tweetFormDataValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const urlRegex =
    /((?:\bhttp(?:s)?\b\:\/\/)?(?:\bwww\b\.)?(?:\byoutube\b\.\bcom\b\/(?:\bwatch\b\?v\=|\bembed\b\/))\b[a-zA-Z0-9-_]{11}\b)|((?:\bhttp(?:s)?\b\:\/\/)?(?:\bwww\b\.)?(?:\byoutu\b\.\bbe\b\/\b)\b[a-zA-Z0-9-_]{11}\b)/;
  // const image = req.file?.path;
  const image = req.file?.location;
  const { text, video }: { text?: string; video?: string } = req.body;
  if (!text && !image && !video) {
    return res.status(400).json({ message: "Invalid value(s)" });
  }
  if (video && !video?.match(urlRegex)) {
    return res.status(400).json({ message: "Invalid url" });
  }
  next();
};

export const paramsValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, main } = req.params;
  const isComment = req.path.includes("comments");
  if (isComment && (req.method === "PUT" || req.method === "DELETE")) {
    if (!main || main === "undefined") {
      return res
        .status(404)
        .json({ message: `Bad ${isComment ? "comment" : "tweet"} id` });
    }
  }
  if (!id || id === "undefined") {
    return res
      .status(404)
      .json({ message: `Bad ${isComment ? "comment" : "tweet"} id` });
  }
  return next();
};
