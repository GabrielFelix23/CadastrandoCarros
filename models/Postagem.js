const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Postagem = new Schema({
    titulo:{
        type: String,
        requered: true
    },
    nome: {
        type: String,
        requered: true
    },
    ano:{
        type: String,
        requered: true
    },
    km:{
        type: String,
        requered: true
    },
    preco: {
        type: String,
        requered: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "cadastros",
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", Postagem)