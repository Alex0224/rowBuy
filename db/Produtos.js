const Sequelize = require('sequelize');
const connection = require('./db');

const Produtos = connection.define('Produtos', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.STRING,
        allowNull: false
    },
    preco:{
        type: Sequelize.STRING,
        allowNull: false
    },
    promocao:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nomeVendedor:{
        type: Sequelize.STRING,
        allowNull: false
    },
    contatoVendedor:{
        type: Sequelize.STRING,
        allowNull: false
    },
    imagem:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Produtos.sync({force: false}).then(()=>{})

module.exports = Produtos;