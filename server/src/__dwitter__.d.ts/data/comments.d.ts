export declare type OutputComment = {
  id: string;
  text: string;
  good: number;
  tweetId: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

declare interface CommentDataHandler {
  getAll(tweetId: string, userId: number): Promise<OutputComment[] | void>;
  create(
    userId: number,
    tweetId: string,
    text: string,
    recipient?: string
  ): Promise<OutputComment | void>;
  update(
    tweetId: string,
    commentId: string,
    userId: number,
    text: string
  ): Promise<OutputComment | void>;
  updateGood(id: string, good: number): Promise<void>;
  delete(commentId: string): Promise<void>;
}

export default CommentDataHandler;
