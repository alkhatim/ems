const { createLogger, format, transports } = require("winston");

module.exports = createLogger({
  format: format.combine(format.simple()),
  transports: [
    new transports.File({
      filename: "logs/logfile.log",
      level: "warn"
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: "logs/exceptions.log" }),
    new transports.Console()
  ]
});
