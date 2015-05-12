//validate function, takes 1 parameters ({required validation: data for validation} - type: Object) return whether the validation passed - type: Boolean
module.exports = function (data) {
    var map = {
        "validLimitAndFrom": function () {
            return this.from >= 0 && this.limit >= 0;
        },
        "validId": function () {
            return this.id > 0;
        },
        "validNewsData": function () {
            return Object.keys(this).length === 3 && this.title && this.title.length <= 30 && this.shortDescription && this.shortDescription.length <= 255 && this.body ? true : false;
        }
    };
    for (var i in data) {
        if(!map[i].call(data[i])) return false;
    }
    return true;
};
