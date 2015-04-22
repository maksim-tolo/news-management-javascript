module.exports = function (connection) {
    return {
        getNumberOfPages: function (req, res) {
            connection.query('SELECT COUNT(*) FROM news', function(err, result) {
                if(err) {
                    console.log(err);
                    return;
                }
                for (var i in result[0]) {
                    res.send({numberOfPages: Math.ceil(result[0][i]/10)});
                    return;
                }
            });
        },
        getNewsFromPage: function (req, res) {
            connection.query('SELECT id, title, shortDescription, creationDate, modificationDate FROM news', function(err, result) {
                if(err) {
                    console.log(err);
                    return;
                }
                res.send(result.splice((req.params.pageNumber-1)*10, 10).reverse());
            });
        },
        getNews: function (req, res) {
            connection.query('SELECT * FROM news where id = ?', req.params.id, function(err, result) {
                if(err) {
                    console.log(err);
                    return;
                }
                res.send(result);
            });
        },
        changeNews: function (req, res) {
            req.body.modificationDate = new Date();
            connection.query('UPDATE news SET ? WHERE id = ?', [req.body, req.params.id], function(err) {
                if(err) {
                    console.log(err);
                    return;
                }
                res.end();
            });
        },
        addNews: function (req, res) {
            req.body.creationDate = req.body.modificationDate = new Date();
            connection.query('INSERT INTO news set ?', req.body, function(err) {
                if(err) {
                    console.log(err);
                    return;
                }
                res.end();
            });
        },
        deleteNews: function (req, res) {
            connection.query('DELETE FROM news WHERE id = ?', req.params.id, function(err) {
                if(err) {
                    console.log(err);
                    return;
                }
                res.end();
            });
        }
    };
};