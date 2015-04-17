module.exports = function(connection) {
    connection.query('CREATE TABLE IF NOT EXISTS news (id INTEGER AUTO_INCREMENT, title VARCHAR(255) NOT NULL, shortDescription VARCHAR(1000) NOT NULL, body TEXT NOT NULL, creationDate DATETIME NOT NULL, modificationDate DATETIME NOT NULL, PRIMARY KEY (id))', function(err) {
        if(err) {
            console.log(err);
        }
        else{
            console.log("Table 'news' Created");
        }
    });
};