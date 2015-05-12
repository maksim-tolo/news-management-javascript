module.exports = function (dataService) {

    function badRequestHandler(next) {
        var err = new Error('Bad Request');
        err.status = 400;
        return next(err);
    }

    var valid = require('./validate');

    return {
        getNewsList: function (req, res, next) {
            if (valid({validLimitAndFrom: req.query})) {
                dataService.getNewsList(+req.query.from, +req.query.limit, function (newsList) {
                    if (newsList && newsList.err) {
                        next(newsList.err);
                    } else {
                        dataService.getNumberOfNews(function (numberOfNews) {
                            if (numberOfNews && numberOfNews.err) {
                                next(numberOfNews.err);
                            } else {
                                res.send({newsList: newsList, numberOfNews: numberOfNews});
                            }
                        });
                    }
                });
            } else {
                badRequestHandler(next);
            }
        },
        getNewsById: function (req, res, next) {
            if (valid({validId: req.params})) {
                dataService.getNewsById(req.params.id, function (data) {
                    if (data && data.err) {
                        next(data.err);
                    } else {
                        res.send(data);
                    }
                });
            } else {
                badRequestHandler(next);
            }
        },
        changeNews: function (req, res, next) {
            if (valid({validId: req.params, validNewsData: req.body})) {
                dataService.changeNews(req.params.id, req.body, function (data) {
                    if (data && data.err) {
                        next(data.err);
                    } else {
                        res.end();
                    }
                });
            } else {
                badRequestHandler(next);
            }
        },
        addNews: function (req, res, next) {
            if (valid({validNewsData: req.body})) {
                dataService.addNews(req.body, function (data) {
                    if (data && data.err) {
                        next(data.err);
                    } else {
                        dataService.getLastInsertId(function (newsId) {
                            if (newsId && newsId.err) {
                                next(newsId.err);
                            } else {
                                res.send(newsId);
                            }
                        });
                    }
                });
            } else {
                badRequestHandler(next);
            }
        },
        deleteNews: function (req, res, next) {
            if (valid({validId: req.params})) {
                dataService.deleteNews(req.params.id, function (data) {
                    if (data && data.err) {
                        next(data.err);
                    } else {
                        res.end();
                    }
                });
            } else {
                badRequestHandler(next);
            }
        }
    };
};