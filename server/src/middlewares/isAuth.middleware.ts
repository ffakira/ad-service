import { NextFunction, Request, Response } from "express";
import { constants as c } from "http2";

function isAuth(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (req.session["isAuth"]) {
    next();
  } else {
    res.status(c.HTTP_STATUS_UNAUTHORIZED).json({
      error: {
        message: "Unauthorized"
      }
    });
  }
}

export default isAuth;
