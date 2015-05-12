module.exports = function (pool) {
    return {
        //get number of news, takes 1 parameters (callback(number of news - type: Number) - type: Function)
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
        //get news list, takes 3 parameters (start position - type: Number, finish position - type: Number, callback(news list - type: Array) - type: Function)
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
        //get news message by id, takes 2 parameters (news id - type: Number, callback(news message - type: Array with 1 element comprising news - type: Object) - type: Function)
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
        //change news message, takes 3 parameters (news id - type: Number, new data - type: Object, callback - type: Function)
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
        //add news message, takes 2 parameters (news data - type: Object, callback - type: Function)
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
        //get last insert id, takes 1 parameters (callback({newsId: news id - type: Number} - type: Object) - type: Function)
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
        //delete news message by id, takes 2 parameters (news id - type: Number, callback - type: Function)
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