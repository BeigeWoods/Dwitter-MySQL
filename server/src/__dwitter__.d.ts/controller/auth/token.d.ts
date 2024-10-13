import { NextFunction, Request, Response } from "express";

declare interface TokenHandler {
  createJwtToken(id: number): string;
  setToken(res: Response, token: string): Response<any, Record<string, any>>;
  csrfToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | NextFunction>;
}

export default TokenHandler;
