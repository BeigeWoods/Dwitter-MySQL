import httpMocks from "node-mocks-http";
import GoodController from "../good";
import {
  mockedGoodRepository,
  mockedTweetRepository,
  mockedCommentRepository,
} from "../../__mocked__/handler";

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
    request: httpMocks.MockRequest<any>;

  beforeEach(() => (response = httpMocks.createResponse()));

  describe("good of tweet", () => {
    test("calls next middleware when DB returns error at switching 'unclicked' to 'clicked'", async () => {
      request = httpMocks.createRequest(reqOptions(true, "0", "0"));
      (mockedGoodRepository.tweet.click as jest.Mock).mockRejectedValueOnce(
        "Error"
      );

      await goodController
        .tweet(request, response)
        .catch((error) =>
          expect(error).toBe("## goodController.tweet < Error")
        );

      expect(mockedGoodRepository.tweet.click).toHaveBeenCalledWith(
        userId,
        tweetId
      );
      expect(mockedGoodRepository.tweet.unClick).not.toHaveBeenCalled();
      expect(mockedTweetRepository.updateGood).not.toHaveBeenCalled();
      expect(response.statusCode).not.toBe(201);
    });

    test("return status 400 number of clicked good is zero", async () => {
      const warn = jest.spyOn(console, "warn");
      request = httpMocks.createRequest(reqOptions(true, "0", String(userId)));

      await goodController.tweet(request, response);

      expect(mockedGoodRepository.tweet.unClick).not.toHaveBeenCalled();
      expect(mockedGoodRepository.tweet.click).not.toHaveBeenCalled();
      expect(mockedTweetRepository.updateGood).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledWith(
        "## goodController.tweet ##\n Number of clicked good is 0"
      );
      expect(response.statusCode).toBe(400);
    });

    test("switches 'clicked' to 'unclicked' when user click the good button", async () => {
      request = httpMocks.createRequest(reqOptions(true, "1", String(userId)));
      (mockedGoodRepository.tweet.unClick as jest.Mock).mockResolvedValueOnce(
        ""
      );
      mockedTweetRepository.updateGood.mockResolvedValueOnce();

      await goodController.tweet(request, response);

      expect(mockedGoodRepository.tweet.unClick).toHaveBeenCalledWith(
        userId,
        tweetId
      );
      expect(mockedGoodRepository.tweet.click).not.toHaveBeenCalled();
      expect(mockedTweetRepository.updateGood).toHaveBeenCalledWith(tweetId, 0);
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toMatchObject({
        id: Number(tweetId),
        good: 0,
        clicked: 0,
      });
    });
  });

  describe("good of comment", () => {
    test("calls next middleware when DB returns error at switching 'unclicked' to 'clicked'", async () => {
      request = httpMocks.createRequest(reqOptions(false, "0", "0"));
      (mockedGoodRepository.comment.click as jest.Mock).mockRejectedValueOnce(
        "Error"
      );

      await goodController
        .comment(request, response)
        .catch((error) =>
          expect(error).toBe("## goodController.comment < Error")
        );

      expect(mockedGoodRepository.comment.unClick).not.toHaveBeenCalled();
      expect(mockedGoodRepository.comment.click).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(mockedCommentRepository.updateGood).not.toHaveBeenCalled();
      expect(response.statusCode).not.toBe(201);
    });

    test("calls next middleware when DB returns error at switching 'clicked' to 'unclicked'", async () => {
      request = httpMocks.createRequest(reqOptions(false, "1", String(userId)));
      (mockedGoodRepository.comment.unClick as jest.Mock).mockResolvedValueOnce(
        ""
      );
      mockedCommentRepository.updateGood.mockRejectedValueOnce("Error");

      await goodController
        .comment(request, response)
        .catch((error) =>
          expect(error).toBe("## goodController.comment < Error")
        );

      expect(mockedGoodRepository.comment.unClick).toHaveBeenCalledWith(
        userId,
        commentId
      );
      expect(mockedGoodRepository.comment.click).not.toHaveBeenCalled();
      expect(mockedCommentRepository.updateGood).toHaveBeenCalledWith(
        commentId,
        0
      );
      expect(response.statusCode).not.toBe(201);
    });

    test("switches 'unclicked' to 'clicked' when user unclick the good button", async () => {
      request = httpMocks.createRequest(reqOptions(false, "0", "0"));
      (mockedGoodRepository.comment.click as jest.Mock).mockResolvedValueOnce(
        ""
      );
      mockedCommentRepository.updateGood.mockResolvedValueOnce();

      await goodController.comment(request, response);

      expect(mockedGoodRepository.comment.unClick).not.toHaveBeenCalled();
      expect(mockedGoodRepository.comment.click).toHaveBeenCalledWith(
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
