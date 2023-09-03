import { createLogger, transports, format } from "winston";
const { combine, timestamp, printf, colorize, align } = format;

const appLogger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS"
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/app.log",
      maxsize: 5 * 1024 * 1024 // Rotate log at 5MiB
    })
  ]
});

export default appLogger;
