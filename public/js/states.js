App.prototype.listNewsState = function(pageNumber) {     //html в отдельные файлы
    var self = this;
    this.httpService.getNewsList({from: (pageNumber-1)*10, limit: 10}, function(data) {
        $(".backButton").remove();
        $("main").empty().scrollTop(0);
        for (var i = 0; i < data.newsList.length; i++) {
            $("main").append('<div><h1>'+data.newsList[i].title+'</h1><p>'+data.newsList[i].shortDescription+'</p></div>');
        }
        $("aside").html('<div class="floating icon-add ripple"><p>'+self.userLang.addNews+'</p></div>');
        self.numberOfPages = Math.ceil(data.numberOfNews/10);
        self.drawPagination(pageNumber);
    });
};

App.prototype.newsMessageState = function(id) {
    var self = this;
    this.httpService.getNewsById(id, function(data) {
        $("main").empty();
        $("main").append('<div><h1>'+data[0].title+'</h1><p>'+data[0].shortDescription+'</p><p>'+data[0].body+'</p></div>');
        $("aside").html('<div class="floating icon-add ripple"><p>'+self.userLang.addNews+'</p></div><div class="floating icon-delete ripple"><p>'+self.userLang.deleteNews+'</p></div><div class="floating icon-edit ripple"><p>'+self.userLang.editNews+'</p></div>');
        if (!$(".backButton").length) {
            $("header").append('<div class="floating icon-arrow-back ripple backButton"><p>'+self.userLang.back+'</p></div>');
        }
    });
};

App.prototype.addNewsState = function() {
    $("main").empty();
    $("aside").html('<div class="floating icon-list ripple"><p>'+this.userLang.listNews+'</p></div>');
    if (!$(".backButton")) {
        $("header").append('<div class="floating icon-arrow-back ripple backButton"><p>'+self.userLang.back+'</p></div>');
    }
};

App.prototype.editNewsState = function(id) {
    var self = this;
    this.httpService.getNewsById(id, function(data) {
        $("main").html('<div><h1>'+data[0].title+'</h1><p>'+data[0].shortDescription+'</p><p>'+data[0].body+'</p></div>');
        $("aside").html('<div class="floating icon-list ripple"><p>'+self.userLang.listNews+'</p></div><div class="floating icon-delete ripple"><p>'+self.userLang.deleteNews+'</p></div>');
        if (!$(".backButton")) {
            $("header").append('<div class="floating icon-arrow-back ripple backButton"><p>'+self.userLang.back+'</p></div>');
        }
    });
};