App.prototype.listNewsState = function(pageNumber) {     //html в отдельные файлы
    var self = this;
    this.httpService.getNewsList({from: (pageNumber-1)*10, limit: 10}, function(data) {

        $(".backButton").remove();

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

        self.numberOfPages = Math.ceil(data.numberOfNews/10);
        self.drawPagination(pageNumber);
    });
};

App.prototype.newsMessageState = function(id) {
    var self = this;
    this.httpService.getNewsById(id, function(data) {

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

    });
};

App.prototype.addNewsState = function() {

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

App.prototype.editNewsState = function(id) {
    var self = this;
    this.httpService.getNewsById(id, function(data) {

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

    });
};