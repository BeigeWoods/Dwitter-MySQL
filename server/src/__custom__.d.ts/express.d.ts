import { OutputUserInfo } from "../__dwitter__.d.ts/data/user";

declare global {
  namespace Express {
    interface Request {
      user?: OutputUserInfo;
      token?: string;
    }
  }
}
