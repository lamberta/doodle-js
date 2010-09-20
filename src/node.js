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
      check_rect_type = doodle.utils.types.check_rect_type,
      check_point_type = doodle.utils.types.check_point_type,
      /*END_DEBUG*/
      //recycled events
      evt_addedEvent = doodle.Event(doodle.Event.ADDED, true),
      evt_removedEvent = doodle.Event(doodle.Event.REMOVED, true),
      //lookup help
      doodle_Point = doodle.geom.Point,
      doodle_Matrix = doodle.geom.Matrix,
      create_scene_path = doodle.utils.create_scene_path,
      PI = Math.PI;
  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Node}
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
      
      'root': (function () {
        var root = null;
        return {
          enumerable: true,
          configurable: false,
          get: function () { return root; },
          set: function (node) {
            /*DEBUG*/
            if (node !== null) {
              //because it's defined later, global declared in prologue
              check_display_type(node, this+'.root');
            }
            /*END_DEBUG*/
            root = node;
          }
        };
      }()),
      
      'parent': (function () {
        var parent = null;
        return {
          enumerable: true,
          configurable: false,
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
      
      'transform': (function () {
        var transform = doodle_Matrix();
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

      /* The bounding box of a Node is a union of all it's child Sprite's bounds.
       * @param {Node} targetCoordSpace
       * @return {Rectangle|Null}
       */
      'getBounds': {
        enumerable: true,
        writable: true,
        configurable: false,
        value: function (targetCoordSpace) {
          /*DEBUG*/
          check_node_type(targetCoordSpace, this+'.getBounds', '*targetCoordSpace*');
          /*END_DEBUG*/
          var bounding_box = null,
              child_bounds,
              children = this.children,
              len = children.length;
          
          while (len--) {
            child_bounds = children[len].getBounds(targetCoordSpace);

            if (child_bounds === null) {
              continue;
            }
            if (bounding_box === null) {
              bounding_box = child_bounds;
            } else {
              bounding_box.__union(child_bounds);
            }
          }
          return bounding_box;
        }
      },

      /* Same as getBounds, but modifies a rectangle parameter.
       * @param {Rectangle|null} rect
       * @param {Node} targetCoordSpace
       * @return {Rectangle|Null}
       */
      '__getBounds': {
        enumerable: false,
        writable: true,
        configurable: false,
        value: function (rect, targetCoordSpace) {
          /*DEBUG*/
          check_rect_type(rect, this+'.__getBounds', '*rect*, targetCoordSpace');
          check_node_type(targetCoordSpace, this+'.__getBounds', 'rect, *targetCoordSpace*');
          /*END_DEBUG*/
          var child_bounds,
              children = this.children,
              len = children.length;
          
          while (len--) {
            child_bounds = children[len].getBounds(targetCoordSpace);
            
            if (child_bounds === null) {
              continue;
            } else {
              rect.__union(child_bounds);
            }
          }
          return rect;
        }
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

    /**
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
    **/

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
    
    'rotation': {
      enumerable: true,
      configurable: false,
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

    /*
     * METHODS
     */

    /* Returns the string representation of the specified object.
     * @return {String}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Node]";
      }
    },

    'addChildAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node, index) {
        var children = this.children,
            this_display = this.root,
            node_display = node.root,
            node_parent = node.parent,
            //was the node already on the display list?
            on_scene_graph_p = (node_display && node_display === this_display) ? true : false,
            node_descendants,
            i;
        
        //if already a child then ignore
        if (children.indexOf(node) !== -1) {
          return false;
        }
        /*DEBUG*/
        check_node_type(node, this+'.addChildAt', '*node*, index');
        check_number_type(index, this+'.addChildAt', 'node, *index*');
        /*END_DEBUG*/
        
        //make sure parent/child share same root
        if (node_display !== this_display) {
          node.root = this_display;
        }
        //if it had another parent, remove from their children
        if (node_parent !== null && node_parent !== this) {
          node.parent.removeChild(node);
        }
        //adopt node
        node.parent = this;
        children.splice(index, 0, node);

        //now part of display list
        if (this_display) {
          //reorder scene path
          this_display.__sortAllChildren();
          //if it wasn't on the scene graph before, tell everyone now
          if (!on_scene_graph_p) {
            //fire off Event.ADDED for node and all it's descendants
            node_descendants = create_scene_path(node, []);
            i = node_descendants.length;
            while(i--) {
              //recycle our Event.ADDED
              node_descendants[i].dispatchEvent(evt_addedEvent.__setTarget(null));
            }
          }
        }

        return node;
      }
    },
    
    'addChild': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        check_node_type(node, this+'.addChild', '*node*');
        /*END_DEBUG*/
        return this.addChildAt(node, this.children.length);
      }
    },
    
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
            this_display = this.root,
            child_descendants = create_scene_path(child, []), //includes child
            i = child_descendants.length,
            j = i;
        
        //event dispatching depends on an intact scene graph
        if (this_display) {
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
        if (this_display) {
          this_display.__sortAllChildren();
        }
      }
    },
    
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

    /* Changes the position of an existing child in the node's children array.
     * This affects the layering of child objects.
     * @param {Node} child
     * @param {Number} index
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
      }
    },

    /* Swaps the child nodes at the two specified index positions in the child list.
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
      }
    },
    
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

    /* Swap positions with another node in the parents child list.
     * @param {Node} node
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

    /* Swap positions with another node at a given index in the parents child list.
     * @param {Number} index
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
    
    /* Determine if node is among it's children, grandchildren, etc.
     * @param {Node} node
     * @return {Boolean}
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

    /* Same as localToGlobal, but modifies a point in place.
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

    /* Same as globalToLocal, but modifies a point in place.
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

  /* Test if an object is an node.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isNode = doodle.Node.isNode = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
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

  /*DEBUG*/
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
