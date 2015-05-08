module.exports = function(app, controller) {

    app.get('/api/news', controller.getNewsList);

    app.get('/api/news/:id', controller.getNewsById);

    app.post('/api/news/:id', controller.changeNews);

    app.put('/api/news', controller.addNews);

    app.delete('/api/news/:id', controller.deleteNews);

};