App.prototype.httpService = {

    getNewsList: function (params, callback) {
        $.ajax({
            url: '/api/news',
            method: 'GET',
            traditional: true,
            data: params,
            success: callback
        });
    },

    getNewsById: function (id, callback) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'GET',
            success: callback
        });
    },

    changeNews: function (id, newData, callback) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'POST',
            data: newData,
            success: callback
        });
    },

    addNews: function (newData, callback) {
        $.ajax({
            url: '/api/news',
            method: 'PUT',
            data: newData,
            success: callback
        });
    },

    deleteNews: function (id, callback) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'DELETE',
            success: callback
        });
    }

};