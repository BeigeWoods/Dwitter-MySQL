import {} from "express-async-errors";
import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import { TokenHandler } from "../../__dwitter__.d.ts/controller/auth/token";
import {
  OutputUserInfo,
  UserDataHandler,
} from "../../__dwitter__.d.ts/data/user";
import { GithubOauth } from "../../__dwitter__.d.ts/controller/auth/oauth";
import { Config } from "../../__dwitter__.d.ts/config";

export default class OauthController implements GithubOauth {
  constructor(
    private config: Config,
    private tokenController: TokenHandler,
    private userRepository: UserDataHandler
  ) {}

  private signIn = async (
    userData: any,
    emailData: any
  ): Promise<{ token: string; username: string } | undefined> => {
    const user = await this.userRepository.findByUserEmail(emailData[0].email);
    switch (typeof user) {
      case "number":
        return;
      case "undefined":
        const userId = await this.userRepository.createUser({
          username: userData!.login,
          password: "",
          name: userData!.name,
          email: emailData[0].email,
          url: userData!.avatar_url,
          socialLogin: true,
        });
        return userId
          ? {
              token: this.tokenController.createJwtToken(userId),
              username: userData!.login as string,
            }
          : undefined;
    }
    return {
      token: this.tokenController.createJwtToken(
        (user as OutputUserInfo).userId
      ),
      username: (user as OutputUserInfo).username,
    };
  };

  protected getUserData = async (givenToken: unknown) => {
    const apiUrl = "https://api.github.com";
    return [
      await (
        await fetch(`${apiUrl}/user`, {
          headers: {
            Authorization: `token ${givenToken}`,
          },
        })
      ).json(),
      await (
        await fetch(`${apiUrl}/user/emails`, {
          headers: {
            Authorization: `token ${givenToken}`,
          },
        })
      ).json(),
    ];
  };

  protected getToken = async (code: string): Promise<{}> => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const option = {
      client_id: this.config.ghOauth.clientId,
      client_secret: this.config.ghOauth.clientSecret,
      code,
    };
    const params = new URLSearchParams(option).toString();
    const finalUrl = `${baseUrl}?${params}`;

    return (await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
    ).json()) as {};
  };

  githubLogin = async (req: Request, res: Response, next: NextFunction) => {
    const tokenReq = await this.getToken(req.body.code as string);
    if (!("access_token" in tokenReq)) {
      console.warn("failed Github login : Get token\n", tokenReq);
      return res.status(409).json({ message: "failed Github login" });
    }

    const { access_token } = tokenReq;
    const githubUser = await this.getUserData(access_token);
    if (!githubUser[0] && !githubUser[1]) {
      console.warn("failed Github login : Get userData\n", githubUser);
      return res.status(409).json({ message: "failed Github login" });
    }

    const user = await this.signIn(githubUser[0], githubUser[1]);
    if (!user) {
      return next(new Error("githubLogin : from signIn"));
    }
    this.tokenController.setToken(res, user.token);
    return res.status(201).json(user);
  };
}
