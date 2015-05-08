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
                dataService.getNewsList(+req.query.from, +req.query.limit, function(newsList) {
                    (newsList && newsList.err) ? next(newsList.err): dataService.getNumberOfNews(function(numberOfNews) {
                        (numberOfNews && numberOfNews.err) ? next(numberOfNews.err): res.send({newsList: newsList, numberOfNews: numberOfNews});
                    });
                });
            } else {
                badRequestHandler(next);
            }
        },
        getNewsById: function (req, res, next) {
             if(valid({validId: req.params})) {
                 dataService.getNewsById(req.params.id, function(data) {
                     (data && data.err) ? next(data.err): res.send(data);
                 });
             } else {
                 badRequestHandler(next);
             }
        },
        changeNews: function (req, res, next) {
            if(valid({validId: req.params, validNewsData: req.body})) {
                dataService.changeNews(req.params.id, req.body, function(data) {
                    (data && data.err) ? next(data.err): res.end();
                });
            } else {
                badRequestHandler(next);
            }
        },
        addNews: function (req, res, next) {
            if(valid({validNewsData: req.body})) {
                dataService.addNews(req.body, function (data) {
                    (data && data.err) ? next(data.err): dataService.getLastInsertId(function (newsId) {
                        (newsId && newsId.err) ? next(newsId.err): res.send(newsId);
                    });
                });
            } else {
                badRequestHandler(next);
            }
        },
        deleteNews: function (req, res, next) {
            if(valid({validId: req.params})) {
                dataService.deleteNews(req.params.id, function (data) {
                    (data && data.err) ? next(data.err): res.end();
                });
            } else {
                badRequestHandler(next);
            }
        }
    };
};