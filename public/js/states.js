App.prototype.listNewsState = function (pageNumber) {
    var self = this;
    this.httpService.getNewsList({from: (pageNumber - 1) * 10, limit: 10}, function (data) {

        if (!data.newsList.length) {
            if (+pageNumber === 1) {
                return self.errorState(418);
            } else {
                return self.errorState(404);
            }
        }

        self.newsDateFormatting.call(data.newsList);

        $(".backButton").remove(); //remove back button

        $("main").scrollTop(0)
                 .html(self.templateParser("listNewsTemplate", data));

        $("aside").html(self.templateParser("asideButtonsTemplate", {floating: [
            {
                href: "#addNews",
                class: "icon-add",
                dataAttr: "addNews"
            }
        ]}));

        self.updateUI();

        self.numberOfPages = Math.ceil(data.numberOfNews / 10);
        self.drawPagination(pageNumber);
    }, function (jqXHR) {
        self.errorState(jqXHR.status);
    });
};

App.prototype.newsMessageState = function (id) {
    var self = this;
    this.httpService.getNewsById(id, function (data) {

        if (!data.length) {
            return self.errorState(404);
        }

        self.newsDateFormatting.call(data);

        $("main").scrollTop(0)
                 .html(self.templateParser("newsMessageTemplate", data[0]));

        $("aside").html(self.templateParser("asideButtonsTemplate", {floating: [
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

        if (!$(".backButton").length) {
            $("header").append(self.templateParser("asideButtonsTemplate", {floating: [
                {
                    href: "",
                    class: "icon-arrow-back backButton",
                    dataAttr: "back"
                }
            ]}));
        }

        self.updateUI();

    }, function (jqXHR) {
        self.errorState(jqXHR.status);
    });
};

App.prototype.addNewsState = function () {

    $("main").scrollTop(0)
             .html(this.templateParser("addOrChangeNewsTemplate", {
            title: "",
            shortDescription: "",
            body: ""
        }));

    $("aside").html(this.templateParser("asideButtonsTemplate", {floating: [
        {
            href: "#page/1",
            class: "icon-list",
            dataAttr: "listNews"
        }
    ]}));

    if (!$(".backButton").length) {
        $("header").append(this.templateParser("asideButtonsTemplate", {floating: [
            {
                href: "",
                class: "icon-arrow-back backButton",
                dataAttr: "back"
            }
        ]}));
    }

    this.updateUI();

};

App.prototype.editNewsState = function (id) {
    var self = this;
    this.httpService.getNewsById(id, function (data) {

        if (!data.length) {
            return self.errorState(404);
        }

        self.currentChangingNews = data[0]; //save not changed news in order to verify changing news on exit "edit news" state

        $("main").scrollTop(0)
            .html(self.templateParser("addOrChangeNewsTemplate", data[0]));

        $("aside").html(self.templateParser("asideButtonsTemplate", {floating: [
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

        if (!$(".backButton").length) {
            $("header").append(self.templateParser("asideButtonsTemplate", {floating: [
                {
                    href: "",
                    class: "icon-arrow-back backButton",
                    dataAttr: "back"
                }
            ]}));
        }

        self.updateUI();

        $('textarea').each(function (index, val) {
            self.resize.call(val);
        });

    }, function (jqXHR) {
        self.errorState(jqXHR.status);
    });
};

App.prototype.errorState = function (err) {

    var data = {},
        map = {
            "400": 'badRequest',
            "404": 'notFound',
            "418": 'emptyNewsList',
            "500": 'internalError'
        };

    if (map[err]) {
        data.status = err;
        data.description = map[err];
    } else {
        data.status = err;
        data.description = "";
    }


    $("main").scrollTop(0)
             .html(this.templateParser("errorTemplate", data));

    if (err == 418) {
        $("aside").html(this.templateParser("asideButtonsTemplate", {floating: [
            {
                href: "#addNews",
                class: "icon-add",
                dataAttr: "addNews"
            }
        ]}));

        $(".backButton").remove();
    } else {
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

    this.updateUI();

};