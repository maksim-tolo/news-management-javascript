App.prototype.eventsListeners = function() {

    $('.langMenu').on('click', 'li', $.proxy(this.changeLang, this));

    $('body').on('click', '.ripple', this.ripple);

    $(window).on('hashchange', $.proxy(this.render, this));

    $('header').on('click', '.backButton', this.back);

    $('body').on('keyup', 'textarea', this.resize);

    $('body').on('click', '.submit', $.proxy(this.submitChanges, this));

};