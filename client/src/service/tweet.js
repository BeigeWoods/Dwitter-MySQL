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

  async postTweet(text) {
    return this.http.fetch(`/`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  async deleteTweet(tweetId) {
    return this.http.fetch(`/${tweetId}`, {
      method: "DELETE",
    });
  }

  async updateTweet(tweetId, text) {
    return this.http.fetch(`/${tweetId}`, {
      method: "PUT",
      body: JSON.stringify({ text }),
    });
  }

  onSync(callback) {
    return this.socket.onSync("tweets", callback);
  }
}
