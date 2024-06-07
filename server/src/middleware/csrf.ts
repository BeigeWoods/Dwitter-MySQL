import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "../config.js";

export const csrfCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const CSRF_ERROR = { message: "Failed CSRF check" };

  if (
    (req.method === "GET" && req.path !== "/profile") ||
    req.method === "OPTIONS" ||
    req.method === "HEAD"
  ) {
    return next();
  }

  const csrfHeader = req.get("dwitter_csrf-token");
  if (!csrfHeader) {
    console.warn(
      'Missing required "dwitter_csrf-token" header : ',
      req.headers.origin
    );
    return res.status(403).json(CSRF_ERROR);
  }

  return await validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          `Value provided in 'dwitter_csrf-token' header doesn't validate.\n
          - request origin : ${req.headers.origin}\n
          - dwitter_csrf-token : ${csrfHeader}`
        );
        return res.status(403).json(CSRF_ERROR);
      }
      next();
    })
    .catch((error) => {
      console.error('The problem of validating "dwitter_csrf-token"\n', error);
      return next(error);
    });
};

async function validateCsrfToken(csrfHeader: string) {
  return await bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
