App.prototype.onChangeLang = function() {
    $('.langMenu').on('click', 'li', $.proxy(this.changeLang, this));
};
App.prototype.onRipple = function() {
    $('body').on('click', '.ripple', this.ripple);
};
App.prototype.onHashChange = function() {
    $(window).on('hashchange', $.proxy(this.render, this));
};
App.prototype.onBack = function() {
    $('header').on('click', '.backButton', this.back);
};
App.prototype.onFloating = function() {
    $('aside').on('click', '.floating', this.floatingFunctions);
};