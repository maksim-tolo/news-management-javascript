App.prototype.httpService = {

    getNewsList: function (params, success, error) {
        $.ajax({
            url: '/api/news',
            method: 'GET',
            traditional: true,
            data: params,
            success: success,
            error: error
        });
    },

    getNewsById: function (id, success) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'GET',
            success: success,
            error: error
        });
    },

    changeNews: function (id, newData, success) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'POST',
            data: newData,
            success: success,
            error: error
        });
    },

    addNews: function (newData, success) {
        $.ajax({
            url: '/api/news',
            method: 'PUT',
            data: newData,
            success: success,
            error: error
        });
    },

    deleteNews: function (id, success) {
        $.ajax({
            url: '/api/news/' + id,
            method: 'DELETE',
            success: success,
            error: error
        });
    }

};