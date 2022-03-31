const Sequelize = require('sequelize');
const connection = new Sequelize('rowbuy', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;