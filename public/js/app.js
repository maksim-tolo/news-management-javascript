$(function() {

    new App().init();

});

function App() {
    this.numberOfPages = 1;
    this.userLang = this.LANG.en;   //сделать отложенную загрузку
}

App.prototype.init = function() {
    this.defineLang();
    this.onChangeLang();
    this.onRipple();
    this.onHashChange();
    this.onBack();
    this.onFloating();
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
    }
    this.render();
};

App.prototype.drawPagination = function(curPage) {
    var temp = Math.ceil(curPage / 5);
    var $ul = $('<ul>');
    $ul.addClass('pagination');
    $("main").append($ul);
    if (curPage == 1) {
        $ul.append('<li><a href="#page/' + curPage + '" class="prev disabled">&laquo</a></li>');
    }
    else {
        $ul.append('<li><a href="#page/' + (curPage - 1) + '" class="prev">&laquo</a></li>');
    }

    for (var i = (temp - 1) * 5 + 1; i <= this.numberOfPages && i <= temp * 5; i++) {
        if (i == curPage) {
            $ul.append('<li> <a class="active" href="#page/' + i + '">' + i + '</a></li>');
        }
        else {
            $ul.append('<li> <a href="#page/' + i + '">' + i + '</a></li>');
        }
    }

    if (curPage == this.numberOfPages) {
        $ul.append('<li><a href="#page/' + curPage + '" class="next disabled">&raquo</a></li>');
    }
    else {
        $ul.append('<li><a href="#page/' + (+curPage + 1) + '" class="next">&raquo</a></li>');
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
            self.listNewsState(temp[1])
        },
        '#news': function() {
            self.newsMessageState(temp[1])
        },
        '#addNews': function() {
            self.addNewsState()
        },
        '#editNews': function() {
            self.editNewsState(temp[1])
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

App.prototype.floatingFunctions = function(e) {

}