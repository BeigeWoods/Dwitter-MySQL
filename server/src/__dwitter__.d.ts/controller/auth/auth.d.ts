import { Request, Response } from "express";
import Config from "../../config";
import UserDataHandler from "../../data/user";
import TokenHandler from "./token";

declare interface AuthHandler {
  signup(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  login(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
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
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  updatePassword(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  withdrawal(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
}

export declare class AuthController implements AuthHandler {
  private readonly config;
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
  signup: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  login: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
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
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  updatePassword: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  withdrawal: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
}

export default AuthHandler;
