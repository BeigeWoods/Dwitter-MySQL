import "express-async-errors";
import { CookieOptions, Request, Response } from "express";
import https from "node:https";
import bcrypt from "bcrypt";
import ExceptionHandler from "../../exception/exception.js";
import GithubOauthHandler, {
  IndexForFetchUsage,
  ResorceOwner,
} from "../../__dwitter__.d.ts/controller/auth/oauth";
import TokenHandler from "../../__dwitter__.d.ts/controller/auth/token";
import UserDataHandler, { OutputUser } from "../../__dwitter__.d.ts/data/user";
import Config from "../../__dwitter__.d.ts/config";
import { KindOfController } from "../../__dwitter__.d.ts/exception/exception.js";

export default class OauthController implements GithubOauthHandler {
  constructor(
    private readonly config: Config,
    private readonly tokenController: TokenHandler,
    private readonly userRepository: UserDataHandler,
    private readonly exc: ExceptionHandler<
      KindOfController,
      keyof GithubOauthHandler
    >
  ) {}

  private setErrorMessage = async (res: Response) => {
    const options: CookieOptions = {
      sameSite: "none",
      secure: true,
    };
    return res.cookie("oauth", "Github login is failed", options);
  };

  private fetchData = (
    index: IndexForFetchUsage,
    url: string,
    reqOption: https.RequestOptions
  ) =>
    new Promise((resolve, reject) =>
      https
        .request(url, reqOption, (res) => {
          let body = "";
          res
            .on("data", (chunk) => (body += chunk))
            .on("end", () => {
              const result = JSON.parse(body);

              if (res.statusCode! < 200 || res.statusCode! >= 300)
                return reject(
                  new Error(
                    `Responds with "${result.message}" and status ${result.status}`
                  )
                );

              if (result)
                switch (index) {
                  case "token":
                    return "access_token" in result
                      ? resolve(result.access_token)
                      : reject(new Error(JSON.stringify(result)));
                  case "user":
                    return "login" in result && "name" in result
                      ? resolve(result)
                      : reject(new Error(JSON.stringify(result)));
                  case "email":
                    return Array.isArray(result) && "email" in result[0]
                      ? resolve(result[0].email)
                      : reject(new Error(JSON.stringify(result)));
                }
              else
                return reject(
                  new Error(`Response to get ${index} doesn't exist`)
                );
            });
        })
        .on("error", reject)
        .end()
    );

  private signup = async (
    owner: ResorceOwner,
    email: string,
    exist: boolean
  ) => {
    const userId = (await this.userRepository.create({
      username: exist ? `${owner.login}_github` : owner.login,
      password: "",
      name: owner.name,
      email: email,
      url: owner.avatar_url,
      socialLogin: true,
    })) as number;

    return {
      token: this.tokenController.createJwtToken(userId),
      username: owner.login as string,
    };
  };

  private login = async (owner: ResorceOwner, email: string) => {
    const user = (await Promise.all([
      this.userRepository.findByUsername(owner.login),
      this.userRepository.findByEmail(email),
    ])) as OutputUser[];

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

    try {
      return (await Promise.all([
        this.fetchData("user", `${apiUrl}/user`, reqOption),
        this.fetchData("email", `${apiUrl}/user/emails`, reqOption),
      ])) as [ResorceOwner, string];
    } catch (e) {
      throw new Error("Failed to get user information", {
        cause: { contents: e, token },
      });
    }
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

    try {
      return (await this.fetchData(
        "token",
        `${baseUrl}?${params}`,
        reqOption
      )) as string;
    } catch (e) {
      throw new Error("Failed to get token", { cause: { contents: e, code } });
    }
  };

  githubStart = async (req: Request, res: Response) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const state = await bcrypt
      .hash(this.config.oauth.state.plain, this.config.oauth.state.saltRounds)
      .catch((e) => this.exc.throw(e, "githubStart"));
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
    try {
      if (req.query) {
        const validate = await bcrypt.compare(
          this.config.oauth.state.plain,
          req.query.state as string
        );
        if (validate) token = await this.getToken(req.query.code as string);
        else
          console.warn(
            this.exc.setup(
              new Error("A state of query from Github doesn't validate"),
              "githubFinish"
            )
          );
      }
      const owner = await this.getUser(token);
      await this.login(owner[0], owner[1]).then((user) =>
        this.tokenController.setToken(res, user.token)
      );
    } catch (e) {
      console.error(this.exc.setup(e, "githubFinish"));
      this.setErrorMessage(res);
    } finally {
      return res.redirect(301, this.config.cors.allowedOrigin);
    }
  };
}
