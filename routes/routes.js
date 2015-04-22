module.exports = function(app, controller) {

    app.get('/', function (req, res) {
        res.sendfile('../public/index.html');
    });

    app.get('/api/numberOfPages', controller.getNumberOfPages);

    app.get('/api/news/page/:pageNumber', controller.getNewsFromPage);

    app.get('/api/news/:id', controller.getNews);

    app.post('/api/news/:id', controller.changeNews);

    app.put('/api/news', controller.addNews);

    app.delete('/api/news/:id', controller.deleteNews);

};