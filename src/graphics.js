/*globals doodle, Image*/
(function () {
  var graphics_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      reference_check = doodle.utils.debug.reference_check,
      /*END_DEBUG*/
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      get_element = doodle.utils.get_element,
      doodle_Event = doodle.events.Event,
      LINEAR = doodle.GradientType.LINEAR,
      RADIAL = doodle.GradientType.RADIAL;
  
  /**
   * @name doodle.Graphics
   * @class
   * @augments Object
   * @param {Array} draw_commands Reference to draw commands array.
   * @return {Object}
   * @this {doodle.Sprite}
   */
  doodle.Graphics = function (draw_commands) {
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
      /**
       * @property
       * @private
       */
      '__minX': {
        enumerable: false,
        configurable: false,
        value: 0
      },

      /**
       * @property
       * @private
       */
      '__minY': {
        enumerable: false,
        configurable: false,
        value: 0
      },

      /**
       * @property
       * @private
       */
      '__maxX': {
        enumerable: false,
        configurable: false,
        value: 0
      },

      /**
       * @property
       * @private
       */
      '__maxY': {
        enumerable: false,
        configurable: false,
        value: 0
      },
      
      /**
       * @name lineWidth
       * @return {number} [read-only]
       * @property
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linewidth">context.lineWidth</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineWidth_example">A lineWidth Example</a> [Canvas Tutorial]
       */
      'lineWidth': {
        enumerable: true,
        configurable: false,
        get: function () { return line_width; }
      },

      /**
       * @name lineCap
       * @return {string} [read-only]
       * @property
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linecap">context.lineCap</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineCap_example">A lineCap Example</a> [Canvas Tutorial]
       */
      'lineCap': {
        enumerable: true,
        configurable: false,
        get: function () { return line_cap; }
      },

      /**
       * @name lineJoin
       * @return {string} [read-only]
       * @property
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linejoin">context.lineJoin</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineJoin_example">A lineJoin Example</a> [Canvas Tutorial]
       */
      'lineJoin': {
        enumerable: true,
        configurable: false,
        get: function () { return line_join; }
      },

      /**
       * The miter value means that a second filled triangle must (if possible, given
       * the miter length) be rendered at the join, with one line being the line between
       * the two aforementioned corners, abutting the first triangle, and the other two
       * being continuations of the outside edges of the two joining lines, as long as
       * required to intersect without going over the miter length.
       * @name lineMiter
       * @return {number} [read-only]
       * @property
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.miterLimit</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_demo_of_the_miterLimit_property">A miterLimit Demo</a> [Canvas Tutorial]
       */
      'lineMiter': {
        enumerable: true,
        configurable: false,
        get: function () { return line_miter; }
      },

      /**
       * Provide direct access to the canvas drawing api.
       * Canvas context is called as the first argument to function.
       * Unable to set bounds from a user supplied function unless explictly set.
       * @name draw
       * @param {Function} fn
       * @example
       *   x = Object.create(doodle.sprite);<br/>
       *   x.graphics.draw(function (ctx) {<br/>
       *   &nbsp; ctx.fillStyle = "#ff0000";<br/>
       *   &nbsp; ctx.fillRect(this.x, this.y, 100, 100);<br/>
       *   });<br/>
       *   x.draw();
       */
      'draw': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (fn) {
          /*DEBUG*/
          type_check(fn,'function', {label:'Graphics.draw', id:gfx_node.id});
          /*END_DEBUG*/
          draw_commands.push(fn);
        }
      },

      /**
       * Remove all drawing commands for sprite.
       * @name clear
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

          this.__minX = this.__minY = this.__maxX = this.__maxY = 0;
          cursor_x = cursor_y = 0;
          return this;
        }
      },

      /**
       * @name rect
       * @param {number} x
       * @param {number} y
       * @param {number} width
       * @param {number} height
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-rect">context.rect</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Rectangles">Rectangles</a> [Canvas Tutorial]
       */
      'rect': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height) {
          /*DEBUG*/
          type_check(x,'number', y,'number', width,'number', height,'number', {label:'Graphics.rect', params:['x','y','width','height'], id:gfx_node.id});
          /*END_DEBUG*/

          //update extremas
          this.__minX = Math.min(0, x, this.__minX);
          this.__minY = Math.min(0, y, this.__minY);
          this.__maxX = Math.max(0, x, x+width, this.__maxX);
          this.__maxY = Math.max(0, y, y+height, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;
          
          draw_commands.push(function (ctx) {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.closePath();
            ctx.stroke();
          });
          return this;
        }
      },

      /**
       * @name circle
       * @param {number} x The x location of the center of the circle relative to the registration point of the parent display object (in pixels).
       * @param {number} y The y location of the center of the circle relative to the registration point of the parent display object (in pixels).
       * @param {number} radius
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Arcs">Arcs</a> [Canvas Tutorial]
       */
      'circle': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, radius) {
          /*DEBUG*/
          type_check(x,'number', y,'number', radius,'number', {label:'Graphics.circle', params:['x','y','radius'], id:gfx_node.id});
          /*END_DEBUG*/

          //update extremas
          this.__minX = Math.min(0, -radius+x, this.__minX);
          this.__minY = Math.min(0, -radius+y, this.__minY);
          this.__maxX = Math.max(0, x, x+radius, this.__maxX);
          this.__maxY = Math.max(0, y, y+radius, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

          draw_commands.push(function (ctx) {
            ctx.beginPath();
            //x, y, radius, start_angle, end_angle (Math.PI*2), anti-clockwise
            ctx.arc(x, y, radius, 0, 6.283185307179586, true);
            ctx.closePath();
            ctx.stroke();
          });
          return this;
        }
      },

      /**
       * @name ellipse
       * @param {number} x
       * @param {number} y
       * @param {number} width
       * @param {number} height
       */
      'ellipse': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height) {
          height = (height === undefined) ? width : height; //default to circle
          /*DEBUG*/
          type_check(x,'number', y,'number', width,'number', height,'number', {label:'Graphics.ellipse', params:['x','y','width','height'], id:gfx_node.id});
          /*END_DEBUG*/
          var rx = width / 2,
              ry = height / 2,
              krx = 0.5522847498 * rx, //kappa * radius_x
              kry = 0.5522847498 * ry;

          //update extremas
          this.__minX = Math.min(0, -rx+x, this.__minX);
          this.__minY = Math.min(0, -ry+y, this.__minY);
          this.__maxX = Math.max(0, x, x+rx, this.__maxX);
          this.__maxY = Math.max(0, y, y+ry, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

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
          return this;
        }
      },

      /**
       * @name roundRect
       * @param {number} x
       * @param {number} y
       * @param {number} width
       * @param {number} height
       * @param {number} rx
       * @param {number} ry
       */
      'roundRect': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height, rx, ry) {
          rx = (rx === undefined) ? 0 : rx; //default to rectangle
          ry = (ry === undefined) ? 0 : ry;
          /*DEBUG*/
          type_check(x,'number', y,'number', width,'number', height,'number', rx,'number', ry,'number', {label:'Graphics.roundRect', params:['x','y','width','height','rx','ry'], id:gfx_node.id});
          /*END_DEBUG*/
          var x3 = x + width,
              x2 = x3 - rx,
              x1 = x + rx,
              y3 = y + height,
              y2 = y3 - ry,
              y1 = y + ry;

          //update extremas
          this.__minX = Math.min(0, x, this.__minX);
          this.__minY = Math.min(0, y, this.__minY);
          this.__maxX = Math.max(0, x, x+width, this.__maxX);
          this.__maxY = Math.max(0, y, y+height, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

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
          return this;
        }
      },

      /**
       * @name moveTo
       * @param {number} x
       * @param {number} y
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-moveto">context.moveTo</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#moveTo">moveTo</a> [Canvas Tutorial]
       */
      'moveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          /*DEBUG*/
          type_check(x,'number', y,'number', {label:'Graphics.moveTo', params:['x','y'], id:gfx_node.id});
          /*END_DEBUG*/
          draw_commands.push(function (ctx) { ctx.moveTo(x, y); });
          //update cursor
          cursor_x = x;
          cursor_y = y;
          return this;
        }
      },

      /**
       * @name lineTo
       * @param {number} x
       * @param {number} y
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-lineto">context.lineTo</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Lines">Lines</a> [Canvas Tutorial]
       */
      'lineTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          /*DEBUG*/
          type_check(x,'number', y,'number', {label:'Graphics.lineTo', params:['x','y'], id:gfx_node.id});
          /*END_DEBUG*/

          //update extremas
          this.__minX = Math.min(0, x, cursor_x, this.__minX);
          this.__minY = Math.min(0, y, cursor_y, this.__minY);
          this.__maxX = Math.max(0, x, cursor_x, this.__maxX);
          this.__maxY = Math.max(0, y, cursor_y, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = this.__maxX - this.__minX;
          gfx_node.height = this.__maxY - this.__minY;
          
          draw_commands.push(function (ctx) {
            ctx.lineTo(x, y);
          });

          //update cursor
          cursor_x = x;
          cursor_y = y;
          return this;
        }
      },

      /**
       * Quadratic curve to point.
       * @name curveTo
       * @param {Point} pt1 Control point
       * @param {Point} pt2 End point
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-quadraticCurveTo">context.quadraticCurveTo</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Bezier_and_quadratic_curves">Bezier and Quadratic Curves</a> [Canvas Tutorial]
       */
      'curveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt1, pt2) {
          /*DEBUG*/
          type_check(pt1,'Point', pt2,'Point', {label:'Graphics.curveTo', params:['ctrl_point','point'], id:gfx_node.id});
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
          this.__minX = Math.min(0, x0, cx, x2, this.__minX);
          this.__minY = Math.min(0, y0, cy, y2, this.__minY);
          this.__maxX = Math.max(0, x0, cx, x2, this.__maxX);
          this.__maxY = Math.max(0, y0, cy, y2, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

          draw_commands.push(function (ctx) {
            ctx.quadraticCurveTo(x1, y1, x2, y2);
          });

          //update cursor
          cursor_x = x2;
          cursor_y = y2;
          return this;
        }
      },

      /**
       * Bezier curve to point.
       * @name bezierCurveTo
       * @param {Point} pt1 Control point 1
       * @param {Point} pt2 Control point 2
       * @param {Point} pt3 End point
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-bezierCurveTo">context.bezierCurveTo</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Bezier_and_quadratic_curves">Bezier and Quadratic Curves</a> [Canvas Tutorial]
       */
      'bezierCurveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt1, pt2, pt3) {
          /*DEBUG*/
          type_check(pt1,'Point', pt2,'Point', pt3,'Point', {label:'Graphics.bezierCurveTo', params:['ctrl_point1','ctrl_point2','point'], id:gfx_node.id});
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
          this.__minX = min(0, x0, cx_min, x3, this.__minX);
          this.__minY = min(0, y0, cy_min, y3, this.__minY);
          this.__maxX = max(0, x0, cx_max, x3, this.__maxX);
          this.__maxY = max(0, y0, cy_max, y3, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

          draw_commands.push(function (ctx) {
            ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
          });
          //update cursor
          cursor_x = x3;
          cursor_y = y3;
          return this;
        }
      },

      /**
       * Specifies a simple one-color fill that subsequent calls to other
       * graphics methods use when drawing.
       * @name beginFill
       * @param {Color} color In hex format.
       * @param {number} alpha
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Colors">Colors</a> [Canvas Tutorial]
       */
      'beginFill': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (color, alpha) {
          alpha = (alpha === undefined) ? 1 : alpha;
          /*DEBUG*/
          type_check(color,'*', alpha,'number', {label:'Graphics.beginFill', params:['color','alpha'], id:gfx_node.id});
          /*END_DEBUG*/
          draw_commands.push(function (ctx) {
            ctx.fillStyle = hex_to_rgb_str(color, alpha);
          });
          return this;
        }
      },

      /**
       * @name beginGradientFill
       * @param {GradientType} type
       * @param {Point} pt1
       * @param {Point} pt2
       * @param {Array} ratios Array of numbers.
       * @param {Array} colors
       * @param {Array} alphas
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createlineargradient">context.createLinearGradient</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createradialgradient">context.createRadialGradient</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-canvasgradient-addcolorstop">context.addColorStop</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Gradients">Gradients</a> [Canvas Tutorial]
       */
      'beginGradientFill': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (type, pt1, pt2, ratios, colors, alphas) {
          /*DEBUG*/
          type_check(type,'string', pt1,'Point', pt2,'Point', ratios,'array', colors,'array', alphas,'array',
                     {label:'Graphics.beginGradientFill', params:['gradient_type','point','point','ratios','colors','alphas'], id:gfx_node.id});
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
              type_check(pt1.radius,'number', pt2.radius,'number', {label:'Graphics.beginGradientFill', id:gfx_node.id, message:"No radius for radial type."});
              /*END_DEBUG*/
              gradient = ctx.createRadialGradient(pt1.x, pt1.y, pt1.radius, pt2.x, pt2.y, pt2.radius);
            } else {
              throw new TypeError(gfx_node.id + " Graphics.beginGradientFill(*type*, point1, point2, ratios, colors, alphas): Unknown gradient type.");
            }
            //add color ratios to our gradient
            for (; i < len; i+=1) {
              gradient.addColorStop(ratios[i], hex_to_rgb_str(colors[i], alphas[i]));
            }
            ctx.fillStyle = gradient;
          });
          return this;
        }
      },

      /**
       * @name beginPatternFill
       * @param {HTMLImageElement} image
       * @param {Pattern} repeat
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createpattern">context.createPattern</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Patterns">Patterns</a> [Canvas Tutorial]
       */
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
          type_check(image,'*', repeat,'string', {label:'Graphics.beginPatternFill', params:['image','repeat'], id:gfx_node.id});
          reference_check(repeat === Pattern.REPEAT || repeat === Pattern.NO_REPEAT || repeat === Pattern.REPEAT_X || repeat !== Pattern.REPEAT_Y, {label:'Graphics.beginPatternFill', id:gfx_node.id, message:"Invalid Pattern type."});
          /*END_DEBUG*/
          
          if (typeof image === 'string') {
            //element id
            if (image[0] === '#') {
              image = get_element(image);
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
          reference_check(image && image.tagName === 'IMG', {label:'Graphics.beginPatternFill', id:gfx_node.id, message:"Parameter must be an src url, image object, or element id."});
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
              throw new URIError(gfx_node.id + "Graphics.beginPatternFill(*image*,repeat): Unable to load " + image.src);
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
          return this;
        }
      },

      /**
       * @name lineStyle
       * @param {number} thickness
       * @param {Color} color
       * @param {number} alpha
       * @param {LineCap} caps
       * @param {LineJoin} joints
       * @param {number} miterLimit
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.lineWidth</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-strokestyle">context.strokeStyle</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linecap">context.lineCap</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linejoin">context.lineJoin</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.miterLimit</a> [Canvas API]
       */
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
          type_check(thickness,'number', color,'*', alpha,'number', caps,'string', joints,'string', miterLimit,'number',
                     {label:'Graphics.lineStyle', params:['thickness','color','alpha','caps','joints','miterLimit'], id:gfx_node.id});
          //check values
          range_check(isFinite(thickness), thickness >= 0, {label:'Graphics.lineStyle', id:gfx_node.id, message:"thickness must have a positive number."});
          reference_check(caps === doodle.LineCap.BUTT || caps === doodle.LineCap.ROUND || caps === doodle.LineCap.SQUARE,
                          {label:'Graphics.lineStyle', id:gfx_node.id, message:"Invalid LineCap: " + caps});
          reference_check(joints === doodle.LineJoin.BEVEL || joints === doodle.LineJoin.MITER || joints === doodle.LineJoin.ROUND,
                          {label:'Graphics.lineStyle', id:gfx_node.id, message:"Invalid LineJoin: " + joints});
          range_check(isFinite(miterLimit), miterLimit >= 0, {label:'Graphics.lineStyle', id:gfx_node.id, message:"miterLimit must have a positive number."});
          /*END_DEBUG*/
          line_width = thickness;
          line_join = joints;
          line_cap = caps;
          line_miter = miterLimit;
          
          //convert color to canvas rgb() format
          if (typeof color === 'string' || typeof color === 'number') {
            color = hex_to_rgb_str(color, alpha);
          } else {
            throw new TypeError(gfx_node + " Graphics.lineStyle(thickness,*color*,alpha,caps,joints,miterLimit): Color must be a hex value.");
          }
          draw_commands.push(function (ctx) {
            ctx.lineWidth = line_width;
            ctx.strokeStyle = color;
            ctx.lineCap = line_cap;
            ctx.lineJoin = line_join;
            ctx.miterLimit = line_miter;
          });
          return this;
        }
      },

      /**
       * @name beginPath
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-beginpath">context.beginPath</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
       */
      'beginPath': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.push(function (ctx) {
            ctx.beginPath();
            ctx.moveTo(cursor_x, cursor_y);
          });
          return this;
        }
      },

      /**
       * @name closePath
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-closepath">context.closePath</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-stroke">context.stroke</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
       */
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
          return this;
        }
      },

      /**
       * @name endFill
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fill">context.fill</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
       */
      'endFill': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.push(function (ctx) { ctx.fill(); });
          return this;
        }
      },
      
      /**
       * @name stroke
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-stroke">context.stroke</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
       */
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
          return this;
        }
      }

    });//end defineProperties

    return graphics;
  };
  

  graphics_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/toString">Object.toString</a> [JS Ref]
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () { return "[object Graphics]"; }
    }
  };

}());//end class closure
