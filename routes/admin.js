const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Cadastro")
const CadastroCar = mongoose.model("cadastros")

router.get("/", (req, res) => {
    res.render("admin/index")
})

//Botão Ver Carros
router.get("/carros", (req, res) => {
    CadastroCar.find().lean().sort({data: 'desc'}).then((carros) => {
        res.render("admin/carros", {carros:carros})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar o carro!")
        res.redirect("/carros")
    })
})

router.post("/novo/carro", (req, res) => {
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.ano || typeof req.body.ano == undefined || req.body.ano == null){
        erros.push({texto: "Ano inválido!"})
    }
    if(!req.body.preco || typeof req.body.preco == undefined || req.body.preco == null){
        erros.push({texto: "Preço inválido!"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descrição inválida!"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "O nome está muito pequeno. Por favor alterar esse campo!"})
    }
    if(req.body.descricao.length < 5){
        erros.push({texto: "A descrição está muito pequena. Por favor alterar esse campo!"})
    }
    if(erros.length > 0){
        res.render("admin/addcarros", {erros:erros})
    }
    else{
        const novoCarro = {
            nome: req.body.nome,
            ano: req.body.ano,
            preco: req.body.preco,
            descricao: req.body.descricao
        }
        new CadastroCar(novoCarro).save().then(() => {
            req.flash("success_msg", "Carro cadastrado com sucesso!")
            res.redirect("/carros")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao cadastrar esse carro. Por favor cadastre novamente!")
            res.redirect("/add/carros")
        })
    }
})

//Cadastrar +
router.get("/add/carros", (req, res) => {
    res.render("admin/addcarros")
})

//Postagem
router.get("/postagem", (req, res) => {
    CadastroCar.find().lean().then((postagens) => {
        res.render("admin/postagem", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao entrar na página da postagem!")
        res.redirect("/carros")
    })
})

//Botão Editar Postagem
router.get("/editar/carros/:id", (req, res) => {
    CadastroCar.findOne({_id: req.params.id}).lean().then((carroEditar) => {
        res.render("admin/editarcarros", {carroEditar:carroEditar})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar. Tente novamente!")
        res.redirect("/carros")
    })
})

router.post("/carro/editado", (req, res) => {
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.ano || typeof req.body.ano == undefined || req.body.ano == null){
        erros.push({texto: "Ano inválido!"})
    }
    if(!req.body.preco || typeof req.body.preco == undefined || req.body.preco == null){
        erros.push({texto: "Preço inválido!"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descrição inválida!"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "O nome está muito pequeno. Por favor alterar esse campo!"})
    }
    if(req.body.descricao.length < 5){
        erros.push({texto: "A descrição está muito pequena. Por favor alterar esse campo!"})
    }
    if(erros.length > 0){
        res.render("admin/editarcarros", {erros:erros})
    }
    else{
        CadastroCar.findOne({_id: req.body.id}).sort({data: 'desc'}).then((carrosEditados) => {
            
            carrosEditados.nome = req.body.nome,
            carrosEditados.ano = req.body.ano,
            carrosEditados.preco = req.body.preco,
            carrosEditados.descricao = req.body.descricao

            carrosEditados.save().then(() => {
                req.flash("success_msg", "A postagem do seu carro foi editada com sucesso!")
                res.redirect("/carros")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao editar a postagem do seu carro. Tente novamente!")
                res.redirect("/editar/carros")
            })
        }).catch((err) => {
                req.flash("error_msg", "Não foi possivel editar seu carro. Tente novamente mais tarde! Obrigado.")
                res.redirect("/editar/carros")
        })
    }
})

//Botão deletar
router.post("/deletar/carros", (req, res) => {
    CadastroCar.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Lista deletada com sucesso!")
        res.redirect("/carros")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a lista de carro!")
        res.redirect("/carros")
    })
})

module.exports = router