$(function () {

    new App().init();

});

function App() { //app constructor
    this.templateCache = {};
    this.numberOfPages = 1;
    this.userLang = this.LANG.en;
    this.ignoreNextEvent = false;
}

App.prototype.init = function () { //init app
    this.defineLang();
    this.eventsListeners();
    this.render();
};

App.prototype.defineLang = function () { //define language by local storage value or browser language
    var lang = localStorage.getItem("userLang");
    this.userLang = this.LANG[lang] || this.LANG[navigator.language] || this.LANG.en;
};

App.prototype.changeLang = function (e) { //change current language
    var lang = $(e.target).data("lang");
    if (lang) {
        localStorage.setItem("userLang", lang);
        this.userLang = this.LANG[lang];
        this.updateUI(); //update language of interface
    }
};

App.prototype.render = function () { //render templates according to hash
    
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

    $('#deleteNewsModal').prop('checked', false); //hide "deleteNewsModal"
    exitWithoutSavingModal.prop('checked', false);  //hide "exitWithoutSavingModal"

    if (this.curState == '#addNews' && $('.title textarea').val() && ($('.title textarea').val().trim() || $('.shortDescription textarea').val().trim() || $('.fullDescription textarea').val().trim())) { //show warning if adding news form is not blank and not saved
        return showWarning(); //show warning modal
    } else if (this.curState && this.curState.split('/')[0] == '#editNews' && this.currentChangingNews && $('.title textarea').val() && ($('.title textarea').val().trim() != this.currentChangingNews.title || $('.shortDescription textarea').val().trim() != this.currentChangingNews.shortDescription || $('.fullDescription textarea').val().trim() != this.currentChangingNews.body)) { //show warning if editing news form is changed and not saved
        return showWarning(); //show warning modal
    }

    if (map[temp[0]]) { //change state
        this.curState = url;
        map[temp[0]]();
    } else {
        this.curState = url;
        this.errorState(404);
    }

    function showWarning() { //show warning modal
        self.lastState = url;
        self.ignoreNextEvent = self;
        exitWithoutSavingModal.prop('checked', true);
        window.location.hash = self.curState;
    }

};

App.prototype.back = function () {
    window.history.back();
};

App.prototype.resize = function () { //resize textarea according to text height
    $(this).height(0);
    $(this).height(this.scrollHeight);
};

App.prototype.submitChanges = function (e) { //save or update news message

    var title = $('.title textarea'),
        shortDescription = $('.shortDescription textarea'),
        fullDescription = $('.fullDescription textarea'),
        titleTrimmed = title.val().trim(),
        shortDescriptionTrimmed = shortDescription.val().trim(),
        fullDescriptionTrimmed = fullDescription.val().trim();

    if (titleTrimmed && shortDescriptionTrimmed && fullDescriptionTrimmed) { //if all fields not empty
        e.preventDefault(); //don't refresh the page
        var url = window.location.hash,
            self = this,
            temp = url.split('/'),
            data = {
                title: titleTrimmed,
                shortDescription: shortDescriptionTrimmed,
                body: fullDescriptionTrimmed
            };
        if (temp[0] === "#addNews") { //if add news message
            this.httpService.addNews(data, function (data) {
                self.curState = window.location.hash = "#news/" + data.newsId; //go to news message state
            }, function (jqXHR) {
                self.errorState(jqXHR.status); //if error go to error state
            });
        } else { //if edit news message
            this.httpService.changeNews(temp[1], data, function () {
                self.curState = window.location.hash = "#news/" + temp[1]; //go to news message state
            }, function (jqXHR) {
                self.errorState(jqXHR.status); //if error go to error state
            });
        }
    } else { //will showed build-in warning if one of fields is empty
        title.val(titleTrimmed);
        shortDescription.val(shortDescriptionTrimmed);
        fullDescription.val(fullDescriptionTrimmed);
    }

};

App.prototype.updateUI = function () { //update language of interface
    var self = this;
    $('[data-translation]').each(function (index, val) {
        $(val).text(self.userLang[$(val).data("translation")]);
    });
};

App.prototype.drawPagination = function (curPage) { //draw pagination on newsList state
    var temp = Math.ceil(curPage / 5);
    $("main").append(this.templateParser("pagination", { //parse pagination template
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

App.prototype.deleteNews = function () { //delete news message
    var self = this,
        id = $('[data-news-id]')[0].dataset.newsId;
    this.httpService.deleteNews(id, function () { //go to newsList state
        if (window.location.hash.split('/')[0] === "#page") {
            self.render();
        } else {
            window.location.hash = "#page/1";
        }
    }, function (jqXHR) {
        self.errorState(jqXHR.status); //if error go to error state
    });
};

App.prototype.addDataAttr = function (e) {
    $('.confirmDeletingNews')[0].dataset.newsId = $(e.target).data('id'); //add deleting news id to "confirm deleting news" button
};

App.prototype.newsDateFormatting = function () { //formatting news date

    function dateFormatting(str) {
        var curDate = new Date(str),
            date = curDate.getDate(),
            month = curDate.getMonth() + 1,
            year = curDate.getFullYear(),
            hours = curDate.getHours(),
            minutes = curDate.getMinutes();
        return addZero(date) + '-' + addZero(month) + '-' + year + ' ' + addZero(hours) + ':' + addZero(minutes);
    }

    function addZero(data) { //add '0' before number if it less then 10
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

App.prototype.exitWithoutSaving = function () { //confirm exit without saving
    this.curState = this.lastState;
    window.location.hash = this.lastState;
};