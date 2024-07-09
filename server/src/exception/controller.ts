import {
  KindOfController,
  objectToPrintMessageOfCont,
  objectToThrowErrorOfCont,
} from "../__dwitter__.d.ts/exception/controller";

const exceptionMessage = (
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
  return result;
};

export const throwErrorOfController: objectToThrowErrorOfCont = {
  auth: (...argues) => {
    throw exceptionMessage("authController", ...argues);
  },
  oauth: (...argues) => {
    throw exceptionMessage("oauthController", ...argues);
  },
  tweet: (...argues) => {
    throw exceptionMessage("tweetController", ...argues);
  },
  comment: (...argues) => {
    throw exceptionMessage("commentController", ...argues);
  },
  good: (...argues) => {
    throw exceptionMessage("goodController", ...argues);
  },
};

export const printExceptionOfController: objectToPrintMessageOfCont = {
  oauth: (...argues) => exceptionMessage("oauthController", ...argues),
  good: (...argues) => exceptionMessage("goodController", ...argues),
};
