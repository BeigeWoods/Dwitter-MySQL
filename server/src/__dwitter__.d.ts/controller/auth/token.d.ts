import { Request, Response } from "express";
import { Config } from "../../config";

export declare interface TokenHandler {
  createJwtToken(id: number): string;
  setToken(res: Response, token: string): Response<any, Record<string, any>>;
  csrfToken(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>>;
  generateCSRFToken(): Promise<string>;
}

export declare class TokenController implements TokenHandler {
  private config;

  constructor(config: Config);

  createJwtToken: (id: number) => string;
  setToken: (
    res: Response,
    token: string
  ) => Response<any, Record<string, any>>;
  csrfToken: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>>>;
  generateCSRFToken: () => Promise<string>;
}
