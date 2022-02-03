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
    let text, video, matchVideo, image, userId, request, response;

    beforeEach(() => {
      text = faker.random.words(3);
      video = "https://youtu.be/q_VsCxx3jpo";
      matchVideo = "https://www.youtube.com/embed/q_VsCxx3jpo";
      image = faker.internet.url();
      userId = faker.random.alphaNumeric(16);
      response = httpMocks.createResponse();
      tweetRepository.create = jest.fn((userId, text, video) => ({
        userId,
        text,
        video,
        image,
      }));
    });

    it("returns tweet when all data is provided", async () => {
      request = httpMocks.createRequest({
        method: "POST",
        body: { text, video },
        file: { path: image },
        userId: userId,
      });

      await tweetController.createTweet(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        userId,
        text,
        video: matchVideo,
        image,
      });
      expect(tweetRepository.create).toHaveBeenCalledWith(
        userId,
        text,
        matchVideo,
        image
      );
    });

    it("returns tweet when only video is provided", async () => {
      request = httpMocks.createRequest({
        method: "POST",
        body: { video },
        userId: userId,
      });

      await tweetController.createTweet(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        userId,
        video: matchVideo,
      });
      expect(tweetRepository.create).toHaveBeenCalledWith(
        userId,
        undefined,
        matchVideo,
        undefined
      );
    });

    it("send text, userId to websocket", async () => {
      request = httpMocks.createRequest({
        method: "POST",
        body: { text, video },
        file: { path: image },
        userId,
      });

      await tweetController.createTweet(request, response);

      expect(mockedSocket.emit).toHaveBeenLastCalledWith("tweets", {
        image,
        text,
        userId,
        video: matchVideo,
      });
    });
  });

  describe("updateTweet", () => {
    let paramsId, reqUserId, content, mediaUrl, matchVideo, imageFile, response;

    beforeEach(() => {
      paramsId = faker.random.alphaNumeric(16);
      reqUserId = faker.datatype.number(3);
      content = faker.random.words(3);
      mediaUrl = "https://youtu.be/q_VsCxx3jpo";
      matchVideo = "https://www.youtube.com/embed/q_VsCxx3jpo";
      imageFile = faker.internet.url();
      response = httpMocks.createResponse();
      tweetRepository.update = jest.fn((id, text, video, image) => ({
        text,
        video,
        image,
      }));
      tweetRepository.getById = jest.fn(() => ({
        text: faker.random.words(3),
        video: faker.internet.url(),
        image: faker.internet.url(),
        userId: reqUserId,
      }));
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
        body: { text: content, video: mediaUrl },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => ({
        text: faker.random.words(3),
        userId: faker.random.alphaNumeric(2),
      }));

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(403);
    });

    it("return updated tweet when id and video are provided", async () => {
      const request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { video: mediaUrl },
        userId: reqUserId,
      });

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ video: matchVideo });
      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        undefined,
        matchVideo,
        undefined
      );
    });

    it("return updated tweet when all data are provided", async () => {
      const request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { text: content, video: mediaUrl },
        file: { path: imageFile },
        userId: reqUserId,
      });

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({
        text: content,
        video: matchVideo,
        image: imageFile,
      });
      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        content,
        matchVideo,
        imageFile
      );
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
