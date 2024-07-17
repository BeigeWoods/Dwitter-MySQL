import httpMocks from "node-mocks-http";
import faker from "faker";
import TweetController from "../tweet";
import awsS3 from "../../middleware/awsS3";
import { mockedTweetRepository } from "../../__mocked__/handler";
import { mockTweet } from "../../__mocked__/data";

jest.mock("../../middleware/awsS3", () => ({ deleteImage: jest.fn() }));

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
    newImage = faker.internet.url(),
    image = faker.internet.url();
  let response: httpMocks.MockResponse<any>,
    request: httpMocks.MockRequest<any>;

  beforeEach(() => {
    response = httpMocks.createResponse();
  });

  describe("getAll", () => {
    test("returns all tweets when username is not provided", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions());
      mockedTweetRepository.getAll.mockResolvedValueOnce([mockTweet.tweet()]);

      await tweetController.getAll(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual([mockTweet.tweet()]);
    });

    test("returns tweets for the given user when username is provided", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(NaN, {}, "smith"));
      mockedTweetRepository.getAllByUsername.mockResolvedValueOnce([
        mockTweet.tweet(),
      ]);

      await tweetController.getAll(request, response);

      expect(mockedTweetRepository.getAllByUsername).toHaveBeenCalledWith(
        1,
        "smith"
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual([mockTweet.tweet()]);
    });
  });

  describe("getById", () => {
    test("returns status 404 when given tweetId doesn't exist", async () => {
      mockedTweetRepository.getById.mockResolvedValueOnce(undefined);

      await tweetController.getById(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual({
        message: "Tweet not found",
      });
    });

    test("returns tweet when tweetId is provided", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(tweetId));
      mockedTweetRepository.getById.mockResolvedValueOnce(mockTweet.tweet());

      await tweetController.getById(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(mockTweet.tweet());
      expect(mockedTweetRepository.getById).toHaveBeenCalledWith(tweetId, 1);
    });
  });

  describe("create", () => {
    test("returns tweet and sends data to websocket when all data is provided", async () => {
      request = httpMocks.createRequest(
        mockTweet.reqOptions(NaN, { text, video, newImage })
      );
      mockedTweetRepository.create.mockResolvedValueOnce(mockTweet.tweet());

      await tweetController.create(request, response);

      expect(mockedTweetRepository.create).toHaveBeenCalledWith(1, {
        text,
        video: match,
        image: newImage,
      });
      expect(mockedSocket.emit).toHaveBeenCalledWith(
        "tweets",
        mockTweet.tweet()
      );
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject(mockTweet.tweet());
    });

    test("will throw an error if DB returns nothing when creates tweet for the given video", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(NaN, { video }));
      mockedTweetRepository.create.mockRejectedValueOnce("Error");

      await tweetController
        .create(request, response)
        .catch((error) =>
          expect(error).toBe("## tweetController.create < Error")
        );

      expect(mockedTweetRepository.create).toHaveBeenCalledWith(1, {
        text: "",
        video: match,
        image: "",
      });
      expect(response.statusCode).not.toBe(201);
    });
  });

  describe("update", () => {
    test("returns updated tweet for given new image", async () => {
      request = httpMocks.createRequest(
        mockTweet.reqOptions(tweetId, { newImage, image })
      );
      (awsS3.deleteImage as jest.Mock).mockResolvedValueOnce("");
      mockedTweetRepository.update.mockResolvedValueOnce(mockTweet.tweet());

      await tweetController.update(request, response);

      expect(mockedTweetRepository.update).toHaveBeenCalledWith(tweetId, 1, {
        text: "",
        video: "",
        image: newImage,
      });
      expect(response.statusCode).toBe(200);
    });

    test("returns status 400 when a existed image isn't given, but a new image.", async () => {
      request = httpMocks.createRequest(
        mockTweet.reqOptions(tweetId, { image })
      );
      mockedTweetRepository.update.mockResolvedValueOnce(mockTweet.tweet());

      await tweetController.update(request, response);

      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toEqual({
        message: "Invalid values to convert image",
      });
      expect(awsS3.deleteImage).not.toHaveBeenCalled();
      expect(mockedTweetRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("calls next middleware when DB returns error at deleting tweet", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(tweetId));
      (awsS3.deleteImage as jest.Mock).mockResolvedValueOnce("");
      mockedTweetRepository.delete.mockRejectedValueOnce("Error");

      await tweetController
        .delete(request, response)
        .catch((error) =>
          expect(error).toBe("## tweetController.delete < Error")
        );

      expect(mockedTweetRepository.delete).toHaveBeenCalledWith(tweetId);
      expect(response.statusCode).not.toBe(204);
    });

    test("returns status 204 when tweetId is provided", async () => {
      request = httpMocks.createRequest(mockTweet.reqOptions(tweetId));
      (awsS3.deleteImage as jest.Mock).mockResolvedValueOnce("");
      mockedTweetRepository.delete.mockResolvedValueOnce(undefined);

      await tweetController.delete(request, response);

      expect(mockedTweetRepository.delete).toHaveBeenCalledWith(tweetId);
      expect(response.statusCode).toBe(204);
    });
  });
});
