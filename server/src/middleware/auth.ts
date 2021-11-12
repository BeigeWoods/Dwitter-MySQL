import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import * as userRepository from "../data/auth.js";

const AUTH_ERROR = { message: "Authentication Error" };

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string;

  // check the header(for Non-Browser Client) first
  const authHeader = req.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // if no token in the header, check the cookie(for Browser Client)
  if (!token) {
    token = req.cookies["token"];
  }

  // 그래도 token이 없으면, error 보내기
  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }

  // token 유효성 검사
  jwt.verify(token, config.jwt.secretKey, async (error: any, decoded: any) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id; // req.customData
    req.token = token;
    next();
  });
};
