const winston = require("winston")
const config = require("config")
const mongoose = require("mongoose")

module.exports = function () {
    // mongoose.connect("mongodb://localhost/vidly", { reconnectTries: 2 })
    mongoose.connect(config.get("dbPath"), { reconnectTries: 2 }) // Reconnect tries are set so low for debugging
        .then(() => winston.info("Connected to MongoDB"))
}