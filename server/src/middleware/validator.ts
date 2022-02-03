import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";

export type Validate = {
  (req: Request, res: Response, next: NextFunction): void | Response<
    any,
    Record<string, any>
  >;
};

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
  const image = req.file?.path;
  const { text, video }: { text?: string; video?: string } = req.body;
  if (!text && !image && !video) {
    return res.status(400).json({ message: "Invalid value(s)" });
  }
  if (video && !video?.match(urlRegex)) {
    return res.status(400).json({ message: "Invalid url" });
  }
  next();
};
