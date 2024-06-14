import "express-async-errors";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "../config.js";

const csrfCheck = async (req: Request, res: Response, next: NextFunction) => {
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
      'Warn! csrfCheck\n missing required "dwitter_csrf-token" header : ',
      req.headers.origin
    );
    return res.status(403).json(CSRF_ERROR);
  }

  return await validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          `Warn! csrfCheck < validateCsrfToken\n 
          the value of 'dwitter_csrf-token' doesn't validate.\n
          - request origin : ${req.headers.origin}\n
          - dwitter_csrf-token : ${csrfHeader}`
        );
        return res.status(403).json(CSRF_ERROR);
      }
      next();
    })
    .catch((error) => {
      throw `Error! csrfCheck < validateCsrfToken\n
        ${error}`;
    });
};

async function validateCsrfToken(csrfHeader: string) {
  return await bcrypt.compare(config.csrf.plainToken, csrfHeader);
}

export default csrfCheck;
