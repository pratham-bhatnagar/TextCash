


  import { NextFunction, Request, Response } from "express";
import logger from "../services/logger.service";

const errorHandler =
  () => (err: Error | any, req: Request, res: Response, next: NextFunction) => {
    if (err?.errorCode) {
      logger.error("User Input Error!");
      logger.error(JSON.stringify(err));
      res.status(err.errorCode).json({
        success: false,
        message: `ErrorName: ${err.status}`,
      });
    } else {
      logger.error("Internal Server Error");
      logger.error(JSON.stringify(err));
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

export default errorHandler;
