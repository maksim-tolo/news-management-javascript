var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var port = process.env.PORT || 3000;
var database = require('./config/database');
var pool = mysql.createPool(database.url);
var mySQLService = require('./services/mySQLService')(pool);
var controller = require('./controllers/controller')(mySQLService);

//prepare table
pool.getConnection(function (err, connection) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    require('./config/createTable')(connection);
    require('./config/addSomeNewsToTable')(connection);
    connection.release();
});

app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/routes.js')(app, controller);

//404 error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error handler
app.use(function (err, req, res, next) {
    console.log(err);
    if (err.status == 404) {
        res.status(err.status).sendfile("./public/404.html");
    } else {
        res.status(err.status || 500).end();
    }
});

app.listen(port, function () {
    console.log("App listening on port " + port);
});
