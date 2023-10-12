import winston from "winston";

const logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console({}),
    new winston.transports.File({level: "silly", filename: "combined.log"})
  ],
});

export default logger;
