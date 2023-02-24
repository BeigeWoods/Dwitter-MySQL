declare namespace Express {
  interface Request {
    userId?: number;
    token?: string;
    file?: { path: string };
  }
}
