export default class TweetService {
  constructor(http, socket) {
    this.http = http;
    this.socket = socket;
  }

  async getTweets(username) {
    const query = username ? `?username=${username}` : "";
    return this.http.fetch(`/${query}`, {
      method: "GET",
    });
  }

  async postTweet(text, video, image) {
    const data = new FormData();
    data.append("text", text);
    data.append("video", video);
    data.append("image", image);
    return this.http.fetch(
      `/`,
      {
        method: "POST",
        body: data,
      },
      false
    );
  }

  async updateTweet(tweetId, text, video, image) {
    const data = new FormData();
    data.append("text", text);
    data.append("video", video);
    data.append("image", image);
    return this.http.fetch(
      `/${tweetId}`,
      {
        method: "PUT",
        body: data,
      },
      false
    );
  }

  async clickGood(tweetId, good, clicked) {
    return this.http.fetch(
      `/${tweetId}/good`,
      {
        method: "PUT",
        body: JSON.stringify({ good, clicked }),
      },
      true
    );
  }

  async deleteTweet(tweetId) {
    return this.http.fetch(`/${tweetId}`, {
      method: "DELETE",
    });
  }

  onSync(callback) {
    return this.socket.onSync("tweets", callback);
  }
}
