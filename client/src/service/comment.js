export default class CommentService {
  constructor(http, socket) {
    this.http = http;
    this.socket = socket;
  }

  async getComments(tweetId) {
    return this.http.fetch(`/${tweetId}/comments`, {
      method: "GET",
    });
  }

  async postComment(tweetId, text, repliedUser) {
    return this.http.fetch(
      `/${tweetId}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ text, repliedUser }),
      },
      true
    );
  }

  async updateComment(tweetId, mainId, text) {
    return this.http.fetch(
      `/${tweetId}/comments/${mainId}`,
      {
        method: "PUT",
        body: JSON.stringify({ text }),
      },
      true
    );
  }

  async clickGood(tweetId, mainId, good, clicked) {
    return this.http.fetch(
      `/${tweetId}/comments/${mainId}/good`,
      {
        method: "PUT",
        body: JSON.stringify({ good, clicked }),
      },
      true
    );
  }

  async deleteComment(tweetId, mainId) {
    return this.http.fetch(`/${tweetId}/comments/${mainId}`, {
      method: "DELETE",
    });
  }

  onSync(callback) {
    return this.socket.onSync("comments", callback);
  }
}
