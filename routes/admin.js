const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Cadastro")
const Cadastro = mongoose.model("cadastros")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


router.get("/nome", (req, res) => {
    Usuario.find().lean().then((user) => {
        res.render("partials/_navbar", {user:user})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao mostrar o nome do user")
        res.redirect("/")
    })
})


//Home
router.get("/", (req, res) => {
    Postagem.find().populate("categoria").sort({data: 'desc'}).lean().then((postagens) => {
        res.render("admin/index", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/404")
    })
})
//Rota do erro 404
router.get("/404", (req, res) => {
    res.send("Erro 404")
})
//Lista de postagem
router.get("/postagem/lista/:nome", (req, res) => {
    Postagem.findOne({nome: req.params.nome}).lean().then((postagens) => {
        res.render("postagens/index", {postagens:postagens})
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erros ao lista esta postagem!")
        res.redirect("/")
    })
})
//Lista de Cadastro
router.get("/cadastros/lista", (req, res) => {
    Cadastro.find().lean().sort({data: 'desc'}).then((cadastros) => { 
        res.render("cadastros/index", {cadastros:cadastros})    
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar este cadastro!")
        res.redirect("/")
    })
})
//Links dos cadastros para as postagens
router.get("/cadastro/postagem/:nomeCarro", (req, res) => {
    Cadastro.findOne({nomeCarro: req.params.nomeCarro}).lean().then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).lean().then((postagem) => {
                res.render("cadastros/postagens", {postagem:postagem, categoria:categoria })
            }).catch((err) => {
                req.flash("error_msg", "Esta postagem não existe!")
                res.redirect("/cadastros/lista")
            })
        }else{
            req.flash("error_msg", "Este cadastro não existe!")
            res.redirect("/cadastros/lista")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao lista a postagem!")
        res.redirect("/cadastros/lista")
    })
})

//Botão Ver Carros
router.get("/carros", eAdmin, (req, res) => {
    Cadastro.find().lean().sort({data: 'desc'}).then((carros) => {
        res.render("admin/carros", {carros:carros})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar o carro!")
        res.redirect("/carros")
    })
})

//Cadastrar +
router.get("/add/carros", eAdmin, (req, res) => {
    res.render("admin/addcarros")
})
router.post("/novo/carro", eAdmin, (req, res) => {
    var erros = []
    if(!req.body.nomeUser || typeof req.body.nomeUser == undefined || req.body.nomeUser == null){
        erros.push({texto: "Nome do proprietario inválido!"})
    }
    if(!req.body.nomeCarro || typeof req.body.nomeCarro == undefined || req.body.nomeCarro == null){
        erros.push({texto: "Nome do carro está inválido!"})
    }
    if(!req.body.ano || typeof req.body.ano == undefined || req.body.ano == null){
        erros.push({texto: "Ano inválido!"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descricão inválido!"})
    }
    if(req.body.nomeUser.length < 2){
        erros.push({texto: "O nome do proprietario está muito pequeno. Por favor alterar esse campo!"})
    }
    if(req.body.nomeCarro.length < 2){
        erros.push({texto: "O nome está muito pequeno. Por favor alterar esse campo!"})
    }
    if(req.body.descricao.length < 2){
        erros.push({texto: "A descrição está muito pequena. Por favor alterar esse campo!"})
    }
    if(erros.length > 0){
        res.render("admin/addcarros", {erros:erros})
    }
    else{
        const novoCarro = {
            nomeUser: req.body.nomeUser,
            nomeCarro: req.body.nomeCarro,
            ano: req.body.ano,
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
router.get("/editar/carros/:id", eAdmin, (req, res) => {
    Cadastro.findOne({_id: req.params.id}).lean().then((carroEditar) => {
        res.render("admin/editarcarros", {carroEditar:carroEditar})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar. Tente novamente!")
        res.redirect("/carros")
    })
})
router.post("/carro/editado", eAdmin, (req, res) => {
    var erros = []
    if(!req.body.nomeUser || typeof req.body.nomeUser == undefined || req.body.nomeUser == null){
        erros.push({texto: "Nome do proprietario está inválido!"})
    }
    if(!req.body.nomeCarro || typeof req.body.nomeCarro == undefined || req.body.nomeCarro == null){
        erros.push({texto: "Nome do carro inválido!"})
    }
    if(!req.body.ano || typeof req.body.ano == undefined || req.body.ano == null){
        erros.push({texto: "Ano inválido!"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descricão inválido!"})
    }
    if(req.body.nomeUser.length < 4){
        erros.push({texto: "O nome do proprietario está muito pequeno. Por favor alterar esse campo!"})
    }
    if(req.body.nomeCarro.length < 2){
        erros.push({texto: "O nome do carro está muito pequeno. Por favor alterar esse campo!"})
    }
    if(req.body.descricao.length < 2){
        erros.push({texto: "A descrição está muito pequena. Por favor alterar esse campo!"})
    }
    if(erros.length > 0){
        res.render("admin/editarcarros", {erros:erros})
    }
    else{
        Cadastro.findOne({_id: req.body.id}).sort({data: 'desc'}).then((carrosEditados) => {
            
            carrosEditados.nomeUser = req.body.nomeUser,
            carrosEditados.nomeCarro = req.body.nomeCarro,
            carrosEditados.ano = req.body.ano,
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
router.post("/deletar/carros", eAdmin, (req, res) => {
    Cadastro.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Lista deletada com sucesso!")
        res.redirect("/carros")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a lista de carro!")
        res.redirect("/carros")
    })
})

//Postagem
router.get("/postagem", eAdmin, (req, res) => {
    Postagem.find().populate("categoria").sort({data: 'desc'}).lean().then((postagens) => {
        res.render("admin/listapostagens", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens!")
        res.redirect("/postagem")
    })
})
router.get("/add/postagem", eAdmin, (req, res) => {  
    Cadastro.find().lean().then((cadastro) => {
        res.render("admin/addpostagem", {cadastro:cadastro})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao entrar na página da postagem!")
        res.redirect("/carros")
    })
})
router.post("/postagem/carro", eAdmin, (req, res) => {
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
router.get("/edit/postagem/:id", eAdmin, (req, res) => {
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
router.post("/postagem/editada", eAdmin, (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        
        postagem.titulo = req.body.titulo,
        postagem.nome = req.body.nome,
        postagem.ano = req.body.ano,
        postagem.km = req.body.km,
        postagem.preco = req.body.preco
        
        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/postagem")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salva a sua edição!")
            console.log("Erro: " + err)
            res.redirect("/postagem")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/postagem")
    })
})

//Deletar postagem
router.get("/delete/postagem/:id", eAdmin, (req, res) => {
    Postagem.remove({_id: req.params.id}).lean().then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/postagem")
    }).catch((err) => {
        req.flash("error_msg","Houve um erro ao deletar esta postagem!")
    })
})

///logout
router.get("/logout", (req, res) => {
    req.logout()

    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")
})

module.exports = router