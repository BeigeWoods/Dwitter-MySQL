import { CookieOptions, NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Config from "../../__dwitter__.d.ts/config";
import { TokenHandler } from "../../__dwitter__.d.ts/controller/auth/token";

export default class TokenController implements TokenHandler {
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
    return res.cookie("token", token, options);
  };

  csrfToken = async (req: Request, res: Response, next: NextFunction) => {
    const csrfToken = await this.generateCSRFToken().catch((error) =>
      next(`Error! tokenController.csrfToken < ${error}`)
    );
    return res.status(200).json({ csrfToken });
  };

  generateCSRFToken = async () => {
    return await bcrypt
      .hash(this.config.csrf.plainToken, this.config.csrf.saltRounds)
      .catch((error) => {
        throw `tokenController.generateCSRFToken\n ${error}`;
      });
  };
}
