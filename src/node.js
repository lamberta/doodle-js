
(function () {
  var node_properties,
      node_count = 0,
      isNode,
      inheritsNode,
      check_matrix_type = doodle.utils.types.check_matrix_type,
      check_string_type = doodle.utils.types.check_string_type;
  
  /* Super constructor
   * @param {Function} initializer
   * @return {Object}
   */
  doodle.Node = function (id) {
    var arg_len = arguments.length,
        initializer,
        node = Object.create(doodle.EventDispatcher()),
        children = [],
        transform = doodle.geom.Matrix(),
        root = null,
        parent = null;
    
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
			id = undefined;
    } else if (arg_len > 1) {
			throw new SyntaxError("[object Node]: Invalid number of parameters.");
		}

    Object.defineProperties(node, node_properties);
    //properties that require privacy
    Object.defineProperties(node, {
			
      'id': {
        enumerable: true,
        configurable: false,
        get: function () { return id; },
        set: function (s) {
          if (check_string_type(s, this+'.id')) {
            id = s;
          }
        }
      },
			
      'root': {
        enumerable: true,
        configurable: false,
        get: function () { return root; },
        set: function (node) {
          if (node === null || inheritsNode(node)) {
            root = node;
          } else {
            throw new TypeError(this+".root: Parameter must be a node.");
          }
        }
      },
			
      'parent': {
        enumerable: true,
        configurable: false,
        get: function () { return parent; },
        set: function (node) {
          if (node === null || inheritsNode(node)) {
            parent = node;
          } else {
            throw new TypeError(this+".parent: Parameter must be a node.");
          }
        }
      },
			
      'children': {
        enumerable: false,
        configurable: false,
        get: function () {
          return children;
        }
      },
			
      'transform': {
        enumerable: false,
        configurable: false,
        get: function () {
          return transform;
        },
        set: function (matrix) {
          if (check_matrix_type(matrix, this+'.transform')) {
            transform = matrix;
          }
        }
      }
    });

    //passed an initialization object: function
    if (initializer) {
      node.id = "node" + String('000'+node_count).slice(-3);
      initializer.call(node);
    } else {
      node.id = id || "node" + String('000'+node_count).slice(-3);
    }
    node_count += 1;

    return node;
  };


	/*
	 * CLASS METHODS
	 */

  /* Test if an object is an node.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isNode = doodle.Node.isNode = function (obj) {
    return (obj.toString() === '[object Node]');
  };

  /* Check if object inherits from node.
   * @param {Object} obj
   * @return {Boolean}
   */
  inheritsNode = doodle.Node.inheritsNode = function (obj) {
    while (obj) {
      if (isNode(obj)) {
        return true;
      } else {
        if (typeof obj !== 'object') {
          return false;
        }
        obj = Object.getPrototypeOf(obj);
      }
    }
    return false;
  };

  doodle.utils.types.check_node_type = function (node, caller_name) {
    if (!inheritsNode(node)) {
			caller_name = (caller_name === undefined) ? "check_node_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a node.");
    } else {
      return true;
    }
  };


  (function () {

    var Point = doodle.geom.Point,
        isPoint = Point.isPoint,
        check_number_type = doodle.utils.types.check_number_type,
        check_point_type = doodle.utils.types.check_point_type,
				check_node_type = doodle.utils.types.check_node_type,a
				to_degrees = 180/Math.PI,
				to_radians = Math.PI/180;

    node_properties = {
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
          check_number_type(d, this+'.x');
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
          check_number_type(d, this+'.y');
          this.transform.ty = d;
        }
      },

			//registration point
			'axis': {
				//temp value
				value: {x: this.x, y: this.y}
			},

			'rotate': { //around external point?
				value: function (deg) {
					check_number_type(deg, this+'.rotate');
					this.transform.rotate(deg * to_radians);
				}
			},
			
      'rotation': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.transform.rotation * to_degrees; //return degress
        },
        set: function (deg) {
          check_number_type(deg, this+'.rotation');
          this.transform.rotation = deg * to_radians; //deg-to-rad
        }
      },
      
      'scale': {
        enumerable: true,
        configurable: false,
        get: function () {
          return Point(this.transform.a, this.transform.d);
        },
        /* Scale uniformly if given a single number, otherwise scale x and y.
         * @param {Number|Array|Point} s
         */
        set: function (s) {
          if (typeof s === "number") {
            this.transform.a = s;
            this.transform.d = s;
          } else if (Array.isArray(s)) {
            this.transform.a = s[0];
            this.transform.d = s[1];
          } else if (isPoint(s)) {
            this.transform.a = s.x;
            this.transform.d = s.y;
          } else {
            throw new TypeError(this+".scale: Wrong parameter type.");
          }
        }
      },

      /*
       * METHODS
       */

      /* Returns the string representation of the specified object.
       * @return {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object Node]";
        }
      },

      'addChildAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (node, index) {
					//if already a child then ignore
					if (this.children.indexOf(node) !== -1) {
						return false;
					}
					//type check
					check_node_type(node, this+'.addChildAt');
					check_number_type(index, this+'.addChildAt');
					
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

					return node;
				}
      },
      
      'addChild': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (node) {
          return this.addChildAt(node, this.children.length);
        }
      },
      
      'removeChildAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (index) {
          check_number_type(index, this+'.removeChildAt');
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
          //just assign an empty array to this.children?
          var i = this.children.length;
          while ((i -= 1) >= 0) {
            this.removeChildAt(i);
          }
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
          if (check_number_type(arguments, this+'.swapChildrenAt')) {
            var a = this.children;
            a[index1] = a.splice(index2, 1, a[index1])[0];
          }
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

      //change this nodes depth in parent
      'swapDepths': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function I(node) {
          var parent = this.parent;
          if (!parent || !Array.isArray(parent.children)) {
            throw new Error(this+".swapDepths: no parent found.");
          } else {
            parent.swapChildren(this, node);
          }
        }
      },

      'swapDepthAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (index) {
          if (check_number_type(index, this+'.swapDepthAt')) {
            var parent = this.parent;
            if (!parent || !Array.isArray(parent.children)) {
              throw new Error(this+".swapDepthAt: no parent found.");
            } else {
              parent.swapChildrenAt(index, parent.children.indexOf(this));
            }
          }
        }
      },
      
      /* Determine if node is among it's children, grandchildren, etc.
       * @return {Boolean}
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
        value: function (pt) {
          if (check_point_type(pt, this+'.globalToLocal')) {
            return Point(pt.x - this.x, pt.y - this.y);
          }
        }
      },

      'localToGlobal': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          if (check_point_type(pt, this+'.localToGlobal')) {
            return Point(pt.x + this.x, pt.y + this.y);
          }
        }
      }
      
    };//end node_properties
  }());
}());//end class closure
