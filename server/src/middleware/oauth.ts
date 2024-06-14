import { NextFunction, Request, Response } from "express";

const oauthMessageCheck = (req: Request, res: Response, next: NextFunction) => {
  const oauth = req.cookies["oauth"];
  if (oauth) {
    res.clearCookie("oauth", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.status(409).json({ message: oauth });
  }
  next();
};

export default oauthMessageCheck;
