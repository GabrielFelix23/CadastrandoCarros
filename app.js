const express = require("express")
const app = express()
const mongoose = require("mongoose")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
const router = require("./routes/admin")
const session = require("express-session")
const flash = require("connect-flash")

//Configurações das Midllewares
    //Session
    app.use(session({
        secret: "ProjetoCadastrandoCarros",
        resave: true,
        saveUninitialized: true
    }))
    //Flash
    app.use(flash())
    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
    //Mongoose banco de dados
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/cadastrandoCarros", {
        useMongoClient: true, 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true}).then(() => {
            console.log("Banco de dados conctado!")
    }).catch((err) => {
        console.log("Houve um erro ao se conctar com o banco de dados!")
    })

    //Handlebars para arquivos html
    app.engine("handlebars", handlebars({defaultLayout: "main"}))
    app.set('view engine', "handlebars")

    //Body-Parser para receber dados dos fomulários
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //Pash para trabalhar com arquivos externos
    app.use(express.static(path.join(__dirname, "public")))

    //Rotas
    app.use("/", router)
    
//servidor
const porta = 8080
app.listen(porta, () => {
    console.log("Servidor rodando na porta: 8080")
})
    