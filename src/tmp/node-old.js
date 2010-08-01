/*
//to add:
visible: true,
alpha: 1.0,
filters: null, //?
compositeOperation: null,

registration_point: null, //point of rotation, x, y
showRegistrationPoint: null,
*/

/*
 * Inherits from EventDispatcher.
 */
(function () {

  var point = doodle.geom.point,
      isPoint = doodle.geom.point.isPoint,
      node_count = 0;
  
  /* Called when instantiated by Object.create(doodle.node)
   */
  Object.defineProperty(doodle, 'node', {
    configurable: false,
    enumerable: true,
    //constructor
    get: function () {
      var node = Object.create(doodle.eventdispatcher),
          node_name = "node" + node_count;
      
      node_count = node_count + 1;

      Object.defineProperties(node, node_properties);
      //init node object
      node.id = node_name;
      //node.root
      node.children = [];
      node.transform = Object.create(doodle.geom.matrix);

      return node;
    }
  });

  
  //static property description
  var node_properties = {
    /*
     * PROPERTIES
     */

    'id': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: null
    },

    'root': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: null
    },

    'parent': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: null
    },

    'children': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: null
    },

    'transform': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: null
    },
    
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
        return Object.create(point).compose(this.transform.a, this.transform.d);
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
        //just assign an empty array to this.children?
        var i = this.children.length;
        while ((i=i-1) >= 0) {
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
        var a = this.children;
        a[index1] = a.splice(index2, 1, a[index1])[0];
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
          throw new Error("node.swapDepths: no parent found.");
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
        var parent = this.parent;
        if (!parent || !Array.isArray(parent.children)) {
          throw new Error("node.swapDepthAt: no parent found.");
        } else {
          parent.swapChildrenAt(index, parent.children.indexOf(this));
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
        if (isPoint(pt, 'node.globalToLocal')) {
          return Object.create(point).compose(pt.x - this.x, pt.y - this.y);
        }
      }
    },

    'localToGlobal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        if (isPoint(pt, 'node.localToGlobal')) {
          return Object.create(point).compose(pt.x + this.x, pt.y + this.y);
        }
      }
    }
  };
  
}());
