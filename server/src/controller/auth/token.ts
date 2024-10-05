import { CookieOptions, NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExceptionHandler from "../../exception/exception.js";
import Config from "../../__dwitter__.d.ts/config";
import TokenHandler from "../../__dwitter__.d.ts/controller/auth/token";
import { KindOfController } from "../../__dwitter__.d.ts/exception/exception.js";

export default class TokenController implements TokenHandler {
  constructor(
    private readonly config: Config,
    private readonly exc: ExceptionHandler<KindOfController, keyof TokenHandler>
  ) {}

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
    const csrfToken = await bcrypt
      .hash(this.config.csrf.plainToken, this.config.csrf.saltRounds)
      .catch((e) => next(this.exc.setup(e, "csrfToken")));
    return res.status(200).json({ csrfToken });
  };
}
