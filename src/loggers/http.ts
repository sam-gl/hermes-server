import { NextFunction, Request, Response } from "express";
import { createLogger, transports, format } from "winston";
const { combine, timestamp, printf, align } = format;

const httpLogger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS"
    }),
    align(),
    printf(
      (info) => `[${info.timestamp}] [HTTP] ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/http.log",
      maxsize: 5 * 1024 * 1024 // Rotate log at 5MiB
    })
  ]
});

const expressLogger = (req: Request, res: Response, next: NextFunction) => {
  httpLogger.info(`${req.method} ${req.url} from ${req.ip}`);
  next();
};

export default expressLogger;
