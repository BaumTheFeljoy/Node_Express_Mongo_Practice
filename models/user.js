const mongoose = require("mongoose")
const Joi = require("joi")
const config = require("config")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function() { // Arrow function syntax doesn't work with "this" for self reference
    return jwt.sign({ 
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get("jwtPrivateKey")) // $env:vidly_jwtPrivateKey = "anything"
}

const User = mongoose.model("User", userSchema)

function validateUser(user) {
    const schema = {
        name: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().max(255).min(8).required()
    }

    return Joi.validate(user, schema)
}

exports.validate = validateUser
exports.User = User