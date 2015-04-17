var express = require('express');
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Sequelize = require('sequelize');
var mysql = require('mysql');
var port = process.env.PORT || 3000;
var database = require('./config/database');
var sequelize = new Sequelize(database.url);
var controller = require('./controllers/controller')(sequelize);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.sync().then(function() {
    require('./routes/routes.js')(app, controller);
    app.listen(port);
    console.log("App listening on port " + port);
}).catch(function(error) {
    console.log(error);
});

