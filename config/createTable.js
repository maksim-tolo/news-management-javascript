//create table 'news' if not exist
module.exports = function (connection) {
    var q = 'CREATE TABLE IF NOT EXISTS news (id INTEGER AUTO_INCREMENT, title VARCHAR(30) NOT NULL, shortDescription VARCHAR(255) NOT NULL, body TEXT NOT NULL, creationDate DATETIME NOT NULL, modificationDate DATETIME NOT NULL, PRIMARY KEY (id))';

    connection.query(q, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Table 'news' Created");
        }
    });
};