//testing design pattern
var my_package = {};
(function () {
	var cls = 2; //class var, when using a getter/setter
	var cls2 = []; //class var in both because its passed by reference
	var cls3 = {count:0};
	var cls4 = 0;
	
	Object.defineProperty(my_package, 'display', {
		configurable: false,
		enumerable: true,
		//constructor
		get: function () {
			var this_proto; // = Object.create(my_proto);
			var priv = "hooha";

			return {
				a: 1,
				b: cls,
				c: cls2,
				d: priv,
				e: cls3.count++,
				f: cls4++,
				g: []
			};
			/* could add on to my_proto
			return Object.defineProperties({}, {
				'x': {
					value: 1
				},
				'y': {
					get: function () {
						return cls;
					},
					set: function (x) {
						cls = x;
					}
				},
				'z': {
					get: function () {
						return priv;
					},
					set: function (x) {
						priv = x;
					}
				}
			});
			*/
		}
	});
}());

var d1 = Object.create(my_package.display);
