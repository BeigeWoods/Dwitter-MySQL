import { Request, Response } from "express";

export type UserForToken = {
  token: string;
  username: string;
};

export type ResorceOwner = {
  login: string;
  name: string;
  avatar_url: string;
};

export type IndexForFetchUsage = "token" | "user" | "email";

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

export default GithubOauthHandler;
