import httpMocks from "node-mocks-http";
import faker from "faker";
import { TweetController } from "../tweet";
import { TweetHandler } from "../../__dwitter__.d.ts/controller/tweet";
import { TweetDataHandler } from "../../__dwitter__.d.ts/data/tweet";

describe("Tweet Controller", () => {
  let tweetController: TweetHandler;
  let tweetRepository: jest.Mocked<TweetDataHandler | any>;
  let mockedSocket: jest.Mocked<any>;
  let response: httpMocks.MockResponse<any>;
  let request: httpMocks.MockRequest<any>;
  let userId: number = 1;
  let good: number = 1;
  let clicked: null | number = null;

  beforeEach(() => {
    tweetRepository = {};
    mockedSocket = { emit: jest.fn() };
    tweetController = new TweetController(tweetRepository, () => mockedSocket);
    response = httpMocks.createResponse();
  });

  describe("getTweets", () => {
    it("returns all tweets when username is not provided", async () => {
      request = httpMocks.createRequest();
      const allTweets = [
        { text: faker.random.words(3), good, clicked },
        { text: faker.random.words(3), good, clicked },
      ];
      tweetRepository.getAll = () => allTweets;

      await tweetController.getTweets(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(allTweets);
    });

    it("returns tweets for the given user when username is provided", async () => {
      const username = faker.internet.userName();
      request = httpMocks.createRequest({
        userId,
        query: { username },
      });
      const userTweet = [{ text: faker.random.words(3), good, clicked }];
      tweetRepository.getAllByUsername = jest.fn(() => userTweet);

      await tweetController.getTweets(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(userTweet);
      expect(tweetRepository.getAllByUsername).toHaveBeenCalledWith(
        userId,
        username
      );
    });
  });

  describe("getTweet", () => {
    let tweets: { text: string; good: number; clicked: null | number }[],
      id: string;

    beforeEach(() => {
      id = faker.random.alphaNumeric(16);
      tweets = [
        { text: faker.random.words(3), good, clicked },
        { text: faker.random.words(3), good, clicked },
      ];
      request = httpMocks.createRequest({
        params: { id },
        userId,
      });
    });

    it("response 404 when given id doesn't exist", async () => {
      tweetRepository.getById = jest.fn(() => undefined);

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual({
        message: `Tweet not found`,
      });
    });

    it("returns tweets when id is provided", async () => {
      tweetRepository.getById = jest.fn(() => tweets);

      await tweetController.getTweet(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(tweets);
      expect(tweetRepository.getById).toHaveBeenCalledWith(id, 1);
    });
  });

  describe("createTweet", () => {
    let content: string, videoUrl: string, match: string, image: string;

    beforeEach(() => {
      content = faker.random.words(3);
      videoUrl = "https://youtu.be/q_VsCxx3jpo";
      match = "https://www.youtube.com/embed/q_VsCxx3jpo";
      image = faker.internet.url();
      tweetRepository.create = jest.fn((userId, text, video, image) => ({
        userId,
        text,
        video,
        image,
      }));
    });

    it("returns tweet when all data is provided", async () => {
      request = httpMocks.createRequest({
        method: "POST",
        body: { text: content, video: videoUrl },
        file: { location: image },
        userId,
      });

      await tweetController.createTweet(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        userId,
        text: content,
        video: match,
        image,
      });
      expect(tweetRepository.create).toHaveBeenCalledWith(
        userId,
        content,
        match,
        image
      );
    });

    it("returns tweet when only video is provided", async () => {
      request = httpMocks.createRequest({
        method: "POST",
        body: { video: videoUrl },
        userId,
      });

      await tweetController.createTweet(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        userId,
        video: match,
      });
      expect(tweetRepository.create).toHaveBeenCalledWith(
        userId,
        "",
        match,
        ""
      );
    });

    it("send text, userId to websocket", async () => {
      request = httpMocks.createRequest({
        method: "POST",
        body: { text: content, video: videoUrl },
        file: { location: image },
        userId,
      });

      await tweetController.createTweet(request, response);

      expect(mockedSocket.emit).toHaveBeenLastCalledWith("tweets", {
        image,
        text: content,
        userId,
        video: match,
      });
    });
  });

  describe("updateTweet", () => {
    let paramsId: string,
      content: string,
      videoUrl: string,
      match: string,
      imageFile: string,
      oldImgFile: String;

    beforeEach(() => {
      paramsId = faker.random.alphaNumeric(16);
      content = faker.random.words(3);
      videoUrl = "https://youtu.be/q_VsCxx3jpo";
      match = "https://www.youtube.com/embed/q_VsCxx3jpo";
      imageFile = faker.internet.url();
      oldImgFile = faker.internet.url();
      tweetRepository.update = jest.fn((id, userId, text, video, image) => ({
        id,
        userId,
        text,
        video,
        image,
      }));
      response = httpMocks.createResponse();
    });

    it("return updated tweet when id and uploading image is provided", async () => {
      request = httpMocks.createRequest({
        params: { id: paramsId },
        file: { location: imageFile },
        userId,
      });

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        userId,
        undefined,
        "",
        imageFile
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ image: imageFile });
    });

    it("return updated tweet when id, uploading image and existing image are provided", async () => {
      request = httpMocks.createRequest({
        params: { id: paramsId },
        file: { location: imageFile },
        body: { oldImg: oldImgFile },
        userId,
      });

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        userId,
        undefined,
        "",
        imageFile
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ image: imageFile });
    });

    it("return existing image when only id and existing image are provided", async () => {
      request = httpMocks.createRequest({
        params: { id: paramsId },
        userId,
        body: { oldImg: oldImgFile },
      });

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        userId,
        undefined,
        "",
        oldImgFile
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ image: oldImgFile });
    });

    it("return updated tweet when id and video are provided", async () => {
      request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { video: videoUrl },
        userId,
      });

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        userId,
        undefined,
        match,
        ""
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ video: match });
    });

    it("return updated tweet when all data are provided", async () => {
      request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { text: content, video: videoUrl, oldImg: oldImgFile },
        file: { location: imageFile },
        userId,
      });

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        userId,
        content,
        match,
        imageFile
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({
        text: content,
        video: match,
        image: imageFile,
      });
    });
  });

  describe("deleteTweet", () => {
    let paramsId: string, userId: number, text: string;

    beforeEach(() => {
      paramsId = faker.random.alphaNumeric(16);
      userId = faker.datatype.number(3);
      text = faker.random.words(3);
      request = httpMocks.createRequest({
        params: { id: paramsId },
        userId,
      });
      response = httpMocks.createResponse();
    });

    it("response 204 when id are provided", async () => {
      tweetRepository.getById = jest.fn(() => ({
        text,
        userId,
      }));
      tweetRepository.remove = jest.fn();

      await tweetController.deleteTweet(request, response);

      expect(response.statusCode).toBe(204);
      expect(tweetRepository.remove).toHaveBeenCalledWith(paramsId);
    });
  });
});
