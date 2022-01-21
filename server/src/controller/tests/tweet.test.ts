import httpMocks from "node-mocks-http";
import faker from "faker";
import { TweetController } from "../tweet";

describe("Tweet Controller", () => {
  let tweetController;
  let tweetRepository;
  let mockedSocket;

  beforeEach(() => {
    tweetRepository = {};
    mockedSocket = { emit: jest.fn() };
    tweetController = new TweetController(tweetRepository, () => mockedSocket);
  });

  describe("getTweets", () => {
    it("returns all tweets when username is not provided", async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const allTweets = [
        { text: faker.random.words(3) },
        { text: faker.random.words(3) },
      ];
      tweetRepository.getAll = () => allTweets;

      await tweetController.getTweets(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(allTweets);
    });

    it("returns tweets for the given user when username is provided", async () => {
      const username = faker.internet.userName();
      const reqeust = httpMocks.createRequest({
        query: { username },
      });
      const response = httpMocks.createResponse();
      const userTweet = [{ text: faker.random.words(3) }];
      //tweetRepository.getAllByUsername = () => userTweet;
      tweetRepository.getAllByUsername = jest.fn(() => userTweet);

      await tweetController.getTweets(reqeust, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(userTweet);
      expect(tweetRepository.getAllByUsername).toHaveBeenCalledWith(username);
    });
  });

  describe("getTweet", () => {
    let tweets, id, request, response;

    beforeEach(() => {
      id = faker.random.alphaNumeric(16);
      tweets = [
        { text: faker.random.words(3) },
        { text: faker.random.words(3) },
      ];
      request = httpMocks.createRequest({
        params: { id },
      });
      response = httpMocks.createResponse();
    });

    it("response 404 when given id doesn't exist", async () => {
      tweetRepository.getById = jest.fn(() => undefined);

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual({
        message: `Tweet id(${id}) not found`,
      });
    });

    it("returns tweets when id is provided", async () => {
      tweetRepository.getById = jest.fn(() => tweets);

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(tweets);
      expect(tweetRepository.getById).toHaveBeenCalledWith(id);
    });
  });

  describe("createTweet", () => {
    let text, userId, request, response;

    beforeEach(() => {
      text = faker.random.words(3);
      userId = faker.random.alphaNumeric(16);
      request = httpMocks.createRequest({
        method: "POST",
        body: { text },
        userId: userId,
      });
      response = httpMocks.createResponse();
    });

    it("returns tweet when text is provided", async () => {
      tweetRepository.create = jest.fn((text, userId) => ({ text, userId }));

      await tweetController.createTweet(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({ text, userId });
      expect(tweetRepository.create).toHaveBeenCalledWith(text, userId);
    });

    it("send text, userId to websocket", async () => {
      tweetRepository.create = jest.fn((text, userId) => ({ text, userId }));

      await tweetController.createTweet(request, response);

      expect(mockedSocket.emit).toHaveBeenLastCalledWith("tweets", {
        text,
        userId,
      });
    });
  });
  describe("updateTweet", () => {
    let paramsId, reqUserId, content, response;

    beforeEach(() => {
      paramsId = faker.random.alphaNumeric(16);
      reqUserId = faker.datatype.number(3);
      content = faker.random.words(3);
      response = httpMocks.createResponse();
    });

    it("response 404 when tweet by given id doesn't exist", async () => {
      const request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { text: content },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => undefined);

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual({
        message: `Tweet not found: ${paramsId}`,
      });
    });

    it("response 403 when tweet userId doesn't match with request userId", async () => {
      const request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { text: content },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => ({
        text: faker.random.words(3),
        userId: faker.random.alphaNumeric(2),
      }));
      tweetRepository.update = jest.fn((id, text) => ({ text }));

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(403);
    });

    it("return updated tweet when id and text are provided", async () => {
      const request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { text: content },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => ({
        text: faker.random.words(3),
        userId: reqUserId,
      }));
      tweetRepository.update = jest.fn((id, text) => ({ text }));

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ text: content });
      expect(tweetRepository.update).toHaveBeenCalledWith(paramsId, content);
    });
  });

  describe("deleteTweet", () => {
    let paramsId, reqUserId, text, request, response;

    beforeEach(() => {
      paramsId = faker.random.alphaNumeric(16);
      reqUserId = faker.datatype.number(3);
      text = faker.random.words(3);
      request = httpMocks.createRequest({
        params: { id: paramsId },
        userId: reqUserId,
      });
      response = httpMocks.createResponse();
    });

    it("response 404 when tweet by given id doesn't exist", async () => {
      tweetRepository.getById = jest.fn(() => undefined);

      await tweetController.deleteTweet(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual({
        message: `Tweet not found: ${paramsId}`,
      });
    });

    it("response 403 when tweet userId doesn't match with request userId", async () => {
      tweetRepository.getById = jest.fn(() => ({
        text,
        userId: faker.random.alphaNumeric(2),
      }));

      await tweetController.deleteTweet(request, response);

      expect(response.statusCode).toBe(403);
    });

    it("response 204 when id are provided", async () => {
      tweetRepository.getById = jest.fn(() => ({
        text,
        userId: reqUserId,
      }));
      tweetRepository.remove = jest.fn();

      await tweetController.deleteTweet(request, response);

      expect(response.statusCode).toBe(204);
      expect(tweetRepository.remove).toHaveBeenCalledWith(paramsId);
    });
  });
});
