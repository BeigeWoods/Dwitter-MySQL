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

  async postTweet(text, video, newImage) {
    const data = new FormData();
    data.append("text", text);
    data.append("video", video);
    data.append("newImage", newImage);
    return this.http.fetch(
      `/`,
      {
        method: "POST",
        body: data,
      },
      false
    );
  }

  async updateTweet(tweetId, text, video, newImage, image) {
    const data = new FormData();
    data.append("text", text);
    data.append("video", video);
    data.append("newImage", newImage);
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
        body: JSON.stringify({ good, clicked: Number(clicked) }),
      },
      true
    );
  }

  async deleteTweet(tweetId, image) {
    return this.http.fetch(`/${tweetId}`, {
      method: "DELETE",
      body: JSON.stringify({ image }),
    });
  }

  onSync(callback) {
    return this.socket.onSync("tweets", callback);
  }
}
