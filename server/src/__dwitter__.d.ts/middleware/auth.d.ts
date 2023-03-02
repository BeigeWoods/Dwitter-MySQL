import { NextFunction, Request, Response } from "express";
import { Config } from "../config.js";
import { UserDataHandler } from "../data/auth.js";
export interface AuthValidateHandler {
  isAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
}
export default class AuthValidator implements AuthValidateHandler {
  private config;
  private userRepository;
  constructor(config: Config, userRepository: UserDataHandler);
  isAuth: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
}
