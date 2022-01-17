declare namespace Express {
  interface Request {
    userId?: number;
    token?: string;
  }
}
