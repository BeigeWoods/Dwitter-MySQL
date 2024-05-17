import { NextFunction, Request, Response } from "express";
import { Config } from "../../config";
import { TokenHandler } from "./token";
import { UserDataHandler } from "../../data/user";

export type SendTinyUserInfo = {
  token: string;
  username: string;
};

export declare interface GithubOauth {
  githubLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | void>;
}

export declare class OauthController implements GithubOauth {
  private config;
  private tokenController;
  private userRepository;

  constructor(
    config: Config,
    tokenController: TokenHandler,
    userRepository: UserDataHandler
  );

  private signIn(
    userData: any,
    emailData: any
  ): Promise<SendTinyUserInfo | undefined>;
  protected getUserData(githubToken: unknown): Promise<unknown[]>;
  protected getToken(code: string): Promise<{}>;

  githubLogin: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>;
}
