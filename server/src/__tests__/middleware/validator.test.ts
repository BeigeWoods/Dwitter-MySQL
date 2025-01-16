import request from "supertest";
import express, { Response, Request, NextFunction } from "express";
import { body, check, param, query, validationResult } from "express-validator";

describe("Express Validator", () => {
  const app = express();
  app.use(express.json());

  describe("default response", () => {
    const expressValidator = (req: Request, res: Response) => {
      const errors = validationResult(req);
      return errors.isEmpty()
        ? res.sendStatus(200)
        : res.status(400).json(errors.array()[0].msg);
    };

    describe("tweetId", () => {
      const baseUrl = "/tweetId";
      beforeEach(() =>
        app.get(`${baseUrl}/:tweetId`, [
          param("tweetId", "Invalid tweetId")
            .notEmpty()
            .withMessage("Invalid tweetId_0")
            .bail()
            .trim()
            .isNumeric()
            .isInt({ allow_leading_zeroes: false, min: 1 }),
          expressValidator,
        ])
      );

      test("return 404 when inputted nothing", function (done) {
        request(app).get(`${baseUrl}/`).expect(404, done);
      });

      test("return 400 when inputted &", function (done) {
        request(app).get(`${baseUrl}/&`).expect(400, '"Invalid tweetId"', done);
      });

      test("return 400 when inputted undefined", function (done) {
        request(app)
          .get(`${baseUrl}/undefined`)
          .expect(400, '"Invalid tweetId"', done);
      });

      test("return 400 when inputted null", function (done) {
        request(app)
          .get(`${baseUrl}/null`)
          .expect(400, '"Invalid tweetId"', done);
      });

      test("return 400 when inputted ' no '", function (done) {
        request(app)
          .get(`${baseUrl}/ no `)
          .expect(400, '"Invalid tweetId"', done);
      });

      test("return 200 when inputted ' 1 '", function (done) {
        request(app).get(`${baseUrl}/ 1 `).expect(200, done);
      });

      test("return 400 when inputted 0", function (done) {
        request(app).get(`${baseUrl}/0`).expect(400, '"Invalid tweetId"', done);
      });

      test("return 200 when inputted 2", function (done) {
        request(app).get(`${baseUrl}/2`).expect(200, done);
      });
    });

    describe("clicked", () => {
      const baseUrl = "/good";
      beforeEach(() =>
        app.put(baseUrl, [
          body("clicked", `Invalid clicked`)
            .replace([null], 0)
            .exists({ values: "undefined" })
            .withMessage(`Invalid clicked_X`)
            .bail()
            .isBoolean(),
          expressValidator,
        ])
      );

      test("return 400 when clicked doesn't exist in req.body", function (done) {
        request(app).put(baseUrl).expect(400, '"Invalid clicked_X"', done);
      });

      test("return 400 when inputted ''", function (done) {
        request(app)
          .put(baseUrl)
          .send({ clicked: "" })
          .expect(400, '"Invalid clicked"', done);
      });

      test("return 400 when inputted null", function (done) {
        request(app).put(baseUrl).send({ clicked: null }).expect(200, done);
      });

      test("return 400 when inputted undefined", function (done) {
        request(app)
          .put(baseUrl)
          .send({ clicked: undefined })
          .expect(400, '"Invalid clicked_X"', done);
      });

      test("return 400 when inputted 'undefined'", function (done) {
        request(app)
          .put(baseUrl)
          .send({ clicked: "undefined" })
          .expect(400, '"Invalid clicked"', done);
      });

      test("return 400 when inputted ' 1 '", function (done) {
        request(app)
          .put(baseUrl)
          .send({ clicked: " 1 " })
          .expect(400, '"Invalid clicked"', done);
      });

      test("return 400 when inputted 0", function (done) {
        request(app).put(baseUrl).send({ clicked: 0 }).expect(200, done);
      });

      test("return 400 when inputted true", function (done) {
        request(app).put(baseUrl).send({ clicked: true }).expect(200, done);
      });
    });

    describe("username", () => {
      const baseUrl = "/username";
      const reqQuery = "?username=";
      beforeEach(() =>
        app.get(baseUrl, [
          query("username", "Invalid username")
            .if((value, { req }) => "username" in req.query!)
            .notEmpty()
            .withMessage("Invalid username_0")
            .bail()
            .isString()
            .bail()
            .trim()
            .isLength({ min: 2 }),
          expressValidator,
        ])
      );

      test("return 200 when query doesn't exist", function (done) {
        request(app).get(`${baseUrl}/`).expect(200, done);
      });

      test("return 400 when inputted nothing", function (done) {
        request(app)
          .get(`${baseUrl}${reqQuery}`)
          .expect(400, '"Invalid username_0"', done);
      });

      test("return 400 when inputted '&user' because of special symbol &", function (done) {
        request(app)
          .get(`${baseUrl}${reqQuery}&user`)
          .expect(400, '"Invalid username_0"', done);
      });

      test("return 400 when inputted '0'", function (done) {
        request(app)
          .get(`${baseUrl}${reqQuery}0`)
          .expect(400, '"Invalid username"', done);
      });

      test("return 200 when inputted '02'", function (done) {
        request(app).get(`${baseUrl}${reqQuery}02`).expect(200, done);
      });

      test("return 200 when inputted ' user '", function (done) {
        request(app).get(`${baseUrl}${reqQuery} user `).expect(200, done);
      });

      test("return 200 when inputted '^user%'", function (done) {
        request(app).get(`${baseUrl}${reqQuery}^user%`).expect(200, done);
      });
    });

    describe("recipient", () => {
      const baseUrl = "/reply";
      beforeEach(() =>
        app.get(baseUrl, [
          body("recipient", "Invalid reply")
            .if((value, { req }) => "recipient" in req.body!)
            .notEmpty()
            .withMessage("Invalid reply_0")
            .bail()
            .exists({ values: "falsy" })
            .withMessage("Invalid reply_X")
            .bail()
            .isString()
            .bail()
            .trim()
            .isLength({ min: 2 }),
          expressValidator,
        ])
      );

      test("return 200 when recipient doesn't exist in req.body", function (done) {
        request(app).get(baseUrl).expect(200, done);
      });

      test("return 200 when inputted undefined", function (done) {
        request(app)
          .get(baseUrl)
          .send({ recipient: undefined })
          .expect(200, done);
      });

      test("return 400 when inputted false", function (done) {
        request(app)
          .get(baseUrl)
          .send({ recipient: false })
          .expect(400, '"Invalid reply_X"', done);
      });

      test("return 400 when inputted null", function (done) {
        request(app)
          .get(baseUrl)
          .send({ recipient: null })
          .expect(400, '"Invalid reply_0"', done);
      });

      test("return 400 when inputted blank string", function (done) {
        request(app)
          .get(baseUrl)
          .send({ recipient: "" })
          .expect(400, '"Invalid reply_0"', done);
      });

      test("return 400 when inputted number", function (done) {
        request(app)
          .get(baseUrl)
          .send({ recipient: 1 })
          .expect(400, '"Invalid reply"', done);
      });

      test("return 400 when inputted wrong username with length 1", function (done) {
        request(app)
          .get(baseUrl)
          .send({ recipient: "x" })
          .expect(400, '"Invalid reply"', done);
      });

      test("return 200 when inputted right username", function (done) {
        request(app)
          .get(baseUrl)
          .send({ recipient: " user " })
          .expect(200, done);
      });
    });

    describe("isAllEmpty", () => {
      const mockedMulter =
        (image: boolean) =>
        (req: Request, res: Response, next: NextFunction) => {
          req.file = (image ? { location: "image.jpg" } : {}) as any;
          return next();
        };
      const validation = [
        check("body").custom((value, { req }) => {
          const newImage =
            req.file && "location" in req.file ? req.file.location : false;
          if (!req.body.text && !req.body.video && !newImage)
            throw "Should provide at least one value";
          return true;
        }),
        expressValidator,
      ];

      describe("no file", () => {
        const baseUrl = "/noFile";
        beforeEach(() => app.post(baseUrl, validation));

        test("return 400 when inputted nothing", function (done) {
          request(app)
            .post(baseUrl)
            .expect(400, '"Should provide at least one value"', done);
        });

        test("return 200 when the other file are given", function (done) {
          request(app)
            .post(baseUrl)
            .send({ text: "text", video: "video" })
            .expect(200, done);
        });
      });

      describe("file is given but there is no data", () => {
        test("return 400 when only file.location is given but there is no data", function (done) {
          const baseUrl = "/noData";
          app.post(baseUrl, [mockedMulter(false), ...validation]);

          request(app)
            .post(baseUrl)
            .expect(400, '"Should provide at least one value"', done);
        });
      });

      describe("file is given", () => {
        const baseUrl = "/file";
        beforeEach(() =>
          app.post(baseUrl, [mockedMulter(true), ...validation])
        );

        test("return 200 when only file.location exists", function (done) {
          request(app).post(baseUrl).expect(200, done);
        });

        test("return 200 when all data were given", function (done) {
          request(app)
            .post(baseUrl)
            .send({ text: "text", video: "video" })
            .expect(200, done);
        });
      });
    });
  });

  describe("response showing result made by express validator", () => {
    const expressValidator = (req: Request, res: Response) => {
      const errors = validationResult(req);
      console.log(req.body);
      return errors.isEmpty()
        ? res.status(200).json({ result: req.body })
        : res
            .status(400)
            .json({ error: errors.array()[0].msg, result: req.body });
    };

    describe("text", () => {
      const baseUrl = "/text";
      beforeEach(() =>
        app.get(baseUrl, [
          body("text", "Invalid text")
            .notEmpty()
            .withMessage(`Invalid text_0`)
            .bail()
            .replace([null, false], "")
            .isString()
            .bail()
            .trim(),
          expressValidator,
        ])
      );

      test("return 400 when inputted nothing", function (done) {
        request(app)
          .get(baseUrl)
          .expect(400, { error: "Invalid text_0", result: {} }, done);
      });

      test("return 200 when inputted false", function (done) {
        request(app)
          .get(baseUrl)
          .send({ text: false })
          .expect(200, { result: { text: "" } }, done);
      });

      test("return 400 when inputted undefined", function (done) {
        request(app)
          .get(baseUrl)
          .send({ text: undefined })
          .expect(400, { error: "Invalid text_0", result: {} }, done);
      });

      test("return 400 when text doesn't exist but video", function (done) {
        request(app)
          .get(baseUrl)
          .send({ video: "video" })
          .expect(
            400,
            { error: "Invalid text_0", result: { video: "video" } },
            done
          );
      });

      test("return 200 when inputted ' 1 '", function (done) {
        request(app)
          .get(baseUrl)
          .send({ text: " 1 " })
          .expect(200, { result: { text: "1" } }, done);
      });

      test("return 200 when inputted only blank", function (done) {
        request(app)
          .get(baseUrl)
          .send({ text: "  " })
          .expect(200, { result: { text: "" } }, done);
      });

      test("return 400 when data type is number", function (done) {
        request(app)
          .get(baseUrl)
          .send({ text: 1 })
          .expect(400, { error: "Invalid text", result: { text: 1 } }, done);
      });

      test("return 400 when data type is object", function (done) {
        request(app)
          .get(baseUrl)
          .send({ text: { name: "jone" } })
          .expect(
            400,
            { error: "Invalid text", result: { text: { name: "jone" } } },
            done
          );
      });
    });

    describe("image", () => {
      const baseUrl = "/image";
      beforeEach(() =>
        app.get(baseUrl, [
          body("image", "Invalid image")
            .optional({ values: "falsy" })
            .trim()
            .matches(
              RegExp(`https:\/\/bucket.s3.region.amazonaws.com\/\\d{1}_`)
            ),
          expressValidator,
        ])
      );

      test("return 200 when inputted nothing", function (done) {
        request(app).get(baseUrl).expect(200, { result: {} }, done);
      });

      test("return 200 when inputted null", function (done) {
        request(app)
          .get(baseUrl)
          .send({ image: null })
          .expect(200, { result: { image: null } }, done);
      });

      test("return 200 when inputted false", function (done) {
        request(app)
          .get(baseUrl)
          .send({ image: false })
          .expect(200, { result: { image: false } }, done);
      });

      test("return 400 when doesn't match with RegExp", function (done) {
        request(app)
          .get(baseUrl)
          .send({ image: "image" })
          .expect(
            400,
            { error: "Invalid image", result: { image: "image" } },
            done
          );
      });

      test("return 200 when matches with RegExp", function (done) {
        const imageUrl = "https://bucket.s3.region.amazonaws.com/1_jpg";
        request(app)
          .get(baseUrl)
          .send({ image: imageUrl })
          .expect(200, { result: { image: imageUrl } }, done);
      });
    });
  });
});
