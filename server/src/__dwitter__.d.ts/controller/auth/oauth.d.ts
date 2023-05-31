import { Request, Response } from "express";
import { Config } from "../../config.js";
import { TokenHandler } from "./token.js";
import { UserDataHandler } from "../../data/auth.js";
export interface GithubOauth {
  githubLogin(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
}
export type UserData = {
  token: string;
  username: string;
};
export default class OauthController implements GithubOauth {
  private config;
  private tokenController;
  private userRepository;
  constructor(
    config: Config,
    tokenController: TokenHandler,
    userRepository: UserDataHandler
  );
  private setUser(givenToken: string): Promise<UserData>;
  githubLogin: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>;
}
