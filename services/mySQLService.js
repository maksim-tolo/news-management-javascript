module.exports = function (pool) {
    return {
        getNumberOfNews: function (callback) { //get number of news, takes 1 parameters (callback(number of news - type: Number) - type: Function)
            pool.getConnection(function(err, connection) {
                if(err) {
                    return callback({err: err}); //call callback, pass error Object if error has occurred
                }
                var q = 'SELECT COUNT(*) FROM news';

                callback && connection.query(q, function (err, result) {
                    connection.release();
                    callback(err ? {err: err} : result[0]["COUNT(*)"]); //call callback, pass error Object if error has occurred or number of news - type: Number, if no error
                });
            });
        },
        getNewsList: function(from, limit, callback) { //get news list, takes 3 parameters (start position - type: Number, finish position - type: Number, callback(news list - type: Array) - type: Function)
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err}); //call callback, pass error Object if error has occurred
                }
                var q = 'SELECT id, title, shortDescription, creationDate, modificationDate FROM news ORDER BY id DESC LIMIT ? OFFSET ?';

                callback && connection.query(q, [+limit, +from], function (err, result) {
                    connection.release();
                    callback(err ? {err: err} : result); //call callback, pass error Object if error has occurred or news list - type: Array, if no error
                });
            });
        },
        getNewsById: function (newsId, callback) { //get news message by id, takes 2 parameters (news id - type: Number, callback(news message - type: Array with 1 element comprising news - type: Object) - type: Function)
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err}); //call callback, pass error Object if error has occurred
                }
                var q = 'SELECT id, title, shortDescription, creationDate, modificationDate, body FROM news where id = ?';

                callback && connection.query(q, newsId, function (err, result) {
                    connection.release();
                    callback(err ? {err: err} : result); //call callback, pass error Object if error has occurred or news message - type: Array with 1 element comprising news - type: Object, if no error
                });
            });
        },
        changeNews: function (newsId, newsData, callback) { //change news message, takes 3 parameters (news id - type: Number, new data - type: Object, callback - type: Function)
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err}); //call callback, pass error Object if error has occurred
                }
                var q = 'UPDATE news SET ?, modificationDate=? WHERE id = ?';
                var date = new Date();

                callback && connection.query(q, [newsData, date, newsId], function (err) {
                    connection.release();
                    callback(err ? {err: err} : null); //call callback, pass error Object if error has occurred or null, if no error
                });
            });
        },
        addNews: function (newsData, callback) { //add news message, takes 2 parameters (news data - type: Object, callback - type: Function)
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err}); //call callback, pass error Object if error has occurred
                }
                var q = 'INSERT INTO news SET ?, creationDate=?, modificationDate=?';
                var date = new Date();

                callback && connection.query(q, [newsData, date, date], function (err) {
                    connection.release();
                    callback(err ? {err: err} : null); //call callback, pass error Object if error has occurred or null, if no error
                });
            });
        },
        getLastInsertId: function(callback) { //get last insert id, takes 1 parameters (callback({newsId: news id - type: Number} - type: Object) - type: Function)
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err}); //call callback, pass error Object if error has occurred
                }
                var q = 'SELECT LAST_INSERT_ID()';

                callback && connection.query(q, function (err, result) {
                    connection.release();
                    callback(err ? {err: err} : {newsId: result[0]["LAST_INSERT_ID()"]}); //call callback, pass error Object if error has occurred or {newsId: last insert id - type: Number} - type: Object, if no error
                });
            });
        },
        deleteNews: function (newsId, callback) { //delete news message by id, takes 2 parameters (news id - type: Number, callback - type: Function)
            pool.getConnection(function(err, connection) {
                if (err) {
                    return callback({err: err}); //call callback, pass error Object if error has occurred
                }
                var q = 'DELETE FROM news WHERE id = ?';

                callback && connection.query(q, newsId, function (err) {
                    connection.release();
                    callback(err ? {err: err} : null); //call callback, pass error Object if error has occurred or null, if no error
                });
            });
        }
    };
};