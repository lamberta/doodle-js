/*not implemented
  id: null,
  //node has matrix - x,y
  showBoundingBox: null,

  clickable: false,
  useHandCursor: false, //on mouse over
  hitArea: null, //if null use this, otherwise use another sprite
  hitTestPoint: null, //point intersects with obj bounds
  hitTestObject: null, //another object intersects with obj bounds
*/

(function () {

  var sprite_properties,
      bounds_properties,
      isSprite,
      inheritsSprite,
      check_sprite_type,
      hex_to_rgb = doodle.utils.hex_to_rgb,
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      rgb_str_to_hex = doodle.utils.rgb_str_to_hex,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_function_type = doodle.utils.types.check_function_type,
      check_array_type = doodle.utils.types.check_array_type,
      isMatrix = doodle.geom.Matrix.isMatrix,
      check_matrix_type = doodle.utils.types.check_matrix_type,
      check_point_type = doodle.utils.types.check_point_type,
      check_rect_type = doodle.utils.types.check_rect_type,
      check_context_type = doodle.utils.types.check_context_type,
      inheritsNode = doodle.Node.inheritsNode,
      get_element = doodle.utils.get_element,
      Rectangle = doodle.geom.Rectangle;


  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Sprite = function (id) {
    var arg_len = arguments.length,
        initializer,
        sprite,
        draw_commands = [],
        bounds_min_x = 0, //offsets used in getBounds and graphics shapes
        bounds_min_y = 0,
        bounds_max_x = 0,
        bounds_max_y = 0,
        graphics_cursor_x = 0,
        graphics_cursor_y = 0;

    /**for testing**/
    dc_check = draw_commands;
    
    //inherits from doodle.Node, if string pass along id
    sprite = (typeof id === 'string') ?
      Object.create(doodle.Node(id)) : Object.create(doodle.Node());

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
      id = undefined;
    } else if (arg_len > 1) {
      throw new SyntaxError("[object Sprite]: Invalid number of parameters.");
    }

    Object.defineProperties(sprite, sprite_properties);
    //properties that require privacy
    Object.defineProperties(sprite, {
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
       * @param {Node|Matrix} targetCoordSpace
       * @return {Rectangle}
       */
      'getBounds': {
        enumerable: true,
        writable: true,
        configurable: false,
        value: function (targetCoordSpace) {
          /*DEBUG*/
          if (!inheritsNode(targetCoordSpace)) {
            throw new TypeError(this+'.getBounds(targetCoordinateSpace): Parameter must inherit from doodle.Node.');
          }
          /*END_DEBUG*/
          var bounding_box = Rectangle(),
              w = this.width,
              h = this.height,
              //transform corners to global
              tl = this.localToGlobal({x: bounds_min_x, y: bounds_min_y}), //top left
              tr = this.localToGlobal({x: bounds_min_x+w, y: bounds_min_y}), //top right
              br = this.localToGlobal({x: bounds_min_x+w, y: bounds_min_y+h}), //bot right
              bl = this.localToGlobal({x: bounds_min_x, y: bounds_min_y+h}); //bot left
          
          //transform global to target space
          tl = targetCoordSpace.globalToLocal(tl);
          tr = targetCoordSpace.globalToLocal(tr);
          br = targetCoordSpace.globalToLocal(br);
          bl = targetCoordSpace.globalToLocal(bl);

          //set rect with extremas
          bounding_box.left = Math.min(tl.x, tr.x, br.x, bl.x);
          bounding_box.right = Math.max(tl.x, tr.x, br.x, bl.x);
          bounding_box.top = Math.min(tl.y, tr.y, br.y, bl.y);
          bounding_box.bottom = Math.max(tl.y, tr.y, br.y, bl.y);

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
          var node = this.parent,
              ctx;
          while (node) {
            if (node.context) {
              ctx = node.context;
              check_context_type(ctx, this+'.context (traversal)');
              return ctx;
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
            var debug_boundingBox = "rgb(0, 0, 255)";
            return {
              enumerable: true,
              configurable: false,
              get: function () {
                return rgb_str_to_hex(debug_boundingBox);
              },
              set: function (color) {
                debug_boundingBox = hex_to_rgb_str(color);
              }
            };
          }())
        })
      },

      /*
       * GRAPHICS
       */
      'graphics': {
        value: Object.create(null, {
          /*
           * METHODS
           */

          /* Provide direct access to the canvas drawing api.
           * Canvas context is called as the first argument to function.
           * Unable to set bounds from a user supplied function unless explictly set.
           * @param {Function} fn
           * Ex:
           * x = Object.create(doodle.sprite);
           * x.graphics.draw(function (ctx) {
           *   ctx.fillStyle = "#ff0000";
           *   ctx.fillRect(this.x, this.y, 100, 100);
           * });
           * x.draw();
           */
          'draw': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (fn) {
              /*DEBUG*/
              check_function_type(fn, this+'.graphics.draw', '*function*');
              /*END_DEBUG*/
              draw_commands.push(fn);
            }).bind(sprite)
          },

          /* Remove all drawing commands for sprite.
           */
          'clear': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function () {
              //should probably test, better to assign new empty array?
              var i = draw_commands.length;
              while ((i=i-1) >= 0) {
                draw_commands.splice(i, 1);
              }
              //reset dimensions
              this.width = 0;
              this.height = 0;

              bounds_min_x = bounds_min_y = bounds_max_x = bounds_max_y = 0;
              graphics_cursor_x = graphics_cursor_y = 0;
              
            }).bind(sprite)
          },

          /*
           * @param {Number} x
           * @param {Number} y
           * @param {Number} w
           * @param {Number} h
           */
          'rect': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y, width, height) {
              /*DEBUG*/
              check_number_type(x, this+'.graphics.rect', '*x*, y, width, height');
              check_number_type(y, this+'.graphics.rect', 'x, *y*, width, height');
              check_number_type(width, this+'.graphics.rect', 'x, y, *width*, height');
              check_number_type(height, this+'.graphics.rect', 'x, y, width, *height*');
              /*END_DEBUG*/

              //update extremas
              bounds_min_x = Math.min(0, x, bounds_min_x);
              bounds_min_y = Math.min(0, y, bounds_min_y);
              bounds_max_x = Math.max(0, x, x+width, bounds_max_x);
              bounds_max_y = Math.max(0, y, y+height, bounds_max_y);
              
              //update size for bounding box
              this.width = -bounds_min_x + bounds_max_x;
              this.height = -bounds_min_y + bounds_max_y;
              
              draw_commands.push(function (ctx) {
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                ctx.closePath();
                ctx.stroke();
              });
              
            }).bind(sprite)
          },

          /*
           * @param {Number} x The x location of the center of the circle relative to the registration point of the parent display object (in pixels).
           * @param {Number} y The y location of the center of the circle relative to the registration point of the parent display object (in pixels).
           * @param {Number} radius
           */
          'circle': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y, radius) {
              /*DEBUG*/
              check_number_type(x, this+'.graphics.circle', '*x*, y, radius');
              check_number_type(y, this+'.graphics.circle', 'x, *y*, radius');
              check_number_type(radius, this+'.graphics.circle', 'x, y, *radius*');
              /*END_DEBUG*/

              //update extremas
              bounds_min_x = Math.min(0, -radius+x, bounds_min_x);
              bounds_min_y = Math.min(0, -radius+y, bounds_min_y);
              bounds_max_x = Math.max(0, x, x+radius, bounds_max_x);
              bounds_max_y = Math.max(0, y, y+radius, bounds_max_y);
              
              //update size for bounding box
              this.width = -bounds_min_x + bounds_max_x;
              this.height = -bounds_min_y + bounds_max_y;

              draw_commands.push(function (ctx) {
                ctx.beginPath();
                //x, y, radius, start_angle, end_angle (Math.PI*2), anti-clockwise
                ctx.arc(x, y, radius, 0, 6.283185307179586, true);
                ctx.closePath();
                ctx.stroke();
              });
              
            }).bind(sprite)
          },

          /*
           * @param {Number} x
           * @param {Number} y
           * @param {Number} width
           * @param {Number} height
           */
          'ellipse': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y, width, height) {
              height = (height === undefined) ? width : height; //default to circle
              /*DEBUG*/
              check_number_type(x, this+'.graphics.ellipse', '*x*, y, width, height');
              check_number_type(y, this+'.graphics.ellipse', 'x, *y*, width, height');
              check_number_type(width, this+'.graphics.ellipse', 'x, y, *width*, height');
              check_number_type(height, this+'.graphics.ellipse', 'x, y, width, *height*');
              /*END_DEBUG*/
              var rx = width / 2,
                  ry = height / 2,
                  krx = 0.5522847498 * rx, //kappa * radius_x
                  kry = 0.5522847498 * ry;

              //update extremas
              bounds_min_x = Math.min(0, -rx+x, bounds_min_x);
              bounds_min_y = Math.min(0, -ry+y, bounds_min_y);
              bounds_max_x = Math.max(0, x, x+rx, bounds_max_x);
              bounds_max_y = Math.max(0, y, y+ry, bounds_max_y);
              
              //update size for bounding box
              this.width = -bounds_min_x + bounds_max_x;
              this.height = -bounds_min_y + bounds_max_y;

              draw_commands.push(function (ctx) {
                ctx.beginPath();
                ctx.moveTo(x+rx, y);
                //(cp1), (cp2), (pt)
                ctx.bezierCurveTo(x+rx, y-kry, x+krx, y-ry, x, y-ry);
                ctx.bezierCurveTo(x-krx, y-ry, x-rx, y-kry, x-rx, y);
                ctx.bezierCurveTo(x-rx, y+kry, x-krx, y+ry, x, y+ry);
                ctx.bezierCurveTo(x+krx, y+ry, x+rx, y+kry, x+rx, y);
                ctx.closePath();
                ctx.stroke();
              });
              
            }).bind(sprite)
          },

          /*
           * @param {Number} x
           * @param {Number} y
           * @param {Number} width
           * @param {Number} height
           * @param {Number} rx
           * @param {Number} ry
           */
          'roundRect': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y, width, height, rx, ry) {
              rx = (rx === undefined) ? 0 : rx; //default to rectangle
              ry = (ry === undefined) ? 0 : ry;
              /*DEBUG*/
              check_number_type(x, this+'.graphics.roundRect', '*x*, y, width, height, rx, ry');
              check_number_type(y, this+'.graphics.roundRect', 'x, *y*, width, height, rx, ry');
              check_number_type(width, this+'.graphics.roundRect', 'x, y, *width*, height, rx, ry');
              check_number_type(height, this+'.graphics.roundRect', 'x, y, width, *height*, rx, ry');
              check_number_type(rx, this+'.graphics.roundRect', 'x, y, width, height, *rx*, ry');
              check_number_type(ry, this+'.graphics.roundRect', 'x, y, width, height, rx, *ry*');
              /*END_DEBUG*/
              var x3 = x + width,
                  x2 = x3 - rx,
                  x1 = x + rx,
                  y3 = y + height,
                  y2 = y3 - ry,
                  y1 = y + ry;

              //update extremas
              bounds_min_x = Math.min(0, x, bounds_min_x);
              bounds_min_y = Math.min(0, y, bounds_min_y);
              bounds_max_x = Math.max(0, x, x+width, bounds_max_x);
              bounds_max_y = Math.max(0, y, y+height, bounds_max_y);
              
              //update size for bounding box
              this.width = -bounds_min_x + bounds_max_x;
              this.height = -bounds_min_y + bounds_max_y;

              draw_commands.push(function (ctx) {
                ctx.beginPath();
                //clockwise
                ctx.moveTo(x1, y);
                ctx.beginPath();
                ctx.lineTo(x2, y);
                ctx.quadraticCurveTo(x3, y, x3, y1);
                ctx.lineTo(x3, y2);
                ctx.quadraticCurveTo(x3, y3, x2, y3);
                ctx.lineTo(x1, y3);
                ctx.quadraticCurveTo(x, y3, x, y2);
                ctx.lineTo(x, y1);
                ctx.quadraticCurveTo(x, y, x1, y);
                ctx.closePath();
                ctx.stroke();
              });
              
            }).bind(sprite)
          },

          /*
           * @param {Number} x
           * @param {Number} y
           */
          'moveTo': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y) {
              /*DEBUG*/
              check_number_type(x, this+'.graphics.moveTo', '*x*, y');
              check_number_type(y, this+'.graphics.moveTo', 'x, *y*');
              /*END_DEBUG*/
              draw_commands.push(function (ctx) {
                ctx.moveTo(x, y);
              });
              //update cursor
              graphics_cursor_x = x;
              graphics_cursor_y = y;
              
            }).bind(sprite)
          },

          /*
           * @param {Number} x
           * @param {Number} y
           */
          'lineTo': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y) {
              /*DEBUG*/
              check_number_type(x, this+'.graphics.lineTo', '*x*, y');
              check_number_type(y, this+'.graphics.lineTo', 'x, *y*');
              /*END_DEBUG*/

              //update extremas
              bounds_min_x = Math.min(0, x, graphics_cursor_x, bounds_min_x);
              bounds_min_y = Math.min(0, y, graphics_cursor_y, bounds_min_y);
              bounds_max_x = Math.max(0, x, graphics_cursor_x, bounds_max_x);
              bounds_max_y = Math.max(0, y, graphics_cursor_y, bounds_max_y);
              
              //update size for bounding box
              this.width = bounds_max_x - bounds_min_x;
              this.height = bounds_max_y - bounds_min_y;
              
              draw_commands.push(function (ctx) {
                ctx.lineTo(x, y);
              });

              //update cursor
              graphics_cursor_x = x;
              graphics_cursor_y = y;
              
            }).bind(sprite)
          },

          /* Quadratic curve to point.
           * @param {Point} pt1 Control point
           * @param {Point} pt2 End point
           */
          'curveTo': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (pt1, pt2) {
              /*DEBUG*/
              check_point_type(pt1, this+'.graphics.curveTo', '*ctl_point*, point');
              check_point_type(pt2, this+'.graphics.curveTo', 'ctl_point, *point*');
              /*END_DEBUG*/
              var x0 = graphics_cursor_x,
                  y0 = graphics_cursor_y,
                  x1 = pt1.x,
                  y1 = pt1.y,
                  x2 = pt2.x,
                  y2 = pt2.y,
                  t,
                  cx = 0,
                  cy = 0;
              
              //curve ratio of extrema
              t = (x0 - x1) / (x0 - 2 * x1 + x2);
              //if true, store extrema position
              if (0 <= t && t <= 1) {
                cx = (1-t) * (1-t) * x0 + 2 * (1-t) * t * x1 + t * t * x2;
              }

              t = (y0 - y1) / (y0 - 2 * y1 + y2);
              if (0 <= t && t <= 1) {
                cy = (1-t) * (1-t) * y0 + 2 * (1-t) * t * y1 + t * t * y2;
              }
              
              //update extremas
              bounds_min_x = Math.min(0, x0, cx, x2, bounds_min_x);
              bounds_min_y = Math.min(0, y0, cy, y2, bounds_min_y);
              bounds_max_x = Math.max(0, x0, cx, x2, bounds_max_x);
              bounds_max_y = Math.max(0, y0, cy, y2, bounds_max_y);
              
              //update size for bounding box
              this.width = -bounds_min_x + bounds_max_x;
              this.height = -bounds_min_y + bounds_max_y;

              draw_commands.push(function (ctx) {
                ctx.quadraticCurveTo(x1, y1, x2, y2);
              });

              //update cursor
              graphics_cursor_x = x2;
              graphics_cursor_y = y2;
              
            }).bind(sprite)
          },

          /* Bezier curve to point.
           * @param {Point} pt1 Control point 1
           * @param {Point} pt2 Control point 2
           * @param {Point} pt3 End point
           */
          'bezierCurveTo': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (pt1, pt2, pt3) {
              /*DEBUG*/
              check_point_type(pt1, this+'.graphics.bezierCurveTo', '*ctl_point1*, ctl_point2, point');
              check_point_type(pt2, this+'.graphics.bezierCurveTo', 'ctl_point1, *ctl_point2*, point');
              check_point_type(pt3, this+'.graphics.bezierCurveTo', 'ctl_point1, ctl_point2, *point*');
              /*END_DEBUG*/
              var pow = Math.pow,
                  max = Math.max,
                  min = Math.min,
                  x0 = graphics_cursor_x,
                  y0 = graphics_cursor_y,
                  x1 = pt1.x,
                  y1 = pt1.y,
                  x2 = pt2.x,
                  y2 = pt2.y,
                  x3 = pt3.x,
                  y3 = pt3.y,
                  t,
                  xt,
                  yt,
                  cx_max = 0,
                  cx_min = 0,
                  cy_max = 0,
                  cy_min = 0;

              /* Solve for t on curve at various intervals and keep extremas.
               * Kinda hacky until I can find a real equation.
               * 0 <= t && t <= 1
               */
              for (t = 0.1; t < 1; t += 0.1) {
                xt = pow(1-t,3) * x0 + 3 * pow(1-t,2) * t * x1 +
                  3 * pow(1-t,1) * pow(t,2) * x2 + pow(t,3) * x3;
                //extremas
                if (xt > cx_max) { cx_max = xt; }
                if (xt < cx_min) { cx_min = xt; }
                
                yt = pow(1-t,3) * y0 + 3 * pow(1-t,2) * t * y1 +
                  3 * pow(1-t,1) * pow(t,2) * y2 + pow(t,3) * y3;
                //extremas
                if (yt > cy_max) { cy_max = yt; }
                if (yt < cy_min) { cy_min = yt; }
              }

              //update extremas
              bounds_min_x = min(0, x0, cx_min, x3, bounds_min_x);
              bounds_min_y = min(0, y0, cy_min, y3, bounds_min_y);
              bounds_max_x = max(0, x0, cx_max, x3, bounds_max_x);
              bounds_max_y = max(0, y0, cy_max, y3, bounds_max_y);
              
              //update size for bounding box
              this.width = -bounds_min_x + bounds_max_x;
              this.height = -bounds_min_y + bounds_max_y;

              draw_commands.push(function (ctx) {
                ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
              });

              //update cursor
              graphics_cursor_x = x3;
              graphics_cursor_y = y3;

            }).bind(sprite)
          },

          /* Specifies a simple one-color fill that subsequent calls to other
           * graphics methods use when drawing.
           * @param {Color} color In hex format.
           * @param {Number} alpha
           */
          'beginFill': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (color, alpha) {
              alpha = (alpha === undefined) ? 1 : alpha;
              /*DEBUG*/
              check_number_type(alpha, this+'.graphics.beginFill', 'color, *alpha*');
              /*END_DEBUG*/
              draw_commands.push(function (ctx) {
                ctx.fillStyle = hex_to_rgb_str(color, alpha);
              });
            }).bind(sprite)
          },

          'beginGradientFill': {
            enumerable: true,
            writable: false,
            configurable: false,
            value: (function () {
              var LINEAR = doodle.GradientType.LINEAR,
                  RADIAL = doodle.GradientType.RADIAL;
              
              return (function (type, pt1, pt2, ratios, colors, alphas) {
                /*DEBUG*/
                check_point_type(pt1, this+'.graphics.beginGradientFill', 'type, *point1*, point2, ratios, colors, alphas');
                check_point_type(pt2, this+'.graphics.beginGradientFill', 'type, point1, *point2*, ratios, colors, alphas');
                check_array_type(ratios, this+'.graphics.beginGradientFill', 'type, point1, point2, *ratios*, colors, alphas');
                check_number_type(ratios, this+'.graphics.beginGradientFill', 'type, point1, point2, *ratios*, colors, alphas');
                check_array_type(colors, this+'.graphics.beginGradientFill', 'type, point1, point2, ratios, *colors*, alphas');
                check_array_type(alphas, this+'.graphics.beginGradientFill', 'type, point1, point2, ratios, colors, *alphas*');
                /*END_DEBUG*/
                
                draw_commands.push(function (ctx) {
                  var hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
                      gradient,
                      len = ratios.length,
                      i = 0;
                  if (type === LINEAR) {
                    //not really too keen on creating this here, but I need access to the context
                    gradient = ctx.createLinearGradient(pt1.x, pt1.y, pt2.x, pt2.y);
                    
                  } else if (type === RADIAL) {
                    /*DEBUG*/
                    check_number_type(pt1.radius, this+'.graphics.beginGradientFill', 'type, *circle1.radius*, circle2, ratios, colors, alphas');
                    check_number_type(pt2.radius, this+'.graphics.beginGradientFill', 'type, circle1, *circle2.radius*, ratios, colors, alphas');
                    /*END_DEBUG*/
                    gradient = ctx.createRadialGradient(pt1.x, pt1.y, pt1.radius,
                                                        pt2.x, pt2.y, pt2.radius);
                  } else {
                    throw new TypeError(this+'.graphics.beginGradientFill(*type*, point1, point2, ratios, colors, alphas): Unknown gradient type.');
                  }
                  //add color ratios to our gradient
                  for (; i < len; i+=1) {
                    gradient.addColorStop(ratios[i], hex_to_rgb_str(colors[i], alphas[i]));
                  }
                  ctx.fillStyle = gradient;
                });
                
              }).bind(sprite);
            }())
          },

          'beginPatternFill': {
            enumerable: true,
            writable: false,
            configurable: false,
            value: (function (image, repeat) {
              var img = null, //image after loaded
                  _img, //image before loaded
                  on_image_error,
                  Pattern = doodle.Pattern,
                  Event = doodle.Event;
              
              repeat = (repeat === undefined) ? Pattern.REPEAT : repeat;
              /*DEBUG*/
              check_string_type(repeat, this+'.graphics.beginPatternFill', 'image,*repeat*');
              /*END_DEBUG*/
              if (repeat !== Pattern.REPEAT && repeat !== Pattern.NO_REPEAT &&
                  repeat !== Pattern.REPEAT_X && repeat !== Pattern.REPEAT_Y) {
                throw new SyntaxError(this+'.graphics.beginPatternFill(image,*repeat*): Invalid pattern repeat type.');
              }

              //given element id
              if (typeof image === 'string' && image[0] === '#') {
                image = get_element(image, this+'.beginPatternFill');
              }
              if (typeof image === 'string') {
                //src url
                _img = new Image();
                _img.src = encodeURI(image);
              } else if (image && image.tagName === 'IMG') {
                _img = image;
              } else {
                throw new TypeError(this+'.graphics.beginPatternFill(*image*,repeat): Parameter must be an src url, image object, or element id.');
              }

              //check if image has already been loaded
              if (_img.complete) {
                img = _img;
              } else {
                //if not, assign load handlers
                _img.onload = (function () {
                  img = _img;
                  this.dispatchEvent(Event(Event.LOAD));
                }).bind(this);
                on_image_error = (function () {
                  throw new URIError(this+'.graphics.beginPatternFill(*image*,repeat): Unable to load ' + _img.src);
                }).bind(this);
                _img.onerror = on_image_error;
                _img.onabort = on_image_error;
              }
              
              draw_commands.push(function (ctx) {
                if (img) {
                  ctx.fillStyle = ctx.createPattern(img, repeat);
                } else {
                  //use transparent fill until image is loaded
                  ctx.fillStyle = 'rgba(0,0,0,0)';
                }
              });
              
            }).bind(sprite)
          },

          'lineStyle': {
            enumerable: true,
            writable: false,
            configurable: false,
            value: (function (thickness, color, alpha, caps, joints, miterLimit) {
              //defaults
              thickness = (thickness === undefined) ? 1 : thickness;
              color = (color === undefined) ? "#000000" : color;
              alpha = (alpha === undefined) ? 1 : alpha;
              caps = (caps === undefined) ? doodle.LineCap.BUTT : caps;
              joints = (joints === undefined) ? doodle.LineJoin.MITER : joints;
              miterLimit = (miterLimit === undefined) ? 10 : miterLimit;
              
              /*DEBUG*/
              check_number_type(thickness, this+'.graphics.lineStyle', '*thickness*, color, alpha, caps, joints, miterLimit');
              check_number_type(alpha, this+'.graphics.lineStyle', 'thickness, color, *alpha*, caps, joints, miterLimit');
              check_string_type(caps, this+'.graphics.lineStyle', 'thickness, color, alpha, *caps*, joints, miterLimit');
              check_string_type(joints, this+'.graphics.lineStyle', 'thickness, color, alpha, caps, *joints*, miterLimit');
              check_number_type(miterLimit, this+'.graphics.lineStyle', 'thickness, color, alpha, caps, joints, *miterLimit*');
              /*END_DEBUG*/
              
              //convert color to canvas rgb() format
              if (typeof color === 'string' || typeof color === 'number') {
                color = hex_to_rgb_str(color, alpha);
              } else {
                throw new TypeError(this+'.graphics.lineStyle(thickness,*color*,alpha,caps,joints,miterLimit): Color must be a hex value.');
              }

              draw_commands.push(function (ctx) {
                ctx.lineWidth = thickness;
                ctx.strokeStyle = color;
                ctx.lineCap = caps;
                ctx.lineJoin = joints;
                ctx.miterLimit = miterLimit;
              });
              
            }).bind(sprite)
          },

          'beginPath': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function () {
              draw_commands.push(function (ctx) {
                ctx.beginPath();
                ctx.moveTo(graphics_cursor_x, graphics_cursor_y);
              });
            }
          },

          'closePath': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function () {
              draw_commands.push(function (ctx) {
                ctx.closePath();
                ctx.stroke();
              });
              graphics_cursor_x = 0;
              graphics_cursor_y = 0;
            }
          },

          //temp
          'endFill': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function () {
              draw_commands.push(function (ctx) {
                ctx.fill();
              });
            }
          },
          
          //temp
          'stroke': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function () {
              draw_commands.push(function (ctx) {
                ctx.stroke();
              });
              graphics_cursor_x = 0;
              graphics_cursor_y = 0;
            }
          }
          
        })
      }//end graphics object
    });//end sprite property definitions w/ privact


    //passed an initialization object: function
    if (initializer) {
      initializer.call(sprite);
    }
    
    return sprite;
  };

  
  /*
   * CLASS METHODS
   */
  
  isSprite = doodle.Sprite.isSprite = function (obj) {
    return obj.toString() === '[object Sprite]';
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
  

  (function () {
    
    sprite_properties = {
      /*
       * PROPERTIES
       */

      'rotation': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.transform.rotation * 180/Math.PI; //return degress
        },
        set: function (deg) {
          /*DEBUG*/
          check_number_type(deg, this+'.rotation', '*degrees*');
          /*END_DEBUG*/
          this.transform.rotation = deg * Math.PI/180; //deg-to-rad
        }
      },

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
    };//end sprite_properties
    
  }());
}());//end class closure
