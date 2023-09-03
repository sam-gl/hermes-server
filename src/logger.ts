import { NextFunction, Request, Response } from "express";
import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/http.log" })
  ]
});

const expressLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`[HTTP] ${req.method} ${req.url} from ${req.ip}`);
  next();
};

export default expressLogger;
