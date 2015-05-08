module.exports = function (pool) {
    return {
        getNumberOfNews: function (callback) {
            pool.getConnection(function(err, connection) {
                if(err) {
                    return callback({err: err});
                }
                var q = 'SELECT COUNT(*) FROM news';

                callback && connection.query(q, function (err, result) {
                    connection.release();
                    callback(err ? {err: err} : result[0]["COUNT(*)"]);
                });
            });
        },
        getNewsList: function(from, limit, callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err});
                }
                var q = 'SELECT id, title, shortDescription, creationDate, modificationDate FROM news ORDER BY id DESC LIMIT ? OFFSET ?';

                callback && connection.query(q, [+limit, +from], function (err, result) {
                    connection.release();
                    callback(err ? {err: err} : result);
                });
            });
        },
        getNewsById: function (newsId, callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err});
                }
                var q = 'SELECT id, title, shortDescription, creationDate, modificationDate, body FROM news where id = ?';

                callback && connection.query(q, newsId, function (err, result) {
                    connection.release();
                    callback(err ? {err: err} : result);
                });
            });
        },
        changeNews: function (newsId, newsData, callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err});
                }
                var q = 'UPDATE news SET ?, modificationDate=? WHERE id = ?';
                var date = new Date();

                callback && connection.query(q, [newsData, date, newsId], function (err) {
                    connection.release();
                    callback(err ? {err: err} : null);
                });
            });
        },
        addNews: function (newsData, callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err});
                }
                var q = 'INSERT INTO news SET ?, creationDate=?, modificationDate=?';
                var date = new Date();

                callback && connection.query(q, [newsData, date, date], function (err) {
                    connection.release();
                    callback(err ? {err: err} : null);
                });
            });
        },
        getLastInsertId: function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err});
                }
                var q = 'SELECT LAST_INSERT_ID()';

                callback && connection.query(q, function (err, result) {
                    connection.release();
                    callback(err ? {err: err} : {newsId: result[0]["LAST_INSERT_ID()"]});
                });
            });
        },
        deleteNews: function (newsId, callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err});
                }
                var q = 'DELETE FROM news WHERE id = ?';

                callback && connection.query(q, newsId, function (err) {
                    connection.release();
                    callback(err ? {err: err} : null);
                });
            });
        }
    };
};