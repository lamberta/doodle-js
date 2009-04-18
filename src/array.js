/**
 * For compatability, adds additional the Mozilla methods to Array.
 **/

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/) {
		var len = this.length >>> 0;
		
		var from = Number(arguments[1]) || 0;
		from = (from < 0)
			? Math.ceil(from)
			: Math.floor(from);
		if (from < 0)
			from += len;
		
		for (; from < len; from++) {
			if (from in this &&
				this[from] === elt)
				return from;
		}
		return -1;
	};
}


if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function(elt /*, from*/) {
		var len = this.length;
		
		var from = Number(arguments[1]);
		if (isNaN(from)) {
			from = len - 1;
		}else {
			from = (from < 0)
				? Math.ceil(from)
				: Math.floor(from);
			if (from < 0)
				from += len;
			else if (from >= len)
				from = len - 1;
		}
		
		for (; from > -1; from--) {
			if (from in this &&
				this[from] === elt)
				return from;
		}
		return -1;
	};
}


if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun /*, thisp*/) {
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();
		
		var res = new Array();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this) {
				var val = this[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, this))
					res.push(val);
			}
		}	
		return res;
	};
}


if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fun /*, thisp*/) {
		var len = this.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();
		
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this)
				fun.call(thisp, this[i], i, this);
		}
	};
}


if (!Array.prototype.every) {
	Array.prototype.every = function(fun /*, thisp*/) {
		var len = this.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();
		
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this &&
				!fun.call(thisp, this[i], i, this))
				return false;
		}
		return true;
	};
}


if (!Array.prototype.map) {
	Array.prototype.map = function(fun /*, thisp*/) {
		var len = this.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();
		
		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		}
		return res;
	};
}


if (!Array.prototype.some) {
	Array.prototype.some = function(fun /*, thisp*/) {
		var len = this.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();
		
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this &&
				fun.call(thisp, this[i], i, this))
				return true;
		}
		return false;
	};
}


if (!Array.prototype.reduce) {
	Array.prototype.reduce = function(fun /*, initial*/) {
		var len = this.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();

		// no value to return if no initial value and an empty array
		if (len == 0 && arguments.length == 1)
			throw new TypeError();
		
		var i = 0;
		if (arguments.length >= 2) {
			var rv = arguments[1];
		} else {
			do {
				if (i in this) {
					rv = this[i++];
					break;
				}
				
				// if array contains no values, no initial value to return
				if (++i >= len)
					throw new TypeError();
			}while (true);
		}
		
		for (; i < len; i++) {
			if (i in this)
				rv = fun.call(null, rv, this[i], i, this);
		}
		return rv;
	};
}


if (!Array.prototype.reduceRight) {
	Array.prototype.reduceRight = function(fun /*, initial*/) {
		var len = this.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();
		
		// no value to return if no initial value, empty array
		if (len == 0 && arguments.length == 1)
			throw new TypeError();
		
		var i = len - 1;
		if (arguments.length >= 2) {
			var rv = arguments[1];
		}else {
			do {
				if (i in this) {
					rv = this[i--];
					break;
				}
				
				// if array contains no values, no initial value to return
				if (--i < 0)
					throw new TypeError();
			} while (true);
		}
		
		for (; i >= 0; i--) {
			if (i in this)
				rv = fun.call(null, rv, this[i], i, this);
		}
		
		return rv;
	};
}
