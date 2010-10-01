/*globals doodle*/

(function () {
  var sprite_static_properties,
      isSprite,
      inheritsSprite,
      /*DEBUG*/
      check_sprite_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_function_type = doodle.utils.types.check_function_type,
      check_point_type = doodle.utils.types.check_point_type,
      check_node_type = doodle.utils.types.check_node_type,
      check_context_type = doodle.utils.types.check_context_type,
      /*END_DEBUG*/
      //lookup help
      doodle_Rectangle = doodle.geom.Rectangle;

  /**
	 * An node to display.
   * @class Sprite
	 * @extends Node
   * @param {String|Function} id|initializer Name or initialization function.
   * @return {Sprite} A sprite object.
	 * @throws {SyntaxError} Invalid parameters.
   */
  doodle.Sprite = function (id) {
    //only pass id if string, an init function will be called later
    var sprite = Object.create(doodle.Node((typeof id === 'string') ? id : undefined));

    /*DEBUG*/
    if (arguments.length > 1) {
      throw new SyntaxError("[object Sprite](id): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(sprite, sprite_static_properties);
    //properties that require privacy
    Object.defineProperties(sprite, (function () {
      var draw_commands = [],
          extrema = {min_x:0, max_x:0, min_y:0, max_y:0};
      
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
          value:  Object.create(doodle.Graphics.call(sprite, draw_commands, extrema))
        },

        /**
         * Indicates the width of the sprite, in pixels.
         * @name width
         * @return {Number}
         * @throws {TypeError}
         * @property
         */
        'width': (function () {
          var width = 0;
          return {
            enumerable: true,
            configurable: false,
            get: function () {
              return width;
            },
            set: function (n) {
              /*DEBUG*/
              check_number_type(n, this+'.width');
              /*END_DEBUG*/
              width = n;
            }
          };
        }()),

        /**
         * Indicates the height of the sprite, in pixels.
         * @name height
         * @return {Number}
         * @throws {TypeError}
         * @property
         */
        'height': (function () {
          var height = 0;
          return {
            enumerable: true,
            configurable: false,
            get: function () {
              return height;
            },
            set: function (n) {
              /*DEBUG*/
              check_number_type(n, this+'.height');
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
            var rect = doodle_Rectangle(); //recycle
            
            return function (targetCoordSpace) {
              /*DEBUG*/
              check_node_type(targetCoordSpace, this+'.__getBounds', '*targetCoordSpace*');
              /*END_DEBUG*/
              var children = this.children,
                  len = children.length,
                  bounding_box = rect,
                  child_bounds,
                  w = this.width,
                  h = this.height,
                  min = Math.min,
                  max = Math.max,
                  tl = {x: extrema.min_x, y: extrema.min_y},
                  tr = {x: extrema.min_x+w, y: extrema.min_y},
                  br = {x: extrema.min_x+w, y: extrema.min_y+h},
                  bl = {x: extrema.min_x, y: extrema.min_y+h};
              
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
         * @return {Boolean}
         * @throws {TypeError}
         */
        'hitTestObject': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (node) {
            /*DEBUG*/
            check_node_type(node, this+'.hitTestObject', '*sprite*');
            /*END_DEBUG*/
            return this.getBounds(this).intersects(node.getBounds(this));
          }
        },

        /**
         * @name hitTestPoint
				 * @param {Point} pt
         * @return {Boolean}
         * @throws {TypeError}
         */
        'hitTestPoint': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (pt) {
            /*DEBUG*/
            check_point_type(pt, this+'.hitTestPoint', '*point*');
            /*END_DEBUG*/
            return this.getBounds(this).containsPoint(this.globalToLocal(pt));
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
            /*DEBUG*/
            check_context_type(ctx, this+'.__draw', '*context*');
            /*END_DEBUG*/
            draw_commands.forEach(function (cmd) {
              /*DEBUG*/
              check_function_type(cmd, sprite+'.__draw: [draw_commands]::', '*command*');
              /*END_DEBUG*/
              cmd.call(sprite, ctx);
            });
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
     * @return {Number}
     * @throws {TypeError}
     * @property
     */
    'rotation': (function () {
      var to_degrees = 180 / Math.PI,
          to_radians = Math.PI / 180;
      return {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.transform.rotation * to_degrees;
        },
        set: function (deg) {
          /*DEBUG*/
          check_number_type(deg, this+'.rotation', '*degrees*');
          /*END_DEBUG*/
          this.transform.rotation = deg * to_radians;
        }
      };
    }()),

    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {String}
     * @override
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Sprite]";
      }
    },

    /**
     * Updates the position and size of this sprite.
     * @name compose
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @return {Sprite}
     * @throws {TypeError}
     */
    'compose': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (x, y, width, height) {
        /*DEBUG*/
        check_number_type(x, this+'.compose', '*x*, y, width, height');
        check_number_type(y, this+'.compose', 'x, *y*, width, height');
        check_number_type(width, this+'.compose', 'x, y, *width*, height');
        check_number_type(height, this+'.compose', 'x, y, width, *height*');
        /*END_DEBUG*/
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
      }
    }
  };//end sprite_static_properties
  
  
  /*
   * CLASS METHODS
   */

  /**
   * @name isSprite
   * @param {Object} obj
   * @return {Boolean}
   * @static
   */
  isSprite = doodle.Sprite.isSprite = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object Sprite]');
  };

  /**
   * Check if object inherits from Sprite.
   * If it doesn't return false.
   * @name inheritsSprite
   * @param {Object} obj
   * @return {Boolean}
   * @static
   */
  inheritsSprite = doodle.Sprite.inheritsSprite = function (obj) {
    while (obj) {
      if (isSprite(obj)) {
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
   * @name check_sprite_type
   * @param {Sprite} sprite
   * @param {String} caller
   * @param {String} params
   * @return {Boolean}
   * @throws {TypeError}
   * @memberOf utils.types
   * @static
   */
  check_sprite_type = doodle.utils.types.check_sprite_type = function (sprite, caller, params) {
    if (inheritsSprite(sprite)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_sprite_type" : caller;
      params = (params === undefined) ? "" : '('+params+')';
      throw new TypeError(caller + params +": Parameter must inherit from Sprite.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
