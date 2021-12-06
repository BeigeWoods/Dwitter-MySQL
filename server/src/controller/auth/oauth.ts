import {} from "express-async-errors";
import { Request, Response } from "express";
import fetch from "node-fetch";
import * as tokenController from "./token.js";
import { config } from "../../config.js";
import * as userRepository from "../../data/auth.js";

export async function githubStart(req: Request, res: Response) {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const option = {
    client_id: config.ghOauth.clientId,
    allow_signup: "false",
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(option).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
}

export async function githubFinish(req: Request, res: Response) {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const option = {
    client_id: config.ghOauth.clientId,
    client_secret: config.ghOauth.clientSecret,
    code: req.query.code as string,
  };
  const params = new URLSearchParams(option).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenReq: any = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenReq) {
    const { access_token } = tokenReq;
    const apiUrl = "https://api.github.com";
    const userData: any = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData: any = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const user = await userRepository.findByUserEmail(emailData[0].email);
    if (!user) {
      const userId = await userRepository.createUser({
        username: userData.login,
        password: "",
        name: userData.name,
        email: emailData[0].email,
        url: userData.avatar_url,
        socialLogin: true,
      });
      const token = tokenController.createJwtToken(userId);
      tokenController.setToken(res, token);
    } else {
      const token = tokenController.createJwtToken(user.id);
      tokenController.setToken(res, token);
    }
  } else {
    res.redirect(config.cors.allowedOrigin);
  }
  res.redirect(config.cors.allowedOrigin);
}
