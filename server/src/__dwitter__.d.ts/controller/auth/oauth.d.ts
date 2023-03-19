import { Request, Response } from "express";
import { Config } from "../../config.js";
import { TokenHandler } from "./token.js";
import { UserDataHandler } from "../../data/auth.js";
export interface GithubOauth {
  githubStart(req: Request, res: Response): Promise<void>;
  githubFinish(req: Request, res: Response): Promise<void>;
}
export default class OauthController implements GithubOauth {
  private config;
  private tokenController;
  private userRepository;
  constructor(
    config: Config,
    tokenController: TokenHandler,
    userRepository: UserDataHandler
  );
  githubStart: (req: Request, res: Response) => Promise<void>;
  private setUser;
  githubFinish: (req: Request, res: Response) => Promise<void>;
}
