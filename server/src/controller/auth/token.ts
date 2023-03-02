import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {} from "express-async-errors";
import { CookieOptions, Request, Response } from "express";
import { Config } from "../../__dwitter__.d.ts/config";
import { TokenHandler } from "../../__dwitter__.d.ts/controller/auth/token";

export default class TokenRepository implements TokenHandler {
  constructor(private config: Config) {}

  createJwtToken = (id: number) => {
    return jwt.sign({ id }, this.config.jwt.secretKey, {
      expiresIn: this.config.jwt.expiresInSec,
    });
  };

  setToken = (res: Response, token: string) => {
    const options: CookieOptions = {
      maxAge: this.config.jwt.expiresInSec * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
    res.cookie("token", token, options); // Http-Only
  };

  csrfToken = async (req: Request, res: Response) => {
    const csrfToken = await this.generateCSRFToken();
    res.status(200).json({ csrfToken });
  };

  generateCSRFToken = async () => {
    return bcrypt.hash(this.config.csrf.plainToken, 1);
  };
}
