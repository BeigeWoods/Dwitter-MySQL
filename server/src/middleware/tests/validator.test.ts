import httpMocks from "node-mocks-http";
import * as validator from "express-validator";
import { expressValidate } from "../validator";

jest.mock("express-validator");

describe("Validator Middleware", () => {
  let request;
  let response;
  let next;

  beforeEach(() => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  it("calls next if there no validation errors", () => {
    Object.defineProperty(validator, "validationResult", {
      value: jest.fn(() => ({
        isEmpty: () => true,
      })),
    });
    // validator.validationResult = jest.fn(() => ({
    //   isEmpty: () => true
    // }));

    expressValidate(request, response, next);

    expect(next).toBeCalled();
  });

  it("returns 400 if there are validation errors", () => {
    Object.defineProperty(validator, "validationResult", {
      value: jest.fn(() => ({
        isEmpty: () => false,
        array: () => [{ msg: "Error!" }],
      })),
    });
    // validator.validationResult = jest.fn(()=>({
    //   isEmpty: () => false,
    //   array: () => [{msg: 'Error!'}]
    // }));

    expressValidate(request, response, next);

    expect(response.statusCode).toBe(400);
    expect(next).not.toBeCalled();
    expect(response._getJSONData().message).toBe("Error!");
  });
});
