const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get("/email", (req, res) =>{
    res.render("contatos/index")
})

module.exports = router