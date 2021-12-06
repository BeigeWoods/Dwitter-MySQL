import bcrypt from "bcrypt";
import {} from "express-async-errors";
import { NextFunction, Request, Response } from "express";
import * as userRepository from "../../data/auth.js";
import { config } from "../../config.js";
import * as tokenController from "./token.js";

export async function signup(req: Request, res: Response) {
  const { username, password, name, email, url } = req.body;
  const foundEmail = await userRepository.findByUserEmail(email);
  if (foundEmail) {
    return res.status(409).json({ message: `${email} already exists.` });
  }
  const foundUsername = await userRepository.findByUsername(username);
  if (foundUsername) {
    return res.status(409).json({ message: `${username} already exists` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
    socialLogin: false,
  });
  const token = tokenController.createJwtToken(userId);
  tokenController.setToken(res, token);
  res.status(201).json({ token, username });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const token = tokenController.createJwtToken(user.id);
  tokenController.setToken(res, token);
  res.status(200).json({ token, username });
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  tokenController.setToken(res, "");
  res.sendStatus(204);
}

export async function me(req: Request, res: Response) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ token: req.token, username: user.username });
}

export async function getUser(req: Request, res: Response) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.socialLogin) {
    res.sendStatus(204);
  } else {
    const { username, name, email, url } = user;
    return res.status(200).json({ username, name, email, url });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { username, name, email, url } = req.body;
  const foundUsername = await userRepository.findByUsername(username);
  if (foundUsername && foundUsername.id !== req.userId) {
    return res.status(409).json({ message: `${username} already exists` });
  }
  const foundEmail = await userRepository.findByUserEmail(email);
  if (foundEmail && foundEmail.id !== req.userId) {
    return res.status(409).json({ message: `${email} already exists` });
  }
  await userRepository.updateUser(req.userId, {
    username,
    name,
    email,
    url,
  });
  return res.status(201).json({ username, name, email, url });
}

export async function password(req: Request, res: Response) {
  const { oldPassword, newPassword, checkPassword } = req.body;
  const user = await userRepository.findById(req.userId);
  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  if (user.socialLogin) {
    return res.sendStatus(404);
  }
  if (!isValidPassword) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  if (newPassword !== checkPassword) {
    return res.status(400).json({ message: "Incorrect password" });
  } else {
    const hashedNew = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await userRepository.updatePassword(req.userId, hashedNew);
    return res.sendStatus(204);
  }
}

export async function withdrawal(req: Request, res: Response) {
  await userRepository.deleteUser(req.userId);
  return res.sendStatus(204);
}
