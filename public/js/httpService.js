App.prototype.httpService = {

    getNumberOfPages: function (callback) {
        $.ajax({
            url: '/api/numberOfPages',
            method: 'GET'
        }).done(function (data) {
            callback(data.numberOfPages);
        });
    },

    getNewsFromPage: function (pageNumber, callback) {
        $.ajax({
            url: '/api/news/page/' + pageNumber,
            method: 'GET'
        }).done(function (data) {
            callback(data);
        });
    },

    getNews: function (id, callback) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'GET'
        }).done(function (data) {
            callback(data);
        });
    },

    changeNews: function (id, newData, callback) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'POST',
            data: newData
        }).done(function (data) {
            callback(data);
        });
    },

    addNews: function (newData, callback) {
        $.ajax({
            url: '/api/news',
            method: 'PUT',
            data: newData
        }).done(function (data) {
            callback(data);
        });
    },

    deleteNews: function (id, callback) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'DELETE'
        }).done(function (data) {
            callback(data);
        });
    }
};