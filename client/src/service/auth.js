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

  //githubOauth
  async githubStart() {
    return await this.http.fetch("/auth/github/start", {
      method: "GET",
    });
  }

  async githubFinish() {
    return await this.http.fetch("/auth/github/finish", {
      method: "GET",
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

  async password(oldPassword, newPassword, checkPassword) {
    return await this.http.fetch("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        oldPassword,
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
