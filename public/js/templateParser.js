//parsing templates
App.prototype.templateParser = function (str, data) {
    
    var fn = !/\W/.test(str) ?
        this.templateCache[str] = this.templateCache[str] ||
            this.templateParser($("#" + str).html()) :

        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            "with(obj){p.push('" +

            str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'")
            + "');}return p.join('');");

    return data ? fn(data) : fn;
};