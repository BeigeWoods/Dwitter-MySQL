import "express-async-errors";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ExceptionHandler from "../../exception/exception.js";
import AuthDataHandler from "../../__dwitter__.d.ts/controller/auth/auth";
import UserDataHandler, {
  UserForCreate,
  UserForUpdate,
  OutputUser,
  Password,
} from "../../__dwitter__.d.ts/data/user";
import TokenHandler from "../../__dwitter__.d.ts/controller/auth/token";
import Config from "../../__dwitter__.d.ts/config";
import { KindOfController } from "../../__dwitter__.d.ts/exception/exception.js";

export default class AuthController implements AuthDataHandler {
  constructor(
    private readonly config: Config,
    private userRepository: UserDataHandler,
    private tokenController: TokenHandler,
    private readonly exc: ExceptionHandler<
      KindOfController,
      keyof AuthDataHandler
    >
  ) {}

  private async isDuplicateEmailOrUsername(email: string, username: string) {
    let result: OutputUser;
    result = (await this.userRepository.findByEmail(email)) as OutputUser;
    if (result) return email;

    result = (await this.userRepository.findByUsername(username)) as OutputUser;
    if (result) return username;
  }

  signup = async (req: Request, res: Response) => {
    const { username, password, name, email, url }: UserForCreate = req.body;

    const isDuplicate = await this.isDuplicateEmailOrUsername(
      email,
      username
    ).catch((e) => this.exc.throw(e, "signup"));
    if (isDuplicate)
      return res.status(409).json({
        message: `${isDuplicate} already exists.`,
      });

    const hashedPw = await bcrypt.hash(
      password + this.config.bcrypt.randomWords,
      this.config.bcrypt.saltRounds
    );
    const userId = await this.userRepository
      .create({
        username,
        password: hashedPw,
        name,
        email,
        url,
        socialLogin: false,
      })
      .catch((e) => this.exc.throw(e, "signup"));

    const token = this.tokenController.createJwtToken(userId!);
    this.tokenController.setToken(res, token);
    return res.status(201).json({ token, username });
  };

  login = async (req: Request, res: Response) => {
    const { username, password }: UserForCreate = req.body;
    const user = await this.userRepository
      .findByUsername(username)
      .catch((e) => this.exc.throw(e, "login"));
    if (!user)
      return res.status(400).json({ message: "Invalid user or password" });

    const isSamePw = await bcrypt
      .compare(
        password + this.config.bcrypt.randomWords,
        (user as OutputUser).password
      )
      .catch((e) => this.exc.throw(e, "login"));
    if (!isSamePw)
      return res.status(400).json({ message: "Invalid user or password" });

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

  updateUser = async (req: Request, res: Response) => {
    const { username, name, email, url }: UserForUpdate = req.body;
    const isDuplicate = await this.isDuplicateEmailOrUsername(
      email!,
      username!
    ).catch((e) => this.exc.throw(e, "updateUser"));
    if (isDuplicate)
      return res.status(409).json({
        message: `${isDuplicate} already exists.`,
      });

    await this.userRepository
      .update(req.user!.id, {
        username,
        name,
        email,
        url,
      })
      .catch((e) => this.exc.throw(e, "updateUser"));
    return res.status(201).json({ username, name, email, url });
  };

  updatePassword = async (req: Request, res: Response) => {
    const { password, newPassword, checkPassword }: Password = req.body;
    if (req.user!.socialLogin) return res.sendStatus(403);

    if (password === newPassword)
      return res
        .status(400)
        .json({ message: "Do not use the old password again" });

    const isSamePw = await bcrypt
      .compare(password + this.config.bcrypt.randomWords, req.user!.password)
      .catch((e) => this.exc.throw(e, "updatePassword"));
    if (!isSamePw || newPassword !== checkPassword)
      return res.status(400).json({ message: "Incorrect password" });

    const hashedNewPw = await bcrypt
      .hash(
        newPassword + this.config.bcrypt.randomWords,
        this.config.bcrypt.saltRounds
      )
      .catch((e) => this.exc.throw(e, "updatePassword"));
    await this.userRepository
      .updatePassword(req.user!.id, hashedNewPw)
      .catch((e) => this.exc.throw(e, "updatePassword"));
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
