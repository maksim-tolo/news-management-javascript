module.exports = function (connection) {
    return {
        getNumberOfNews: function (callback) {
            callback && connection.query('SELECT COUNT(*) FROM news', function(err, result) {
                callback(err ? {err: err} : result[0]["COUNT(*)"]);
            });
        },
        getNewsList: function(from, limit, callback) {
            callback && connection.query('SELECT id, title, shortDescription, creationDate, modificationDate FROM news ORDER BY id DESC LIMIT ' + limit + ' OFFSET ' + from, function(err, result) {
                callback(err ? {err: err} : result);
            });
        },
        getNewsById: function (newsId, callback) {
            callback && connection.query('SELECT id, title, shortDescription, creationDate, modificationDate, body FROM news where id = ' + connection.escape(newsId), function(err, result) {
                callback(err ? {err: err} : result);
            });
        },
        changeNews: function (newsId, newsData, callback) {
            callback && connection.query('UPDATE news SET ' + connection.escape(newsData) + ', modificationDate=' + connection.escape(new Date()) + ' WHERE id = ' + connection.escape(newsId), function(err) {
                callback(err ? {err: err} : null);
            });
        },
        addNews: function (newsData, callback) {
            callback && connection.query('INSERT INTO news SET ' + connection.escape(newsData) + ', creationDate=' + connection.escape(new Date()) + ', modificationDate=' + connection.escape(new Date()), function(err) {
                callback(err ? {err: err} : null);
            });
        },
        getLastInsertId: function(callback) {
            callback && connection.query('SELECT LAST_INSERT_ID()', function(err, result) {
                callback(err ? {err: err} : {newsId: result[0]["LAST_INSERT_ID()"]});
            });
        },
        deleteNews: function (newsId, callback) {
            callback && connection.query('DELETE FROM news WHERE id = ' + connection.escape(newsId), function(err) {
                callback(err ? {err: err} : null);
            });
        }
    };
};