import bcrypt from "bcrypt";
import {} from "express-async-errors";
import { NextFunction, Request, Response } from "express";
import { AuthDataHandler } from "../../__dwitter__.d.ts/controller/auth/auth";
import {
  OutputUserInfo,
  PasswordInfo,
  UserDataHandler,
  UserProfile,
} from "../../__dwitter__.d.ts/data/user";
import { TokenHandler } from "../../__dwitter__.d.ts/controller/auth/token";
import { Config } from "../../__dwitter__.d.ts/config";

export default class AuthController implements AuthDataHandler {
  constructor(
    private config: Config,
    private userRepository: UserDataHandler,
    private tokenController: TokenHandler
  ) {}

  private async isDuplicateEmailOrUsername(email: string, username: string) {
    let result: number | void | OutputUserInfo;
    result = await this.userRepository.findByUserEmail(email);
    if (result) {
      return Number(result) ? 1 : email;
    }
    result = await this.userRepository.findByUsername(username);
    if (result) {
      return Number(result) ? 1 : email;
    }
    return 0;
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const {
      username,
      password,
      name,
      email,
      url,
    }: UserProfile & {
      password: string;
      email: string;
    } = req.body;

    const isDuplicate = await this.isDuplicateEmailOrUsername(email, username);
    if (isDuplicate) {
      return Number(isDuplicate)
        ? next(new Error("signUp: from isDuplicateEmailOrUsername"))
        : res.status(409).json({
            message: `${isDuplicate} already exists.`,
          });
    }

    const hashedPw = await bcrypt.hash(
      password + this.config.bcrypt.randomWords,
      this.config.bcrypt.saltRounds
    );
    const userId = await this.userRepository.createUser({
      username,
      password: hashedPw,
      name,
      email,
      url,
      socialLogin: false,
    });
    if (!userId) {
      return next(new Error("signUp : from userRepository.createUser"));
    }
    const token = this.tokenController.createJwtToken(userId);
    this.tokenController.setToken(res, token);
    return res.status(201).json({ token, username });
  };

  login = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } =
      req.body;
    const isSamePw = await bcrypt.compare(
      password + this.config.bcrypt.randomWords,
      req.user!.password!
    );
    if (!isSamePw) {
      return res.status(400).json({ message: "Invalid user or password" });
    }
    const token = this.tokenController.createJwtToken(req.user!.userId);
    this.tokenController.setToken(res, token);
    return res.status(200).json({ token, username });
  };

  logout = async (req: Request, res: Response) => {
    this.tokenController.setToken(res, "");
    return res.sendStatus(204);
  };

  me = async (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ token: req.token, username: req.user!.username });
  };

  getUser = async (req: Request, res: Response) => {
    const { username, name, email, url, socialLogin } = req.user!;
    return res.status(200).json({ username, name, email, url, socialLogin });
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, name, email, url }: UserProfile & { email: string } =
      req.body;
    const isDuplicate = await this.isDuplicateEmailOrUsername(email, username);
    if (isDuplicate) {
      return Number(isDuplicate)
        ? next(new Error("updateUser: from isDuplicateEmailOrUsername"))
        : res.status(409).json({
            message: `${isDuplicate} already exists.`,
          });
    }
    return await this.userRepository.updateUser(
      req.user!.userId,
      {
        username,
        name,
        email,
        url,
      },
      (error) =>
        error
          ? next(error)
          : res.status(201).json({ username, name, email, url })
    );
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword, checkPassword }: PasswordInfo = req.body;
    if (req.user!.socialLogin) {
      return res.sendStatus(403);
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "Do not use the old password again" });
    }
    const isSamePw = await bcrypt.compare(
      oldPassword + this.config.bcrypt.randomWords,
      req.user!.password!
    );
    if (!isSamePw || newPassword !== checkPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const hashedNewPw = await bcrypt.hash(
      newPassword + this.config.bcrypt.randomWords,
      this.config.bcrypt.saltRounds
    );
    return await this.userRepository.updatePassword(
      req.user!.userId,
      hashedNewPw,
      (error) => (error ? next(error) : res.sendStatus(204))
    );
  };

  withdrawal = async (req: Request, res: Response, next: NextFunction) => {
    return await this.userRepository.deleteUser(req.user!.userId, (error) => {
      if (error) {
        return next(error);
      }
      this.tokenController.setToken(res, "");
      return res.sendStatus(204);
    });
  };
}
