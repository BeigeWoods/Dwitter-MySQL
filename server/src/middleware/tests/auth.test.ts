import httpMocks from "node-mocks-http";
import faker from "faker";
import jwt from "jsonwebtoken";
import { isAuth } from "../auth";
import * as userRepository from "../../data/auth"

jest.mock('jsonwebtoken');
jest.mock('../../data/auth');

describe('Auth Middleware', () => {
  let response;
  let next;

  beforeEach(() => {
    response = httpMocks.createResponse();
    next = jest.fn();
  })  
  
  it("returns 401 for the request without Authorization", async() => {
    //given
    const request = httpMocks.createRequest({
      method: 'GET',
      url: "/",
    });

    //when
    await isAuth(request, response, next);

    //then
    expect(response.statusCode).toBe(401);
    expect(response._getJSONData().message).toBe('Authentication Error');
    expect(next).not.toBeCalled();
  })

  describe("Check Authorization header for Non-Browser Client", () => {
    it("returns 401 for the request with unsupposed Authorization header", async()=>{
      const request = httpMocks.createRequest({
        method: 'GET',
        url: "/",
        headers: { "Authorization" : `Basic`}
      })
      
      await isAuth(request, response, next);
      
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe('Authentication Error');
      expect(next).not.toBeCalled();
    })
    
    it("returns 401 for the request with invalid JWT", async() => {
      const token = faker.random.alphaNumeric(128);
      const request = httpMocks.createRequest({
        method: 'GET',
        url: "/",
        headers: { "Authorization" : `Bearer ${token}` }
      })
      Object.defineProperty(jwt, 'verify', {
        value: jest.fn((token, secret, callback) => {
          callback(new Error('bab token'), undefined)
        })
      })
      // jwt.verify = jest.fn((token, secret, callback)=>{
      //   callback(new Error('bad token'), undefined)
      // })
      
      await isAuth(request, response, next);
      
      expect(response.statusCode).toBe(401);
      expect(response._getJSONData().message).toBe('Authentication Error');
      expect(next).not.toBeCalled();
    })
    
    it("returns 401 when cannot find a user by id from the JWT", async() => {
      const token = faker.random.alphaNumeric(128);
      const userId = faker.random.alphaNumeric(32);
      const request = httpMocks.createRequest({
        method: 'GET',
        url: "/",
        headers: { "Authorization" : `Bearer ${token}` }
      })
      Object.defineProperty(jwt, 'verify', {
        value: jest.fn((token, secret, callback) => {
          callback(undefined, { id: userId})
        })
      })
      // jwt.verify = jest.fn((token, secret, callback)=>{
        //   callback(undefined, { id: userId })
        // })
        Object.defineProperty(userRepository, 'findById', {
          value: jest.fn((id) => 
          Promise.resolve(undefined)
          )
        })
        // userRepository.findById = jest.fn((id)=>Promise.resolve(undefined));
        
        await isAuth(request, response, next);
        
        expect(response.statusCode).toBe(401);
        expect(response._getJSONData().message).toBe('Authentication Error');
        expect(next).not.toBeCalled();
      })
      
      it("success Authorization", async()=>{
        const token = faker.random.alphaNumeric(128);
        const userId = faker.random.alphaNumeric(32);
        const request = httpMocks.createRequest({
          method: 'GET',
          url: "/",
          headers: { "Authorization": `Bearer ${token}` }
        })
        Object.defineProperty(jwt, 'verify', {
          value: jest.fn((token, secret, callback) => {
            callback(undefined, { id: userId})
          })
        })
        Object.defineProperty(userRepository, 'findById', {
          value: jest.fn((id) => 
          Promise.resolve({ id })
          )
        })

        await isAuth(request, response, next);

        expect(request).toMatchObject({ userId, token });
        expect(next).toHaveBeenCalledTimes(1);
      })
    })
  })