declare type GoodDataHandler = {
  tweet: {
    click(userId: number, tweetId: string): Promise<void>;
    unClick(userId: number, tweetId: string): Promise<void>;
  };
  comment: {
    click(userId: number, commentId: string): Promise<void>;
    unClick(userId: number, commentId: string): Promise<void>;
  };
};

export default GoodDataHandler;
