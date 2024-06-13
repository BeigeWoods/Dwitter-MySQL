import httpMocks from "node-mocks-http";
import { NextFunction } from "express";
import { hash, compare } from "bcrypt";
import {
  mockedOauthController,
  mockedTokenController,
} from "../../../__mocked__/controller";
import { mockOauth, mockUser } from "../../../__mocked__/data";
import { mockedUserRepository } from "../../../__mocked__/repository";

jest.mock("bcrypt");

describe("OauthController", () => {
  const oauthController = new mockedOauthController(
    mockedTokenController,
    mockedUserRepository
  );
  const hideMathods = {
    setErrorMessage: jest.spyOn(oauthController as any, "setErrorMessage"),
    getToken: jest.spyOn(oauthController as any, "getToken"),
    getUser: jest.spyOn(oauthController as any, "getUser"),
    login: jest.spyOn(oauthController as any, "login"),
    signUp: jest.spyOn(oauthController as any, "signUp"),
  };
  const mockBcrypt = {
    hash: hash as jest.Mock,
    compare: compare as jest.Mock,
  };
  let response: httpMocks.MockResponse<any>,
    request: httpMocks.MockRequest<any>,
    next: jest.Mock<NextFunction>,
    error: jest.SpyInstance;

  beforeEach(() => {
    response = httpMocks.createResponse();
    error = jest.spyOn(console, "error");
  });

  describe("githubStart", () => {
    test("success to respond", async () => {
      request = httpMocks.createRequest();
      mockBcrypt.hash.mockResolvedValueOnce("hashed state");

      await oauthController.githubStart(request, response, next);

      expect(response.statusCode).toBe(200);
      expect(typeof response._getJSONData()).toBe("string");
    });

    test("calls next function when hashing state is failed", async () => {
      request = httpMocks.createRequest();
      mockBcrypt.hash.mockRejectedValueOnce("hash error");

      await oauthController
        .githubStart(request, response, next)
        .catch((error) =>
          expect(error).toBe(`githubStart : hash by bcrypt\n hash error`)
        );
    });
  });

  describe("githubFinish", () => {
    describe("validate the state", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions("code"));
      });

      test("the OAuth will fail when validate is false", async () => {
        const warn = jest.spyOn(console, "warn");
        mockBcrypt.compare.mockResolvedValueOnce(false);

        await oauthController.githubFinish(request, response);

        expect(warn).toHaveBeenCalledWith(
          "githubFinish : state of github OAuth doesn't validate."
        );
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from validating the state"
        );
      });

      test("the OAuth will fail when bcrypt occur error", async () => {
        mockBcrypt.compare.mockRejectedValueOnce("compare error");

        await oauthController.githubFinish(request, response);

        expect(error).toHaveBeenCalledWith(
          "githubFinish : validate by bcrypt\n compare error"
        );
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from validating the state"
        );
      });
    });

    describe("get access_token", () => {
      beforeEach(() => {
        mockBcrypt.compare.mockResolvedValueOnce(true);
      });

      test("occurs error when value of access_token doesn't exist", async () => {
        request = httpMocks.createRequest(mockOauth.reqOptions("null"));

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getToken).toHaveBeenCalledWith("null");
        expect(error).toHaveBeenCalledWith(
          "githubFinish : getToken\n doesn't exist token"
        );
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from get access_token"
        );
      });

      test("occurs error when access_token is undefined", async () => {
        request = httpMocks.createRequest(mockOauth.reqOptions("undefined"));

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getToken).toHaveBeenCalledWith("undefined");
        expect(error).toHaveBeenCalledWith(
          "githubFinish : getToken\n doesn't exist token"
        );
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from get access_token"
        );
      });

      test("occurs error when github gets problem", async () => {
        request = httpMocks.createRequest(mockOauth.reqOptions("error"));

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getToken).toHaveBeenCalledWith("error");
        expect(error).toHaveBeenCalledWith(
          "githubFinish : getToken\n the problem of github"
        );
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from get access_token"
        );
      });
    });

    describe("get user from github", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions("code"));
        mockBcrypt.compare.mockResolvedValueOnce(true);
      });

      test("occurs error when value of owner's email doesn't exist", async () => {
        hideMathods.getToken.mockResolvedValueOnce("undefined");

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getUser).toHaveBeenCalledWith("undefined");
        expect(error).toHaveBeenCalledWith(
          "githubFinish : getUser\n doesn't exist data"
        );
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from get user"
        );
      });

      test("occurs error when a problem occurs by getting owner", async () => {
        hideMathods.getToken.mockResolvedValueOnce("error");

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getUser).toHaveBeenCalledWith("error");
        expect(error).toHaveBeenCalledWith(
          "githubFinish : getUser\n the problem of github"
        );
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from get user"
        );
      });
    });

    describe("login", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions("code"));
        mockBcrypt.compare.mockResolvedValueOnce(true);
        hideMathods.getToken.mockResolvedValueOnce("all");
      });

      test("occurs error when DB gets a problem by finding user", async () => {
        mockedUserRepository.findByUsername.mockRejectedValueOnce("error");
        mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

        await oauthController.githubFinish(request, response);

        expect(error).toHaveBeenCalledWith(
          "githubFinish : find user by username from login"
        );
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from login"
        );
      });

      test("a user can find not by owner's username but by owner's email", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);
        mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

        await oauthController.githubFinish(request, response);

        expect(error).not.toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).not.toHaveBeenCalled();
        expect(mockedTokenController.setToken).toHaveBeenCalled();
        expect(hideMathods.signUp).not.toHaveBeenCalled();
      });

      test("a user can find by owner's username and by owner's email", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(1));
        mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

        await oauthController.githubFinish(request, response);

        expect(error).not.toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).not.toHaveBeenCalled();
        expect(mockedTokenController.setToken).toHaveBeenCalled();
        expect(hideMathods.signUp).not.toHaveBeenCalled();
      });

      test("a user can find by owner's username and by owner's email, but id doesn't match", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(2));
        mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

        await oauthController.githubFinish(request, response);

        expect(error)
          .toHaveBeenCalledWith(`githubFinish : unexpected discord from login\n
          - [ id from username : 2, id from email : 1 ]`);
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from login"
        );
        expect(mockedTokenController.setToken).not.toHaveBeenCalled();
        expect(hideMathods.signUp).not.toHaveBeenCalled();
      });
    });

    describe.skip("signUp", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions("code"));
        mockBcrypt.compare.mockResolvedValueOnce(true);
        hideMathods.getToken.mockResolvedValueOnce("all");
      });

      test("occurs error when DB gets a problem by creating user from signUp", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);
        mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
        hideMathods.signUp.mockRejectedValueOnce("githubFinish : signUp");

        await oauthController.githubFinish(request, response);

        expect(hideMathods.signUp).toHaveBeenCalledWith(
          mockOauth.ownerData,
          mockOauth.emailData,
          false
        );
        expect(error).toHaveBeenCalledWith("githubFinish : signUp");
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(
          response,
          "error from login"
        );
      });

      test("success", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(1));
        mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
        hideMathods.signUp.mockResolvedValueOnce({ token: "token" });

        await oauthController.githubFinish(request, response);

        expect(hideMathods.signUp).toHaveBeenCalledWith(
          mockOauth.ownerData,
          mockOauth.emailData,
          true
        );
        expect(error).not.toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).not.toHaveBeenCalled();
        expect(mockedTokenController.setToken).toHaveBeenCalled();
      });
    });
  });
});
