import { CookieOptions, NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { MockResponse } from "node-mocks-http";
import { UserForToken } from "../__dwitter__.d.ts/controller/auth/oauth";
import TokenHandler from "../__dwitter__.d.ts/controller/auth/token";
import { OutputUser, UserDataHandler } from "../__dwitter__.d.ts/data/user";
import { mockOauth } from "./data";

export const mockedTokenController: jest.Mocked<TokenHandler> = {
  createJwtToken: jest.fn((userId: number) => "token"),
  setToken: jest.fn((res: MockResponse<any>, token) => res),
  csrfToken: jest.fn(),
  generateCSRFToken: jest.fn(),
};

export class mockedOauthController {
  private readonly config = {
    oauth: {
      github: {
        clientId: "",
        clientSecret: "",
      },
      state: { plain: "", saltRounds: 1 },
    },
    cors: { allowedOrigin: "" },
  };
  constructor(
    private tokenController: TokenHandler,
    private userRepository: UserDataHandler
  ) {}

  private setErrorMessage(res: Response, text: string) {
    const options: CookieOptions = {
      maxAge: 5000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
    return res.cookie("ouath", text, options);
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
      .catch(() => {
        throw "githubFinish : signUp";
      })) as number;

    return {
      token: this.tokenController.createJwtToken(userId),
      username: owner!.login as string,
    };
  };

  private login = async (owner: any, email: any) => {
    const byUsername = (await this.userRepository
      .findByUsername(owner!.login)
      .catch(() => {
        throw "githubFinish : find user by username from login";
      })) as OutputUser;
    const byEmail = (await this.userRepository
      .findByEmail(email[0].email)
      .catch(() => {
        throw "githubFinish : find user by email from login";
      })) as OutputUser;

    return byEmail
      ? {
          token: this.tokenController.createJwtToken(byEmail.id),
          username: byEmail.username,
        }
      : await this.signUp(owner, email, byUsername ? true : false);
  };

  protected getUser = async (token: string) => {
    // "https://api.github.com";
    const cases = [
      token === "error" ? "error" : "owner",
      token === "undefined" ? "undefined" : "email",
    ];
    const fetch = (value: string) =>
      new Promise((resolve, reject) => {
        switch (value) {
          case "owner":
            resolve(mockOauth.ownerData);
          case "email":
            resolve(mockOauth.emailData);
          case "undefined":
            resolve(undefined);
          case "error":
            reject("the problem of github");
        }
      });
    const result: any = await Promise.all([
      fetch(cases[0]),
      fetch(cases[1]),
    ]).catch((error) => {
      throw `githubFinish : getUser\n ${error}`;
    });

    if (!result[0] || !result[1])
      throw "githubFinish : getUser\n doesn't exist data";
    return result;
  };

  protected getToken = async (code: string) => {
    // "https://github.com/login/oauth/access_token";
    const fetch = new Promise((resolve, reject) => {
      switch (code) {
        case "code":
          resolve({
            access_token: "access_token",
          });
        case "null":
          resolve({
            access_token: null,
          });
        case "undefined":
          resolve(undefined);
        case "error":
          reject("the problem of github");
      }
    });
    const result = (await fetch.catch((error) => {
      throw `githubFinish : getToken\n ${error}`;
    })) as any;

    if (!result || !result.access_token)
      throw `githubFinish : getToken\n doesn't exist token`;
    return result.access_token;
  };

  githubStart = async (req: Request, res: Response, next: NextFunction) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const state = await bcrypt
      .hash(this.config.oauth.state.plain, this.config.oauth.state.saltRounds)
      .catch((error) => {
        throw `githubStart : hash by bcrypt\n ${error}`;
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
    let isError = "";
    if (req.query) {
      const validate = await bcrypt
        .compare(this.config.oauth.state.plain, req.query.state as string)
        .catch((error) =>
          console.error(`githubFinish : validate by bcrypt\n ${error}`)
        );
      if (!validate) {
        isError = "error from validating the state";
        console.warn("githubFinish : state of github OAuth doesn't validate.");
      }
      token =
        !isError &&
        (await this.getToken(req.query.code as string).catch((error) => {
          isError = "error from get access_token";
          console.error(error);
        }));
    }

    const owner =
      !isError &&
      (await this.getUser(token!).catch((error) => {
        isError = "error from get user";
        console.error(error);
      }));
    const user =
      !isError &&
      (await this.login(owner[0], owner[1]).catch((error) => {
        isError = "error from login";
        console.error(error);
      }));

    isError
      ? this.setErrorMessage(res, isError)
      : this.tokenController.setToken(res, (user as UserForToken).token);
    return res.redirect(this.config.cors.allowedOrigin);
  };
}
