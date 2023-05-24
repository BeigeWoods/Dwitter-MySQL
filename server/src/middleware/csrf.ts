import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { config } from "../config.js";

export const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
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
      'Missing required "dwitter_csrf-token" header.',
      req.headers.origin
    );
    return res.status(403).json({ message: "Failed CSRF check" });
  }

  validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          'Value provided in "dwitter_csrf-token" header does not validate.\n',
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: "Failed CSRF check" });
      }
      next();
    })
    .catch((err) => {
      console.error('The problem of validating "dwitter_csrf-token"\n', err);
      return res.status(500).json({ message: "Something went wrong" });
    });
};

async function validateCsrfToken(csrfHeader: string): Promise<boolean> {
  return await bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
