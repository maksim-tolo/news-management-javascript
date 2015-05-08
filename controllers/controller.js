module.exports = function (dataService) {

    function badRequestHandler(next) {
        var err = new Error('Bad Request');
        err.status = 400;
        return next(err);
    }

    function validation() {

    }

    return {
        getNewsList: function (req, res, next) {
            if (req.query.from >= 0 && req.query.limit >= 0) {
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
             if(req.params.id > 0) {
                 dataService.getNewsById(req.params.id, function(data) {
                     (data && data.err) ? next(data.err): res.send(data);
                 });
             } else {
                 badRequestHandler(next);
             }
        },
        changeNews: function (req, res, next) {
            if(req.params.id > 0 && Object.keys(req.body).length == 3 && req.body.title && req.body.title.length <= 30 && req.body.shortDescription && req.body.shortDescription.length <= 255 && req.body.body) {
                dataService.changeNews(req.params.id, req.body, function(data) {
                    (data && data.err) ? next(data.err): res.end();
                });
            } else {
                badRequestHandler(next);
            }
        },
        addNews: function (req, res, next) {
            if(Object.keys(req.body).length == 3 && req.body.title && req.body.title.length <= 30 && req.body.shortDescription && req.body.shortDescription.length <= 255 && req.body.body) {
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
            if(req.params.id > 0) {
                dataService.deleteNews(req.params.id, function (data) {
                    (data && data.err) ? next(data.err): res.end();
                });
            } else {
                badRequestHandler(next);
            }
        }
    };
};