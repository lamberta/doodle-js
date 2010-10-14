/*jslint nomen: false, plusplus: false*/
/*globals doodle, check_display_type*/

(function () {
  var node_count = 0,
      node_static_properties,
      isNode,
      inheritsNode,
      /*DEBUG*/
      check_node_type,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_matrix_type = doodle.utils.types.check_matrix_type,
      check_point_type = doodle.utils.types.check_point_type,
      check_context_type = doodle.utils.types.check_context_type,
      /*END_DEBUG*/
      //recycled events
      evt_addedEvent = doodle.events.Event(doodle.events.Event.ADDED, true),
      evt_removedEvent = doodle.events.Event(doodle.events.Event.REMOVED, true),
      //lookup help
      doodle_Point = doodle.geom.Point,
      doodle_Matrix = doodle.geom.Matrix,
      doodle_Rectangle = doodle.geom.Rectangle,
      create_scene_path = doodle.utils.create_scene_path,
      PI = Math.PI;
  
  /**
   * @name doodle.Node
   * @class
   * @augments doodle.EventDispatcher
   * @param {string=} id|initializer
   * @return {doodle.Node}
   */
  doodle.Node = function (id) {
    var node = Object.create(doodle.EventDispatcher());
    
    /*DEBUG*/
    if (arguments.length > 1) {
      throw new SyntaxError("[object Node](id): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(node, node_static_properties);
    //properties that require privacy
    Object.defineProperties(node, {
      
      /*DEBUG*/
      'debug': {
        //Debugging oprions
        enumerable: true,
        configurable: false,
        value: Object.create(null, {
          /**
           * @name debug.boundingBox
           * @return {boolean}
           * @property
           */
          'boundingBox': (function () {
            var show_bounds = false;
            return {
              enumerable: true,
              configurable: false,
              get: function () {
                return show_bounds;
              },
              set: function (showBoundingBox) {
                show_bounds = showBoundingBox === true;
              }
            };
          }())
        })
      },
      /*END_DEBUG*/

      /**
       * @name id
       * @return {string}
       * @property
       */
      'id': (function () {
        var node_id = (typeof id === 'string') ? id : "node"+ String('000'+node_count).slice(-3);
        node_count += 1;
        return {
          enumerable: true,
          configurable: true,
          get: function () { return node_id; },
          set: function (idArg) {
            /*DEBUG*/
            check_string_type(idArg, this+'.id');
            /*END_DEBUG*/
            node_id = idArg;
          }
        };
      }()),

      /**
       * @name root
       * @return {Display}
       * @property
       */
      'root': (function () {
        var root = null;
        return {
          enumerable: true,
          configurable: true,
          get: function () { return root; },
          set: function (node) {
            /*DEBUG*/
            if (node !== null) {
              //no lookup help since it's not defined until display.js
              doodle.utils.types.check_display_type(node, this+'.root');
            }
            /*END_DEBUG*/
            root = node;
          }
        };
      }()),

      /**
       * @name parent
       * @return {Node}
       * @property
       */
      'parent': (function () {
        var parent = null;
        return {
          enumerable: true,
          configurable: true,
          get: function () { return parent; },
          set: function (node) {
            /*DEBUG*/
            if (node !== null) {
              check_node_type(node, this+'.parent');
            }
            /*END_DEBUG*/
            parent = node;
          }
        };
      }()),

      /**
       * @name children
       * @return {Array}
       * @property
       */
      'children': (function () {
        var children = [];
        return {
          enumerable: true,
          configurable: false,
          get: function () {
            return children;
          }
        };
      }()),

      /**
       * @name transform
       * @return {Matrix}
       * @property
       */
      'transform': (function () {
        var transform = doodle_Matrix(1, 0, 0, 1, 0, 0);
        return {
          enumerable: true,
          configurable: false,
          get: function () { return transform; },
          set: function (matrix) {
            /*DEBUG*/
            check_matrix_type(matrix, this+'.transform');
            /*END_DEBUG*/
            transform = matrix;
          }
        };
      }()),

      /**
       * @name visible
       * @return {boolean}
       * @property
       */
      'visible': (function () {
        var visible = true;
        return {
          enumerable: true,
          configurable: true,
          get: function () { return visible; },
          set: function (isVisible) {
            /*DEBUG*/
            check_boolean_type(isVisible, node+'.visible');
            /*END_DEBUG*/
            visible = isVisible;
          }
        };
      }()),

      /**
       * @name alpha
       * @return {number}
       * @property
       */
      'alpha': (function () {
        var alpha = 1; //alpha is between 0 and 1
        return {
          enumerable: true,
          configurable: true,
          get: function () { return alpha; },
          set: function (alphaArg) {
            /*DEBUG*/
            check_number_type(alphaArg, node+'.alpha');
            /*END_DEBUG*/
            alpha = (alphaArg > 1) ? 1 : ((alphaArg < 0) ? 0 : alphaArg);
          }
        };
      }()),

      /**
       * The bounding box of a Node is a union of all it's child Sprite's bounds.
       * @name getBounds
       * @param {Node} targetCoordSpace
       * @return {Rectangle|null}
       */
      'getBounds': {
        enumerable: true,
        writable: true,
        configurable: false,
        value: function (targetCoordSpace) {
          /*DEBUG*/
          check_node_type(targetCoordSpace, this+'.getBounds', '*targetCoordSpace*');
          /*END_DEBUG*/
          return this.__getBounds(targetCoordSpace).clone();
        }
      },

      /* Same as getBounds, but reuses an internal rectangle.
       * Since it's passed by reference, you don't want to modify it, but
       * it's more efficient for checking bounds.
       * @name __getBounds
       * @private
       */
      '__getBounds': {
        enumerable: false,
        writable: true,
        configurable: false,
        value: (function () {
          var rect = doodle_Rectangle(0, 0, 0, 0); //recycle
          
          return function (targetCoordSpace) {
            /*DEBUG*/
            check_node_type(targetCoordSpace, this+'.__getBounds', '*targetCoordSpace*');
            /*END_DEBUG*/
            var bounding_box = null,
                child_bounds,
                children = this.children,
                len = children.length;
          
            while (len--) {
              child_bounds = children[len].__getBounds(targetCoordSpace);
              
              if (child_bounds === null) {
                continue;
              }
              if (bounding_box === null) {
                bounding_box = rect.__compose(child_bounds);
              } else {
                bounding_box.__union(child_bounds);
              }
            }
            return bounding_box;
          };
        }())
      }
    });//end defineProperties

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      arguments[0].call(node);
      id = undefined;
    }

    return node;
  };


  node_static_properties = {

    /**
     * @name x
     * @return {number}
     * @property
     */
    'x': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.transform.tx;
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.x');
        /*END_DEBUG*/
        this.transform.tx = n;
      }
    },

    /**
     * @name y
     * @return {number}
     * @property
     */
    'y': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.transform.ty;
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.y');
        /*END_DEBUG*/
        this.transform.ty = n;
      }
    },

    /*
    //registration point
    'axis': {
      value: {x: this.x, y: this.y}
    },

    'rotate': { //around external point?
      value: function (deg) {
      
        check_number_type(deg, this+'.rotate', '*degrees*');

        if (this.axis.x !== undefined && this.axis.y !== undefined) {
          this.transform.rotateAroundInternalPoint(this.axis, deg*to_radians);
        } else {
          this.transform.rotate(deg * to_radians);
        }
      }
    },
    */

    /**
     * @name rotate
     * @param {number} deg
     * @return {number}
     */
    'rotate': {
      enumerable: true,
      configurable: false,
      value: function (deg) {
        /*DEBUG*/
        check_number_type(deg, this+'.rotate', '*degrees*');
        /*END_DEBUG*/
        this.transform.rotate(deg * PI / 180);
      }
    },

    /**
     * @name rotation
     * @return {number}
     * @property
     */
    'rotation': {
      enumerable: true,
      configurable: true,
      get: function () {
        return this.transform.rotation * 180 / PI;
      },
      set: function (deg) {
        /*DEBUG*/
        check_number_type(deg, this+'.rotation', '*degrees*');
        /*END_DEBUG*/
        this.transform.rotation = deg * PI / 180;
      }
    },

    /**
     * @name scaleX
     * @param {number} sx
     * @return {number}
     */
    'scaleX': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.transform.a;
      },
      set: function (sx) {
        /*DEBUG*/
        check_number_type(sx, this+'.scaleX');
        /*END_DEBUG*/
        this.transform.a = sx;
      }
    },

    /**
     * @name scaleY
     * @param {number} sy
     * @return {number}
     */
    'scaleY': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.transform.d;
      },
      set: function (sy) {
        /*DEBUG*/
        check_number_type(sy, this+'.scaleY');
        /*END_DEBUG*/
        this.transform.d = sy;
      }
    },

    /**
     * drawing context to use
     * @name context
     * @return {CanvasRenderingContext2D}
     * @property
     */
    'context': {
      enumerable: true,
      configurable: true,
      get: function () {
        //will keep checking parent for context till found or null
        var node = this.parent;
        while (node) {
          if (node.context) {
            /*DEBUG*/
            check_context_type(node.context, this+'.context (traversal)');
            /*END_DEBUG*/
            return node.context;
          }
          node = node.parent;
        }
        return null;
      }
    },

    /*
     * @name __allTransforms
     * @private
     */
    '__allTransforms': {
      enumerable: false,
      configurable: false,
      get: (function () {
        var transform = doodle_Matrix(1, 0, 0, 1, 0, 0);
        return function () {
          var $transform = transform,
              node = this.parent;
          $transform.compose.apply($transform, this.transform.__toArray());
          
          while (node) {
            $transform.multiply(node.transform);
            node = node.parent;
          }
          return $transform;
        };
      }())
    },

    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object Node]"; }
    },

    /**
     * @name addChildAt
     * @param {Node} node
     * @param {number} index
     * @return {Node}
     * @throws {TypeError}
     */
    'addChildAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node, index) {
        var children = this.children,
            display = this.root,
            node_parent = node.parent,
            i;

        /*DEBUG*/
        check_node_type(node, this+'.addChildAt', '*node*, index');
        check_number_type(index, this+'.addChildAt', 'node, *index*');
        /*END_DEBUG*/
        
        //if already a child then ignore
        if (children.indexOf(node) !== -1) {
          return false;
        }

        //if it had another parent, remove from their children
        if (node_parent !== null && node_parent !== this) {
          node.parent.removeChild(node);
        }
        node.parent = this;
        //add child
        children.splice(index, 0, node);

        //are we on the display path and node not previously on path
        if (display && node.root !== display) {
          //resort scene graph
          display.__sortAllChildren();
          children = create_scene_path(node, []);
          i = children.length;
          while (i--) {
            node = children[i];
            //set new root for all descendants
            node.root = display;
            //fire Event.ADDED if now on display list
            node.dispatchEvent(evt_addedEvent.__setTarget(null));
          }
        }
        return node;
      }
    },

    /**
     * @name addChild
     * @param {Node} node
     * @return {Node}
     * @throws {TypeError}
     */
    'addChild': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        check_node_type(node, this+'.addChild', '*node*');
        /*END_DEBUG*/
        return this.addChildAt(node, 0);
      }
    },

    /**
     * @name removeChildAt
     * @param {number} index
     * @throws {TypeError}
     */
    'removeChildAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index) {
        /*DEBUG*/
        check_number_type(index, this+'.removeChildAt', '*index*');
        /*END_DEBUG*/
        var children = this.children,
            child = children[index],
            display = this.root,
            child_descendants = create_scene_path(child, []), //includes child
            i = child_descendants.length,
            j = i;
        
        //event dispatching depends on an intact scene graph
        if (display) {
          while (i--) {
            child_descendants[i].dispatchEvent(evt_removedEvent.__setTarget(null));
          }
        }
        //un-adopt child
        children.splice(index, 1);
        
        //reset child and descendants
        child.parent = null;
        while (j--) {
          child_descendants[j].root = null;
        }
        //reorder this display's scene path
        if (display) {
          display.__sortAllChildren();
        }
      }
    },

    /**
     * @name removeChild
     * @param {Node} node
     * @throws {TypeError}
     */
    'removeChild': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        check_node_type(node, this+'.removeChild', '*node*');
        /*END_DEBUG*/
        this.removeChildAt(this.children.indexOf(node));
      }
    },

    /**
     * @name removeChildById
     * @param {string} id
     * @throws {TypeError}
     */
    'removeChildById': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (id) {
        /*DEBUG*/
        check_string_type(id, this+'.removeChildById', '*id*');
        /*END_DEBUG*/
        this.removeChild(this.getChildById(id));
      }
    },

    /**
     * @name removeAllChildren
     * @throws {TypeError}
     */
    'removeAllChildren': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        var i = this.children.length;
        while (i--) {
          this.removeChildAt(i);
        }
      }
    },

    /**
     * @name getChildById
     * @param {string} id
     * @return {Node|null}
     * @throws {TypeError}
     */
    'getChildById': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (id) {
        /*DEBUG*/
        check_string_type(id, this+'.getChildById', '*id*');
        /*END_DEBUG*/
        var children = this.children,
            len = children.length,
            i = 0;
        for (; i < len; i++) {
          if (children[i].id === id) {
            return children[i];
          }
        }
        return null;
      }
    },

    /**
     * Changes the position of an existing child in the node's children array.
     * This affects the layering of child objects.
     * @name setChildIndex
     * @param {Node} child
     * @param {number} index
     * @throws {TypeError}
     */
    'setChildIndex': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (child, index) {
        /*DEBUG*/
        check_node_type(child, this+'.setChildIndex', '*child*, index');
        check_number_type(index, this+'.setChildIndex', 'child, *index*');
        /*END_DEBUG*/
        var children = this.children,
            len = children.length,
            pos = children.indexOf(child);
        /*DEBUG*/
        if (pos === -1) {
          throw new ReferenceError(this+'.setChildIndex(*child*, index): ' + child + ' does not exist on child list.');
        }
        if (index > len || index < -len) {
          throw new RangeError(this+'.setChildIndex(child, *index*): ' + index + ' does not exist on child list.');
        }
        /*END_DEBUG*/
        children.splice(pos, 1); //remove child
        children.splice(index, 0, child); //place child at new position
        //reorder this display's scene path
        if (this.root) {
          this.root.__sortAllChildren();
        }
      }
    },

    /**
     * Swaps the child nodes at the two specified index positions in the child list.
     * @name swapChildrenAt
     * @param {number} index1
     * @param {number} index2
     * @throws {TypeError}
     */
    'swapChildrenAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index1, index2) {
        /*DEBUG*/
        check_number_type(index1, this+'.swapChildrenAt', '*index1*, index2');
        check_number_type(index2, this+'.swapChildrenAt', 'index1, *index2*');
        /*END_DEBUG*/
        var children = this.children;
        children[index1] = children.splice(index2, 1, children[index1])[0];
        //reorder this display's scene path
        if (this.root) {
          this.root.__sortAllChildren();
        }
      }
    },

    /**
     * @name swapChildren
     * @param {Node} node1
     * @param {Node} node2
     * @throws {TypeError}
     */
    'swapChildren': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node1, node2) {
        /*DEBUG*/
        check_node_type(node1, this+'.swapChildren', '*node1*, node2');
        check_node_type(node2, this+'.swapChildren', 'node1, *node2*');
        /*END_DEBUG*/
        var children = this.children;
        this.swapChildrenAt(children.indexOf(node1), children.indexOf(node2));
      }
    },

    /**
     * Swap positions with another node in the parents child list.
     * @name swapDepths
     * @param {Node} node
     * @throws {TypeError}
     * @throws {ReferenceError}
     */
    'swapDepths': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function I(node) {
        var parent = this.parent,
            children;
        /*DEBUG*/
        check_node_type(node, this+'.swapDepths', '*node*');
        check_node_type(parent, this+'.swapDepths(node): No parent node found.');
        if (node.parent !== parent) {
          throw new ReferenceError(this+".swapDepths(node): "+ this.id +" node and "+ node.id + " node do not share a parent.");
        }
        /*END_DEBUG*/
        children = parent.children;
        parent.swapChildrenAt(children.indexOf(this), children.indexOf(node));
      }
    },

    /**
     * Swap positions with another node at a given index in the parents child list.
     * @name swapDepthAt
     * @param {number} index
     * @throws {TypeError}
     */
    'swapDepthAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index) {
        var parent = this.parent;
        /*DEBUG*/
        check_number_type(index, this+'.swapDepthAt', '*index*');
        check_node_type(parent, this+'.swapDepthAt(node): No parent node found.');
        /*END_DEBUG*/
        parent.swapChildrenAt(index, parent.children.indexOf(this));
      }
    },
    
    /**
     * Determine if node is among it's children, grandchildren, etc.
     * @name contains
     * @param {Node} node
     * @return {boolean}
     * @throws {TypeError}
     */
    'contains': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        check_node_type(node, this+'.contains', '*node*');
        /*END_DEBUG*/
        return (create_scene_path(this, []).indexOf(node) !== -1) ? true : false;
      }
    },

    /**
     * @name localToGlobal
     * @param {Point} point
     * @return {Point}
     * @throws {TypeError}
     */
    'localToGlobal': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (point) {
        /*DEBUG*/
        check_point_type(point, this+'.localToGlobal', '*point*');
        /*END_DEBUG*/
        var node = this.parent;
        //apply each transformation from this node up to root
        point = this.transform.transformPoint(point); //new point
        while (node) {
          node.transform.__transformPoint(point); //modify point
          node = node.parent;
        }
        return point;
      }
    },

    /**
     * Same as localToGlobal, but modifies a point in place.
     * @name __localToGlobal
     * @param {Point} point
     * @return {Point}
     * @throws {TypeError}
     * @private
     */
    '__localToGlobal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (point) {
        /*DEBUG*/
        check_point_type(point, this+'.localToGlobal', '*point*');
        /*END_DEBUG*/
        var node = this;
        //apply each transformation from this node up to root
        while (node) {
          node.transform.__transformPoint(point); //modify point
          node = node.parent;
        }
        return point;
      }
    },

    /**
     * @name globalToLocal
     * @param {Point} point
     * @return {Point}
     * @throws {TypeError}
     */
    'globalToLocal': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (point) {
        /*DEBUG*/
        check_point_type(point, this+'.globalToLocal', '*point*');
        /*END_DEBUG*/
        var global_pt = {x:0, y:0};
        this.__localToGlobal(global_pt);
        return doodle_Point(point.x - global_pt.x, point.y - global_pt.y);
      }
    },

    /**
     * Same as globalToLocal, but modifies a point in place.
     * @name __globalToLocal
     * @param {Point} point
     * @return {Point}
     * @throws {TypeError}
     * @private
     */
    '__globalToLocal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (point) {
        /*DEBUG*/
        check_point_type(point, this+'.globalToLocal', '*point*');
        /*END_DEBUG*/
        var global_pt = {x:0, y:0};
        this.__localToGlobal(global_pt);
        point.x = point.x - global_pt.x;
        point.y = point.y - global_pt.y;
        return point;
      }
    }
  };//end node_static_properties

  
  /*
   * CLASS METHODS
   */

  /**
   * Test if an object is an node.
   * @name isNode
   * @param {Object} obj
   * @return {boolean}
   * @static
   */
  isNode = doodle.Node.isNode = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object Node]');
  };

  /**
   * Check if object inherits from node.
   * @name inheritsNode
   * @param {Object} obj
   * @return {boolean}
   * @static
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

  /*DEBUG*/
  /**
   * @name check_node_type
   * @param {Node} node
   * @param {string} caller
   * @param {string} params
   * @return {boolean}
   * @throws {TypeError}
   * @memberOf utils.types
   * @static
   */
  check_node_type = doodle.utils.types.check_node_type = function (node, caller, param) {
    if (inheritsNode(node)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_node_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be a Node.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
