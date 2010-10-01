
/* ES5 compatibility
 */
  
if (typeof Function.prototype.bind !== 'function') {
  Function.prototype.bind = function (thisArg /*, args...*/) {
    var fn = this;
    return function () {
      return fn.apply(thisArg, arguments);
    };
  };
}
