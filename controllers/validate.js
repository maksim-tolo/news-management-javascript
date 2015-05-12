module.exports = function (data) { //validate function, takes 1 parameters ({required validation: data for validation} - type: Object) return whether the validation passed - type: Boolean
    var map = {
        "validLimitAndFrom": function () { //validate limit and from
            return this.from >= 0 && this.limit >= 0 ? true : false;
        },
        "validId": function () { //validate id
            return this.id > 0 ? true : false;
        },
        "validNewsData": function () { //validate news message data
            return Object.keys(this).length === 3 && this.title && this.title.length <= 30 && this.shortDescription && this.shortDescription.length <= 255 && this.body ? true : false;
        }
    };
    for (var i in data) {
        if(!map[i].call(data[i])) return false; //validating passed
    }
    return true; //validating failed
}