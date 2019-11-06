const debug = require("debug")("app:startup")
const config = require("config")
const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const mongoose = require("mongoose")

const genres = require("./routes/genres")
const homepage = require("./routes/home")
const customers = require("./routes/customers")
const movies = require("./routes/movies")
const rentals = require("./routes/rentals")
const logger = require("./middleware/logger")

const app = express()

// Connect to db
mongoose.connect("mongodb://localhost/vidly") // In real application this string should come from config file
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Couldn't connect:", err.message))

app.set("view engine", "pug")
app.set("views", "./views")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(helmet())

if(app.get("env") === "development") {
    app.use(morgan("tiny")) // TODO: Write to a logfile
    debug("Morgan enabled")
}
app.use(logger)

// Other app.use functions need to be called before the routing ones!
app.use("/api/genres", genres)
app.use("/", homepage)
app.use("/api/customers", customers)
app.use("/api/movies", movies)
app.use("/api/rentals", rentals)

// Configuration details
console.log("Application name: " + config.get("name"))
console.log("Application mail server: " + config.get("mail.host"))
console.log("Application mail password: " + config.get("mail.password")) // Windows: $env:app_password = "anything" 

// Start listening
const port = process.env.PORT || 3000
app.listen(port, () =>  {
    console.log(`Listening on: http://localhost:${port}`)
})