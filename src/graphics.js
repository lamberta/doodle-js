/*globals doodle, Image*/
(function () {
  var graphics_static_properties,
      /*DEBUG*/
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_function_type = doodle.utils.types.check_function_type,
      check_array_type = doodle.utils.types.check_array_type,
      check_point_type = doodle.utils.types.check_point_type,
      /*END_DEBUG*/
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      get_element = doodle.utils.get_element,
      doodle_Event = doodle.Event,
      LINEAR = doodle.GradientType.LINEAR,
      RADIAL = doodle.GradientType.RADIAL;
  
  /* Super constructor
   * @param {Array} Reference to draw commands array.
   * @param {Object} Reference to object's extrema points.
   * @return {Object}
   * @this {Sprite}
   */
  doodle.Graphics = function (draw_commands, extrema) {
    var graphics = {},
        gfx_node = this,
        cursor_x = 0,
        cursor_y = 0,
        //line defaults
        line_width = 1,
        line_cap = doodle.LineCap.BUTT,
        line_join = doodle.LineJoin.MITER,
        line_miter = 10;
    
    Object.defineProperties(graphics, graphics_static_properties);
    //properties that require privacy
    Object.defineProperties(graphics, {
      /*
       * PROPERTIES
       */
      'lineWidth': {
        enumerable: true,
        configurable: false,
        get: function () { return line_width; }
      },
      
      'lineCap': {
        enumerable: true,
        configurable: false,
        get: function () { return line_cap; }
      },

      'lineJoin': {
        enumerable: true,
        configurable: false,
        get: function () { return line_join; }
      },

      'lineMiter': {
        enumerable: true,
        configurable: false,
        get: function () { return line_miter; }
      },
      
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
        value: function (fn) {
          /*DEBUG*/
          check_function_type(fn, gfx_node+'.graphics.draw', '*function*');
          /*END_DEBUG*/
          draw_commands.push(fn);
        }
      },

      /* Remove all drawing commands for sprite.
       */
      'clear': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.length = 0;
          //reset dimensions
          gfx_node.width = 0;
          gfx_node.height = 0;

          extrema.min_x = extrema.min_y = extrema.max_x = extrema.max_y = 0;
          cursor_x = cursor_y = 0;
        }
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
        value: function (x, y, width, height) {
          /*DEBUG*/
          check_number_type(x, gfx_node+'.graphics.rect', '*x*, y, width, height');
          check_number_type(y, gfx_node+'.graphics.rect', 'x, *y*, width, height');
          check_number_type(width, gfx_node+'.graphics.rect', 'x, y, *width*, height');
          check_number_type(height, gfx_node+'.graphics.rect', 'x, y, width, *height*');
          /*END_DEBUG*/

          //update extremas
          extrema.min_x = Math.min(0, x, extrema.min_x);
          extrema.min_y = Math.min(0, y, extrema.min_y);
          extrema.max_x = Math.max(0, x, x+width, extrema.max_x);
          extrema.max_y = Math.max(0, y, y+height, extrema.max_y);
          
          //update size for bounding box
          gfx_node.width = -extrema.min_x + extrema.max_x;
          gfx_node.height = -extrema.min_y + extrema.max_y;
          
          draw_commands.push(function (ctx) {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.closePath();
            ctx.stroke();
          });
          
        }
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
        value: function (x, y, radius) {
          /*DEBUG*/
          check_number_type(x, gfx_node+'.graphics.circle', '*x*, y, radius');
          check_number_type(y, gfx_node+'.graphics.circle', 'x, *y*, radius');
          check_number_type(radius, gfx_node+'.graphics.circle', 'x, y, *radius*');
          /*END_DEBUG*/

          //update extremas
          extrema.min_x = Math.min(0, -radius+x, extrema.min_x);
          extrema.min_y = Math.min(0, -radius+y, extrema.min_y);
          extrema.max_x = Math.max(0, x, x+radius, extrema.max_x);
          extrema.max_y = Math.max(0, y, y+radius, extrema.max_y);
          
          //update size for bounding box
          gfx_node.width = -extrema.min_x + extrema.max_x;
          gfx_node.height = -extrema.min_y + extrema.max_y;

          draw_commands.push(function (ctx) {
            ctx.beginPath();
            //x, y, radius, start_angle, end_angle (Math.PI*2), anti-clockwise
            ctx.arc(x, y, radius, 0, 6.283185307179586, true);
            ctx.closePath();
            ctx.stroke();
          });
          
        }
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
        value: function (x, y, width, height) {
          height = (height === undefined) ? width : height; //default to circle
          /*DEBUG*/
          check_number_type(x, gfx_node+'.graphics.ellipse', '*x*, y, width, height');
          check_number_type(y, gfx_node+'.graphics.ellipse', 'x, *y*, width, height');
          check_number_type(width, gfx_node+'.graphics.ellipse', 'x, y, *width*, height');
          check_number_type(height, gfx_node+'.graphics.ellipse', 'x, y, width, *height*');
          /*END_DEBUG*/
          var rx = width / 2,
              ry = height / 2,
              krx = 0.5522847498 * rx, //kappa * radius_x
              kry = 0.5522847498 * ry;

          //update extremas
          extrema.min_x = Math.min(0, -rx+x, extrema.min_x);
          extrema.min_y = Math.min(0, -ry+y, extrema.min_y);
          extrema.max_x = Math.max(0, x, x+rx, extrema.max_x);
          extrema.max_y = Math.max(0, y, y+ry, extrema.max_y);
          
          //update size for bounding box
          gfx_node.width = -extrema.min_x + extrema.max_x;
          gfx_node.height = -extrema.min_y + extrema.max_y;

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
          
        }
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
        value: function (x, y, width, height, rx, ry) {
          rx = (rx === undefined) ? 0 : rx; //default to rectangle
          ry = (ry === undefined) ? 0 : ry;
          /*DEBUG*/
          check_number_type(x, gfx_node+'.graphics.roundRect', '*x*, y, width, height, rx, ry');
          check_number_type(y, gfx_node+'.graphics.roundRect', 'x, *y*, width, height, rx, ry');
          check_number_type(width, gfx_node+'.graphics.roundRect', 'x, y, *width*, height, rx, ry');
          check_number_type(height, gfx_node+'.graphics.roundRect', 'x, y, width, *height*, rx, ry');
          check_number_type(rx, gfx_node+'.graphics.roundRect', 'x, y, width, height, *rx*, ry');
          check_number_type(ry, gfx_node+'.graphics.roundRect', 'x, y, width, height, rx, *ry*');
          /*END_DEBUG*/
          var x3 = x + width,
              x2 = x3 - rx,
              x1 = x + rx,
              y3 = y + height,
              y2 = y3 - ry,
              y1 = y + ry;

          //update extremas
          extrema.min_x = Math.min(0, x, extrema.min_x);
          extrema.min_y = Math.min(0, y, extrema.min_y);
          extrema.max_x = Math.max(0, x, x+width, extrema.max_x);
          extrema.max_y = Math.max(0, y, y+height, extrema.max_y);
          
          //update size for bounding box
          gfx_node.width = -extrema.min_x + extrema.max_x;
          gfx_node.height = -extrema.min_y + extrema.max_y;

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
          
        }
      },

      /*
       * @param {Number} x
       * @param {Number} y
       */
      'moveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          /*DEBUG*/
          check_number_type(x, gfx_node+'.graphics.moveTo', '*x*, y');
          check_number_type(y, gfx_node+'.graphics.moveTo', 'x, *y*');
          /*END_DEBUG*/
          draw_commands.push(function (ctx) {
            ctx.moveTo(x, y);
          });
          //update cursor
          cursor_x = x;
          cursor_y = y;
          
        }
      },

      /*
       * @param {Number} x
       * @param {Number} y
       */
      'lineTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          /*DEBUG*/
          check_number_type(x, gfx_node+'.graphics.lineTo', '*x*, y');
          check_number_type(y, gfx_node+'.graphics.lineTo', 'x, *y*');
          /*END_DEBUG*/

          //update extremas
          extrema.min_x = Math.min(0, x, cursor_x, extrema.min_x);
          extrema.min_y = Math.min(0, y, cursor_y, extrema.min_y);
          extrema.max_x = Math.max(0, x, cursor_x, extrema.max_x);
          extrema.max_y = Math.max(0, y, cursor_y, extrema.max_y);
          
          //update size for bounding box
          gfx_node.width = extrema.max_x - extrema.min_x;
          gfx_node.height = extrema.max_y - extrema.min_y;
          
          draw_commands.push(function (ctx) {
            ctx.lineTo(x, y);
          });

          //update cursor
          cursor_x = x;
          cursor_y = y;
          
        }
      },

      /* Quadratic curve to point.
       * @param {Point} pt1 Control point
       * @param {Point} pt2 End point
       */
      'curveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt1, pt2) {
          /*DEBUG*/
          check_point_type(pt1, gfx_node+'.graphics.curveTo', '*ctl_point*, point');
          check_point_type(pt2, gfx_node+'.graphics.curveTo', 'ctl_point, *point*');
          /*END_DEBUG*/
          var x0 = cursor_x,
              y0 = cursor_y,
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
          extrema.min_x = Math.min(0, x0, cx, x2, extrema.min_x);
          extrema.min_y = Math.min(0, y0, cy, y2, extrema.min_y);
          extrema.max_x = Math.max(0, x0, cx, x2, extrema.max_x);
          extrema.max_y = Math.max(0, y0, cy, y2, extrema.max_y);
          
          //update size for bounding box
          gfx_node.width = -extrema.min_x + extrema.max_x;
          gfx_node.height = -extrema.min_y + extrema.max_y;

          draw_commands.push(function (ctx) {
            ctx.quadraticCurveTo(x1, y1, x2, y2);
          });

          //update cursor
          cursor_x = x2;
          cursor_y = y2;
          
        }
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
        value: function (pt1, pt2, pt3) {
          /*DEBUG*/
          check_point_type(pt1, gfx_node+'.graphics.bezierCurveTo', '*ctl_point1*, ctl_point2, point');
          check_point_type(pt2, gfx_node+'.graphics.bezierCurveTo', 'ctl_point1, *ctl_point2*, point');
          check_point_type(pt3, gfx_node+'.graphics.bezierCurveTo', 'ctl_point1, ctl_point2, *point*');
          /*END_DEBUG*/
          var pow = Math.pow,
              max = Math.max,
              min = Math.min,
              x0 = cursor_x,
              y0 = cursor_y,
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
          extrema.min_x = min(0, x0, cx_min, x3, extrema.min_x);
          extrema.min_y = min(0, y0, cy_min, y3, extrema.min_y);
          extrema.max_x = max(0, x0, cx_max, x3, extrema.max_x);
          extrema.max_y = max(0, y0, cy_max, y3, extrema.max_y);
          
          //update size for bounding box
          gfx_node.width = -extrema.min_x + extrema.max_x;
          gfx_node.height = -extrema.min_y + extrema.max_y;

          draw_commands.push(function (ctx) {
            ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
          });

          //update cursor
          cursor_x = x3;
          cursor_y = y3;

        }
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
        value: function (color, alpha) {
          alpha = (alpha === undefined) ? 1 : alpha;
          /*DEBUG*/
          check_number_type(alpha, gfx_node+'.graphics.beginFill', 'color, *alpha*');
          /*END_DEBUG*/
          draw_commands.push(function (ctx) {
            ctx.fillStyle = hex_to_rgb_str(color, alpha);
          });
        }
      },

      'beginGradientFill': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (type, pt1, pt2, ratios, colors, alphas) {
          /*DEBUG*/
          check_point_type(pt1, gfx_node+'.graphics.beginGradientFill', 'type, *point1*, point2, ratios, colors, alphas');
          check_point_type(pt2, gfx_node+'.graphics.beginGradientFill', 'type, point1, *point2*, ratios, colors, alphas');
          check_array_type(ratios, gfx_node+'.graphics.beginGradientFill', 'type, point1, point2, *ratios*, colors, alphas');
          check_number_type(ratios, gfx_node+'.graphics.beginGradientFill', 'type, point1, point2, *ratios*, colors, alphas');
          check_array_type(colors, gfx_node+'.graphics.beginGradientFill', 'type, point1, point2, ratios, *colors*, alphas');
          check_array_type(alphas, gfx_node+'.graphics.beginGradientFill', 'type, point1, point2, ratios, colors, *alphas*');
          /*END_DEBUG*/
          
          draw_commands.push(function (ctx) {
            var hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
                gradient,
                len = ratios.length,
                i = 0;
            
            if (type === LINEAR) {
              //not really too keen on creating gfx_node here, but I need access to the context
              gradient = ctx.createLinearGradient(pt1.x, pt1.y, pt2.x, pt2.y);
              
            } else if (type === RADIAL) {
              /*DEBUG*/
              check_number_type(pt1.radius, gfx_node+'.graphics.beginGradientFill', 'type, *circle1.radius*, circle2, ratios, colors, alphas');
              check_number_type(pt2.radius, gfx_node+'.graphics.beginGradientFill', 'type, circle1, *circle2.radius*, ratios, colors, alphas');
              /*END_DEBUG*/
              gradient = ctx.createRadialGradient(pt1.x, pt1.y, pt1.radius,
                                                  pt2.x, pt2.y, pt2.radius);
            } else {
              throw new TypeError(gfx_node+'.graphics.beginGradientFill(*type*, point1, point2, ratios, colors, alphas): Unknown gradient type.');
            }
            //add color ratios to our gradient
            for (; i < len; i+=1) {
              gradient.addColorStop(ratios[i], hex_to_rgb_str(colors[i], alphas[i]));
            }
            ctx.fillStyle = gradient;
          });
        }
      },

      'beginPatternFill': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (image, repeat) {
          var img_loaded = null, //image after loaded
              on_image_error,
              Pattern = doodle.Pattern;
          
          repeat = (repeat === undefined) ? Pattern.REPEAT : repeat;
          /*DEBUG*/
          check_string_type(repeat, gfx_node+'.graphics.beginPatternFill', 'image, *repeat*');
          /*END_DEBUG*/
          if (repeat !== Pattern.REPEAT && repeat !== Pattern.NO_REPEAT &&
              repeat !== Pattern.REPEAT_X && repeat !== Pattern.REPEAT_Y) {
            throw new SyntaxError(gfx_node+'.graphics.beginPatternFill(image, *repeat*): Invalid pattern repeat type.');
          }
          
          if (typeof image === 'string') {
            //element id
            if (image[0] === '#') {
              image = get_element(image, gfx_node+'.graphics..beginPatternFill');
            } else {
              //url
              (function () {
                var img_url = encodeURI(image);
                image = new Image();
                image.src = img_url;
              }());
            }
          }
          
          /*DEBUG*/
          if (image && image.tagName !== 'IMG') {
            throw new TypeError(gfx_node+'.graphics.beginPatternFill(*image*, repeat): Parameter must be an src url, image object, or element id.');
          }
          /*END_DEBUG*/

          //check if image has already been loaded
          if (image.complete) {
            img_loaded = image;
          } else {
            //if not, assign load handlers
            image.onload = function () {
              img_loaded = image;
              gfx_node.dispatchEvent(doodle_Event(doodle_Event.LOAD));
            };
            on_image_error = function () {
              throw new URIError(gfx_node+'.graphics.beginPatternFill(*image*,repeat): Unable to load ' + image.src);
            };
            image.onerror = on_image_error;
            image.onabort = on_image_error;
          }
          
          draw_commands.push(function (ctx) {
            if (img_loaded) {
              ctx.fillStyle = ctx.createPattern(img_loaded, repeat);
            } else {
              //use transparent fill until image is loaded
              ctx.fillStyle = 'rgba(0,0,0,0)';
            }
          });
          
        }
      },

      'lineStyle': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (thickness, color, alpha, caps, joints, miterLimit) {
          //defaults
          thickness = (thickness === undefined) ? 1 : thickness;
          color = (color === undefined) ? "#000000" : color;
          alpha = (alpha === undefined) ? 1 : alpha;
          caps = (caps === undefined) ? doodle.LineCap.BUTT : caps;
          joints = (joints === undefined) ? doodle.LineJoin.MITER : joints;
          miterLimit = (miterLimit === undefined) ? 10 : miterLimit;
          /*DEBUG*/
          check_number_type(thickness, gfx_node+'.graphics.lineStyle', '*thickness*, color, alpha, caps, joints, miterLimit');
          check_number_type(alpha, gfx_node+'.graphics.lineStyle', 'thickness, color, *alpha*, caps, joints, miterLimit');
          check_string_type(caps, gfx_node+'.graphics.lineStyle', 'thickness, color, alpha, *caps*, joints, miterLimit');
          check_string_type(joints, gfx_node+'.graphics.lineStyle', 'thickness, color, alpha, caps, *joints*, miterLimit');
          check_number_type(miterLimit, gfx_node+'.graphics.lineStyle', 'thickness, color, alpha, caps, joints, *miterLimit*');
          //check values
          if (thickness <= 0 || isNaN(thickness) || !isFinite(thickness)) {
            throw new SyntaxError(gfx_node+'.graphics.lineStyle(*thickness*, color, alpha, caps, joints, miterLimit): Value must be a positive number.');
          }
          if (caps !== doodle.LineCap.BUTT && caps !== doodle.LineCap.ROUND &&
              caps !== doodle.LineCap.SQUARE) {
            throw new SyntaxError(gfx_node+'.graphics.lineStyle(thickness, color, alpha, *caps*, joints, miterLimit): Invalid LineCap value.');
          }
          if (joints !== doodle.LineJoin.BEVEL && joints !== doodle.LineJoin.MITER &&
              joints !== doodle.LineJoin.ROUND) {
            throw new SyntaxError(gfx_node+'.graphics.lineStyle(thickness, color, alpha, caps, *joints*, miterLimit): Invalid LineJoin value.');
          }
          if (miterLimit <= 0 || isNaN(miterLimit) || !isFinite(miterLimit)) {
            throw new SyntaxError(gfx_node+'.graphics.lineStyle(thickness, color, alpha, caps, joints, *miterLimit*): Value must be a positive number.');
          }
          /*END_DEBUG*/
          line_width = thickness;
          line_join = joints;
          line_cap = caps;
          line_miter = miterLimit;
          
          //convert color to canvas rgb() format
          if (typeof color === 'string' || typeof color === 'number') {
            color = hex_to_rgb_str(color, alpha);
          } else {
            throw new TypeError(gfx_node+'.graphics.lineStyle(thickness,*color*,alpha,caps,joints,miterLimit): Color must be a hex value.');
          }

          draw_commands.push(function (ctx) {
            ctx.lineWidth = line_width;
            ctx.strokeStyle = color;
            ctx.lineCap = line_cap;
            ctx.lineJoin = line_join;
            ctx.miterLimit = line_miter;
          });
          
        }
      },

      'beginPath': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.push(function (ctx) {
            ctx.beginPath();
            ctx.moveTo(cursor_x, cursor_y);
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
          cursor_x = 0;
          cursor_y = 0;
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
          cursor_x = 0;
          cursor_y = 0;
        }
      }

    });//end defineProperties

    return graphics;
  };
  

  graphics_static_properties = {

    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Graphics]";
      }
    }
    
  };

}());//end class closure
