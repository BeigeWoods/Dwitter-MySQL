import {
  KindOfController,
  objectToHandleExceptionOfCont,
} from "../__dwitter__.d.ts/exception/controller";

const throwException = (
  title: KindOfController,
  option: string | string[],
  exception: Error | string,
  fromOwn = false
) => {
  let result = `## ${title}.`;
  result +=
    typeof option === "string"
      ? option
      : `${(option as string[])[0]} < ${(option as string[])[1]}`;
  result += fromOwn ? " ##\n " : " < ";
  result += exception;
  throw result;
};

const controllerExceptionHandler: objectToHandleExceptionOfCont = {
  auth: (...argues) => throwException("authController", ...argues),
  oauth: (...argues) => throwException("oauthController", ...argues),
  tweet: (...argues) => throwException("tweetController", ...argues),
  comment: (...argues) => throwException("commentController", ...argues),
  good: (...argues) => throwException("goodController", ...argues),
};

export default controllerExceptionHandler;
