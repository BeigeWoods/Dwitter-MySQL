import { NextFunction, Request, Response } from "express";
import { Config } from "../../config";
import { UserDataHandler } from "../../data/user";
import { TokenHandler } from "./token";

export declare interface AuthDataHandler {
  signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
  login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
  logout(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  me(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
  getUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
  updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
  withdrawal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction | void>;
}

export declare class AuthController implements AuthDataHandler {
  private config;
  private userRepository;
  private tokenController;

  constructor(
    config: Config,
    userRepository: UserDataHandler,
    tokenController: TokenHandler
  );

  private isDuplicateEmailOrUsername(
    email: string,
    username: string
  ): Promise<string | number>;
  signUp: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
  login: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
  logout: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  me: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  getUser: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  updateUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
  updatePassword: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
  withdrawal: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction | void>;
}
