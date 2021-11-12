import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { config } from "../config.js";

export const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
  // 요청이 GET, OPTIONS, HEAD 형태라면 넘어가기
  if (
    req.method === "GET" ||
    req.method === "OPTIONS" ||
    req.method === "HEAD"
  ) {
    return next();
  }
  // header에서 csrf 토큰 가져오기
  const csrfHeader = req.get("dwitter_csrf-token");
  // csrf 토큰이 없다면 status 403하고 서버에 경고 메시지와 정보 남기기
  if (!csrfHeader) {
    console.warn(
      'Missing required "dwitter_csrf-token" header.',
      req.headers.origin
    );
    return res.status(403).json({ message: "Failed CSRF check" });
  }
  // csrf 토큰의 유효성 검사 통과를 실패했다면 status 403, 서버에 경고 메시지와 정보 남기기
  // 그 밖의 유효성 검사 중 에러가 발생했다면 status 500
  validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          'Value provided in "dwitter_csrf-token" header does not validate.',
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: "Failed CSRF check" });
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
};

async function validateCsrfToken(csrfHeader: string): Promise<boolean> {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
