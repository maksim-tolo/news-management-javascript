App.prototype.listNewsState = function (pageNumber) { //list news state
    var self = this;
    this.httpService.getNewsList({from: (pageNumber - 1) * 10, limit: 10}, function (data) { //get news list

        if (!data.newsList.length) { //go to error state if response doesn't contain news
            if (+pageNumber === 1) {
                return self.errorState(418);
            } else {
                return self.errorState(404);
            }
        }

        self.newsDateFormatting.call(data.newsList); //formatting news date

        $(".backButton").remove(); //remove back button

        $("main").scrollTop(0)
                 .html(self.templateParser("listNewsTemplate", data)); //parse list news template

        $("aside").html(self.templateParser("asideButtonsTemplate", {floating: [ //parse aside buttons template
            {
                href: "#addNews",
                class: "icon-add",
                dataAttr: "addNews"
            }
        ]}));

        self.updateUI(); //update language of interface

        self.numberOfPages = Math.ceil(data.numberOfNews / 10);
        self.drawPagination(pageNumber); //draw pagination
    }, function (jqXHR) {
        self.errorState(jqXHR.status); //if error go to error state
    });
};

App.prototype.newsMessageState = function (id) { //news message state
    var self = this;
    this.httpService.getNewsById(id, function (data) { //get news by id

        if (!data.length) {
            return self.errorState(404); //go to error state if response doesn't contain news
        }

        self.newsDateFormatting.call(data); //formatting news date

        $("main").scrollTop(0)
                 .html(self.templateParser("newsMessageTemplate", data[0])); //parse news message template

        $("aside").html(self.templateParser("asideButtonsTemplate", {floating: [ //parse aside buttons template
            {
                href: "#addNews",
                class: "icon-add",
                dataAttr: "addNews"
            },
            {
                href: "",
                class: "icon-delete",
                dataAttr: "deleteNews",
                id: id
            },
            {
                href: "#editNews/" + id,
                class: "icon-edit",
                dataAttr: "editNews"
            }
        ]}));

        if (!$(".backButton").length) { //add back button if it doesn't exist
            $("header").append(self.templateParser("asideButtonsTemplate", {floating: [
                {
                    href: "",
                    class: "icon-arrow-back backButton",
                    dataAttr: "back"
                }
            ]}));
        }

        self.updateUI(); //update language of interface

    }, function (jqXHR) {
        self.errorState(jqXHR.status); //if error go to error state
    });
};

App.prototype.addNewsState = function () { //add news state

    $("main").scrollTop(0)
             .html(this.templateParser("addOrChangeNewsTemplate", { //parse "add or change" template
            title: "",
            shortDescription: "",
            body: ""
        }));

    $("aside").html(this.templateParser("asideButtonsTemplate", {floating: [ //parse aside buttons template
        {
            href: "#page/1",
            class: "icon-list",
            dataAttr: "listNews"
        }
    ]}));

    if (!$(".backButton").length) { //add back button if it doesn't exist
        $("header").append(this.templateParser("asideButtonsTemplate", {floating: [
            {
                href: "",
                class: "icon-arrow-back backButton",
                dataAttr: "back"
            }
        ]}));
    }

    this.updateUI(); //update language of interface

};

App.prototype.editNewsState = function (id) { //edit news state
    var self = this;
    this.httpService.getNewsById(id, function (data) { //get news by id

        if (!data.length) {
            return self.errorState(404); //go to error state if response doesn't contain news
        }

        self.currentChangingNews = data[0]; //save not changed news in order to verify changing news on exit "edit news" state

        $("main").scrollTop(0)
            .html(self.templateParser("addOrChangeNewsTemplate", data[0])); //parse "add or change" template

        $("aside").html(self.templateParser("asideButtonsTemplate", {floating: [ //parse aside buttons template
            {
                href: "#page/1",
                class: "icon-list",
                dataAttr: "listNews"
            },
            {
                href: "",
                class: "icon-delete",
                dataAttr: "deleteNews",
                id: id
            }
        ]}));

        if (!$(".backButton").length) { //add back button if it doesn't exist
            $("header").append(self.templateParser("asideButtonsTemplate", {floating: [
                {
                    href: "",
                    class: "icon-arrow-back backButton",
                    dataAttr: "back"
                }
            ]}));
        }

        self.updateUI(); //update language of interface

        $('textarea').each(function (index, val) { //resize textarea according to text height
            self.resize.call(val);
        });

    }, function (jqXHR) {
        self.errorState(jqXHR.status); //if error go to error state
    });
};

App.prototype.errorState = function (err) { //error state

    var data = {},
        map = {
            "400": 'badRequest',
            "404": 'notFound',
            "418": 'emptyNewsList',
            "500": 'internalError'
        };

    if (map[err]) { //if error is defined
        data.status = err;
        data.description = map[err];
    } else {
        data.status = err;
        data.description = "";
    }


    $("main").scrollTop(0)
             .html(this.templateParser("errorTemplate", data)); //parse error template

    if (err == 418) { //if error is "empty news list", remove back button and add button "add news"
        $("aside").html(this.templateParser("asideButtonsTemplate", {floating: [
            {
                href: "#addNews",
                class: "icon-add",
                dataAttr: "addNews"
            }
        ]}));

        $(".backButton").remove();
    } else { //remove aside buttons and add back button
        $("aside").empty();

        if (!$(".backButton").length) {
            $("header").append(this.templateParser("asideButtonsTemplate", {
                floating: [
                    {
                        href: "",
                        class: "icon-arrow-back backButton",
                        dataAttr: "back"
                    }
                ]
            }));
        }
    }

    this.updateUI(); //update language of interface

};