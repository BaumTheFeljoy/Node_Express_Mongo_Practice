const debug = require("debug")("app:startup")
const express = require("express")
const morgan = require("morgan")
const winston = require("winston")
const app = express()

require("./startup/config")()
require("./startup/logging")()
require("./startup/routes")(app)
require("./startup/db")()
require("./startup/joivalidation")()

if (app.get("env") === "development") {
    app.use(morgan("tiny"))
    debug("Morgan enabled")
}

// Start listening
const port = process.env.PORT || 3000
app.listen(port, () => {
    winston.info(`Listening on: http://localhost:${port}`)
})