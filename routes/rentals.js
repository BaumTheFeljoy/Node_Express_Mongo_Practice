const express = require("express")
const { Rental, validate } = require("../models/rental")
const { Customer } = require("../models/customer")
const { Movie } = require("../models/movie")
const Fawn = require("fawn")
const mongoose = require("mongoose")
const router = express.Router()
const auth = require("../middleware/auth")

Fawn.init(mongoose) // Maybe don't use, npm shows vulnerabilities

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut")
    res.send(rentals)
})

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send("Invalid customer id")

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send("Invalid movie id")

    if (movie.numberInStock === 0) return res.status(400).send("Movie not in stock")

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })
    try {
        new Fawn.Task()  //TODO: Find alternative
            .save("rentals", rental)
            .update("movies", { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run()
        // rental = await rental.save()
        // movie.numberInStock--
        // await movie.save() // does await work like this? i think it does

        res.send(rental)
    } catch (err) {
        res.status(500).send("Db Transaction failed")
        // TODO: Log the error
    }
})

module.exports = router