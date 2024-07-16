import "express-async-errors";
import { CookieOptions, Request, Response } from "express";
import https from "node:https";
import bcrypt from "bcrypt";
import {
  throwErrorOfController as throwError,
  printExceptionOfController as printException,
} from "../../exception/controller.js";
import GithubOauthHandler, {
  IndexForFetchUsage,
  ResorceOwner,
} from "../../__dwitter__.d.ts/controller/auth/oauth";
import TokenHandler from "../../__dwitter__.d.ts/controller/auth/token";
import UserDataHandler from "../../__dwitter__.d.ts/data/user";
import Config from "../../__dwitter__.d.ts/config";

export default class OauthController implements GithubOauthHandler {
  constructor(
    private readonly config: Config,
    private tokenController: TokenHandler,
    private userRepository: UserDataHandler
  ) {}

  private async setErrorMessage(res: Response) {
    const options: CookieOptions = {
      sameSite: "none",
      secure: true,
    };
    return res.cookie("oauth", "Github login is failed", options);
  }

  private async fetch(
    index: IndexForFetchUsage,
    url: string,
    reqOption: https.RequestOptions
  ) {
    return await new Promise((resolve, reject) => {
      const req = https
        .request(url, reqOption, (res) => {
          let body = "";
          res
            .on("data", (chunk) => (body += chunk))
            .on("end", () => {
              if (res.statusCode! < 200 || res.statusCode! >= 300)
                return reject(new Error(body));

              const result = JSON.parse(body);
              if (result)
                switch (index) {
                  case "token":
                    return resolve(result.access_token);
                  case "user":
                    return resolve(result);
                  case "email":
                    return resolve(result[0].email);
                }
              else return reject(`Doesn't exist ${index} in ${result}`);
            });
        })
        .on("error", reject);
      req.end();
    });
  }

  private signup = async (
    owner: ResorceOwner,
    email: string,
    exist: boolean
  ) => {
    const userId = (await this.userRepository
      .create({
        username: exist ? `${owner.login}_github` : owner.login,
        password: "",
        name: owner.name,
        email: email,
        url: owner.avatar_url,
        socialLogin: true,
      })
      .catch((error) =>
        throwError.oauth(["githubFinish", "signup"], error)
      )) as number;

    return {
      token: this.tokenController.createJwtToken(userId),
      username: owner.login as string,
    };
  };

  private login = async (owner: ResorceOwner, email: string) => {
    const user = await Promise.all([
      await this.userRepository.findByUsername(owner.login),
      await this.userRepository.findByEmail(email),
    ]).catch((error) => throwError.oauth(["githubFinish", "login"], error));

    return user[1]
      ? {
          token: this.tokenController.createJwtToken(user[1].id),
          username: user[1].username,
        }
      : await this.signup(owner, email, user[0] ? true : false);
  };

  protected getUser = async (token: unknown) => {
    const apiUrl = "https://api.github.com";
    const reqOption: https.RequestOptions = {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "user-agent": "Dwitter/1.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    };

    return await Promise.all([
      (await this.fetch("user", `${apiUrl}/user`, reqOption)) as ResorceOwner,
      (await this.fetch("email", `${apiUrl}/user/emails`, reqOption)) as string,
    ]);
  };

  protected getToken = async (code: string) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const urlOption = {
      client_id: this.config.oauth.github.clientId,
      client_secret: this.config.oauth.github.clientSecret,
      code,
    };
    const params = new URLSearchParams(urlOption).toString();

    const reqOption: https.RequestOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    };

    return (await this.fetch(
      "token",
      `${baseUrl}?${params}`,
      reqOption
    )) as string;
  };

  githubStart = async (req: Request, res: Response) => {
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
      state,
    };
    const params = new URLSearchParams(option).toString();

    return res.status(200).json(`${baseUrl}?${params}`);
  };

  githubFinish = async (req: Request, res: Response) => {
    let token;
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
      if (validate)
        token = await this.getToken(req.query.code as string).catch((error) =>
          console.error(
            printException.oauth(["githubFinish", "getToken"], error, true)
          )
        );
      else
        console.warn(
          printException.oauth(
            "githubFinish",
            "a state of query from Github doesn't validate.",
            true
          )
        );
    }

    const owner =
      token &&
      (await this.getUser(token).catch((error) =>
        console.error(
          printException.oauth(["githubFinish", "getUser"], error, true)
        )
      ));
    if (owner)
      await this.login(owner[0], owner[1])
        .then((user) => this.tokenController.setToken(res, user.token))
        .catch((error) => console.error(error));
    else this.setErrorMessage(res);

    return res.redirect(301, this.config.cors.allowedOrigin);
  };
}
