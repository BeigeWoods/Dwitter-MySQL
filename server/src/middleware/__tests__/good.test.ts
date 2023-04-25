import httpMocks from "node-mocks-http";
import { GoodHandler } from "../../__dwitter__.d.ts/middleware/good";
import { TweetDataHandler } from "../../__dwitter__.d.ts/data/tweet";
import { GoodDataHandler } from "../../__dwitter__.d.ts/data/good";
import { GoodMiddleWare } from "../good";

describe("Good Middleware", () => {
  let goodMiddleware: GoodHandler;
  let goodRepository: jest.Mocked<GoodDataHandler | any> = {};
  let tweetRepository: jest.Mocked<TweetDataHandler | any> = {};
  let response: httpMocks.MockResponse<any>;
  let request: httpMocks.MockRequest<any>;
  let next: jest.Mock;
  let good: string | undefined, clicked: string | undefined;
  let id: number = 2;
  let userId: number = 1;

  beforeEach(() => {
    goodMiddleware = new GoodMiddleWare(tweetRepository, goodRepository);
    goodRepository.clickTweet = jest.fn();
    goodRepository.unClickTweet = jest.fn();
    tweetRepository.updateGood = jest.fn();
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("goodTweet", () => {
    it("go next middleware when values of good and clicked doesn't exist", () => {
      request = httpMocks.createRequest({
        params: { id },
        userId,
        body: {},
      });

      goodMiddleware.goodTweet(request, response, next);

      expect(next).toHaveBeenCalled();
    });

    it("return staus code 400 when user was clicked good but count is 0", () => {
      good = "0";
      clicked = String(userId);
      request = httpMocks.createRequest({
        params: { id },
        userId,
        body: { good, clicked },
      });

      goodMiddleware.goodTweet(request, response, next);

      expect(next).not.toHaveBeenCalled();
      expect(goodRepository.clickTweet).not.toHaveBeenCalled();
      expect(goodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(409);
    });

    it("switch unclicked to clicked when user was unclicked the good", () => {
      good = "0";
      clicked = "null";
      request = httpMocks.createRequest({
        params: { id },
        userId,
        body: { good, clicked },
      });

      goodMiddleware.goodTweet(request, response, next);

      expect(goodRepository.clickTweet).toHaveBeenCalledWith(userId, id);
      expect(goodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      // expect(tweetRepository.updateGood).toHaveBeenCalledWith(id, userId, 1);
      // expect(response.statusCode).toBe(201);
      // expect(response._getJSONData()).toMatchObject({
      //   id,
      //   good: 1,
      //   clicked: userId,
      // });
    });

    it("switch clicked to unclicked when user was clicked the good", () => {
      good = "1";
      clicked = String(userId);
      request = httpMocks.createRequest({
        params: { id },
        userId,
        body: { good, clicked },
      });

      goodMiddleware.goodTweet(request, response, next);

      expect(goodRepository.unClickTweet).toHaveBeenCalledWith(userId, id);
      expect(goodRepository.clickTweet).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      // expect(tweetRepository.updateGood).toHaveBeenCalledWith(id, userId, 0);
      // expect(response.statusCode).toBe(201);
      // expect(response._getJSONData()).toMatchObject({
      //   id,
      //   good: 0,
      //   clicked: 0,
      // });
    });
  });
});
