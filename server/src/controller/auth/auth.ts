import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { AuthDataHandler } from "../../__dwitter__.d.ts/controller/auth/auth";
import {
  InputUserInfo,
  InputUserProf,
  OutputUser,
  PasswordInfo,
  UserDataHandler,
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
    let result: OutputUser | number | void;
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
    const { username, password, name, email, url }: InputUserInfo = req.body;

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

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: InputUserInfo = req.body;
    const user = await this.userRepository.findByUsername(username);
    switch (user) {
      case 1:
        return next(new Error("login : from userRepository.findByUsername"));
      case undefined:
        return res.status(400).json({ message: "Invalid user or password" });
    }

    const isSamePw = await bcrypt.compare(
      password + this.config.bcrypt.randomWords,
      (user as OutputUser).password
    );
    if (!isSamePw) {
      return res.status(400).json({ message: "Invalid user or password" });
    }

    const token = this.tokenController.createJwtToken((user as OutputUser).id);
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
    const { username, name, email, url }: InputUserProf = req.body;
    const isDuplicate = await this.isDuplicateEmailOrUsername(
      email!,
      username!
    );
    if (isDuplicate) {
      return Number(isDuplicate)
        ? next(new Error("updateUser: from isDuplicateEmailOrUsername"))
        : res.status(409).json({
            message: `${isDuplicate} already exists.`,
          });
    }
    const error = await this.userRepository.updateUser(req.user!.id, {
      username,
      name,
      email,
      url,
    });
    return error
      ? next(error)
      : res.status(201).json({ username, name, email, url });
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password, newPassword, checkPassword }: PasswordInfo = req.body;
    if (req.user!.socialLogin) {
      return res.sendStatus(403);
    }

    if (password === newPassword) {
      return res
        .status(400)
        .json({ message: "Do not use the old password again" });
    }
    const isSamePw = await bcrypt.compare(
      password + this.config.bcrypt.randomWords,
      req.user!.password
    );
    if (!isSamePw || newPassword !== checkPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const hashedNewPw = await bcrypt.hash(
      newPassword + this.config.bcrypt.randomWords,
      this.config.bcrypt.saltRounds
    );
    const error = await this.userRepository.updatePassword(
      req.user!.id,
      hashedNewPw
    );
    return error ? next(error) : res.sendStatus(204);
  };

  withdrawal = async (req: Request, res: Response, next: NextFunction) => {
    const error = await this.userRepository.deleteUser(req.user!.id);
    if (error) {
      return next(error);
    }
    this.tokenController.setToken(res, "");
    return res.sendStatus(204);
  };
}
