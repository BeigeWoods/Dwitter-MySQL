import { Request, Response } from "express";
import { Config } from "../../config";
export interface TokenHandler {
  createJwtToken(id: number): string;
  setToken(res: Response, token: string): void;
  csrfToken(req: Request, res: Response): Promise<void>;
  generateCSRFToken(): Promise<string>;
}
export default class TokenRepository implements TokenHandler {
  private config;
  constructor(config: Config);
  createJwtToken: (id: number) => string;
  setToken: (res: Response, token: string) => void;
  csrfToken: (req: Request, res: Response) => Promise<void>;
  generateCSRFToken: () => Promise<string>;
}
