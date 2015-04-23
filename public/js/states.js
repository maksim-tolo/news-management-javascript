App.prototype.listNewsState = function(pageNumber) {
    var self = this;
    this.httpService.getNewsFromPage(pageNumber, function(data) {
        $("main").html('');
        for (var i = 0; i < data.length; i++) {
            $("main").append('<div><h1>'+data[i].title+'</h1><p>'+data[i].shortDescription+'</p></div>');
        }
        $("aside").html('<div class="floating icon-add ripple"><p>'+self.userLang.addNews+'</p></div>');
    });
}

App.prototype.newsMessageState = function(id) {
    var self = this;
    this.httpService.getNews(id, function(data) {
        $("main").html('');
        $("main").append('<div><h1>'+data[0].title+'</h1><p>'+data[0].shortDescription+'</p><p>'+data[0].body+'</p></div>');
        $("aside").html('<div class="floating icon-add ripple"><p>'+self.userLang.addNews+'</p></div><div class="floating icon-edit ripple"><p>'+self.userLang.editNews+'</p></div><div class="floating icon-delete ripple"><p>'+self.userLang.deleteNews+'</p></div>');
    });
}