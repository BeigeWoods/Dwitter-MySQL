const bcrypt = require("bcryptjs");

export default class AuthService {
  constructor(http) {
    this.http = http;
  }

  async signup(username, password, name, email, url) {
    return await this.http.fetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        name,
        email,
        url,
      }),
    });
  }

  async login(username, password) {
    return await this.http.fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async githubStart() {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const state = bcrypt.hashSync(
      process.env.REACT_APP_GH_STATE,
      Number(process.env.REACT_APP_SALT)
    );
    if (!state) {
      throw new Error("The problem of bcrypt");
    }
    const option = {
      client_id: process.env.REACT_APP_GH_CLIENT_ID,
      allow_signup: "false",
      scope: "read:user user:email",
      redirect_uri: process.env.REACT_APP_URL,
      state,
    };
    const params = new URLSearchParams(option).toString();
    return `${baseUrl}?${params}`;
  }

  async githubLogin(query) {
    const code = new URLSearchParams(query).get("code");
    const state = new URLSearchParams(query).get("state");
    const result = bcrypt.compareSync(process.env.REACT_APP_GH_STATE, state);
    if (!result) {
      throw new Error("Github OAuth state doesn't validate.");
    }
    return await this.http.fetch("/auth/github", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  }

  async me() {
    return await this.http.fetch("/auth/me", {
      method: "GET",
    });
  }

  async getUser() {
    return await this.http.fetch("/auth/profile", {
      method: "GET",
    });
  }

  async updateUser(username, name, email, url) {
    return await this.http.fetch("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({
        username,
        name,
        email,
        url,
      }),
    });
  }

  async password(password, newPassword, checkPassword) {
    return await this.http.fetch("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        password,
        newPassword,
        checkPassword,
      }),
    });
  }

  async logout() {
    return await this.http.fetch("/auth/logout", {
      method: "POST",
    });
  }

  async withdrawal() {
    return await this.http.fetch("/auth/withdrawal", {
      method: "POST",
    });
  }

  async csrfToken() {
    const resp = await this.http.fetch("/auth/csrf-token", {
      method: "GET",
    });
    return resp.csrfToken;
  }
}
