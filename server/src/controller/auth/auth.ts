import "express-async-errors";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { AuthDataHandler } from "../../__dwitter__.d.ts/controller/auth/auth";
import {
  InputUserInfo,
  InputUserProf,
  OutputUser,
  PasswordInfo,
  UserDataHandler,
} from "../../__dwitter__.d.ts/data/user";
import { TokenHandler } from "../../__dwitter__.d.ts/controller/auth/token";
import Config from "../../__dwitter__.d.ts/config";

export default class AuthController implements AuthDataHandler {
  constructor(
    private config: Config,
    private userRepository: UserDataHandler,
    private tokenController: TokenHandler
  ) {}

  private async isDuplicateEmailOrUsername(email: string, username: string) {
    let result: OutputUser;
    result = (await this.userRepository.findByEmail(email).catch((error) => {
      throw `isDuplicateEmailOrUsername < ${error}`;
    })) as OutputUser;
    if (result) {
      return email;
    }
    result = (await this.userRepository
      .findByUsername(username)
      .catch((error) => {
        throw `isDuplicateEmailOrUsername < ${error}`;
      })) as OutputUser;
    if (result) {
      return username;
    }
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, name, email, url }: InputUserInfo = req.body;

    const isDuplicate = await this.isDuplicateEmailOrUsername(
      email,
      username
    ).catch((error) => {
      throw `Error! authController.signUp < ${error}`;
    });
    if (isDuplicate) {
      return res.status(409).json({
        message: `${isDuplicate} already exists.`,
      });
    }

    const hashedPw = await bcrypt.hash(
      password + this.config.bcrypt.randomWords,
      this.config.bcrypt.saltRounds
    );
    const userId = await this.userRepository
      .createUser({
        username,
        password: hashedPw,
        name,
        email,
        url,
        socialLogin: false,
      })
      .catch((error) => {
        throw `Error! authController.signUp < ${error}`;
      });

    const token = this.tokenController.createJwtToken(userId!);
    this.tokenController.setToken(res, token);
    return res.status(201).json({ token, username });
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: InputUserInfo = req.body;
    const user = await this.userRepository
      .findByUsername(username)
      .catch((error) => {
        throw `Error! authController.login < ${error}`;
      });
    if (!user) {
      return res.status(400).json({ message: "Invalid user or password" });
    }

    const isSamePw = await bcrypt
      .compare(
        password + this.config.bcrypt.randomWords,
        (user as OutputUser).password
      )
      .catch((error) => {
        throw `Error! authController.login < bcrypt.compare\n ${error}`;
      });
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
    ).catch((error) => {
      throw `Error! authController.updateUser < ${error}`;
    });
    if (isDuplicate) {
      return res.status(409).json({
        message: `${isDuplicate} already exists.`,
      });
    }
    await this.userRepository
      .updateUser(req.user!.id, {
        username,
        name,
        email,
        url,
      })
      .catch((error) => {
        throw `Error! authController.updateUser < ${error}`;
      });
    return res.status(201).json({ username, name, email, url });
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
    const isSamePw = await bcrypt
      .compare(password + this.config.bcrypt.randomWords, req.user!.password)
      .catch((error) => {
        throw `Error! authController.updatePassword < bcrypt.compare\n ${error}`;
      });
    if (!isSamePw || newPassword !== checkPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const hashedNewPw = await bcrypt.hash(
      newPassword + this.config.bcrypt.randomWords,
      this.config.bcrypt.saltRounds
    );
    await this.userRepository
      .updatePassword(req.user!.id, hashedNewPw)
      .catch((error) => {
        throw `Error! authController.updatePassword < ${error}`;
      });
    return res.sendStatus(204);
  };

  withdrawal = async (req: Request, res: Response, next: NextFunction) => {
    await this.userRepository.deleteUser(req.user!.id).catch((error) => {
      throw `Error! authController.withdrawal < ${error}`;
    });
    this.tokenController.setToken(res, "");
    return res.sendStatus(204);
  };
}
