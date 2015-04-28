App.prototype.ripple = function(e) {
    e.preventDefault();
    var $div = $('<div>'),
        btnOffset = $(this).offset(),
        xPos = e.pageX - btnOffset.left,
        yPos = e.pageY - btnOffset.top;

    $div.addClass('ripple-effect');
    $div.css({
        height: $(this).height(),
        width: $(this).height(),
        top: yPos - ($div.height()/2),
        left: xPos - ($div.width()/2),
        background: $(this).data("ripple-color")
    }).appendTo($(this));

    window.setTimeout(function(){
        $div.remove();
    }, 2000);
};