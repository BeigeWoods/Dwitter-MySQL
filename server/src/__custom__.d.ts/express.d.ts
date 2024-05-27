import { OutputUser } from "../__dwitter__.d.ts/data/user";

declare global {
  namespace Express {
    interface Request {
      user?: OutputUser;
      token?: string;
    }
  }
}
