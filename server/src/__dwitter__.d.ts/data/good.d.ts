declare type GoodDataHandler = {
  click(userId: number, contentId: string, isTweet: boolean): Promise<void>;
  unClick(userId: number, contentId: string, isTweet: boolean): Promise<void>;
};

export default GoodDataHandler;
