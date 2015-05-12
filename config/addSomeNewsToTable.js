module.exports = function (connection) {

    function Data(title, shortDescription, body) {
        this.title = title || "newsTitle";
        this.shortDescription = shortDescription || "newsShortDescription";
        this.body = body || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam animi asperiores beatae commodi consequatur consequuntur cumque ea ex expedita, illo illum obcaecati quidem sed sit tempore temporibus. Accusantium, beatae.";
        this.creationDate = this.modificationDate = new Date();
    }

    connection.query('INSERT INTO news set ' + connection.escape(new Data()), function (err) {
        if (err) {
            console.log(err);
        }
    });
    connection.query('INSERT INTO news set ' + connection.escape(new Data()), function (err) {
        if (err) {
            console.log(err);
        }
    });
    connection.query('INSERT INTO news set ' + connection.escape(new Data()), function (err) {
        if (err) {
            console.log(err);
        }
    });
};