import { NextFunction, Response, Request } from "express";
export declare type Validate = {
  (req: Request, res: Response, next: NextFunction): void | Response<
    any,
    Record<string, any>
  >;
};
export declare const expressValidate: Validate;
export declare const tweetFormDataValidate: (
  req: Request,
  res: Response,
  next: NextFunction
) => Response<any, Record<string, any>>;
export declare const paramsValidate: (
  req: Request,
  res: Response,
  next: NextFunction
) => Response<any, Record<string, any>>;
