const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/resgistro", (req, res) => {
    res.render("usuarios/registros")
})

router.post("/resgistro", (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail inválido!"})
    }  
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválido!"})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito pequena, digite novamente!"})
    }
    if(req.body.senha != req.body.confSenha){
        erros.push({texto: "A senha está diferente, Por favor confirmar novamente!"})
    }
    if(erros.length > 0){
        res.render("usuarios/registros", {erros:erros})
    }
    else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Este e-mail já existe!")
                res.redirect("/usuarios/resgistro")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eAdmin: 1
                })
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Houve um erro no salvamento!")
                            res.redirect("/")
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso!")
                            res.redirect("/usuarios/login")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar usuario. Tente novamente mais tarde!")
                            res.redirect("/")
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash((err) => {
                req.flash("error_msg", "Houve um erro interno!")
                res.redirect("/")
            })
        })
    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", passport.authenticate('local', {
    successRedirect: "/carros",
    failureRedirect: "/usuarios/login",
    failureFlash: true
}), (req, res) => {
    res.redirect("/")
})

//Botão configurações "EDITAR PERFIL"
router.get("/registro/usuario", (req, res) => {
    Usuario.find().lean().then((registro) => {
        res.render("usuarios/userRegistro", {registro:registro})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar os Perfis!")
        res.redirect("/usuarios/registro/usuario")
    })
})

router.post("/editar", (req, res) => {
    var erros = []
    
    if(req.body.senha.length < 4){
        erros.push({texto: "Senhas muito pequena!"})
    }
    if(req.body.senha != req.body.confSenha){
        erros.push({texto: "Senhas difentes!"})
    }
    if(erros.length > 0){
        res.render("usuarios/editarRegistro", {erros:erros})
    }
    else{
        Usuario.findOne({email: req.body.email}).lean().then(() => {
            const perfilEditado = new Usuario({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha,
                eAdmin: 1
            })

            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(perfilEditado.senha, salt, (erro, hash) => {
                    if(erro){
                        req.flash("error_msg", "Houve um erro no salvamento!")
                        res.redirect("/usuarios/registro/usuario")
                    }
                    perfilEditado.senha = hash
                    perfilEditado.save().then(() => {
                        req.flash("success_msg", "Usuario editado com sucesso!")
                        res.redirect("/usuarios/registro/usuario")
                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao editar o usuario. Tente novamente mais tarde!")
                        res.redirect("/usuarios/registro/usuario")
                    })
                })
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno!")
            res.redirect("/usuarios/registro/usuario")
            console.log("Erro interno: " + err)
        })

    }
})

router.get("/editar/:id", (req, res) => {
    Usuario.findOne({_id: req.params.id}).lean().then((editarUser) => {
        res.render("usuarios/editarRegistro", {editarUser:editarUser})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar este perfil!")
        res.redirect("/usuarios/registro/usuario")
    })
})

router.get("/deletar/:id", (req, res) => {
    Usuario.remove({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Perfil deletado com sucesso!")
        res.redirect("/usuarios/registro/usuario")
    }).catch((err) => {
        req.flash("error_msg","Houve um erro ao deletar esse perfil!")
        res.redirect("/usuarios/registro/usuario")
    })
})

module.exports = router