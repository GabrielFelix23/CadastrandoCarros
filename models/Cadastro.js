const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CadastroCar = new Schema({
    nomeUser:{
        type: String,
        required: true
    },
    nomeCarro:{
        type: String,
        required: true
    },
    ano:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("cadastros", CadastroCar)