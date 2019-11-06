const express = require("express")
// const Joi = require("joi")
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {title: "My express app", message: "jo you good?"})
})

module.exports = router
