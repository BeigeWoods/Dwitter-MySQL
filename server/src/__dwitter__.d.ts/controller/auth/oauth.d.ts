import { Request, Response } from "express";
import Config from "../../config";
import TokenHandler from "./token";
import { UserDataHandler } from "../../data/user";

export type UserForToken = {
  token: string;
  username: string;
};

declare interface GithubOauthHandler {
  githubStart(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  githubFinish(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
}

export declare class OauthController implements GithubOauthHandler {
  private readonly config;
  private tokenController;
  private userRepository;

  constructor(
    config: Config,
    tokenController: TokenHandler,
    userRepository: UserDataHandler
  );

  private setErrorMessage(res: Response): Response<any, Record<string, any>>;
  private fetch(
    index: "token" | "user" | "email",
    url: string,
    reqOption: object
  ): Promise<unknown>;
  private signup(
    owner: any,
    email: any,
    exist: boolean
  ): Promise<UserForToken | void>;
  private login(owner: any, email: any): Promise<UserForToken | void>;
  protected getUser(githubToken: string): Promise<unknown[] | void>;
  protected getToken(code: string): Promise<string | void>;
  githubStart: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
  githubFinish: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
}

export default GithubOauthHandler;
