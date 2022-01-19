import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";

export type Validate = {
  (req: Request, res: Response, next: NextFunction): void | Response<
    any,
    Record<string, any>
  >;
};

export const validate: Validate = (
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
