var httpService = {};

httpService.getNumberOfPages = function(callback) {
     $.ajax({
        url: '/api/numberOfPages',
        method: 'GET'
    }).done(function(data) {
         callback(data.numberOfPages);
    });
};

httpService.getNewsFromPage = function(pageNumber, callback) {
    $.ajax({
        url: '/api/news/page/'+pageNumber,
        method: 'GET'
    }).done(function(data) {
        callback(data);
    });
};

httpService.getNews = function(id, callback) {
    $.ajax({
        url: '/api/news/'+id,
        method: 'GET'
    }).done(function(data) {
        callback(data);
    });
};

httpService.changeNews = function(id, newData, callback) {
    $.ajax({
        url: '/api/news/'+id,
        method: 'POST',
        data: newData
    }).done(function(data) {
        callback(data);
    });
};

httpService.addNews = function(newData, callback) {
    $.ajax({
        url: '/api/news',
        method: 'PUT',
        data: newData
    }).done(function(data) {
        callback(data);
    });
};

httpService.deleteNews = function(id, callback) {
    $.ajax({
        url: '/api/news/'+id,
        method: 'DELETE'
    }).done(function(data) {
        callback(data);
    });
};