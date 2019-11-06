const mongoose = require("mongoose")
const Joi = require("joi")

const Customer = mongoose.model("Customer", new mongoose.Schema({
    name: {
        required: true,
        type: String,
        minlength: 5,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    isGold: {
        default: true,
        type: Boolean
    }
}))

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        phone: Joi.string().min(5).max(255).required(),
        isGold: Joi.boolean()
    }

    return Joi.validate(customer, schema)
}

exports.Customer = Customer
exports.validate = validateCustomer