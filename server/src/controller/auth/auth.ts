import bcrypt from "bcrypt";
import {} from "express-async-errors";
import { NextFunction, Request, Response } from "express";
import { AuthDataHandler } from "../../__dwitter__.d.ts/controller/auth/auth.js";
import { Config } from "../../__dwitter__.d.ts/config.js";
import { UserDataHandler } from "../../__dwitter__.d.ts/data/auth.js";
import { TokenHandler } from "../../__dwitter__.d.ts/controller/auth/token.js";

export default class AuthController implements AuthDataHandler {
  constructor(
    private config: Config,
    private userRepository: UserDataHandler,
    private tokenController: TokenHandler
  ) {}

  signup = async (req: Request, res: Response) => {
    const {
      username,
      password,
      name,
      email,
      url,
    }: {
      username: string;
      password: string;
      name: string;
      email: string;
      url: string;
    } = req.body;
    const foundEmail = await this.userRepository.findByUserEmail(email);
    const foundUsername = await this.userRepository.findByUsername(username);
    if (foundEmail) {
      return res.status(409).json({ message: `${email} already exists.` });
    }
    if (foundUsername) {
      return res.status(409).json({ message: `${username} already exists` });
    }
    const hashed = await bcrypt.hash(
      password + this.config.bcrypt.randomWords,
      this.config.bcrypt.saltRounds
    );
    const userId = await this.userRepository.createUser({
      username,
      password: hashed,
      name,
      email,
      url,
      socialLogin: false,
    });
    const token = this.tokenController.createJwtToken(userId!);
    this.tokenController.setToken(res, token);
    res.status(201).json({ token, username });
  };

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid user or password" });
    }
    const isValidPassword = await bcrypt.compare(
      password + this.config.bcrypt.randomWords,
      user.password!
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid user or password" });
    }
    const token = this.tokenController.createJwtToken(user.id);
    this.tokenController.setToken(res, token);
    res.status(200).json({ token, username });
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    this.tokenController.setToken(res, "");
    return res.sendStatus(204);
  };

  me = async (req: Request, res: Response) => {
    const user = await this.userRepository.findById(req.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ token: req.token, username: user.username });
  };

  getUser = async (req: Request, res: Response) => {
    const user = await this.userRepository.findById(req.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, name, email, url, socialLogin } = user;
    return res.status(200).json({ username, name, email, url, socialLogin });
  };

  updateUser = async (req: Request, res: Response) => {
    const { username, name, email, url } = req.body;
    const foundUsername = await this.userRepository.findByUsername(username);
    if (foundUsername && foundUsername.id !== req.userId) {
      return res.status(409).json({ message: `${username} already exists` });
    }
    const foundEmail = await this.userRepository.findByUserEmail(email);
    if (foundEmail && foundEmail.id !== req.userId) {
      return res.status(409).json({ message: `${email} already exists` });
    }
    await this.userRepository.updateUser(req.userId!, {
      username,
      name,
      email,
      url,
    });
    return res.status(201).json({ username, name, email, url });
  };

  updatePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, checkPassword } = req.body;
    const user = await this.userRepository.findById(req.userId!);
    if (user!.socialLogin) {
      return res.sendStatus(404);
    }
    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "Do not use the old password again" });
    }
    const isValidPassword = await bcrypt.compare(
      oldPassword + this.config.bcrypt.randomWords,
      user!.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    if (newPassword !== checkPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const hashedNew = await bcrypt.hash(
      newPassword + this.config.bcrypt.randomWords,
      this.config.bcrypt.saltRounds
    );
    await this.userRepository.updatePassword(req.userId!, hashedNew);
    return res.sendStatus(204);
  };

  withdrawal = async (req: Request, res: Response) => {
    await this.userRepository.deleteUser(req.userId!);
    this.tokenController.setToken(res, "");
    return res.sendStatus(204);
  };
}
