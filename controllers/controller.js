module.exports = function (sequelize) {
    var News = require('../models/news')(sequelize);
    return {
        create: function (req, res) {

        },
        get: function (req, res) {
            News.findAll().success(function (news) {
                res.send(news);
            });
        }
    };
};