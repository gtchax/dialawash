const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
         unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    address: {
         type: Sequelize.STRING,
          allowNull: true,
     },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    resetToken: Sequelize.STRING,
    resetTokenExpiration: Sequelize.DATE
});

module.exports = User