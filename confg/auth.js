const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

//Conf para salvar os dados do usuario e levar para as outras sessões
passport.serializeUser((usuario, done) => {
    done(null, usuario._id)
})
passport.deserializeUser((id, done) => {
    Usuario.findById(id, (error, usuario) => {
        done(error,usuario)
    })
})

//Confg email e senha
module.exports = passport.use(new LocalStrategy({
    usernameField: "email", 
    passwordField: "senha"
},(email, senha, done) => {
    Usuario.findOne({email: email}).lean().then((usuario) => {
        if(!usuario){
            return done(null, false, {message: "Esta conta não existe!"})
        }
        bcrypt.compare(senha, usuario.senha, (erro, batem) => {
            if(batem){
                return done(null, usuario)
            }else{
                return done(null, false, {message: "Senha incorreta!"})
            }
        })
    })
}))