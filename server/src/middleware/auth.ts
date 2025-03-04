import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Config from "../__dwitter__.d.ts/config";
import AuthValidateHandler from "../__dwitter__.d.ts/middleware/auth";
import UserDataHandler from "../__dwitter__.d.ts/data/user";

export default class AuthValidator implements AuthValidateHandler {
  private readonly AUTH_ERROR = { message: "Authentication Error" };
  constructor(
    private readonly config: Config,
    private userRepository: UserDataHandler
  ) {}
  isAuth = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer "))
      token = authHeader.split(" ")[1];

    if (!token) token = req.cookies["token"];

    if (!token) return res.status(401).json(this.AUTH_ERROR);

    jwt.verify(token, this.config.jwt.secretKey, async (e, decoded) => {
      if (e) {
        e.name += " > authValidator.isAuth";
        console.error(e);
        return res.status(401).json(this.AUTH_ERROR);
      }

      const user = await this.userRepository.findById(decoded!.id);
      if (!user) return res.status(401).json(this.AUTH_ERROR);

      req.user = user;
      req.token = token;
      next();
    });
  };
}
