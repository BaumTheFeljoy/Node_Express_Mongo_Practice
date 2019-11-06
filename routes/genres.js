const express = require("express")
const { Genre, validate } = require("../models/genre")
const router = express.Router();

router.get("/", async (req, res) => {
    const genres = await Genre.find().sort("name")
    res.send(genres)
})

router.get("/:id", async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send("Genre with given id not found")

    res.send(genre)
})

router.post("/", async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let genre = new Genre({ name: req.body.name })
    genre = await genre.save()
    res.send(genre)
})

router.put("/:id", async (req, res) => {
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
})

router.delete("/:id", async (req, res) => {
    // Look up the genre - If not existing, return 404
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send("Genre with given id not found")

    // Return deleted genre
    res.send(genre)
})

module.exports = router