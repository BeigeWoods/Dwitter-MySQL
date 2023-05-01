import httpMocks from "node-mocks-http";
import { GoodHandler } from "../../__dwitter__.d.ts/middleware/good";
import { TweetDataHandler } from "../../__dwitter__.d.ts/data/tweet";
import { GoodDataHandler } from "../../__dwitter__.d.ts/data/good";
import { CommentDataHandler } from "../../__dwitter__.d.ts/data/comments";
import { GoodMiddleWare } from "../good";

describe("Good Middleware", () => {
  let goodMiddleware: GoodHandler;
  let goodRepository: jest.Mocked<GoodDataHandler | any> = {};
  let tweetRepository: jest.Mocked<TweetDataHandler | any> = {};
  let commentRepository: jest.Mocked<CommentDataHandler | any> = {};
  let response: httpMocks.MockResponse<any>;
  let request: httpMocks.MockRequest<any>;
  let next: jest.Mock;
  let good: string | undefined, clicked: string | undefined;
  let id: number = 2;
  let main: number = 2;
  let userId: number = 1;

  beforeEach(() => {
    goodMiddleware = new GoodMiddleWare(
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
    next = jest.fn();
  });

  describe("goodTweet", () => {
    it("go next middleware when values of good and clicked doesn't exist", async () => {
      request = httpMocks.createRequest({
        params: { id },
        userId,
        body: {},
      });

      await goodMiddleware.goodTweet(request, response, next);

      expect(next).toHaveBeenCalled();
    });

    it("return staus code 409 when user was clicked good but count is 0", async () => {
      good = "0";
      clicked = String(userId);
      request = httpMocks.createRequest({
        params: { id },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodTweet(request, response, next);

      expect(next).not.toHaveBeenCalled();
      expect(goodRepository.clickTweet).not.toHaveBeenCalled();
      expect(goodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(409);
    });

    it("switch unclicked to clicked when user was unclicked the good", async () => {
      good = "0";
      clicked = "null";
      request = httpMocks.createRequest({
        params: { id },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodTweet(request, response, next);

      expect(goodRepository.clickTweet).toHaveBeenCalledWith(userId, id);
      expect(goodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(tweetRepository.updateGood).toHaveBeenCalledWith(id, 1);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id,
        good: 1,
        clicked: userId,
      });
    });

    it("switch clicked to unclicked when user was clicked the good", async () => {
      good = "1";
      clicked = String(userId);
      request = httpMocks.createRequest({
        params: { id },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodTweet(request, response, next);

      expect(goodRepository.unClickTweet).toHaveBeenCalledWith(userId, id);
      expect(goodRepository.clickTweet).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(tweetRepository.updateGood).toHaveBeenCalledWith(id, 0);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id,
        good: 0,
        clicked: 0,
      });
    });
  });

  describe("goodComment", () => {
    it("go next middleware when values of good and clicked doesn't exist", async () => {
      request = httpMocks.createRequest({
        params: { main },
        userId,
        body: {},
      });

      await goodMiddleware.goodComment(request, response, next);

      expect(next).toHaveBeenCalled();
    });

    it("return staus code 409 when user was clicked good but count is 0", async () => {
      good = "0";
      clicked = String(userId);
      request = httpMocks.createRequest({
        params: { main },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodComment(request, response, next);

      expect(next).not.toHaveBeenCalled();
      expect(goodRepository.clickComment).not.toHaveBeenCalled();
      expect(goodRepository.unClickComment).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(409);
    });

    it("switch unclicked to clicked when user was unclicked the good", async () => {
      good = "0";
      clicked = "undefined";
      request = httpMocks.createRequest({
        params: { main },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodComment(request, response, next);

      expect(goodRepository.clickComment).toHaveBeenCalledWith(userId, main);
      expect(goodRepository.unClickComment).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(commentRepository.updateGood).toHaveBeenCalledWith(main, 1);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        main,
        good: 1,
        clicked: userId,
      });
    });

    it("switch clicked to unclicked when user was clicked the good", async () => {
      good = "1";
      clicked = String(userId);
      request = httpMocks.createRequest({
        params: { main },
        userId,
        body: { good, clicked },
      });

      await goodMiddleware.goodComment(request, response, next);

      expect(goodRepository.unClickComment).toHaveBeenCalledWith(userId, main);
      expect(goodRepository.clickComment).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(commentRepository.updateGood).toHaveBeenCalledWith(main, 0);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        main,
        good: 0,
        clicked: 0,
      });
    });
  });
});
