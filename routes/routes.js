module.exports = function(app, controller) {

    app.get('/', function (req, res) {
        res.sendfile('index.html');
    });

    app.get('/api/get', controller.get);

};