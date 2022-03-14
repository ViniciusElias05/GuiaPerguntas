const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'muitocurta801', {
    host:'localhost',
    dialect: 'mysql'
});

module.exports = connection;