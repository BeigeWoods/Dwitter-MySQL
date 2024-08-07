import { NextFunction, Request, Response } from "express";
import Config from "../config";
import UserDataHandler from "../data/user";

declare interface AuthValidateHandler {
  isAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
}

export declare class AuthValidator implements AuthValidateHandler {
  private readonly AUTH_ERROR: { message: string };
  private readonly config;
  private userRepository;

  constructor(config: Config, userRepository: UserDataHandler);

  isAuth: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
}

export default AuthValidateHandler;
