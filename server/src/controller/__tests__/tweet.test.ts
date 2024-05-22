import httpMocks from "node-mocks-http";
import faker from "faker";
import { NextFunction } from "express";
import TweetController from "../tweet";
import { mockedTweetRepository } from "../../__mocked__/repository";
import { mockTweet } from "../../__mocked__/data";

describe("Tweet Controller", () => {
  const mockedSocket: jest.Mocked<any> = { emit: jest.fn() };
  const tweetController = new TweetController(
    mockedTweetRepository,
    () => mockedSocket
  );
  const tweetId = 2,
    text = faker.random.words(3),
    video = "https://youtu.be/q_VsCxx3jpo",
    match = "https://www.youtube.com/embed/q_VsCxx3jpo",
    image = faker.internet.url(),
    oldImg = faker.internet.url();
  let response: httpMocks.MockResponse<any>,
    request: httpMocks.MockRequest<any>,
    next: jest.Mock<NextFunction>;

  beforeEach(() => {
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("getTweets", () => {
    test("returns all tweets when username is not provided", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions());
      mockedTweetRepository.getAll.mockResolvedValueOnce([mockTweet.tweet()]);

      await tweetController.getTweets(request, response, next);

      expect(next).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual([mockTweet.tweet()]);
    });

    test("returns tweets for the given user when username is provided", async () => {
      request = httpMocks.createRequest(
        mockTweet.reqOptions(NaN, "", "", "", "", "smith")
      );
      mockedTweetRepository.getAllByUsername.mockResolvedValueOnce([
        mockTweet.tweet(),
      ]);

      await tweetController.getTweets(request, response, next);

      expect(mockedTweetRepository.getAllByUsername).toHaveBeenCalledWith(
        1,
        "smith"
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual([mockTweet.tweet()]);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getTweet", () => {
    test("returns status 404 when given tweetId doesn't exist", async () => {
      mockedTweetRepository.getById.mockResolvedValueOnce(undefined);

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual({
        message: `Tweet not found`,
      });
    });

    test("returns tweet when tweetId is provided", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(tweetId));
      mockedTweetRepository.getById.mockResolvedValueOnce(mockTweet.tweet());

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(mockTweet.tweet());
      expect(mockedTweetRepository.getById).toHaveBeenCalledWith(tweetId, 1);
    });
  });

  describe("createTweet", () => {
    test("returns tweet and sends data to websocket when all data is provided", async () => {
      request = httpMocks.createRequest(
        mockTweet.reqOptions(NaN, text, video, image)
      );
      mockedTweetRepository.create.mockResolvedValueOnce(mockTweet.tweet());

      await tweetController.createTweet(request, response, next);

      expect(mockedTweetRepository.create).toHaveBeenCalledWith(
        1,
        text,
        match,
        image
      );
      expect(next).not.toHaveBeenCalled();
      expect(mockedSocket.emit).toHaveBeenCalledWith(
        "tweets",
        mockTweet.tweet()
      );
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject(mockTweet.tweet());
    });

    test("will call next middleware if DB returns nothing when creates tweet for the given video", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(NaN, "", video));
      mockedTweetRepository.create.mockResolvedValueOnce(undefined);

      await tweetController.createTweet(request, response, next);

      expect(mockedTweetRepository.create).toHaveBeenCalledWith(
        1,
        "",
        match,
        ""
      );
      expect(next).toHaveBeenCalled();
      expect(response.statusCode).not.toBe(201);
    });
  });

  describe("updateTweet", () => {
    test("returns updated tweet for given new image even if existing image is provided", async () => {
      request = httpMocks.createRequest(
        mockTweet.reqOptions(tweetId, "", "", image, oldImg)
      );
      mockedTweetRepository.update.mockResolvedValueOnce(mockTweet.tweet());

      await tweetController.updateTweet(request, response, next);

      expect(mockedTweetRepository.update).toHaveBeenCalledWith(
        tweetId,
        1,
        "",
        "",
        image
      );
      expect(response.statusCode).toBe(200);
      expect(next).not.toHaveBeenCalled();
    });

    test("returns updated tweet for existing image when new image isn't provided", async () => {
      request = httpMocks.createRequest(
        mockTweet.reqOptions(tweetId, "", "", "", oldImg)
      );
      mockedTweetRepository.update.mockResolvedValueOnce(mockTweet.tweet());

      await tweetController.updateTweet(request, response, next);

      expect(mockedTweetRepository.update).toHaveBeenCalledWith(
        tweetId,
        1,
        "",
        "",
        oldImg
      );
      expect(response.statusCode).toBe(200);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("deleteTweet", () => {
    test("calls next middleware when DB returns error at deleting tweet", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(tweetId));
      mockedTweetRepository.remove.mockImplementation((tweetId, callback) =>
        Promise.resolve(callback(new Error("Error")))
      );

      await tweetController.deleteTweet(request, response, next);

      expect(mockedTweetRepository.remove).toHaveBeenCalledWith(
        tweetId,
        expect.any(Function)
      );
      expect(next).toHaveBeenCalled();
      expect(response.statusCode).not.toBe(204);
    });

    test("returns status 204 when tweetId is provided", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(tweetId));
      mockedTweetRepository.remove.mockImplementation((tweetId, callback) =>
        Promise.resolve(callback(undefined))
      );

      await tweetController.deleteTweet(request, response, next);

      expect(mockedTweetRepository.remove).toHaveBeenCalledWith(
        tweetId,
        expect.any(Function)
      );
      expect(next).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(204);
    });
  });
});
