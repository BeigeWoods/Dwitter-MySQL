import "express-async-errors";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ExceptionHandler from "../../exception/exception.js";
import AuthHandler from "../../__dwitter__.d.ts/controller/auth/auth";
import UserDataHandler, {
  UserForCreate,
  UserForUpdate,
  OutputUser,
  Password,
  UserForLogin,
} from "../../__dwitter__.d.ts/data/user";
import TokenHandler from "../../__dwitter__.d.ts/controller/auth/token";
import Config from "../../__dwitter__.d.ts/config";
import { KindOfController } from "../../__dwitter__.d.ts/exception/exception.js";

export default class AuthController implements AuthHandler {
  constructor(
    private readonly config: Config,
    private readonly userRepository: UserDataHandler,
    private readonly tokenController: TokenHandler,
    private readonly exc: ExceptionHandler<KindOfController, keyof AuthHandler>
  ) {}

  signup = async (req: Request, res: Response) => {
    const { username, password, name, email, url }: UserForCreate = req.body;
    let userId;
    try {
      await Promise.all([
        this.userRepository
          .findByEmail(email)
          .then((result) => result && "email"),
        this.userRepository
          .findByUsername(username)
          .then((result) => result && "username"),
      ]).then((result) => {
        if (result[0] || result[1])
          throw `${result[0] ? result[0] : result[1]} already exists`;
      });

      const hashedPw = await bcrypt.hash(
        password + this.config.bcrypt.randomWords,
        this.config.bcrypt.saltRounds
      );
      userId = await this.userRepository.create({
        username,
        password: hashedPw,
        name,
        email,
        url,
        socialLogin: false,
      });
    } catch (e) {
      if (typeof e === "string") return res.status(409).json({ message: e });
      this.exc.throw(e, "signup");
    }
    const token = this.tokenController.createJwtToken(userId!);
    this.tokenController.setToken(res, token);
    return res.status(201).json({ token, username });
  };

  login = async (req: Request, res: Response) => {
    const { username, password }: UserForLogin = req.body;
    let user: OutputUser;
    try {
      user = (await this.userRepository
        .findByUsername(username)
        .then((result) => {
          if (result) return result;
          throw false;
        })) as OutputUser;

      await bcrypt
        .compare(password + this.config.bcrypt.randomWords, user.password)
        .then((result) => {
          if (!result) throw false;
        });
    } catch (e) {
      if (!e)
        return res.status(400).json({ message: "Invalid user or password" });
      this.exc.throw(e, "login");
    }
    const token = this.tokenController.createJwtToken(user!.id);
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

  updateUser = async (req: Request, res: Response) => {
    const { username, name, email, url }: UserForUpdate = req.body;
    try {
      await Promise.all([
        email &&
          this.userRepository
            .findByEmail(email)
            .then((result) => result && "email"),
        username &&
          this.userRepository
            .findByUsername(username)
            .then((result) => result && "username"),
      ]).then((result) => {
        if (result[0] || result[1])
          throw `${result[0] ? result[0] : result[1]} already exists`;
      });

      await this.userRepository.update(req.user!.id, {
        username,
        name,
        email,
        url,
      });
    } catch (e) {
      if (typeof e === "string") return res.status(409).json({ message: e });
      this.exc.throw(e, "updateUser");
    }
    return res.status(201).json({ username, name, email, url });
  };

  updatePassword = async (req: Request, res: Response) => {
    const { password, newPassword, checkPassword }: Password = req.body;
    if (req.user!.socialLogin) return res.sendStatus(403);
    try {
      await bcrypt
        .compare(password + this.config.bcrypt.randomWords, req.user!.password)
        .then((result) => {
          if (!result) throw "Incorrect password";
        });
      if (password === newPassword) throw "Do not use the old password again";
      if (newPassword !== checkPassword) throw "Incorrect password";

      const hashedNewPw = await bcrypt.hash(
        newPassword + this.config.bcrypt.randomWords,
        this.config.bcrypt.saltRounds
      );
      await this.userRepository.updatePassword(req.user!.id, hashedNewPw);
    } catch (e) {
      if (typeof e === "string") return res.status(400).json({ message: e });
      this.exc.throw(e, "updatePassword");
    }
    return res.sendStatus(204);
  };

  withdrawal = async (req: Request, res: Response) => {
    await this.userRepository
      .delete(req.user!.id)
      .catch((e) => this.exc.throw(e, "withdrawal"));
    this.tokenController.setToken(res, "");
    return res.sendStatus(204);
  };
}
