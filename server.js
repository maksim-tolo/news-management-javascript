var express = require('express');
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var port = process.env.PORT || 3000;
var database = require('./config/database');
var connection = mysql.createConnection(database.url);
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
    require('./config/createTable')(connection); //create table 'news' if not exist
    //require('./config/addSomeNewsToTable')(connection); //add some news to table 'news'
});

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var controller = require('./controllers/controller')(connection);
require('./routes/routes.js')(app, controller);

app.listen(port);
console.log("App listening on port " + port);

