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

  async postComment(tweetId, text, recipient) {
    return this.http.fetch(
      `/${tweetId}/comments`,
      {
        method: "POST",
        body: JSON.stringify(recipient ? { text, recipient } : { text }),
      },
      true
    );
  }

  async updateComment(tweetId, commentId, text) {
    return this.http.fetch(
      `/${tweetId}/comments/${commentId}`,
      {
        method: "PUT",
        body: JSON.stringify({ text }),
      },
      true
    );
  }

  async clickGood(tweetId, commentId, clicked) {
    return this.http.fetch(
      `/${tweetId}/comments/${commentId}/good`,
      {
        method: "PUT",
        body: JSON.stringify({ clicked }),
      },
      true
    );
  }

  async deleteComment(tweetId, commentId) {
    return this.http.fetch(`/${tweetId}/comments/${commentId}`, {
      method: "DELETE",
    });
  }

  onSync(callback) {
    return this.socket.onSync("comments", callback);
  }
}
