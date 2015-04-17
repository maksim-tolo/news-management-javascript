var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('news', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        shortDescription: {
            type: Sequelize.STRING(1000),
            allowNull: false
        },
        body: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });
};