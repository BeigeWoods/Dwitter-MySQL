import { NextFunction, Request, Response } from "express";
import { Config } from "../config";
import { UserDataHandler } from "../data/user";

export declare interface AuthValidateHandler {
  isAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
}

export declare class AuthValidator implements AuthValidateHandler {
  private config;
  private userRepository;

  constructor(config: Config, userRepository: UserDataHandler);

  isAuth: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
}
