import "express-async-errors";
import { CookieOptions, Request, Response } from "express";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import {
  throwErrorOfController as throwError,
  printExceptionOfController as printException,
} from "../../exception/controller.js";
import TokenHandler from "../../__dwitter__.d.ts/controller/auth/token";
import GithubOauthHandler, {
  UserForToken,
} from "../../__dwitter__.d.ts/controller/auth/oauth";
import { OutputUser, UserDataHandler } from "../../__dwitter__.d.ts/data/user";
import Config from "../../__dwitter__.d.ts/config";

export default class OauthController implements GithubOauthHandler {
  constructor(
    private readonly config: Config,
    private tokenController: TokenHandler,
    private userRepository: UserDataHandler
  ) {}

  private setErrorMessage(res: Response) {
    const options: CookieOptions = {
      sameSite: "none",
      secure: true,
    };
    return res.cookie("oauth", "Github login is failed", options);
  }

  private async signup(owner: any, email: any, exist: boolean) {
    const userId = (await this.userRepository
      .create({
        username: exist ? `${owner!.login}_github` : owner!.login,
        password: "",
        name: owner!.name,
        email: email[0].email,
        url: owner!.avatar_url,
        socialLogin: true,
      })
      .catch((error) =>
        printException.oauth(["githubFinish", "signup"], error)
      )) as number;

    return {
      token: this.tokenController.createJwtToken(userId),
      username: owner!.login as string,
    };
  }

  private async login(owner: any, email: any) {
    const byUsername = (await this.userRepository
      .findByUsername(owner!.login)
      .catch((error) =>
        throwError.oauth(["githubFinish", "login"], error)
      )) as OutputUser;
    const byEmail = (await this.userRepository
      .findByEmail(email[0].email)
      .catch((error) =>
        throwError.oauth(["githubFinish", "login"], error)
      )) as OutputUser;

    return byEmail
      ? {
          token: this.tokenController.createJwtToken(byEmail.id),
          username: byEmail.username,
        }
      : await this.signup(owner, email, byUsername ? true : false);
  }

  protected async getUser(token: string) {
    const apiUrl = "https://api.github.com";

    const result: any = await Promise.all([
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((data) => data.json()),
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((data) => data.json()),
    ]).catch((error) =>
      throwError.oauth(
        ["githubFinish", "getUser"],
        `The problem of fetch\n ${error}`,
        true
      )
    );

    if (!result[0] || !result[1])
      throwError.oauth(
        ["githubFinish", "getUser"],
        `Doesn't exist data in ${result}`,
        true
      );
    return result;
  }

  protected async getToken(code: string) {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const option = {
      client_id: this.config.oauth.github.clientId,
      client_secret: this.config.oauth.github.clientSecret,
      code,
    };
    const params = new URLSearchParams(option).toString();

    const result: any = await fetch(`${baseUrl}?${params}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
      .then((data) => data.json())
      .catch((error) =>
        throwError.oauth(
          ["githubFinish", "getToken"],
          `The problem of fetch\n ${error}`,
          true
        )
      );

    if (!result || !result.access_token)
      throwError.oauth(
        ["githubFinish", "getToken"],
        `Doesn't exist token in ${result}`,
        true
      );
    return result.access_token;
  }

  async githubStart(req: Request, res: Response) {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const state = await bcrypt
      .hash(this.config.oauth.state.plain, this.config.oauth.state.saltRounds)
      .catch((error) =>
        throwError.oauth(["githubStart", "bcrypt.hash"], error, true)
      );
    const option = {
      client_id: this.config.oauth.github.clientId,
      allow_signup: "false",
      scope: "read:user user:email",
      state: state!,
    };
    const params = new URLSearchParams(option).toString();

    return res.status(200).json(`${baseUrl}?${params}`);
  }

  async githubFinish(req: Request, res: Response) {
    let token: string;
    let isSuccess = true;
    if (req.query) {
      const validate = await bcrypt
        .compare(this.config.oauth.state.plain, req.query.state as string)
        .catch((error) =>
          console.error(
            printException.oauth(
              ["githubFinish", "bcrypt.compare"],
              error,
              true
            )
          )
        );
      if (!validate) {
        isSuccess = false;
        console.warn(
          printException.oauth(
            "githubFinish",
            "a state of query from Github doesn't validate.",
            true
          )
        );
      }
      token =
        isSuccess &&
        (await this.getToken(req.query.code as string).catch((error) => {
          isSuccess = false;
          console.error(error);
        }));
    }

    const owner =
      isSuccess &&
      (await this.getUser(token!).catch((error) => {
        isSuccess = false;
        console.error(error);
      }));
    const user =
      isSuccess &&
      (await this.login(owner[0], owner[1]).catch((error) => {
        isSuccess = false;
        console.error(error);
      }));

    isSuccess
      ? this.tokenController.setToken(res, (user as UserForToken).token)
      : this.setErrorMessage(res);
    return res.redirect(301, this.config.cors.allowedOrigin);
  }
}
