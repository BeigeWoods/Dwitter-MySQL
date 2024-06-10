declare type CommentData = {
  id: string;
  text: string;
  good: number;
  tweetId: string;
  userId: number;
  createdAt: object;
  updatedAt: object;
};

export declare interface CommentDataHandler {
  getAll(
    tweetId: string,
    userId: number
  ): Promise<CommentData[] | never | void>;
  getById(
    tweetId: string,
    commentId: string,
    userId: number
  ): Promise<CommentData | never | void>;
  create(
    userId: number,
    tweetId: string,
    text: string,
    recipient?: string
  ): Promise<CommentData | never | void>;
  createReply(
    commentId: string,
    username: string
  ): Promise<unknown[] | never | void>;
  update(
    tweetId: string,
    commentId: string,
    userId: number,
    text: string
  ): Promise<CommentData | never | void>;
  updateGood(id: string, good: number): Promise<never | void>;
  remove(commentId: string): Promise<never | void>;
}

export declare class CommentRepository implements CommentDataHandler {
  private readonly Select_Feild: string;
  private readonly With_User_Reply: string;
  private readonly With_Good: string;
  private readonly Order_By: string;

  constructor();

  getAll: (
    tweetId: string,
    userId: number
  ) => Promise<CommentData[] | never | void>;
  getById: (
    tweetId: string,
    commentId: string,
    userId: number
  ) => Promise<CommentData | never | void>;
  create: (
    userId: number,
    tweetId: string,
    text: string,
    recipient?: string
  ) => Promise<CommentData | never | void>;
  createReply: (
    commentId: string,
    username: string
  ) => Promise<unknown[] | never | void>;
  update: (
    tweetId: string,
    commentId: string,
    userId: number,
    text: string
  ) => Promise<CommentData | never | void>;
  updateGood(commentId: string, good: number): Promise<never | void>;
  remove: (commentId: string) => Promise<never | void>;
}
