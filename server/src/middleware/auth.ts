import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Config } from "../__dwitter__.d.ts/config.js";
import { UserDataHandler } from "../__dwitter__.d.ts/data/auth.js";
import { AuthValidateHandler } from "../__dwitter__.d.ts/middleware/auth.js";

const AUTH_ERROR = { message: "Authentication Error" };

export default class AuthValidator implements AuthValidateHandler {
  constructor(
    private config: Config,
    private userRepository: UserDataHandler
  ) {}
  isAuth = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      token = req.cookies["token"];
    }

    if (!token) {
      return res.status(401).json(AUTH_ERROR);
    }

    jwt.verify(token, this.config.jwt.secretKey, async (error, decoded) => {
      if (error) {
        console.error("The problem of verifying jwt token\n", error);
        return res.status(401).json(AUTH_ERROR);
      }
      const user = await this.userRepository.findById(decoded!.id);
      if (!user) {
        return res.status(401).json(AUTH_ERROR);
      }
      req.userId = user.id;
      req.token = token;
      next();
    });
  };
}
