/* bind(thisObj[, arg...]) */
if (typeof Function.prototype.bind !== "function") {
  Function.prototype.bind = function (context /*, args...*/) {
    var fn = this;
    return function () {
      return fn.apply(context, arguments);
    };
  };
}
