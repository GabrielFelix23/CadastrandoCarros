const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Cadastro")
const Cadastro = mongoose.model("cadastros")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get("/", (req, res) => {
    res.render("admin/index")
})

//Botão Ver Carros
router.get("/carros", (req, res) => {
    Cadastro.find().lean().sort({data: 'desc'}).then((carros) => {
        res.render("admin/carros", {carros:carros})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar o carro!")
        res.redirect("/carros")
    })
})

//Cadastrar +
router.get("/add/carros", (req, res) => {
    res.render("admin/addcarros")
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
        new Cadastro(novoCarro).save().then(() => {
            req.flash("success_msg", "Carro cadastrado com sucesso!")
            res.redirect("/carros")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao cadastrar esse carro. Por favor cadastre novamente!")
            res.redirect("/add/carros")
        })
    }
})

//Botão Editar lista
router.get("/editar/carros/:id", (req, res) => {
    Cadastro.findOne({_id: req.params.id}).lean().then((carroEditar) => {
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
        Cadastro.findOne({_id: req.body.id}).sort({data: 'desc'}).then((carrosEditados) => {
            
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

//Botão deletar lista
router.post("/deletar/carros", (req, res) => {
    Cadastro.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Lista deletada com sucesso!")
        res.redirect("/carros")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a lista de carro!")
        res.redirect("/carros")
    })
})

//Postagem
router.get("/postagem", (req, res) => {
    Postagem.find().populate("categoria").sort({data: 'desc'}).lean().then((postagens) => {
        res.render("admin/listapostagens", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens!")
        res.redirect("/postagem")
    })
})
router.get("/add/postagem", (req, res) => {  
    Cadastro.find().lean().then((cadastro) => {
        res.render("admin/addpostagem", {cadastro:cadastro})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao entrar na página da postagem!")
        res.redirect("/carros")
    })
})
router.post("/postagem/carro", (req, res) => {
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria!"})
    }
    if(erros.length > 0){
        res.render("admin/addpostagem", {erros:erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            nome: req.body.nome,
            ano: req.body.ano,
            km: req.body.km,
            preco: req.body.preco,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/postagem")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao criar a postagem!")
            res.redirect("/add/postagem")
        })
    }
})

//Editar postagem
router.get("/edit/postagem/:id", (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        
        Cadastro.find().lean().then((cadastro) => {
            res.render("admin/editpostagem", {cadastro:cadastro, postagem:postagem})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao entrar na postagem para editar!")
            res.redirect("/postagem")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao iniciar a edição da sua postagem!")
        res.redirect("/postagem")
    })
})
router.post("/postagem/editada", (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        
        postagem.titulo = req.body.titulo,
        postagem.nome = req.body.nome,
        postagem.ano = req.body.ano,
        postagem.km = req.body.km,
        postagem.preco = req.body.preco,
        postagem.categoria = req.body.categoria
        
        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/postagem")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salva a sua edição!")
            res.redirect("/postagem")
        })
    })
})

//Deletar postagem
router.get("/delete/postagem/:id", (req, res) => {
    Postagem.remove({_id: req.params.id}).lean().then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/postagem")
    }).catch((err) => {
        req.flash("error_msg","Houve um erro ao deletar esta postagem!")
    })
})





module.exports = router