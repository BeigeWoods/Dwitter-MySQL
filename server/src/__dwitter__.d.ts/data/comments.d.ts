export declare type OutputComment = {
  id: string;
  text: string;
  good: number;
  tweetId: string;
  userId: number;
  createdAt: typeof Date;
  updatedAt: typeof Date;
};

declare interface CommentDataHandler {
  getAll(tweetId: string, userId: number): Promise<OutputComment[] | void>;
  getById(
    tweetId: string,
    commentId: string,
    userId: number
  ): Promise<OutputComment | void>;
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

export declare class CommentRepository implements CommentDataHandler {
  private readonly Select_Feild: string;
  private readonly With_User_Reply: string;
  private readonly With_Good: string;
  private readonly Order_By: string;

  constructor();

  getAll: (tweetId: string, userId: number) => Promise<OutputComment[] | void>;
  getById: (
    tweetId: string,
    commentId: string,
    userId: number
  ) => Promise<OutputComment | void>;
  create: (
    userId: number,
    tweetId: string,
    text: string,
    recipient?: string
  ) => Promise<OutputComment | void>;
  update: (
    tweetId: string,
    commentId: string,
    userId: number,
    text: string
  ) => Promise<OutputComment | void>;
  updateGood(commentId: string, good: number): Promise<void>;
  delete: (commentId: string) => Promise<void>;
}

export default CommentDataHandler;
