import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {} from "express-async-errors";
import { CookieOptions, Request, Response } from "express";
import { config } from "../../config.js";

export function createJwtToken(id: number) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export function setToken(res: Response, token: string) {
  const options: CookieOptions = {
    maxAge: config.jwt.expiresInSec * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  res.cookie("token", token, options); // Http-Only
}

export async function csrfToken(req: Request, res: Response) {
  const csrfToken = await generateCSRFToken();
  res.status(200).json({ csrfToken });
}

async function generateCSRFToken() {
  return bcrypt.hash(config.csrf.plainToken, 1);
}
