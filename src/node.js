/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
(function () {
  var node_count = 0,
      node_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      reference_check = doodle.utils.debug.reference_check,
      /*END_DEBUG*/
      //recycled events
      evt_addedEvent = doodle.events.Event(doodle.events.Event.ADDED, true),
      evt_removedEvent = doodle.events.Event(doodle.events.Event.REMOVED, true),
      createPoint = doodle.geom.createPoint,
      createMatrix = doodle.geom.createMatrix,
      createRectangle = doodle.geom.createRectangle,
      create_scene_path = doodle.utils.create_scene_path,
      PI = Math.PI;
  
  /**
   * @name doodle.createNode
   * @class
   * @augments doodle.EventDispatcher
   * @param {string=} id|initializer
   * @return {doodle.Node}
   */
  doodle.Node = doodle.createNode = function (id) {
    var node = Object.create(doodle.createEventDispatcher());
    
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
              get: function () { return show_bounds; },
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
            type_check(idArg, 'string', {label:'Node.id', id:this.id});
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
              type_check(node, 'Display', {label:'Node.root', id:this.id, inherits:true});
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
              type_check(node, 'Node', {label:'Node.parent', id:this.id, inherits:true});
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
          get: function () { return children; }
        };
      }()),

      /**
       * @name transform
       * @return {Matrix}
       * @property
       */
      'transform': (function () {
        var transform = createMatrix(1, 0, 0, 1, 0, 0);
        return {
          enumerable: true,
          configurable: false,
          get: function () { return transform; },
          set: function (matrix) {
            /*DEBUG*/
            type_check(matrix, 'Matrix', {label:'Node.transform', id:this.id});
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
            type_check(isVisible, 'boolean', {label:'Node.visible', id:this.id});
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
            type_check(alphaArg, 'number', {label:'Node.alpha', id:this.id});
            range_check(window.isFinite(alphaArg), {label:'Node.alpha', id:this.id, message:"Parameter must be a finite number."});
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
          type_check(targetCoordSpace, 'Node', {label:'Node.getBounds', params:'targetCoordSpace', id:this.id, inherits:true});
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
          var rect = createRectangle(0, 0, 0, 0); //recycle
          return function (targetCoordSpace) {
            /*DEBUG*/
            type_check(targetCoordSpace, 'Node', {label:'Node.__getBounds', params:'targetCoordSpace', id:this.id, inherits:true});
            /*END_DEBUG*/
            var bounding_box = null,
                child_bounds,
                children = this.children,
                len = children.length;
          
            while (len--) {
              child_bounds = children[len].__getBounds(targetCoordSpace);
              
              if (child_bounds !== null) {
                if (bounding_box === null) {
                  bounding_box = rect.__compose(child_bounds);
                } else {
                  bounding_box.__union(child_bounds);
                }
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
      get: function () { return this.transform.tx; },
      set: function (n) {
        /*DEBUG*/
        type_check(n, 'number', {label:'Node.x', id:this.id});
        range_check(window.isFinite(n), {label:'Node.x', id:this.id, message:"Parameter must be a finite number."});
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
      get: function () { return this.transform.ty; },
      set: function (n) {
        /*DEBUG*/
        type_check(n, 'number', {label:'Node.y', id:this.id});
        range_check(window.isFinite(n), {label:'Node.y', id:this.id, message:"Parameter must be a finite number."});
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
        type_check(deg, 'number', {label:'Node.rotate', id:this.id, params:'degrees', message:"Parameter must be a number in degrees."});
        range_check(window.isFinite(deg), {label:'Node.rotate', id:this.id, message:"Parameter must be a finite number."});
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
      get: function () { return this.transform.rotation * 180 / PI; },
      set: function (deg) {
        /*DEBUG*/
        type_check(deg, 'number', {label:'Node.rotation', id:this.id, message:"Parameter must be a number in degrees."});
        range_check(window.isFinite(deg), {label:'Node.rotation', id:this.id, message:"Parameter must be a finite number."});
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
      get: function () { return this.transform.a; },
      set: function (sx) {
        /*DEBUG*/
        type_check(sx, 'number', {label:'Node.scaleX', id:this.id});
        range_check(window.isFinite(sx), {label:'Node.scaleX', id:this.id, message:"Parameter must be a finite number."});
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
      get: function () { return this.transform.d; },
      set: function (sy) {
        /*DEBUG*/
        type_check(sy, 'number', {label:'Node.scaleY', id:this.id});
        range_check(window.isFinite(sy), {label:'Node.scaleY', id:this.id, message:"Parameter must be a finite number."});
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
            type_check(node.context, 'context', {label:'Node.context', id:this.id});
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
        var transform = createMatrix(1, 0, 0, 1, 0, 0);
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
        type_check(node, 'Node', index, 'number', {label:'Node.addChildAt', params:['node', 'index'], inherits:true, id:this.id});
        range_check(index >= -children.length, index <= children.length, {label:'Node.addChildAt', params:['node', '*index*'], id:this.id, message:"Index out of range."});
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
        type_check(node,'Node', {label:'Node.addChild', id:this.id, params:'node', inherits:true});
        /*END_DEBUG*/
        //add to end of children array
        return this.addChildAt(node, this.children.length);
      }
    },

    /**
     * Adds this node to the given node's children.
     * @name appendTo
     * @return {Node}
     * @throws {TypeError}
     */
    'appendTo': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        type_check(node,'Node', {label:'Node.appendTo', id:this.id, params:'node', inherits:true});
        /*END_DEBUG*/
        return node.addChild(this);
      }
    },

    /**
     * @name createNode
     */
    'createNode': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return this.addChild(doodle.createNode.apply(undefined, arguments));
      }
    },

    /**
     * @name createSprite
     */
    'createSprite': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return this.addChild(doodle.createSprite.apply(undefined, arguments));
      }
    },

    /**
     * @name removeChildAt
     * @param {number} index
     * @return {Node} Removed child node.
     * @throws {TypeError}
     * @throws {RangeError}
     */
    'removeChildAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index) {
        /*DEBUG*/
        type_check(index,'number', {label:'Node.removeChildAt', id:this.id, params:'index'});
        range_check(index >= -this.children.length, index < this.children.length, {label:'Node.removeChildAt', params:'*index*', id:this.id, message:"Index out of range."});
        /*END_DEBUG*/
        var child = this.children.splice(index, 1)[0],    //unadopt
            child_descendants = create_scene_path(child), //includes child
            i = child_descendants.length,
            j = i;
        //event dispatching depends on an intact scene graph
        if (this.root) {
          while (i--) {
            child_descendants[i].dispatchEvent(evt_removedEvent.__setTarget(null));
          }
          while (j--) {
            child_descendants[j].root = null;
          }
        }
        //reset child and descendants
        child.parent = null;
        //reorder this display's scene path
        if (this.root) {
          this.root.__sortAllChildren();
        }
        return child;
      }
    },

    /**
     * @name removeChild
     * @param {Node} node
     * @return {Node} Removed child node.
     * @throws {TypeError}
     * @throws {ReferenceError}
     */
    'removeChild': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        type_check(node,'Node', {label:'Node.removeChild', id:this.id, params:'node', inherits:true});
        reference_check(node.parent === this, {label:'Node.removeChild', params:'*node*', id:this.id, message:"Can not remove a Node that is not a child."});
        console.assert(this.children.indexOf(node) !== -1, "Node found in children", node);
        /*END_DEBUG*/
        return this.removeChildAt(this.children.indexOf(node));
      }
    },

    /**
     * @name removeChildById
     * @param {string} id
     * @return {Node} Removed child node.
     * @throws {TypeError}
     */
    'removeChildById': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (id) {
        /*DEBUG*/
        type_check(id, 'string', {label:'Node.removeChildById', id:this.id, params:'id'});
        /*END_DEBUG*/
        return this.removeChild(this.getChildById(id));
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
        var children = this.children,
            display = this.root,
            child_descendants = create_scene_path(this, []),
            n = children.length,
            i, j;
        /*DEBUG*/
        console.assert(child_descendants[child_descendants.length-1] === this, "Last item in array is this Node.");
        /*END_DEBUG*/
        child_descendants.pop(); //remove this node
        i = j = child_descendants.length;
        
        //event dispatching depends on an intact scene graph
        if (display) {
          while (i--) {
            child_descendants[i].dispatchEvent(evt_removedEvent.__setTarget(null));
          }
        }
        //reset root of all descendants
        while (j--) {
          child_descendants[j].root = null;
        }
        //reset parent of children
        while (n--) {
          children[n].parent = null;
        }
        //un-adopt children
        children.length = 0;
        //reorder this display's scene path
        if (display) {
          display.__sortAllChildren();
        }
      }
    },

    /**
     * @name getChildById
     * @param {string} id
     * @return {Node|undefined}
     * @throws {TypeError}
     */
    'getChildById': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (id) {
        /*DEBUG*/
        type_check(id, 'string', {label:'Node.getChildById', params:'id', id:this.id});
        /*END_DEBUG*/
        var children = this.children,
            len = children.length,
            i = 0;
        for (; i < len; i++) {
          if (children[i].id === id) {
            return children[i];
          }
        }
        return undefined;
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
        var children = this.children,
            pos = children.indexOf(child);
        /*DEBUG*/
        window.debug_len = children.length;
        type_check(child,'Node', index,'number', {label:'Node.setChildIndex', params:['child', 'index'], id:this.id, inherits:true});
        range_check(index >= -children.length, index < children.length, {label:'Node.setChildIndex', params:['child', '*index*'], id:this.id, message:"Index out of range."});
        reference_check(child.parent === this, {label:'Node.setChildIndex', params:['*child*','index'], id:this.id, message:"Can not set the index of a Node that is not a child."});
        console.assert(pos !== -1, "Found child node, should be able to detect range with index.", this);
        /*END_DEBUG*/
        children.splice(pos, 1);          //remove child
        children.splice(index, 0, child); //place child at new position
        if (this.root) {
          //reorder this display's scene path
          this.root.__sortAllChildren();
        }
        /*DEBUG*/
        console.assert(window.debug_len === children.length, "Children array length is still the same.");
        delete window.debug_len;
        /*END_DEBUG*/
      }
    },

    /**
     * Swaps the child nodes at the two specified index positions in the child list.
     * @name swapChildrenAt
     * @param {number} index1
     * @param {number} index2
     * @throws {TypeError}
     * @throws {RangeError}
     */
    'swapChildrenAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index1, index2) {
        var children = this.children,
            temp_node;
        /*DEBUG*/
        window.debug_len = children.length;
        type_check(index1,'number', index2,'number', {label:'Node.swapChildrenAt', params:['index1', 'index2'], id:this.id});
        range_check(index1 >= -window.debug_len, index1 < window.debug_len, {label:'Node.setChildIndex', params:['*index1*', 'index2'], id:this.id, message:"Index out of range."});
        range_check(index2 >= -window.debug_len, index2 < window.debug_len, {label:'Node.setChildIndex', params:['index1', '*index2*'], id:this.id, message:"Index out of range."});
        //asserts
        console.assert(doodle.Node.isNode(children[index1]), "Child is a Node.", children[index1]);
        console.assert(doodle.Node.isNode(children[index2]), "Child is a Node.", children[index2]);
        console.assert(children[index1].parent === this, "Child's parent is this Node.", children[index1]);
        console.assert(children[index2].parent === this, "Child's parent is this Node.", children[index2]);
        /*END_DEBUG*/
        
        //need to get a little fancy so we can refer to negative indexes
        temp_node = children.splice(index1, 1, undefined)[0];
        children.splice(index1, 1, children.splice(index2, 1, undefined)[0]);
        children[children.indexOf(undefined)] = temp_node;
        
        if (this.root) {
          //reorder this display's scene path
          this.root.__sortAllChildren();
        }
        /*DEBUG*/
        console.assert(window.debug_len === children.length, "Children array length is still the same.");
        delete window.debug_len;
        /*END_DEBUG*/
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
        var children = this.children;
        /*DEBUG*/
        window.debug_len = children.length;
        type_check(node1, 'Node', node2, 'Node', {label:'Node.swapChildren', id:this.id, params:['node1', 'node2'], inherits:true});
        reference_check(node1.parent === this, node2.parent === this, {label:'Node.swapChildren', params:['child1','child2'], id:this.id, message:"Can not swap a Node that is not a child."});
        /*END_DEBUG*/

        this.swapChildrenAt(children.indexOf(node1), children.indexOf(node2));
        
        /*DEBUG*/
        console.assert(window.debug_len === children.length, "Children array length is still the same.");
        delete window.debug_len;
        /*END_DEBUG*/
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
        type_check(node, 'Node', {label:'Node.swapDepths', params:'node', id:this.id, inherits:true});
        reference_check(parent !== null, node.parent === parent, {label:'Node.swapDepths', params:'*node*', id:this.id, message:"Can not swap positions with a Node that has a different parent."});
        //asserts
        console.assert(doodle.Node.isNode(parent), "parent is a Node", parent);
        window.debug_len = parent.children.length;
        /*END_DEBUG*/
        
        children = parent.children;
        parent.swapChildrenAt(children.indexOf(this), children.indexOf(node));
        
        /*DEBUG*/
        console.assert(window.debug_len === children.length, "Children array length is still the same.");
        delete window.debug_len;
        /*END_DEBUG*/
      }
    },

    /**
     * Swap positions with another node at a given index in the parents child list.
     * @name swapDepthAt
     * @param {number} index
     * @throws {TypeError}
     * @throws {RangeError}
     */
    'swapDepthAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index) {
        var parent = this.parent;
        /*DEBUG*/
        type_check(index, 'number', {label:'Node.swapDepthAt', params:'index', id:this.id});
        reference_check(parent !== null, {label:'Node.swapDepthAt', params:'*index*', id:this.id, message:"Node does not have a parent."});
        
        console.assert(doodle.Node.isNode(parent), "Node has parent Node.");
        window.debug_len = parent.children.length;
        range_check(index >= -window.debug_len, index < window.debug_len, {label:'Node.swapDepthAt', params:'*index1*', id:this.id, message:"Index out of range."});
        /*END_DEBUG*/

        parent.swapChildrenAt(parent.children.indexOf(this), index);

        /*DEBUG*/
        console.assert(window.debug_len === parent.children.length, "Children array length is still the same length.");
        delete window.debug_len;
        /*END_DEBUG*/
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
        type_check(node, 'Node', {label:'Node.contains', params:'node', id:this.id, inherits:true});
        /*END_DEBUG*/
        return (create_scene_path(this, []).indexOf(node) !== -1) ? true : false;
      }
    },

    /**
     * @name localToGlobal
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     */
    'localToGlobal': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Node.localToGlobal', params:'point', id:this.id});
        /*END_DEBUG*/
        var node = this.parent;
        //apply each transformation from this node up to root
        pt = this.transform.transformPoint(pt); //new point
        while (node) {
          /*DEBUG*/
          console.assert(doodle.Node.isNode(node), "node is a Node", node);
          /*END_DEBUG*/
          node.transform.__transformPoint(pt); //modify point
          node = node.parent;
        }
        return pt;
      }
    },

    /**
     * Same as localToGlobal, but modifies a point in place.
     * @name __localToGlobal
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     * @private
     */
    '__localToGlobal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Node.__localToGlobal', params:'point', id:this.id});
        /*END_DEBUG*/
        var node = this;
        //apply each transformation from this node up to root
        while (node) {
          /*DEBUG*/
          console.assert(doodle.Node.isNode(node), "node is a Node", node);
          /*END_DEBUG*/
          node.transform.__transformPoint(pt); //modify point
          node = node.parent;
        }
        return pt;
      }
    },

    /**
     * @name globalToLocal
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     */
    'globalToLocal': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Node.globalToLocal', id:this.id, params:'point'});
        /*END_DEBUG*/
        var global_pt = {x:0, y:0};
        this.__localToGlobal(global_pt);
        return createPoint(pt.x - global_pt.x, pt.y - global_pt.y);
      }
    },

    /**
     * Same as globalToLocal, but modifies a point in place.
     * @name __globalToLocal
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     * @private
     */
    '__globalToLocal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Node.__globalToLocal', id:this.id, params:'point'});
        /*END_DEBUG*/
        var global_pt = {x:0, y:0}; //use temp point instead?
        this.__localToGlobal(global_pt);
        pt.x = pt.x - global_pt.x;
        pt.y = pt.y - global_pt.y;
        return pt;
      }
    }
  };//end node_static_properties
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object inherits from Node.
 * @name isNode
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.Node.isNode = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toString() === '[object Node]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
