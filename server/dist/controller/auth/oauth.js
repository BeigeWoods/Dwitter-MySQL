var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import * as tokenController from "./token.js";
import { config } from "../../config.js";
import * as userRepository from "../../data/auth.js";
export function githubStart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = "https://github.com/login/oauth/authorize";
        const option = {
            client_id: config.ghOauth.clientId,
            allow_signup: "false",
            scope: "read:user user:email",
        };
        const params = new URLSearchParams(option).toString();
        const finalUrl = `${baseUrl}?${params}`;
        return res.redirect(finalUrl);
    });
}
export function githubFinish(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = "https://github.com/login/oauth/access_token";
        const option = {
            client_id: config.ghOauth.clientId,
            client_secret: config.ghOauth.clientSecret,
            code: req.query.code,
        };
        const params = new URLSearchParams(option).toString();
        const finalUrl = `${baseUrl}?${params}`;
        const tokenReq = yield (yield fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })).json();
        if ("access_token" in tokenReq) {
            const { access_token } = tokenReq;
            const apiUrl = "https://api.github.com";
            const userData = yield (yield fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })).json();
            const emailData = yield (yield fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })).json();
            const user = yield userRepository.findByUserEmail(emailData[0].email);
            if (!user) {
                const userId = yield userRepository.createUser({
                    username: userData.login,
                    password: "",
                    name: userData.name,
                    email: emailData[0].email,
                    url: userData.avatar_url,
                    socialLogin: true,
                });
                const token = tokenController.createJwtToken(userId);
                tokenController.setToken(res, token);
            }
            else {
                const token = tokenController.createJwtToken(user.id);
                tokenController.setToken(res, token);
            }
        }
        else {
            res.redirect(config.cors.allowedOrigin);
        }
        res.redirect(config.cors.allowedOrigin);
    });
}
//# sourceMappingURL=oauth.js.map