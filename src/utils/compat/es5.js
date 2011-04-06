/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
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
