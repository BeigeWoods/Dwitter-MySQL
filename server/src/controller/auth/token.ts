import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {} from "express-async-errors";
import { CookieOptions, Request, Response } from "express";
import { Config } from "../../config";

export interface TokenHandler {
  createJwtToken(id: number): string;
  setToken(res: Response, token: string): void;
  csrfToken(req: Request, res: Response): Promise<void>;
  generateCSRFToken(): Promise<string>;
}

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
