export declare type OutputComment = {
  id: number;
  text: string;
  good: number;
  tweetId: string;
  recipient: string | null;
  userId: number;
  clicked: boolean;
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
  delete(commentId: string): Promise<void>;
}

export default CommentDataHandler;
