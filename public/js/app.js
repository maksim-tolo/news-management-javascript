$(function() {

    new App().init();

});

function App() {
    this.templateCache = {};
    this.numberOfPages = 1;
    this.userLang = this.LANG.en;   //сделать отложенную загрузку
}

App.prototype.init = function() {
    this.defineLang();
    this.eventsListeners();
    this.render();
};

App.prototype.defineLang = function() {
    var lang = localStorage.getItem("userLang");
    this.userLang = this.LANG[lang] || this.LANG[navigator.language] || this.LANG.en;
};

App.prototype.changeLang = function(e) {
    var lang = $(e.target).data("lang");
    if(lang) {
        localStorage.setItem("userLang", lang);
        this.userLang = this.LANG[lang];
        this.updateUI();
    }
};

App.prototype.render = function() {
    var self = this;
    var url = window.location.hash;
    var temp = url.split('/');
    var map = {
        '': function() {
            self.listNewsState(1)
        },
        '#': function() {
            self.listNewsState(1)
        },
        '#page': function() {
            var pageNumber = +temp[1];
            if(pageNumber > 0 && (pageNumber <= self.numberOfPages || self.numberOfPages==1)) {
                self.listNewsState(pageNumber);
            }
            else {
                //renderErrorPage();
            }
        },
        '#news': function() {
            if(+temp[1]) {
                self.newsMessageState(+temp[1]);
            }
            else {
                //renderErrorPage();
            }
        },
        '#addNews': function() {
            self.addNewsState()
        },
        '#editNews': function() {
            if(+temp[1]) {
                self.editNewsState(+temp[1]);
            }
            else {
                //renderErrorPage();
            }
        }
    };
    if(map[temp[0]]){
        map[temp[0]]();
    }
    else {
        //renderErrorPage();
    }
};

App.prototype.back = function() {
    window.history.back();
};

App.prototype.resize = function() {
    $(this).height(0);
    $(this).height(this.scrollHeight);
};

App.prototype.submitChanges = function(e) {

    var title = $('.title textarea').val().trim(),
        shortDescription = $('.shortDescription textarea').val().trim(),
        fullDescription = $('.fullDescription textarea').val().trim();

    if(title && shortDescription && fullDescription) {
        e.preventDefault();
        var url = window.location.hash;
        var temp = url.split('/');
        var data = {
            title: title,
            shortDescription: shortDescription,
            body: fullDescription
        };
        if (temp[0]=="#addNews") {
            this.httpService.addNews(data, function(data) {
                window.location.hash = "#news/" + data.newsId;
            })
        } else {
            this.httpService.changeNews(temp[1], data, function() {
                window.location.hash = "#news/" + temp[1];
            })
        }
    }
    else {
        $('.title textarea').val(title);
        $('.shortDescription textarea').val(shortDescription);
        $('.fullDescription textarea').val(fullDescription);
    }

};

App.prototype.updateUI = function() {
    var self = this;
    $('[data-translation]').each(function(index, val) {
        $(val).text(self.userLang[$(val).data("translation")]);
    });
};

App.prototype.drawPagination = function(curPage) {
    var temp = Math.ceil(curPage / 5);
    $("main").append(this.templateParser("pagination", {
        curPage: curPage,
        startPage: (temp - 1) * 5 + 1,
        numberOfPages: this.numberOfPages,
        lastPage: temp * 5
    }));
};