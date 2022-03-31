const Sequelize = require('sequelize');
const connection = require('./db');

const Login = connection.define('Login', {
    nomeUsuario:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    cpf:{
        type: Sequelize.STRING,
        allowNull: false
    },
    anoNascimento:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Login.sync({force: false}).then(()=>{})

module.exports = Login;