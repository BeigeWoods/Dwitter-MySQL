import { NextFunction, Request, Response } from "express";
import { Config } from "../../config.js";
import { UserDataHandler } from "../../data/auth.js";
import { TokenHandler } from "./token.js";
export interface AuthDataHandler {
  signup(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  login(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  me(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  getUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  updateUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  updatePassword(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  withdrawal(req: Request, res: Response): Promise<void>;
}
export default class AuthController implements AuthDataHandler {
  private config;
  private userRepository;
  private tokenController;
  constructor(
    config: Config,
    userRepository: UserDataHandler,
    tokenController: TokenHandler
  );
  signup: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  login: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
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
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  updatePassword: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  withdrawal: (req: Request, res: Response) => Promise<void>;
}
