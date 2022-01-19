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
      const reqeust = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const allTweets = [
        { text: faker.random.words(3) },
        { text: faker.random.words(3) },
      ];
      tweetRepository.getAll = () => allTweets;

      await tweetController.getTweets(reqeust, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(allTweets);
    });
  });
});
