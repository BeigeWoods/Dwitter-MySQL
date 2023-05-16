import httpMocks from "node-mocks-http";
import { GoodHandler } from "../../__dwitter__.d.ts/middleware/good";
import { TweetDataHandler } from "../../__dwitter__.d.ts/data/tweet";
import { GoodDataHandler } from "../../__dwitter__.d.ts/data/good";
import { CommentDataHandler } from "../../__dwitter__.d.ts/data/comments";
import { GoodController } from "../good";

describe("GoodController", () => {
  let goodMiddleware: GoodHandler;
  let goodRepository: jest.Mocked<GoodDataHandler | any> = {};
  let tweetRepository: jest.Mocked<TweetDataHandler | any> = {};
  let commentRepository: jest.Mocked<CommentDataHandler | any> = {};
  let response: httpMocks.MockResponse<any>;
  let request: httpMocks.MockRequest<any>;
  let good: number | undefined, clicked: boolean | null | undefined;
  let tweetId: number = 2;
  let commentId: number = 2;
  let userId: number = 1;

  beforeEach(() => {
    goodMiddleware = new GoodController(
      tweetRepository,
      commentRepository,
      goodRepository
    );
    goodRepository.clickTweet = jest.fn();
    goodRepository.unClickTweet = jest.fn();
    goodRepository.clickComment = jest.fn();
    goodRepository.unClickComment = jest.fn();
    tweetRepository.updateGood = jest.fn();
    commentRepository.updateGood = jest.fn();
    response = httpMocks.createResponse();
  });

  describe("goodTweet", () => {
    it("return staus code 409 when data of clicked isn't boolean type", async () => {
      good = 0;
      clicked = undefined;
      request = httpMocks.createRequest({
        params: { tweetId },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodTweet(request, response);

      expect(goodRepository.clickTweet).not.toHaveBeenCalled();
      expect(goodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(409);
    });

    it("switch unclicked to clicked when user was unclicked the good", async () => {
      good = 0;
      clicked = false;
      request = httpMocks.createRequest({
        params: { tweetId },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodTweet(request, response);

      expect(goodRepository.clickTweet).toHaveBeenCalledWith(userId, tweetId);
      expect(goodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(tweetRepository.updateGood).toHaveBeenCalledWith(tweetId, 1);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        tweetId,
        good: 1,
        clicked: userId,
      });
    });

    it("switch clicked to unclicked when user was clicked the good", async () => {
      good = 1;
      clicked = true;
      request = httpMocks.createRequest({
        params: { tweetId },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodTweet(request, response);

      expect(goodRepository.unClickTweet).toHaveBeenCalledWith(userId, tweetId);
      expect(goodRepository.clickTweet).not.toHaveBeenCalled();
      expect(tweetRepository.updateGood).toHaveBeenCalledWith(tweetId, 0);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        tweetId,
        good: 0,
        clicked: null,
      });
    });
  });

  describe("goodComment", () => {
    it("return staus code 409 when data of clicked isn't boolean type", async () => {
      good = 0;
      clicked = null;
      request = httpMocks.createRequest({
        params: { commentId },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodComment(request, response);

      expect(goodRepository.clickComment).not.toHaveBeenCalled();
      expect(goodRepository.unClickComment).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(409);
    });

    it("switch unclicked to clicked when user was unclicked the good", async () => {
      good = 0;
      clicked = false;
      request = httpMocks.createRequest({
        params: { commentId },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodComment(request, response);

      expect(goodRepository.clickComment).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(goodRepository.unClickComment).not.toHaveBeenCalled();
      expect(commentRepository.updateGood).toHaveBeenCalledWith(commentId, 1);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id: Number(commentId),
        good: 1,
        clicked: userId,
      });
    });

    it("switch clicked to unclicked when user was clicked the good", async () => {
      good = 1;
      clicked = true;
      request = httpMocks.createRequest({
        params: { commentId },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodComment(request, response);

      expect(goodRepository.unClickComment).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(goodRepository.clickComment).not.toHaveBeenCalled();
      expect(commentRepository.updateGood).toHaveBeenCalledWith(commentId, 0);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id: Number(commentId),
        good: 0,
        clicked: null,
      });
    });
  });
});
