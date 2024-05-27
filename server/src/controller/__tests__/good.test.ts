import httpMocks from "node-mocks-http";
import { NextFunction } from "express";
import GoodController from "../good";
import { GoodHandler } from "../../__dwitter__.d.ts/controller/good";
import {
  mockedGoodRepository,
  mockedTweetRepository,
  mockedCommentRepository,
} from "../../__mocked__/repository";

describe("GoodController", () => {
  const goodMiddleware: GoodHandler = new GoodController(
    mockedTweetRepository,
    mockedCommentRepository,
    mockedGoodRepository
  );
  const userId = 1,
    tweetId = 2,
    commentId = 3;
  const reqOptions = (
    isTweet: boolean,
    good: number,
    clicked: number
  ): httpMocks.RequestOptions => ({
    user: { id: 1 },
    params: isTweet ? { tweetId } : { commentId },
    body: { good, clicked },
  });
  let response: httpMocks.MockResponse<any>,
    request: httpMocks.MockRequest<any>,
    next: jest.Mock<NextFunction>;

  beforeEach(() => {
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("goodTweet", () => {
    test("calls next middleware when DB returns error at switching 'unclicked' to 'clicked'", async () => {
      request = httpMocks.createRequest(reqOptions(true, 0, 0));
      mockedGoodRepository.clickTweet.mockResolvedValue(new Error("No"));

      await goodMiddleware.goodTweet(request, response, next);

      expect(mockedGoodRepository.clickTweet).toHaveBeenCalledWith(
        userId,
        tweetId
      );
      expect(mockedGoodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(mockedTweetRepository.updateGood).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(response.statusCode).not.toBe(201);
    });

    test("switches 'clicked' to 'unclicked' when user click the good button", async () => {
      request = httpMocks.createRequest(reqOptions(true, 1, 1));
      mockedGoodRepository.unClickTweet.mockResolvedValue(undefined);
      mockedTweetRepository.updateGood.mockImplementation(
        (tweetId, good, callback) => Promise.resolve(callback(undefined))
      );

      await goodMiddleware.goodTweet(request, response, next);

      expect(mockedGoodRepository.unClickTweet).toHaveBeenCalledWith(
        userId,
        tweetId
      );
      expect(mockedGoodRepository.clickTweet).not.toHaveBeenCalled();
      expect(mockedTweetRepository.updateGood).toHaveBeenCalledWith(
        tweetId,
        0,
        expect.any(Function)
      );
      expect(next).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id: tweetId,
        good: 0,
        clicked: 0,
      });
    });
  });

  describe("goodComment", () => {
    test("calls next middleware when DB returns error at switching 'unclicked' to 'clicked'", async () => {
      request = httpMocks.createRequest(reqOptions(false, 0, 0));
      mockedGoodRepository.clickComment.mockResolvedValue(new Error("No"));

      await goodMiddleware.goodComment(request, response, next);

      expect(mockedGoodRepository.unClickComment).not.toHaveBeenCalled();
      expect(mockedGoodRepository.clickComment).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(mockedCommentRepository.updateGood).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(response.statusCode).not.toBe(201);
    });

    test("calls next middleware when DB returns error at switching 'clicked' to 'unclicked'", async () => {
      request = httpMocks.createRequest(reqOptions(false, 1, 1));
      mockedGoodRepository.unClickComment.mockResolvedValue(undefined);
      mockedCommentRepository.updateGood.mockImplementation(
        (commentId, good, callback) =>
          Promise.resolve(callback(new Error("No")))
      );

      await goodMiddleware.goodComment(request, response, next);

      expect(mockedGoodRepository.unClickComment).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(mockedGoodRepository.clickComment).not.toHaveBeenCalled();
      expect(mockedCommentRepository.updateGood).toHaveBeenCalledWith(
        commentId,
        0,
        expect.any(Function)
      );
      expect(next).toHaveBeenCalled();
      expect(response.statusCode).not.toBe(201);
    });

    test("switches 'unclicked' to 'clicked' when user unclick the good button", async () => {
      request = httpMocks.createRequest(reqOptions(false, 0, 0));
      mockedGoodRepository.clickComment.mockResolvedValue(undefined);
      mockedCommentRepository.updateGood.mockImplementation(
        (commentId, good, callback) => Promise.resolve(callback(undefined))
      );

      await goodMiddleware.goodComment(request, response, next);

      expect(mockedGoodRepository.unClickComment).not.toHaveBeenCalled();
      expect(mockedGoodRepository.clickComment).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(mockedCommentRepository.updateGood).toHaveBeenCalledWith(
        commentId,
        1,
        expect.any(Function)
      );
      expect(next).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id: commentId,
        good: 1,
        clicked: 1,
      });
    });
  });
});
