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

  async postComment(tweetId, text) {
    return this.http.fetch(
      `/${tweetId}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ text }),
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

  async deleteComment(tweetId, mainId) {
    return this.http.fetch(`/${tweetId}/comments/${mainId}`, {
      method: "DELETE",
    });
  }

  onSync(callback) {
    return this.socket.onSync("main comments", callback);
  }
}
