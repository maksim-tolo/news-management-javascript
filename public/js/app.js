$(function() {
   // httpService.getNews(12, function(data) {
      //  console.log(data);
   // });
    $('.icon-language').on('click', function() {
        if($('.langMenu').css("display") == "block") $('.langMenu').css("display", "none");
        else $('.langMenu').css("display", "block");
    });

    changeLang("RU");
    console.log(defineLang());
});

function defineLang() {
    var userLang = localStorage.getItem("userLang");
    var curLang;
    if(userLang) {
        if(userLang == "RU") curLang = LANG.ru;
        if(userLang == "EN") curLang = LANG.en;
    }
    else curLang = LANG.en;
    return curLang;
}

function changeLang(lang) {
    localStorage.setItem("userLang", lang);
}