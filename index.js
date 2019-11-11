require("express-async-errors")
const winston = require("winston")
require("winston-mongodb")
const debug = require("debug")("app:startup")
const config = require("config")
const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const Joi = require("joi")

const routes = require("./startup/routes")
const { startupDb } = require("./startup/db")

Joi.objectId = require("joi-objectid")(Joi)

// WINSTON SETUP
winston.add(winston.transports.File, { filename: "logfile.log" })
winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly", level: "error" })
winston.handleExceptions(new winston.transports.File({ filename: "logfile.log" }))
process.on("unhandledRejection", (ex) => { throw ex })

const app = express()
startupDb()

app.set("view engine", "pug")
app.set("views", "./views")


app.use(helmet())

if (app.get("env") === "development") {
    app.use(morgan("tiny"))
    debug("Morgan enabled")
}

routes(app)

// Configuration details
if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined") // Windows: $env:vidly_jwtPrivateKey = "anything"
    process.exit(1)
}
console.log("Application name: " + config.get("name"))
console.log("Application mail server: " + config.get("mail.host"))
console.log("Application mail password: " + config.get("mail.password")) // Windows: $env:app_password = "anything" 

// Start listening
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`)
})