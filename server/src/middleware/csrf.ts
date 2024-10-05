import "express-async-errors";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "../config.js";

const csrfCheck = async (req: Request, res: Response, next: NextFunction) => {
  const CSRF_ERROR = { message: "Failed CSRF check" };

  const sortOutToCheck: { [key: string]: { [key: string]: boolean } } = {
    GET: { "/profile": true, "/me": true },
    OPTIONS: {},
    HEAD: {},
  };

  if (sortOutToCheck[req.method] && !sortOutToCheck[req.method][req.path])
    return next();

  const csrfHeader = req.get("dwitter_csrf-token");
  if (!csrfHeader) {
    console.warn(
      "csrfCheck : ",
      "Missing required 'dwitter_csrf-token' header\n ",
      req.headers.origin
    );
    return res.status(403).json(CSRF_ERROR);
  }

  return await validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          "validateCsrfToken > csrfCheck : ",
          "The value of 'dwitter_csrf-token' doesn't validate\n ",
          `- request origin : ${req.headers.origin}\n `,
          `- dwitter_csrf-token : ${csrfHeader}`
        );
        return res.status(403).json(CSRF_ERROR);
      }
      next();
    })
    .catch((e) => {
      e.name += " > validateCsrfToken > csrfCheck";
      throw e;
    });
};

async function validateCsrfToken(csrfHeader: string) {
  return await bcrypt.compare(config.csrf.plainToken, csrfHeader);
}

export default csrfCheck;
