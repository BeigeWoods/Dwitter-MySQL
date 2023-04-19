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

  async updateTweet(tweetId, text, video, image, oldImg) {
    const data = new FormData();
    data.append("text", text);
    data.append("video", video);
    data.append("image", image);
    data.append("oldImg", oldImg);
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
    const data = new FormData();
    data.append("good", good);
    data.append("clicked", clicked);
    return this.http.fetch(
      `/${tweetId}`,
      {
        method: "PUT",
        body: data,
      },
      false
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
