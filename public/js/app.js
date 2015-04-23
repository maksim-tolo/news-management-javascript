$(function() {

    new App().init();

});

function App() {
    this.numberOfPages = 1;
    this.userLang = this.LANG.en;
}

App.prototype.init = function() {
    this.defineLang();
    this.dropDownLangMenu();
    this.chooseLang();
};

App.prototype.defineLang = function() {
    var lang = localStorage.getItem("userLang");
    if(lang) this.userLang = this.LANG[lang];
};

App.prototype.changeLang = function(lang) {
    localStorage.setItem("userLang", lang);
    this.userLang = this.LANG[lang];
    this.newsMessageState(12);
};

App.prototype.dropDownLangMenu = function() {
    $('.icon-language').on('click', function() {
        if($('.langMenu').css("display") == "block") $('.langMenu').css("display", "none");
        else $('.langMenu').css("display", "block");
    });
};

App.prototype.chooseLang = function() {
    var self = this;
    $('.langMenu li').on('click', function(e) {
        $('.langMenu').css("display", "none");
        if(e.target.dataset.lang) self.changeLang(e.target.dataset.lang);
    })
};