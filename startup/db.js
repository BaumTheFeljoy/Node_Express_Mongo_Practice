const winston = require("winston")
const mongoose = require("mongoose")

module.exports.startupDb = function () {
    mongoose.connect("mongodb://localhost/vidly", { reconnectTries: 2 }) // In real application this string should come from config file, also reconnect tries are set so low for debugging
        .then(() => winston.info("Connected to MongoDB"))
}