const express = require("express")
const morgan = require("morgan")
const winston = require("winston")
const app = express()

if (app.get("env") === "development") {
    app.use(morgan("tiny"))
    winston.info("Morgan enabled")
}

require("./startup/config")()
require("./startup/logging")()
require("./startup/routes")(app)
require("./startup/db")()
require("./startup/joivalidation")()

// Start listening
const port = process.env.PORT || 3000
app.listen(port, () => {
    winston.info(`Listening on: http://localhost:${port}`)
})