import { NextFunction, Request, Response } from "express";
import Config from "../../config";

declare interface TokenHandler {
  createJwtToken(id: number): string;
  setToken(res: Response, token: string): Response<any, Record<string, any>>;
  csrfToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction>;
}

export declare class TokenController implements TokenHandler {
  private readonly config;

  constructor(config: Config);

  createJwtToken: (id: number) => string;
  setToken: (
    res: Response,
    token: string
  ) => Response<any, Record<string, any>>;
  csrfToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | NextFunction>;
}

export default TokenHandler;
