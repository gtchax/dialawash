const Sequelize = require('sequelize');
require('dotenv/config')

const sequelize = new Sequelize(`${process.env.MYSQL_DB}`, `${process.env.MYSQL_USER}`, `${process.env.MYSQL_PASS}`, {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;