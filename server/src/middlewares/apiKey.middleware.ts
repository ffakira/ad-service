import { NextFunction, Request, Response } from "express";
import { constants as c } from "node:http2";

/**
 * @dev A simple API key middleware which fetches from the
 * process.env.API_KEY if matches with the request headers
 * from the client.
 */
function apiKey(req: Request, res: Response, next: NextFunction) {
  const getApiKey = req.headers["x-api-key"];

  if (getApiKey !== process.env.API_KEY) {
    return res.status(c.HTTP_STATUS_FORBIDDEN).json({
      status: c.HTTP_STATUS_FORBIDDEN,
      error: {
        message: "Invalid API Key",
      },
    });
  } else {
    next();
  }
}

export default apiKey;
