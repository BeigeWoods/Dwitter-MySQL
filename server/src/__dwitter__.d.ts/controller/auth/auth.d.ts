import { Request, Response } from "express";

declare interface AuthHandler {
  signup(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  login(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  logout(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  me(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
  getUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  updateUser(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  updatePassword(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
  withdrawal(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void>;
}

export default AuthHandler;
