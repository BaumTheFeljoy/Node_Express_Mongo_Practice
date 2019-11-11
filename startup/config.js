const config = require("config")

module.exports = function () {
    // Configuration details
    if (!config.get("jwtPrivateKey")) {
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined") // Windows: $env:vidly_jwtPrivateKey = "anything"
    }
    if (!config.get("dbPath")) {
        throw new Error("FATAL ERROR: db path not defined") // Windows: $env:vidly_dbPath = <path>
    }
    console.log("Application name: " + config.get("name"))
}