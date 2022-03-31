const express = require('express');
const app = express();
const porta = 3003;
const bodyParser = require('body-parser');
const connection = require('./db/db');
const Login = require('./db/Login');
const Produtos = require('./db/Produtos');
let token = false;

//Conexão Banco de Dados
connection
    .authenticate()
    .then(() =>{
        console.log('Conexão feita com o banco de dados.')
    })
    .catch((err)=>{
        console.log(err)
    })

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    Produtos.findAll({raw: true, order: [
        ['id', 'DESC'] 
    ]}).then((produtos)=>{
        res.render('index',{
            produtos: produtos
        })
    })
});

app.get('/login', (req, res) =>{
    if(token){
        res.redirect('jaLogado')
    } else{
        res.render('login')
    }
});

app.get('/logado', (req, res) =>{
    if(token){
        Produtos.findAll({raw: true, order: [
            ['id', 'DESC'] 
        ]}).then((produtos)=>{
            res.render('logado',{
                produtos: produtos
            })
        })
    } else{
        res.redirect('/login')
    }
})

app.get('/cadastrarOne', (req, res) =>{
    res.render('cadastrarOne');
});

app.post('/realizarCadastro', (req, res) =>{
    let nomeUsuario = req.body.namePlace;
    let email = req.body.emailPlace;
    let cpf = req.body.cpfPlace;
    let anoNascimento = req.body.dataPlace;
    let senha = req.body.senhaPlace;
    let senhaNovamente = req.body.repeatSenhaPlace;
    if(senha != senhaNovamente){
       console.log('login errado')
    } else{

        Login.create({
            nomeUsuario: nomeUsuario,
            email: email,
            cpf: cpf,
            anoNascimento: anoNascimento,
            senha: senha
        }).catch((err) =>{
            console.log('Erro inesperado! Erro ao enviar os dados para o banco de dados.')
        })
        res.redirect('logado')
    }
})

app.post('/realizarLogin', async (req, res) =>{
    const usuario = await Login.findOne({
        attibutes: ['email', 'senha'], 
        where: {
            email: req.body.inputEmail,
            senha: req.body.inputSenha
        }
    }).catch((err) =>{
        console.log('Erro inesperado!')
    })

    if (usuario == null){
        res.redirect('login')
        return token = false;
    }

    res.redirect('logado')
    return token = true;
})

app.get('/cadastrarProdutos', (req, res) =>{
    if(token){
        res.render('cadastrarProdutos')
    } else{
        res.redirect('/login')
    }
    
})

app.post('/enviar-imagem', (req, res) =>{
        let nomeProduto = req.body.nameProduct;
        let descricaoProduto = req.body.descriptionProduct;
        let precoProduto = req.body.precoProduct;
        let promocaoProduto = req.body.promotionProduct;
        let nomeVendedorProduto = req.body.nameVendedor;
        let contatoVendedorProduto = req.body.contactVendedor;
        let linkImagemProduto = req.body.linkImageProduct;

        Produtos.create({  
                
            nome: nomeProduto,
            descricao: descricaoProduto,
            preco: precoProduto,
            promocao: promocaoProduto,
            nomeVendedor: nomeVendedorProduto,
            contatoVendedor: contatoVendedorProduto,
            imagem: linkImagemProduto
        }).catch((err) =>{
            console.log(err)
        })


        res.redirect('/logado')
});

app.get('/atualizarProduto/:id', (req, res) =>{
    if(token){
        let id = req.params.id;

    Produtos.findOne({
        where: {id: id}
    }).then(produto => {
        if(produto != undefined){
            res.render('atualizarProduto',{
                produto: produto
            })
        };
    }).catch((err) =>{
        console.log('Erro inesperado. Erro: 3')
    })
    }
});

app.post('/atualizar-dados', (req, res) =>{
    let id = req.body.inputIdAtt;
    Produtos.findOne({
        where: {id: id}
    }).then(produto => {
        if(produto != undefined){
            let nomeProdutoAtt = req.body.nameProductAtt;
            let descricaoProdutoAtt = req.body.descriptionProductAtt;
            let precoProdutoAtt = req.body.precoProductAtt;
            let promocaoProdutoAtt = req.body.promotionProductAtt;
            let nomeVendedorAtt = req.body.nameVendedorAtt;
            let contatoVendedorAtt = req.body.contactVendedorAtt;
            let linkImagemAtt = req.body.linkImageProductAtt;

            produto.nome = nomeProdutoAtt;
            produto.descricao = descricaoProdutoAtt;
            produto.preco = precoProdutoAtt;
            produto.promocao = promocaoProdutoAtt;
            produto.nomeVendedor = nomeVendedorAtt;
            produto.contatoVendedor = contatoVendedorAtt;
            produto.imagem = linkImagemAtt;

            produto.save()

            console.log('Ocorreu tudo corretamente, produto atualizado com sucesso!')

            {
                res.redirect('logado')
            }
        };
    }).catch((err) =>{
        console.log('Erro inesperado. Erro: 4')
    })

});

app.post('/produto/excluir', (req, res) =>{
    let id = req.body.inputIDProduto
    if(id != undefined){
        if(!isNaN(id)){
            Produtos.destroy({
                where: {
                    id: id
                }
            }).then(() =>{
                res.redirect('/logado')
            })
        } else{
            res.redirect('/logado')
        }
    } else{
        res.redirect('/logado')
    }
});

app.get('/jaLogado', (req, res) =>{
    if(token){
        res.render('jaLogado')
    } else{
        res.redirect('/login')
    }
});

app.get('/sairLogin', (req, res) =>{
    if(token){
        token = false;
        res.redirect('/login')
    } else{
        res.redirec('/login')
    }
});

app.listen(porta, (err)=>{
    if(err){
        console.log(`Erro inesperado: Problema 01.`);
    } else{
        console.log('Servidor no ar. Rodando na URL: http://localhost:3003');
    }
});



