module.exports = function (connection) {
    return {
        getNewsList: function (req, res, next) {//логику работы с бз в отдельный сервис
            connection.query('SELECT id, title, shortDescription, creationDate, modificationDate FROM news ORDER BY id DESC LIMIT ' + req.query.limit + ' OFFSET ' + req.query.from, function(err, result) {
                if(err) {
                    next(err);
                }
                connection.query('SELECT COUNT(*) FROM news', function(err, numberOfNews) {
                    if(err) {
                        next(err);
                    }
                    res.send({newsList: result, numberOfNews: numberOfNews[0]["COUNT(*)"]});
                });
            });
        },
        getNewsById: function (req, res, next) {
            connection.query('SELECT id, title, shortDescription, creationDate, modificationDate, body FROM news where id = ' + connection.escape(req.params.id), function(err, result) {
                if(err) {
                    next(err);
                }
                res.send(result);
            });
        },
        changeNews: function (req, res, next) {
            connection.query('UPDATE news SET ' + connection.escape(req.body) + ', modificationDate=' + connection.escape(new Date()) + ' WHERE id = ' + connection.escape(req.params.id), function(err) {
                if(err) {
                    next(err);
                }
                res.end();
            });
        },
        addNews: function (req, res, next) {
            connection.query('INSERT INTO news SET ' + connection.escape(req.body) + ', creationDate=' + connection.escape(new Date()) + ', modificationDate=' + connection.escape(new Date()), function(err) {
                if(err) {
                    next(err);
                }
                res.end();
            });
        },
        deleteNews: function (req, res, next) {
            connection.query('DELETE FROM news WHERE id = ' + connection.escape(req.params.id), function(err) {
                if(err) {
                    next(err);
                }
                res.end();
            });
        }
    };
};