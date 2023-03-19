import {} from "express-async-errors";
import { Request, Response } from "express";
import fetch from "node-fetch";
import { Config } from "../../__dwitter__.d.ts/config";
import { TokenHandler } from "../../__dwitter__.d.ts/controller/auth/token";
import { UserDataHandler } from "../../__dwitter__.d.ts/data/auth";
import { GithubOauth } from "../../__dwitter__.d.ts/controller/auth/oauth";

export default class OauthController implements GithubOauth {
  constructor(
    private config: Config,
    private tokenController: TokenHandler,
    private userRepository: UserDataHandler
  ) {}
  githubStart = async (req: Request, res: Response) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const option = {
      client_id: this.config.ghOauth.clientId,
      allow_signup: "false",
      scope: "read:user user:email",
    };
    const params = new URLSearchParams(option).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
  };

  private setUser = async (givenToken: any): Promise<string> => {
    const apiUrl = "https://api.github.com";
    const userData: any = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${givenToken}`,
        },
      })
    ).json();
    const emailData: any = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${givenToken}`,
        },
      })
    ).json();
    const user = await this.userRepository.findByUserEmail(emailData[0].email);
    if (!user) {
      const userId = await this.userRepository.createUser({
        username: userData.login,
        password: "",
        name: userData.name,
        email: emailData[0].email,
        url: userData.avatar_url,
        socialLogin: true,
      });
      return this.tokenController.createJwtToken(userId!);
    } else {
      return this.tokenController.createJwtToken(user.id);
    }
  };

  githubFinish = async (req: Request, res: Response) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const option = {
      client_id: this.config.ghOauth.clientId,
      client_secret: this.config.ghOauth.clientSecret,
      code: req.query.code as string,
    };
    const params = new URLSearchParams(option).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenReq: any = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
    ).json();
    if (!("access_token" in tokenReq)) {
      res.redirect(this.config.cors.allowedOrigin);
    }
    const { access_token } = tokenReq;
    const token = await this.setUser(access_token);
    this.tokenController.setToken(res, token);
    res.redirect(this.config.cors.allowedOrigin);
  };
}
