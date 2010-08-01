//node depends on matrix
//doodle.node = Object.create(doodle.geom.matrix); //sets prototype

doodle.node = {
	id: null,
	root: null,
	parent: null,
	children: null, //assign new array
	transform: null, //assign a matrix object
	visible: true,
	alpha: 1.0,
	filters: null, //?
	compositeOperation: null,

	registration_point: null, //point of rotation, x, y
	showRegistrationPoint: null,
	
	init: (function () {
		var node_count = 0,
				node_name;
		return function (id) {
			this.id = (function () {
				if (id) {
					return id;
				} else {
					node_name = "node" + node_count;
					node_count = node_count + 1;
					return node_name;
				}
			}());
			this.children = [];
			this.frameListeners = [];
			this.transform = Object.create(doodle.geom.matrix);
			return this;
		};
	}()),
};


(function () {
	var node_count = 0;

	Object.defineProperty(doodle, 'node', {
		configurable: false,
		enumerable: true,
		//constructor
		get: function () {
			var node = Object.create(doodle.geom.matrix),
					node_name = "node" + node_count;

			node_count = node_count + 1;
			
			return Object.defineProperties(node, {

			});
		}
	});
}());
	

Object.defineProperties(doodle.node, {

	/*
   * PROPERTIES
   */
	
	'x': {
		enumerable: true,
    configurable: false,
		get: function () {
			return this.transform.tx;
		},
		set: function (d) {
			this.transform.tx = d;
		}
	},
	
	'y': {
		enumerable: true,
    configurable: false,
		get: function () {
			return this.transform.ty;
		},
		set: function (d) {
			this.transform.ty = d;
		}
	},
	
	'rotation': {
		enumerable: true,
    configurable: false,
		get: function () {
			return this.transform.rotation * 180/Math.PI; //return degress
		},
		set: function (deg) {
			this.transform.rotation = deg * Math.PI/180; //deg-to-rad
		}
	},
	
	'scale': {
		enumerable: true,
    configurable: false,
		get: function () {
			return {x: this.transform.a, y: this.transform.d};
		},
		/* Scale uniformly if given a single number, otherwise scale x and y.
		 * @param {Number|Array|Point} s
		 */
		set: function (s) {
			//
			if (typeof s === "number") {
				this.transform.a = s;
				this.transform.d = s;
			} else if (Array.isArray(s)) {
				this.transform.a = s[0];
				this.transform.d = s[1];
			} else {
				this.transform.a = s.x;
				this.transform.d = s.y;
			}
		}
	},

	/*
   * METHODS
   */

	'addChildAt': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (node, index) {
			//make sure parent/child share same root
			if (node.root !== this.root) {
				node.root = this.root;
			}
			//if has previous parent, remove from it's children
			if (node.parent !== null && node.parent !== this) {
				node.parent.removeChild(node);
			}
			node.parent = this;
			this.children.splice(index, 0, node);
		}
	},
	
	'addChild': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (node) {
			this.addChildAt(node, this.children.length);
		}
	},
	
	'removeChildAt': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (index) {
			var node = this.children[index];
			node.root = null;
			node.parent = null;
			this.children.splice(index, 1);
		}
	},
	
	'removeChild': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (node) {
			this.removeChildAt(this.children.indexOf(node));
		}
	},
	
	'removeChildById': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (id) {
			this.removeChild(this.getChildById(id));
		}
	},
	
	'removeAllChildren': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function () {
			var i = this.children.length - 1;
			do {
				this.removeChildAt(i);
			} while (i--);
		}
	},
	
	'getChildById': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (id) {
			return this.children.filter(function (child) {
				return child.id === id;
			})[0];
		}
	},
	
	'swapChildrenAt': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (index1, index2) {
			var a = this.children;
			a[index1]= a.splice(index2, 1, a[index1])[0];
		}
	},
	
	'swapChildren': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (node1, node2) {
			this.swapChildrenAt(this.children.indexOf(node1), this.children.indexOf(node2));
		}
	},
	
	/* Determine if node is among it's children, grandchildren, etc.
	 */
	'contains': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (node) {
			while (node) {
				if (node === this) {
					return true;
				}
				node = node.parent;
			}
			return false;
		}
	},
	
	'globalToLocal': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (point) {
			return {x: point.x - this.x, y: point.y - this.y};
		}
	},

	'localToGlobal': {
		enumerable: false,
		writable: false,
    configurable: false,
    value: function (point) {
			return {x: point.x + this.x, y: point.y + this.y};
		}
	}
	
});
