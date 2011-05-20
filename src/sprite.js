/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
(function () {
  var sprite_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      /*END_DEBUG*/
      createRectangle = doodle.geom.createRectangle;

  /**
   * An node to display.
   * @name doodle.createSprite
   * @class
   * @augments doodle.Node
   * @param {string=} id Name or initialization function.
   * @return {doodle.Sprite} A sprite object.
   * @throws {SyntaxError} Invalid parameters.
   */
  doodle.Sprite = doodle.createSprite = function createSprite (id) {
    //only pass id if string, an init function will be called later
    var sprite = Object.create(doodle.createNode((typeof id === 'string') ? id : undefined));

    /*DEBUG*/
    if (arguments.length > 1) {
      throw new SyntaxError("[object Sprite](id): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(sprite, sprite_static_properties);
    //properties that require privacy
    Object.defineProperties(sprite, (function () {
      var draw_commands = [];
      
      return {
        /**
         * The graphics object contains drawing operations to be stored in draw_commands.
         * Objects and Arrays are passed by reference, so these will be modified
         * @name graphics
         * @return {Graphics}
         * @property
         */
        'graphics': {
          enumerable: false,
          configurable: false,
          value:  Object.create(doodle.createGraphics.call(sprite, draw_commands))
        },

        /**
         * Indicates the width of the sprite, in pixels.
         * @name width
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'width': (function () {
          var width = 0;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return width; },
            set: function (n) {
              /*DEBUG*/
              type_check(n, 'number', {label:'Sprite.width', id:this.id});
              range_check(window.isFinite(n), {label:'Sprite.width', id:this.id, message:"Parameter must be a finite number."});
              /*END_DEBUG*/
              width = n;
            }
          };
        }()),

        /**
         * Indicates the height of the sprite, in pixels.
         * @name height
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'height': (function () {
          var height = 0;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return height; },
            set: function (n) {
              /*DEBUG*/
              type_check(n, 'number', {label:'Sprite.height', id:this.id});
              range_check(window.isFinite(n), {label:'Sprite.height', id:this.id, message:"Parameter must be a finite number."});
              /*END_DEBUG*/
              height = n;
            }
          };
        }()),

        /**
         * @name getBounds
         * @param {Node} targetCoordSpace
         * @return {Rectangle}
         * @throws {TypeError}
         * @override
         */
        'getBounds': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (targetCoordSpace) {
            /*DEBUG*/
            type_check(targetCoordSpace, 'Node', {label:'Sprite.getBounds', id:this.id, params:'targetCoordSpace', inherits:true});
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
              type_check(targetCoordSpace, 'Node', {label:'Sprite.__getBounds', id:this.id, params:'targetCoordSpace', inherits:true});
              /*END_DEBUG*/
              var children = this.children,
                  len = children.length,
                  bounding_box = rect,
                  child_bounds,
                  w = this.width,
                  h = this.height,
                  //extrema points
                  graphics = this.graphics,
                  tl = {x: graphics.__minX, y: graphics.__minY},
                  tr = {x: graphics.__minX+w, y: graphics.__minY},
                  br = {x: graphics.__minX+w, y: graphics.__minY+h},
                  bl = {x: graphics.__minX, y: graphics.__minY+h},
                  min = Math.min,
                  max = Math.max;
              
              //transform corners to global
              this.__localToGlobal(tl); //top left
              this.__localToGlobal(tr); //top right
              this.__localToGlobal(br); //bot right
              this.__localToGlobal(bl); //bot left
              //transform global to target space
              targetCoordSpace.__globalToLocal(tl);
              targetCoordSpace.__globalToLocal(tr);
              targetCoordSpace.__globalToLocal(br);
              targetCoordSpace.__globalToLocal(bl);

              //set rect with extremas
              bounding_box.left = min(tl.x, tr.x, br.x, bl.x);
              bounding_box.right = max(tl.x, tr.x, br.x, bl.x);
              bounding_box.top = min(tl.y, tr.y, br.y, bl.y);
              bounding_box.bottom = max(tl.y, tr.y, br.y, bl.y);

              //add child bounds to this
              while (len--) {
                child_bounds = children[len].__getBounds(targetCoordSpace);
                
                if (child_bounds !== null) {
                  bounding_box.__union(child_bounds);
                }
              }
              return bounding_box;
            };
          }())
        },

        /** not ready
        'hitArea': (function () {
          var hit_area = null;
          return {
            enumerable: true,
            configurable: false,
            get: function () {
              if (hit_area === null) {
                return this.getBounds(this);
              } else {
                return hit_area;
              }
            },
            set: function (rect) {
              //accepts null/false or rectangle area for now
              rect = (rect === false) ? null : rect;
              if (rect !== null) {
                check_rect_type(rect, this+'.hitArea');
              }
              hit_area = rect;
            }
          };
        }()),
        **/

        /**
         * @name hitTestObject
         * @param {Node} node
         * @return {boolean}
         * @throws {TypeError}
         */
        'hitTestObject': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (node) {
            /*DEBUG*/
            type_check(node, 'Node', {label:'Sprite.hitTestObject', id:this.id, params:'node', inherits:true});
            /*END_DEBUG*/
            return this.getBounds(this).intersects(node.getBounds(this));
          }
        },

        /**
         * @name hitTestPoint
         * @param {number} x
         * @param {number} y
         * @return {boolean}
         * @throws {TypeError}
         */
        'hitTestPoint': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (x, y) {
            /*DEBUG*/
            type_check(x,'number', y,'number', {label:'Sprite.hitTestPoint', id:this.id, params:'x,y'});
            /*END_DEBUG*/
            return this.getBounds(this).containsPoint(this.globalToLocal({x: x, y: y}));
          }
        },

        /* When called execute all the draw commands in the stack.
         * This draws from screen 0,0 - transforms are applied when the
         * entire scene graph is drawn.
         * @name __draw
         * @param {Context} ctx 2d canvas context to draw on.
         * @private
         */
        '__draw': {
          enumerable: false,
          writable: false,
          configurable: false,
          value: function (ctx) {
            var i = 0,
                len = draw_commands.length;
            /*DEBUG*/
            type_check(ctx, 'context', {label:'Sprite.__draw', id:this.id, params:'context'});
            /*END_DEBUG*/
            for (; i < len; i++) {
              /*DEBUG*/
              console.assert(typeof draw_commands[i] === 'function', "draw command is a function", draw_commands[i]);
              /*END_DEBUG*/
              draw_commands[i].call(sprite, ctx);
            }
          }
        }
      };
    }()));//end defineProperties

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      arguments[0].call(sprite);
    }
    
    return sprite;
  };

  
  sprite_static_properties = {
    /**
     * @name rotation
     * @return {number}
     * @throws {TypeError}
     * @property
     */
    'rotation': (function () {
      var to_degrees = 180 / Math.PI,
          to_radians = Math.PI / 180;
      return {
        enumerable: true,
        configurable: false,
        get: function () { return this.transform.rotation * to_degrees; },
        set: function (deg) {
          /*DEBUG*/
          type_check(deg, 'number', {label:'Sprite.rotation', id:this.id, message:"Property must be a number specified in degrees."});
          range_check(window.isFinite(deg), {label:'Sprite.rotation', id:this.id, message:"Parameter must be a finite number."});
          /*END_DEBUG*/
          this.transform.rotation = deg * to_radians;
        }
      };
    }()),

    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () { return "[object Sprite]"; }
    },

    /**
     * Updates the position and size of this sprite.
     * @name compose
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @return {Sprite}
     * @throws {TypeError}
     */
    'compose': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (x, y, w, h) {
        /*DEBUG*/
        type_check(x, 'number', y, 'number', w, 'number', h, 'number', {label:'Sprite.compose', id:this.id, params:['x', 'y', 'width', 'height']});
        range_check(window.isFinite(x), window.isFinite(y), window.isFinite(w), window.isFinite(h), {label:'Sprite.compose', id:this.id, message:"Parameters must all be finite numbers."});
        /*END_DEBUG*/
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        return this;
      }
    }
  };//end sprite_static_properties
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a Sprite or inherits from one.
 * @name isSprite
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.Sprite.isSprite = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toLocaleString() === '[object Sprite]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
