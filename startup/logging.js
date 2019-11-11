const winston = require("winston")
const config = require("config")

require("winston-mongodb") // Adds winston.transports.MongoDB
require("express-async-errors") // Automatically catches express async errors and passes control to error middleware function

module.exports = function () {
    // Winston setup
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: "uncaughtExceptions.log" })
    )
    process.on("unhandledRejection", (ex) => { throw ex })

    winston.add(winston.transports.File, { filename: "logfile.log", level: "error" })
    // winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly", level: "error" })
    winston.add(winston.transports.MongoDB, { db: config.get("dbPath"), level: "error" })
}