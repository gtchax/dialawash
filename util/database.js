const Sequelize = require('sequelize');

const sequelize = new Sequelize('dialawash', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;