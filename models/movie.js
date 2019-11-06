const mongoose = require("mongoose")
const Joi = require("joi")
const { genreSchema } = require("./genre")

const Genre = mongoose.model("Genre", genreSchema)

const Movie = mongoose.model("Movie", new mongoose.Schema({
    title: {
        required: true,
        type: String,
        minlength: 5,
        maxlength: 50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        required: true,
        type: Number,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        required: true,
        type: Number,
        min: 0,
        max: 255
    }
}))

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    }

    return Joi.validate(movie, schema)
}

exports.validate = validateMovie
exports.Movie = Movie