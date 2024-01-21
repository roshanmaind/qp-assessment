import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: { service: "grocery-booking" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export default logger;