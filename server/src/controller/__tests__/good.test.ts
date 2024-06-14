import httpMocks from "node-mocks-http";
import { NextFunction } from "express";
import GoodController from "../good";
import {
  mockedGoodRepository,
  mockedTweetRepository,
  mockedCommentRepository,
} from "../../__mocked__/repository";

describe("GoodController", () => {
  const goodController = new GoodController(
    mockedTweetRepository,
    mockedCommentRepository,
    mockedGoodRepository
  );
  const userId = 1,
    tweetId = "2",
    commentId = "3";
  const reqOptions = (
    isTweet: boolean,
    good: string,
    clicked: string
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
  });

  describe("goodTweet", () => {
    test("calls next middleware when DB returns error at switching 'unclicked' to 'clicked'", async () => {
      request = httpMocks.createRequest(reqOptions(true, "0", "0"));
      mockedGoodRepository.clickTweet.mockRejectedValueOnce("Error");

      await goodController
        .goodTweet(request, response, next)
        .catch((error) =>
          expect(error).toBe("Error! goodController.goodTweet < Error")
        );

      expect(mockedGoodRepository.clickTweet).toHaveBeenCalledWith(
        userId,
        tweetId
      );
      expect(mockedGoodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(mockedTweetRepository.updateGood).not.toHaveBeenCalled();
      expect(response.statusCode).not.toBe(201);
    });

    test("return status 400 number of clicked good is zero", async () => {
      const warn = jest.spyOn(console, "warn");
      request = httpMocks.createRequest(reqOptions(true, "0", String(userId)));

      await goodController.goodTweet(request, response, next);

      expect(mockedGoodRepository.unClickTweet).not.toHaveBeenCalled();
      expect(mockedGoodRepository.clickTweet).not.toHaveBeenCalled();
      expect(mockedTweetRepository.updateGood).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledWith(
        "Warn! goodController.goodTweet\n number of clicked good is 0"
      );
      expect(response.statusCode).toBe(400);
    });

    test("switches 'clicked' to 'unclicked' when user click the good button", async () => {
      request = httpMocks.createRequest(reqOptions(true, "1", String(userId)));
      mockedGoodRepository.unClickTweet.mockResolvedValueOnce();
      mockedTweetRepository.updateGood.mockResolvedValueOnce();

      await goodController.goodTweet(request, response, next);

      expect(mockedGoodRepository.unClickTweet).toHaveBeenCalledWith(
        userId,
        tweetId
      );
      expect(mockedGoodRepository.clickTweet).not.toHaveBeenCalled();
      expect(mockedTweetRepository.updateGood).toHaveBeenCalledWith(tweetId, 0);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id: Number(tweetId),
        good: 0,
        clicked: 0,
      });
    });
  });

  describe("goodComment", () => {
    test("calls next middleware when DB returns error at switching 'unclicked' to 'clicked'", async () => {
      request = httpMocks.createRequest(reqOptions(false, "0", "0"));
      mockedGoodRepository.clickComment.mockRejectedValueOnce("Error");

      await goodController
        .goodComment(request, response, next)
        .catch((error) =>
          expect(error).toBe("Error! goodController.goodComment < Error")
        );

      expect(mockedGoodRepository.unClickComment).not.toHaveBeenCalled();
      expect(mockedGoodRepository.clickComment).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(mockedCommentRepository.updateGood).not.toHaveBeenCalled();
      expect(response.statusCode).not.toBe(201);
    });

    test("calls next middleware when DB returns error at switching 'clicked' to 'unclicked'", async () => {
      request = httpMocks.createRequest(reqOptions(false, "1", String(userId)));
      mockedGoodRepository.unClickComment.mockResolvedValueOnce();
      mockedCommentRepository.updateGood.mockRejectedValueOnce("Error");

      await goodController
        .goodComment(request, response, next)
        .catch((error) =>
          expect(error).toBe("Error! goodController.goodComment < Error")
        );

      expect(mockedGoodRepository.unClickComment).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(mockedGoodRepository.clickComment).not.toHaveBeenCalled();
      expect(mockedCommentRepository.updateGood).toHaveBeenCalledWith(
        commentId,
        0
      );
      expect(response.statusCode).not.toBe(201);
    });

    test("switches 'unclicked' to 'clicked' when user unclick the good button", async () => {
      request = httpMocks.createRequest(reqOptions(false, "0", "0"));
      mockedGoodRepository.clickComment.mockResolvedValueOnce();
      mockedCommentRepository.updateGood.mockResolvedValueOnce();

      await goodController.goodComment(request, response, next);

      expect(mockedGoodRepository.unClickComment).not.toHaveBeenCalled();
      expect(mockedGoodRepository.clickComment).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(mockedCommentRepository.updateGood).toHaveBeenCalledWith(
        commentId,
        1
      );
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id: Number(commentId),
        good: 1,
        clicked: userId,
      });
    });
  });
});
