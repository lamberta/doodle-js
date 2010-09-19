/*globals doodle*/

(function () {
  var sprite_static_properties,
      isSprite,
      inheritsSprite,
      check_sprite_type,
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      rgb_str_to_hex = doodle.utils.rgb_str_to_hex,
      /*DEBUG*/
      check_number_type = doodle.utils.types.check_number_type,
      check_function_type = doodle.utils.types.check_function_type,
      check_point_type = doodle.utils.types.check_point_type,
      check_rect_type = doodle.utils.types.check_rect_type,
      check_context_type = doodle.utils.types.check_context_type,
      /*END_DEBUG*/
      inheritsNode = doodle.Node.inheritsNode,
      doodle_Rectangle = doodle.geom.Rectangle;

  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
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
        /* The graphics object contains drawing operations to be stored in draw_commands.
         * Objects and Arrays are passed by reference, so these will be modified
         */
        'graphics': {
          enumerable: false,
          configurable: false,
          value:  Object.create(doodle.Graphics(sprite, draw_commands, extrema))
        },
        
        /*
         * PROPERTIES
         */

        /* Indicates the width of the sprite, in pixels.
         * @param {Number}
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

        /* Indicates the height of the sprite, in pixels.
         * @param {Number}
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

        /*
         * @param {Node} targetCoordSpace
         * @return {Rectangle}
         */
        'getBounds': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (targetCoordSpace) {
            /*DEBUG*/
            if (!inheritsNode(targetCoordSpace)) {
              throw new TypeError(this+'.getBounds(*targetCoordinateSpace*): Parameter must inherit from doodle.Node.');
            }
            /*END_DEBUG*/
            var children = this.children,
                len = children.length,
                bounding_box = doodle_Rectangle(),
                child_bounds,
                w = this.width,
                h = this.height,
                min = Math.min,
                max = Math.max,
                //transform corners to global
                tl = this.localToGlobal({x: extrema.min_x, y: extrema.min_y}), //top left
                tr = this.localToGlobal({x: extrema.min_x+w, y: extrema.min_y}), //top right
                br = this.localToGlobal({x: extrema.min_x+w, y: extrema.min_y+h}), //bot right
                bl = this.localToGlobal({x: extrema.min_x, y: extrema.min_y+h}); //bot left
            
            //transform global to target space
            tl = targetCoordSpace.globalToLocal(tl);
            tr = targetCoordSpace.globalToLocal(tr);
            br = targetCoordSpace.globalToLocal(br);
            bl = targetCoordSpace.globalToLocal(bl);

            //set rect with extremas
            bounding_box.left = min(tl.x, tr.x, br.x, bl.x);
            bounding_box.right = max(tl.x, tr.x, br.x, bl.x);
            bounding_box.top = min(tl.y, tr.y, br.y, bl.y);
            bounding_box.bottom = max(tl.y, tr.y, br.y, bl.y);

            //add child bounds to this
            while (len--) {
              child_bounds = children[len].getBounds(targetCoordSpace);
              if (child_bounds !== null) {
                bounding_box = bounding_box.union(child_bounds);
              }
            }
            
            return bounding_box;
          }
        },
        
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
              /*DEBUG*/
              if (rect !== null) {
                check_rect_type(rect, this+'.hitArea');
              }
              /*END_DEBUG*/
              hit_area = rect;
            }
          };
        }()),

        'hitTestObject': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (obj) {
            /*DEBUG*/
            check_sprite_type(obj, this+'.hitTestObject', '*sprite*');
            /*END_DEBUG*/
            return this.getBounds(this).intersects(obj.getBounds(this));
          }
        },

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

        //drawing context to use
        'context': {
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
         * METHODS
         */

        /* When called execute all the draw commands in the stack.
         * This draws from screen 0,0 - transforms are applied when the
         * entire scene graph is drawn.
         * @private
         * @param {Context} ctx 2d canvas context to draw on.
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
        },

        /* Debug
         */
        'debug': {
          enumerable: true,
          configurable: false,
          value: Object.create(null, {
            'boundingBox': (function () {
              var debug_boundingBox = "rgb(0,0,255)";
              return {
                enumerable: true,
                configurable: false,
                get: function () {
                  return rgb_str_to_hex(debug_boundingBox);
                },
                set: function (color) {
                  /*DEBUG*/
                  if (typeof color === 'number') {
                    color = hex_to_rgb_str(color);
                  } else if (typeof color === 'string' && color[0] === '#') {
                    color = hex_to_rgb_str(color);
                  }
                  /*END_DEBUG*/
                  debug_boundingBox = color;
                }
              };
            }())
          })
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

    /*
     * METHODS
     */

    /* Returns the string representation of the specified object.
     * @param {String}
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Sprite]";
      }
    },

    /* Updates the position and size of this sprite.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @return {Sprite}
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
  
  isSprite = doodle.Sprite.isSprite = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object Sprite]');
  };

  /* Check if object inherits from Sprite.
   * @param {Object} obj
   * @return {Boolean}
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

  check_sprite_type = doodle.utils.types.check_sprite_type = function (sprite, caller, param) {
    if (inheritsSprite(sprite)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_sprite_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must inherit from Sprite.");
    }
  };
  
}());//end class closure
