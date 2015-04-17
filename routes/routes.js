module.exports = function(app, controller) {

    app.get('/', function (req, res) {
        res.sendfile('../public/index.html');
    });

    app.get('/api/news', controller.getAllNews);

    app.get('/api/news/:id', controller.getNews);

    app.post('/api/news/:id', controller.changeNews);

    app.put('/api/news', controller.addNews);

    app.delete('/api/news/:id', controller.deleteNews);

};