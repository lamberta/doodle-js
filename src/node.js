(function () {
  var node_count = 0,
      node_static_properties,
      isNode,
      inheritsNode,
      check_node_type,
      inDisplayList,
      /*DEBUG*/
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_matrix_type = doodle.utils.types.check_matrix_type,
      check_point_type = doodle.utils.types.check_point_type,
      /*END_DEBUG*/
      evt_addedEvent = doodle.Event(doodle.Event.ADDED, true),
      evt_removedEvent = doodle.Event(doodle.Event.REMOVED, true),
      doodle_Rectangle = doodle.geom.Rectangle,
      doodle_Point = doodle.geom.Point,
      doodle_Event = doodle.Event,
      to_degrees = 180 / Math.PI,
      to_radians = Math.PI / 180;
  
  /* Super constructor
   * @param {Function} init_fn
   * @return {Object}
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
        var node_id;
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
        var transform = doodle.geom.Matrix();
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
              bounding_box = bounding_box.union(child_bounds);
            }
          }
          
          return bounding_box;
        }
      }
    });//end defineProperties

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      arguments[0].call(node);
      id = undefined;
    }

    //node defaults
    if (node.id === undefined) {
      node.id = (typeof id === 'string') ? id : "node"+ String('000'+node_count).slice(-3);
      node_count += 1;
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

    //registration point
    'axis': {
      //temp value
      value: {x: this.x, y: this.y}
    },

    /*
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

    'rotate': { //around external point?
      value: function (deg) {
        /*DEBUG*/
        check_number_type(deg, this+'.rotate', '*degrees*');
        /*END_DEBUG*/
        this.transform.rotate(deg * to_radians);
      }
    },
    
    'rotation': {
      enumerable: true,
      configurable: true,
      get: function () {
        return this.transform.rotation * to_degrees;
      },
      set: function (deg) {
        /*DEBUG*/
        check_number_type(deg, this+'.rotation', '*degrees*');
        /*END_DEBUG*/
        this.transform.rotation = deg * to_radians;
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
        if (display) {
          //reorder scene path
          display.__sortAllChildren();
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
      enumerable: false,
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
      enumerable: false,
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
      enumerable: false,
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
        /*DEBUG*/
        check_string_type(id, this+'.getChildById', '*id*');
        /*END_DEBUG*/
        return this.children.filter(function (child) {
          return child.id === id;
        })[0];
      }
    },

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
        if (pos === -1) {
          throw new ReferenceError(this+'.setChildIndex(*child*, index): ' + child + ' does not exist on child list.');
        }
        if (index > len || index < -len) {
          throw new RangeError(this+'.setChildIndex(child, *index*): ' + index + ' does not exist on child list.');
        }
        children.splice(pos, 1); //remove element
        children.splice(index, 0, child); //set new position
      }
    },
    
    'swapChildrenAt': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (index1, index2) {
        /*DEBUG*/
        check_number_type(index1, this+'.swapChildrenAt', '*index1*, index2');
        check_number_type(index2, this+'.swapChildrenAt', 'index1, *index2*');
        /*END_DEBUG*/
        var a = this.children;
        a[index1] = a.splice(index2, 1, a[index1])[0];
      }
    },
    
    'swapChildren': {
      enumerable: false,
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

    //change this nodes depth in parent
    'swapDepths': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function I(node) {
        /*DEBUG*/
        check_node_type(node, this+'.swapDepths', '*node*');
        /*END_DEBUG*/
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
        /*DEBUG*/
        check_number_type(index, this+'.swapDepthAt', '*index*');
        /*END_DEBUG*/
        var parent = this.parent;
        if (!parent || !Array.isArray(parent.children)) {
          throw new Error(this+".swapDepthAt: no parent found.");
        } else {
          parent.swapChildrenAt(index, parent.children.indexOf(this));
        }
      }
    },
    
    /* Determine if node is among it's children, grandchildren, etc.
     * @return {Boolean}
     *
     * THIS ONLY CHECKS PARENTS / GRANDPARENTS
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

    'localToGlobal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        check_point_type(pt, this+'.localToGlobal', '*point*');
        /*END_DEBUG*/
        var node = this;
        while (node) {
          pt = node.transform.transformPoint(pt);
          node = node.parent;
        }
        return pt;
      }
    },

    'globalToLocal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        check_point_type(pt, this+'.globalToLocal', '*point*');
        /*END_DEBUG*/
        var global_pos = this.localToGlobal({x: 0, y: 0});
        return doodle_Point(pt.x - global_pos.x, pt.y - global_pos.y);
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

  check_node_type = doodle.utils.types.check_node_type = function (node, caller, param) {
    if (inheritsNode(node)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_node_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be a Node.");
    }
  };

  /* A node is part of the display list if it can find a context to
   * draw on in it's scene graph.
   */
  inDisplayList = doodle.Node.inDisplayList = function (node) {
    while (node) {
      if (node.context) {
        return true;
      }
      node = node.parent;
    }
    return false;
  };
  
}());//end class closure
