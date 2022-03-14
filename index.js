const express = require("express");
const app = express();
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');
//Database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })


// Estou diznedo para o Express usar o EJS como view engine
app.set('view engine', 'ejs');
app.use(express.static('public')); // definindo qual a pasta contém o arquivos estáticos

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Rotas
app.get("/",(req, res) =>{
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']// ASC = crescente || DESC = decrescente
    ]}).then( perguntas =>{
        res.render("index",{perguntas: perguntas});
    })
    
});

app.get("/perguntar", (req,res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req,res)=>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect('/');
    })
})

app.get("/pergunta/:id", (req,res) =>{
    let id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then( pergunta =>{


    if(pergunta != undefined){
        Resposta.findAll({
            where: {perguntaId: pergunta.id},
            order:[['id', 'DESC']]
        }).then( respostas =>{
            res.render("pergunta", {
                pergunta: pergunta,
                respostas: respostas});
        })
        }else{
            res.redirect("/");
        }
    });
})
 app.post("/responder", (req,res)=>{
     let corpo = req.body.corpo;
     let perguntaId = req.body.pergunta;
     Resposta.create({
         corpo: corpo,
         perguntaId: perguntaId
     }).then(()=>{
         res.redirect("/pergunta/"+perguntaId)
     })
 });
app.listen(8080,()=> {console.log("App rodando!");});