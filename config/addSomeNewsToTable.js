module.exports = function(connection) {

    function Data(title, shortDescription, body) {
        this.title = title || "newsTitle";
        this.shortDescription = shortDescription || "newsShortDescription";
        this.body = body || "newsBody";
        this.creationDate = this.modificationDate = new Date();
    };

    connection.query('INSERT INTO news set ?', new Data(), function(err) {
        if(err) {
            console.log(err);
        }
    });
    connection.query('INSERT INTO news set ?', new Data(), function(err) {
        if(err) {
            console.log(err);
        }
    });
    connection.query('INSERT INTO news set ?', new Data(), function(err) {
        if(err) {
            console.log(err);
        }
    });
};