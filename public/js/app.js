$(function () {

    new App().init();

});

function App() {
    this.templateCache = {};
    this.numberOfPages = 1;
    this.userLang = this.LANG.en;
    this.ignoreNextEvent = false;
}

App.prototype.init = function () {
    this.defineLang();
    this.eventsListeners();
    this.render();
};

//define language by local storage value or browser language
App.prototype.defineLang = function () {
    var lang = localStorage.getItem("userLang");
    this.userLang = this.LANG[lang] || this.LANG[navigator.language] || this.LANG.en;
};

//change current language
App.prototype.changeLang = function (e) {
    var lang = $(e.target).data("lang");
    if (lang) {
        localStorage.setItem("userLang", lang);
        this.userLang = this.LANG[lang];
        this.updateUI();
    }
};

//render templates according to hash
App.prototype.render = function () {
    
    var self = this,
        url = window.location.hash,
        temp = url.split('/'),
        exitWithoutSavingModal = $('#exitWithoutSavingModal'),
        map = {
            '': function () {
                self.listNewsState(1);
            },
            '#': function () {
                self.listNewsState(1);
            },
            '#page': function () {
                var pageNumber = +temp[1];
                if (pageNumber > 0 && (pageNumber <= self.numberOfPages || +self.numberOfPages === 1)) {
                    self.listNewsState(pageNumber);
                } else {
                    self.errorState(404);
                }
            },
            '#news': function () {
                if (+temp[1]) {
                    self.newsMessageState(+temp[1]);
                } else {
                    self.errorState(404);
                }
            },
            '#addNews': function () {
                self.addNewsState();
            },
            '#editNews': function () {
                if (+temp[1]) {
                    self.editNewsState(+temp[1]);
                } else {
                    self.errorState(404);
                }
            }
        };

    if (this.ignoreNextEvent) { //don't change the state
        this.ignoreNextEvent = false;
        return;
    }

    $('#deleteNewsModal').prop('checked', false);
    exitWithoutSavingModal.prop('checked', false);

    //show warning if adding news form is not blank and not saved
    if (this.curState == '#addNews' && $('.title textarea').val() && ($('.title textarea').val().trim() || $('.shortDescription textarea').val().trim() || $('.fullDescription textarea').val().trim())) {
        return showWarning();
    } else if (this.curState && this.curState.split('/')[0] == '#editNews' && this.currentChangingNews && $('.title textarea').val() && ($('.title textarea').val().trim() != this.currentChangingNews.title || $('.shortDescription textarea').val().trim() != this.currentChangingNews.shortDescription || $('.fullDescription textarea').val().trim() != this.currentChangingNews.body)) {
        return showWarning();
    }

    if (map[temp[0]]) {
        this.curState = url;
        map[temp[0]]();
    } else {
        this.curState = url;
        this.errorState(404);
    }

    function showWarning() {
        self.lastState = url;
        self.ignoreNextEvent = self;
        exitWithoutSavingModal.prop('checked', true);
        window.location.hash = self.curState;
    }

};

App.prototype.back = function () {
    window.history.back();
};

//resize textarea according to text height
App.prototype.resize = function () {
    $(this).height(0);
    $(this).height(this.scrollHeight);
};

//save or update news message
App.prototype.submitChanges = function (e) {

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    var title = $('.title textarea'),
        shortDescription = $('.shortDescription textarea'),
        fullDescription = $('.fullDescription textarea'),
        titleTrimmed = escapeHtml(title.val().trim()),
        shortDescriptionTrimmed = escapeHtml(shortDescription.val().trim()),
        fullDescriptionTrimmed = escapeHtml(fullDescription.val().trim());

    if (titleTrimmed && shortDescriptionTrimmed && fullDescriptionTrimmed) {
        e.preventDefault();
        var url = window.location.hash,
            self = this,
            temp = url.split('/'),
            data = {
                title: titleTrimmed,
                shortDescription: shortDescriptionTrimmed,
                body: fullDescriptionTrimmed
            };
        if (temp[0] === "#addNews") {
            this.httpService.addNews(data, function (data) {
                self.curState = window.location.hash = "#news/" + data.newsId;
            }, function (jqXHR) {
                self.errorState(jqXHR.status);
            });
        } else { //if edit news message
            this.httpService.changeNews(temp[1], data, function () {
                self.curState = window.location.hash = "#news/" + temp[1];
            }, function (jqXHR) {
                self.errorState(jqXHR.status);
            });
        }
    } else {
        title.val(titleTrimmed);
        shortDescription.val(shortDescriptionTrimmed);
        fullDescription.val(fullDescriptionTrimmed);
    }

};

//update language of interface
App.prototype.updateUI = function () {
    var self = this;
    $('[data-translation]').each(function (index, val) {
        $(val).text(self.userLang[$(val).data("translation")]);
    });
};

//draw pagination on newsList state
App.prototype.drawPagination = function (curPage) {
    var temp = Math.ceil(curPage / 5);
    $("main").append(this.templateParser("pagination", {
        curPage: curPage,
        startPage: (temp - 1) * 5 + 1,
        numberOfPages: this.numberOfPages,
        lastPage: temp * 5
    }));
};

App.prototype.eventsListeners = function () {

    $('.langMenu').on('click', 'li', $.proxy(this.changeLang, this));

    $('body').on('click', '.ripple', this.ripple)
             .on('keyup', 'textarea', this.resize)
             .on('click', '.submit', $.proxy(this.submitChanges, this))
             .on('click', '.icon-delete, .delete', $.proxy(this.addDataAttr, this));

    $(window).on('hashchange', $.proxy(this.render, this));

    $('.confirmDeletingNews').on('click', $.proxy(this.deleteNews, this));

    $('header').on('click', '.backButton', this.back);

    $('.modal').on('click', '.leave', $.proxy(this.exitWithoutSaving, this));

};

//delete news message
App.prototype.deleteNews = function () {
    var self = this,
        id = $('[data-news-id]')[0].dataset.newsId;
    this.httpService.deleteNews(id, function () {
        if (window.location.hash.split('/')[0] === "#page") {
            self.render();
        } else {
            window.location.hash = "#page/1";
        }
    }, function (jqXHR) {
        self.errorState(jqXHR.status);
    });
};

//add deleting news id to "confirm deleting news" button
App.prototype.addDataAttr = function (e) {
    $('.confirmDeletingNews')[0].dataset.newsId = $(e.target).data('id');
};

//formatting news date
App.prototype.newsDateFormatting = function () {

    function dateFormatting(str) {
        var curDate = new Date(str),
            date = curDate.getDate(),
            month = curDate.getMonth() + 1,
            year = curDate.getFullYear(),
            hours = curDate.getHours(),
            minutes = curDate.getMinutes();
        return addZero(date) + '-' + addZero(month) + '-' + year + ' ' + addZero(hours) + ':' + addZero(minutes);
    }

    function addZero(data) {
        if (data < 10) {
            data = '0' + data;
        }
        return data;
    }

    this.forEach(function (cur) {
        cur.modificationDate = dateFormatting(cur.modificationDate);
        cur.creationDate = dateFormatting(cur.creationDate);
    });

};

//confirm exit without saving
App.prototype.exitWithoutSaving = function () {
    this.curState = this.lastState;
    window.location.hash = this.lastState;
};