import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";

export const expressValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  return errors.isEmpty()
    ? next()
    : res.status(400).json({ message: errors.array()[0].msg });
};
