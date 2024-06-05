export default class HttpClient {
  constructor(baseURL, authErrorEventBus, getCsrfToken) {
    this.baseURL = baseURL;
    this.authErrorEventBus = authErrorEventBus;
    this.getCsrfToken = getCsrfToken;
  }

  async fetch(url, options, json = true, isnOauth = undefined) {
    const contentType = json && { "Content-Type": "application/json" };
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...contentType,
        ...options.headers,
        "dwitter_csrf-token": isnOauth ? isnOauth : this.getCsrfToken(),
      },
      credentials: "include",
    });
    let data;
    try {
      data = await res.json();
    } catch (error) {
      if (res.status !== 204) {
        console.error(error);
      }
    }

    if (res.status > 299 || res.status < 200) {
      const message =
        data && data.message ? data.message : "Something went wrong! 🤪";
      const error = new Error(message);
      if (res.status === 401) {
        this.authErrorEventBus.notify(error);
      }
      throw error;
    }
    return data;
  }
}
