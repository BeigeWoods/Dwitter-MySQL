import bcrypt from "bcrypt";
import {} from "express-async-errors";
import { NextFunction, Request, Response } from "express";
import { Config } from "../../config.js";
import { UserDataHandler } from "../../data/auth.js";
import { TokenHandler } from "./token.js";

export interface AuthDataHandler {
  signup(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  login(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  me(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  getUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  updateUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  password(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  withdrawal(req: Request, res: Response): Promise<void>;
}

export default class AuthController implements AuthDataHandler {
  private hashed?: string;
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
    try {
      this.hashed = bcrypt.hashSync(password, this.config.bcrypt.saltRounds);
    } catch (error) {
      console.log("비밀번호 암호화 실패");
      console.log("password is hashed? : ", this.hashed);
      console.log(
        "what is type of saltRounds? : ",
        typeof this.config.bcrypt.saltRounds
      );
      console.error(error);
      return res.status(500).json({ message: "Something went wrong!" });
    }
    const userId = await this.userRepository.createUser({
      username,
      password: this.hashed,
      name,
      email,
      url,
      socialLogin: false,
    });
    const token = this.tokenController.createJwtToken(userId);
    this.tokenController.setToken(res, token);
    res.status(201).json({ token, username });
  };

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid user or password" });
    }
    const isValidPassword = bcrypt.compare(password, user.password!);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid user or password" });
    }
    const token = this.tokenController.createJwtToken(user.id);
    this.tokenController.setToken(res, token);
    res.status(200).json({ token, username });
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    this.tokenController.setToken(res, "");
    res.sendStatus(204);
  };

  me = async (req: Request, res: Response) => {
    const user = await this.userRepository.findById(req.userId as number);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ token: req.token, username: user.username });
  };

  getUser = async (req: Request, res: Response) => {
    const user = await this.userRepository.findById(req.userId as number);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.socialLogin) {
      res.sendStatus(204);
    } else {
      const { username, name, email, url } = user;
      return res.status(200).json({ username, name, email, url });
    }
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
    await this.userRepository.updateUser(req.userId as number, {
      username,
      name,
      email,
      url,
    });
    return res.status(201).json({ username, name, email, url });
  };

  password = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, checkPassword } = req.body;
    const user = await this.userRepository.findById(req.userId! as number);
    const isValidPassword = bcrypt.compare(
      oldPassword,
      user!.password as string
    );
    if (user!.socialLogin) {
      return res.sendStatus(404);
    }
    if (!isValidPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    if (newPassword !== checkPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    } else {
      const hashedNew = await bcrypt.hash(
        newPassword,
        this.config.bcrypt.saltRounds
      );
      await this.userRepository.updatePassword(req.userId as number, hashedNew);
      return res.sendStatus(204);
    }
  };

  withdrawal = async (req: Request, res: Response) => {
    await this.userRepository.deleteUser(req.userId as number);
    res.sendStatus(204);
  };
}
