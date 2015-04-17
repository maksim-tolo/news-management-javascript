module.exports = function (sequelize) {
    var News = require('../models/news')(sequelize);
    return {
        getAllNews: function (req, res) {
            News.findAll({attributes: ['id', 'title', 'shortDescription', 'createdAt', 'updatedAt']}).then(function (news) {
                res.send(news);
            });
        },
        getNews: function (req, res) {
            News.find(req.params.id).then(function (news) {
                res.send(news);
            });
        },
        changeNews: function (req, res) {
            News.find(req.params.id).then(function (news) {
                if(news) {
                    news.updateAttributes({
                        title: req.body.title,
                        shortDescription: req.body.shortDescription,
                        body: req.body.body
                    }).then(function() {
                        res.send(news);
                    })
                }
            });
        },
        addNews: function (req, res) {
            News.create({
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                body: req.body.body
            }).then(function (news) {
                res.send(news);
            })
        },
        deleteNews: function (req, res) {
            News.find(req.params.id).then(function (news) {
                if(news) {
                    news.destroy().then(function() {
                        res.end();
                    })
                }
            });
        }
    };
};