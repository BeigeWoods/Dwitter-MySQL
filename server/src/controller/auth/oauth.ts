import "express-async-errors";
import { CookieOptions, NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
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

  private signUp = async (owner: any, email: any, exist: boolean) => {
    const userId = (await this.userRepository
      .createUser({
        username: exist ? `${owner!.login}_github` : owner!.login,
        password: "",
        name: owner!.name,
        email: email[0].email,
        url: owner!.avatar_url,
        socialLogin: true,
      })
      .catch((error) => {
        throw `Error! oauthController.githubFinish < signUp < ${error}`;
      })) as number;

    return {
      token: this.tokenController.createJwtToken(userId),
      username: owner!.login as string,
    };
  };

  private login = async (owner: any, email: any) => {
    const byUsername = (await this.userRepository
      .findByUsername(owner!.login)
      .catch((error) => {
        throw `Error! oauthController.githubFinish < login < ${error}`;
      })) as OutputUser;
    const byEmail = (await this.userRepository
      .findByEmail(email[0].email)
      .catch((error) => {
        throw `Error! oauthController.githubFinish < login < ${error}`;
      })) as OutputUser;

    return byEmail
      ? {
          token: this.tokenController.createJwtToken(byEmail.id),
          username: byEmail.username,
        }
      : await this.signUp(owner, email, byUsername ? true : false);
  };

  protected getUser = async (token: string) => {
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
    ]).catch((error) => {
      throw `Error! oauthController.githubFinish < getUser\n The problem of fetch\n ${error}`;
    });

    if (!result[0] || !result[1])
      throw `Error! oauthController.githubFinish < getUser\n doesn't exist data in ${result}`;
    return result;
  };

  protected getToken = async (code: string) => {
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
      .catch((error) => {
        throw `Error! oauthController.githubFinish < getToken\n The problem of fetch\n ${error}`;
      });

    if (!result || !result.access_token) {
      throw `Error! oauthController.githubFinish < getToken\n doesn't exist token in ${result}`;
    }
    return result.access_token;
  };

  githubStart = async (req: Request, res: Response, next: NextFunction) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const state = await bcrypt
      .hash(this.config.oauth.state.plain, this.config.oauth.state.saltRounds)
      .catch((error) => {
        throw `Error! githubStart < bcrypt.hash\n ${error}`;
      });
    const option = {
      client_id: this.config.oauth.github.clientId,
      allow_signup: "false",
      scope: "read:user user:email",
      state: state!,
    };
    const params = new URLSearchParams(option).toString();

    return res.status(200).json(`${baseUrl}?${params}`);
  };

  githubFinish = async (req: Request, res: Response) => {
    let token: string;
    let isSuccess = true;
    if (req.query) {
      const validate = await bcrypt
        .compare(this.config.oauth.state.plain, req.query.state as string)
        .catch((error) => {
          console.error(
            "Error! oauthController.githubFinish < bcrypt.compare\n",
            error
          );
        });
      if (!validate) {
        isSuccess = false;
        console.warn(
          "Warn! oauthController.githubFinish\n",
          "a state of query from Github doesn't validate."
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
  };
}
