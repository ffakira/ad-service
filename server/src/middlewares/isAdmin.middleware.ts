import { NextFunction, Request, Response } from "express";
import { constants as c } from "http2";
import isAuth from "./isAuth.middleware";

/**
 * @dev Note this an over simplified logic for checking
 * permissions and roles for an authenticated user.
 * 
 */
function isAdmin(req: Request, res: Response, next: NextFunction) {
  /** @dev Check if the user is authenticated */
  isAuth(req, res, next);

  /** @dev Check if the user have admin privelege */
  //@ts-ignore
  if (+req.session["isAdmin"] === 1) {
    next();
  } else {
    res.status(c.HTTP_STATUS_FORBIDDEN).json({
      error: {
        message: "Forbidden"
      }
    });
  }
}

export default isAdmin;
