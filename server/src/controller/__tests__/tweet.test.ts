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
      request = httpMocks.createRequest({
        query: { username },
      });
      const userTweet = [{ text: faker.random.words(3) }];
      tweetRepository.getAllByUsername = jest.fn(() => userTweet);

      await tweetController.getTweets(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(userTweet);
      expect(tweetRepository.getAllByUsername).toHaveBeenCalledWith(username);
    });
  });

  describe("getTweet", () => {
    let tweets: { text: string }[], id: string;

    beforeEach(() => {
      id = faker.random.alphaNumeric(16);
      tweets = [
        { text: faker.random.words(3) },
        { text: faker.random.words(3) },
      ];
      request = httpMocks.createRequest({
        params: { id },
      });
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
    let content: string,
      videoUrl: string,
      match: string,
      image: string,
      userId: string;

    beforeEach(() => {
      content = faker.random.words(3);
      videoUrl = "https://youtu.be/q_VsCxx3jpo";
      match = "https://www.youtube.com/embed/q_VsCxx3jpo";
      image = faker.internet.url();
      userId = faker.random.alphaNumeric(16);
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
        file: { path: image },
        userId: userId,
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
        userId: userId,
      });

      await tweetController.createTweet(request, response);

      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        userId,
        video: match,
      });
      expect(tweetRepository.create).toHaveBeenCalledWith(
        userId,
        undefined,
        match,
        undefined
      );
    });

    it("send text, userId to websocket", async () => {
      request = httpMocks.createRequest({
        method: "POST",
        body: { text: content, video: videoUrl },
        file: { path: image },
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
      reqUserId: number,
      content: string,
      videoUrl: string,
      match: string,
      imageFile: string;

    beforeEach(() => {
      paramsId = faker.random.alphaNumeric(16);
      reqUserId = faker.datatype.number(3);
      content = faker.random.words(3);
      videoUrl = "https://youtu.be/q_VsCxx3jpo";
      match = "https://www.youtube.com/embed/q_VsCxx3jpo";
      imageFile = faker.internet.url();
      tweetRepository.update = jest.fn((id, text, video, image) => ({
        id,
        text,
        video,
        image,
      }));
      response = httpMocks.createResponse();
    });

    it("response 404 when tweet by given id doesn't exist", async () => {
      request = httpMocks.createRequest({
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
      request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { text: content, video: videoUrl },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => ({
        text: faker.random.words(3),
        userId: faker.random.alphaNumeric(2),
      }));

      await tweetController.updateTweet(request, response);

      expect(response.statusCode).toBe(403);
    });

    it("return updated tweet when id and uploading image is provided", async () => {
      request = httpMocks.createRequest({
        params: { id: paramsId },
        file: { path: imageFile },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => ({
        text: "",
        video: "",
        image: "",
        userId: reqUserId,
      }));

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        undefined,
        "",
        imageFile
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ image: imageFile });
    });

    it("return existing image when only id is provided", async () => {
      const existingImage = faker.internet.url();
      request = httpMocks.createRequest({
        params: { id: paramsId },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => ({
        text: "",
        video: "",
        image: existingImage,
        userId: reqUserId,
      }));

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
        undefined,
        "",
        existingImage
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toMatchObject({ image: existingImage });
    });

    it("return updated tweet when id and video are provided", async () => {
      request = httpMocks.createRequest({
        params: { id: paramsId },
        body: { video: videoUrl },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => ({
        text: "",
        video: "",
        image: "",
        userId: reqUserId,
      }));

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
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
        body: { text: content, video: videoUrl },
        file: { path: imageFile },
        userId: reqUserId,
      });
      tweetRepository.getById = jest.fn(() => ({
        text: "",
        video: "",
        image: "",
        userId: reqUserId,
      }));

      await tweetController.updateTweet(request, response);

      expect(tweetRepository.update).toHaveBeenCalledWith(
        paramsId,
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
    let paramsId: string, reqUserId: number, text: string;

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
