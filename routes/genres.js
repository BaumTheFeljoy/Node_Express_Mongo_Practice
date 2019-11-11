const express = require("express")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const asyncMiddleware = require("../middleware/async")
const { Genre, validate } = require("../models/genre")
const router = express.Router();

// PROMISE ERROR OPTION 1: use require("express-async-errors") in index.js
router.get("/", async (req, res) => {
    const genres = await Genre.find().sort("name")
    res.send(genres)
})

// PROMISE ERROR OPTION 2: use own asyncMiddleware function
router.get("/:id", asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send("Genre with given id not found")

    res.send(genre)
}))

router.post("/", auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = new Genre({ name: req.body.name })
    await genre.save()

    res.send(genre)
}))

router.put("/:id", auth, asyncMiddleware(async (req, res) => {
    // Validate - If invalid -> return 404
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Look up the genre - If not existing, return 404
    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true })
    if (!genre) return res.status(404).send("Genre with given id not found")

    // Return genre
    res.send(genre)
}))

router.delete("/:id", [auth, admin], asyncMiddleware(async (req, res) => {
    // Look up the genre - If not existing, return 404
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send("Genre with given id not found")

    // Return deleted genre
    res.send(genre)
}))

module.exports = router