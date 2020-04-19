const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.combine(format.simple()),
  transports: [
    new transports.File({
      filename: "logs/logfile.log",
      level: "warn"
    }),
    new transports.Console()
  ],
  exceptionHandlers: [
    new transports.File({ filename: "logs/unhandledExceptions.log" }),
    new transports.Console()
  ]
});

module.exports = logger;
