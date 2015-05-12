module.exports = function (dataService) {

    //400 error handler
    function badRequestHandler(next) {
        var err = new Error('Bad Request');
        err.status = 400;
        return next(err);
    }

    var valid = require('./validate'); //validate function, takes 1 parameters ({required validation: data for validation} - type: Object) return whether the validation passed - type: Boolean

    return {
        getNewsList: function (req, res, next) {
            if (valid({validLimitAndFrom: req.query})) {
                dataService.getNewsList(+req.query.from, +req.query.limit, function (newsList) { //get news list from DB, takes 3 parameters (start position - type: Number, finish position - type: Number, callback(news list - type: Array) - type: Function)
                    if (newsList && newsList.err) {
                        next(newsList.err);
                    } else {
                        dataService.getNumberOfNews(function (numberOfNews) { //get number of news from DB, takes 1 parameters (callback(number of news - type: Number) - type: Function)
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
                dataService.getNewsById(+req.params.id, function (data) { //get news message by id from DB, takes 2 parameters (news id - type: Number, callback(news message - type: Array with 1 element comprising news - type: Object) - type: Function)
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
                dataService.changeNews(+req.params.id, req.body, function (data) { //change news message, takes 3 parameters (news id - type: Number, new data - type: Object, callback - type: Function)
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
                dataService.addNews(req.body, function (data) { //add news message to DB, takes 2 parameters (news data - type: Object, callback - type: Function)
                    if (data && data.err) {
                        next(data.err);
                    } else {
                        dataService.getLastInsertId(function (newsId) { //get last insert id from DB, takes 1 parameters (callback({newsId: news id - type: Number} - type: Object) - type: Function)
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
                dataService.deleteNews(+req.params.id, function (data) { //delete news message by id, takes 2 parameters (news id - type: Number, callback - type: Function)
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