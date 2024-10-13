import httpMocks from "node-mocks-http";
import OauthController from "../../controller/auth/oauth";
import config from "../../config";
import {
  mockedTokenController,
  mockedUserRepository,
} from "../__mocked__/handler";
import { mockOauth, mockUser } from "../__mocked__/data";
import { mockBcrypt } from "../__mocked__/module";
import ExceptionHandler from "../../exception/exception";

jest.mock("bcrypt");
jest.mock("node:https");

describe("OauthController", () => {
  const oauthController = new OauthController(
    config,
    mockedTokenController,
    mockedUserRepository,
    new ExceptionHandler("oauthController")
  );
  const hideMathods = {
    setErrorMessage: jest.spyOn(oauthController as any, "setErrorMessage"),
    fetchData: jest.spyOn(oauthController as any, "fetchData"),
    getToken: jest.spyOn(oauthController as any, "getToken"),
    getUser: jest.spyOn(oauthController as any, "getUser"),
    login: jest.spyOn(oauthController as any, "login"),
    signup: jest.spyOn(oauthController as any, "signup"),
  };
  let response: httpMocks.MockResponse<any>,
    request: httpMocks.MockRequest<any>,
    error: jest.SpyInstance;

  beforeEach(() => {
    response = httpMocks.createResponse();
    error = jest.spyOn(console, "error");
  });

  describe("githubStart", () => {
    test("success to respond", async () => {
      mockBcrypt.hash.mockResolvedValueOnce("hashed state");

      await oauthController.githubStart(request, response);

      expect(response.statusCode).toBe(200);
      expect(typeof response._getJSONData()).toBe("string");
    });

    test("calls next function when hashing state is failed", async () => {
      mockBcrypt.hash.mockRejectedValueOnce("hash error");

      await oauthController.githubStart(request, response).catch((e) => {
        expect(e.name).toBe("Error > oauthController.githubStart");
        expect(e.message).toBe("hash error");
      });
    });
  });

  describe("githubFinish", () => {
    describe("validate the state", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions);
      });

      test("the OAuth will fail when validate is false", async () => {
        const warn = jest.spyOn(console, "warn");
        mockBcrypt.compare.mockResolvedValueOnce(false);

        await oauthController.githubFinish(request, response);

        expect(warn).toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(response);
      });

      test("the OAuth will fail when bcrypt occur error", async () => {
        mockBcrypt.compare.mockRejectedValueOnce("compare error");

        await oauthController.githubFinish(request, response);

        expect(error).toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(response);
      });
    });

    describe("get access_token", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions);
        mockBcrypt.compare.mockResolvedValueOnce(true);
      });

      test("occurs error when value of access_token doesn't exist", async () => {
        hideMathods.fetchData.mockRejectedValueOnce("Doesn't exist token");

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getToken).toHaveBeenCalledWith("code");
        expect(error).toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(response);
      });

      test("occurs error when github gets problem", async () => {
        hideMathods.fetchData.mockRejectedValueOnce(new Error("Github error"));

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getToken).toHaveBeenCalledWith("code");
        expect(error).toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(response);
      });
    });

    describe("get user from github", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        hideMathods.getToken.mockResolvedValueOnce("token");
      });

      test("occurs error when value of owner's email doesn't exist", async () => {
        hideMathods.getUser.mockRejectedValueOnce("Doesn't exist email");

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getUser).toHaveBeenCalledWith("token");
        expect(error).toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(response);
      });

      test("occurs error when github gets problem", async () => {
        hideMathods.getUser.mockRejectedValueOnce(new Error("Github error"));

        await oauthController.githubFinish(request, response);

        expect(hideMathods.getUser).toHaveBeenCalledWith("token");
        expect(error).toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(response);
      });
    });

    describe("login", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        hideMathods.getToken.mockResolvedValueOnce("token");
        hideMathods.getUser.mockResolvedValueOnce([
          mockOauth.ownerData,
          mockOauth.emailData,
        ]);
      });

      test("occurs error when DB gets a problem by finding user", async () => {
        mockedUserRepository.findByUsername.mockRejectedValueOnce(
          "findByUsername error"
        );
        mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

        await oauthController.githubFinish(request, response);

        expect(hideMathods.login).toHaveBeenCalledWith(
          mockOauth.ownerData,
          mockOauth.emailData
        );
        expect(error).toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(response);
      });

      test("a user can find not by owner's username but by owner's email", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);
        mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

        await oauthController.githubFinish(request, response);

        expect(error).not.toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).not.toHaveBeenCalled();
        expect(mockedTokenController.setToken).toHaveBeenCalled();
        expect(hideMathods.signup).not.toHaveBeenCalled();
      });

      test("a user can find by owner's username and by owner's email", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(1));
        mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

        await oauthController.githubFinish(request, response);

        expect(error).not.toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).not.toHaveBeenCalled();
        expect(mockedTokenController.setToken).toHaveBeenCalled();
        expect(hideMathods.signup).not.toHaveBeenCalled();
      });

      test("a user can find by owner's username and by owner's email, but id doesn't match", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(2));
        mockedUserRepository.findByEmail.mockResolvedValueOnce(mockUser(1));

        await oauthController.githubFinish(request, response);

        expect(error).not.toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).not.toHaveBeenCalled();
        expect(mockedTokenController.setToken).toHaveBeenCalled();
        expect(hideMathods.signup).not.toHaveBeenCalled();
      });
    });

    describe("signup", () => {
      beforeEach(() => {
        request = httpMocks.createRequest(mockOauth.reqOptions);
        mockBcrypt.compare.mockResolvedValueOnce(true);
        hideMathods.getToken.mockResolvedValueOnce("token");
        hideMathods.getUser.mockResolvedValueOnce([
          mockOauth.ownerData,
          mockOauth.emailData,
        ]);
      });

      test("occurs error when DB gets a problem by creating user from signup", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(undefined);
        mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
        mockedUserRepository.create.mockRejectedValueOnce("create error");

        await oauthController.githubFinish(request, response);

        expect(hideMathods.signup).toHaveBeenCalledWith(
          mockOauth.ownerData,
          mockOauth.emailData,
          false
        );
        expect(error).toHaveBeenCalled();
        expect(hideMathods.setErrorMessage).toHaveBeenCalledWith(response);
      });

      test("success", async () => {
        mockedUserRepository.findByUsername.mockResolvedValueOnce(mockUser(1));
        mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined);
        hideMathods.signup.mockResolvedValueOnce({ token: "token" });

        await oauthController.githubFinish(request, response);

        expect(hideMathods.signup).toHaveBeenCalledWith(
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
