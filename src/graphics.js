#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  graphics_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  reference_check = doodle.utils.debug.reference_check
  
  #END_DEBUG
  createEvent = doodle.events.createEvent
  LOAD = doodle.events.Event.LOAD
  hex_to_rgb_str = doodle.utils.hex_to_rgb_str
  get_element = doodle.utils.get_element
  LINEAR = doodle.GradientType.LINEAR
  RADIAL = doodle.GradientType.RADIAL
  
  ###
  @name doodle.createGraphics
  @class
  @augments Object
  @param {Array} draw_commands Reference to draw commands array.
  @return {Object}
  @this {doodle.Sprite}
  ###
  doodle.Graphics = doodle.createGraphics = (draw_commands) ->
    graphics = {}
    gfx_node = this
    cursor_x = 0
    cursor_y = 0
    
    #line defaults
    line_width = 1
    line_cap = doodle.LineCap.BUTT
    line_join = doodle.LineJoin.MITER
    line_miter = 10
    Object.defineProperties graphics, graphics_static_properties
    
    #properties that require privacy
    Object.defineProperties graphics,
      
      ###
      @property
      @private
      ###
      __minX:
        enumerable: false
        writable: true
        configurable: false
        value: 0

      
      ###
      @property
      @private
      ###
      __minY:
        enumerable: false
        writable: true
        configurable: false
        value: 0

      
      ###
      @property
      @private
      ###
      __maxX:
        enumerable: false
        writable: true
        configurable: false
        value: 0

      
      ###
      @property
      @private
      ###
      __maxY:
        enumerable: false
        writable: true
        configurable: false
        value: 0

      
      ###
      @name lineWidth
      @return {number} [read-only]
      @property
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linewidth">context.lineWidth</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineWidth_example">A lineWidth Example</a> [Canvas Tutorial]
      ###
      lineWidth:
        enumerable: true
        configurable: false
        get: ->
          line_width

      
      ###
      @name lineCap
      @return {string} [read-only]
      @property
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linecap">context.lineCap</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineCap_example">A lineCap Example</a> [Canvas Tutorial]
      ###
      lineCap:
        enumerable: true
        configurable: false
        get: ->
          line_cap

      
      ###
      @name lineJoin
      @return {string} [read-only]
      @property
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linejoin">context.lineJoin</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineJoin_example">A lineJoin Example</a> [Canvas Tutorial]
      ###
      lineJoin:
        enumerable: true
        configurable: false
        get: ->
          line_join

      
      ###
      The miter value means that a second filled triangle must (if possible, given
      the miter length) be rendered at the join, with one line being the line between
      the two aforementioned corners, abutting the first triangle, and the other two
      being continuations of the outside edges of the two joining lines, as long as
      required to intersect without going over the miter length.
      @name lineMiter
      @return {number} [read-only]
      @property
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.miterLimit</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_demo_of_the_miterLimit_property">A miterLimit Demo</a> [Canvas Tutorial]
      ###
      lineMiter:
        enumerable: true
        configurable: false
        get: ->
          line_miter

      
      ###
      Provide direct access to the canvas drawing api.
      Canvas context is called as the first argument to function.
      Unable to set bounds from a user supplied function unless explictly set.
      @name draw
      @param {Function} fn
      @example
      x = Object.create(doodle.sprite);<br/>
      x.graphics.draw(function (ctx) {<br/>
      &nbsp; ctx.fillStyle = "#ff0000";<br/>
      &nbsp; ctx.fillRect(this.x, this.y, 100, 100);<br/>
      });<br/>
      x.draw();
      ###
      draw:
        enumerable: false
        writable: false
        configurable: false
        value: (fn) ->
          
          #DEBUG
          type_check fn, "function",
            label: "Graphics.draw"
            id: gfx_node.id

          
          #END_DEBUG
          draw_commands.push fn

      
      ###
      Remove all drawing commands for sprite.
      @name clear
      ###
      clear:
        enumerable: false
        writable: false
        configurable: false
        value: ->
          draw_commands.length = 0
          
          #reset dimensions
          gfx_node.width = 0
          gfx_node.height = 0
          @__minX = @__minY = @__maxX = @__maxY = 0
          cursor_x = cursor_y = 0
          this

      
      ###
      @name rect
      @param {number} x
      @param {number} y
      @param {number} width
      @param {number} height
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-rect">context.rect</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Rectangles">Rectangles</a> [Canvas Tutorial]
      ###
      rect:
        enumerable: false
        writable: false
        configurable: false
        value: (x, y, width, height) ->
          
          #DEBUG
          type_check x, "number", y, "number", width, "number", height, "number",
            label: "Graphics.rect"
            params: ["x", "y", "width", "height"]
            id: gfx_node.id

          
          #END_DEBUG
          
          #update extremas
          @__minX = Math.min(0, x, @__minX)
          @__minY = Math.min(0, y, @__minY)
          @__maxX = Math.max(0, x, x + width, @__maxX)
          @__maxY = Math.max(0, y, y + height, @__maxY)
          
          #update size for bounding box
          gfx_node.width = -@__minX + @__maxX
          gfx_node.height = -@__minY + @__maxY
          draw_commands.push (ctx) ->
            ctx.beginPath()
            ctx.rect x, y, width, height
            ctx.closePath()
            ctx.stroke()

          this

      
      ###
      @name circle
      @param {number} x The x location of the center of the circle relative to the registration point of the parent display object (in pixels).
      @param {number} y The y location of the center of the circle relative to the registration point of the parent display object (in pixels).
      @param {number} radius
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Arcs">Arcs</a> [Canvas Tutorial]
      ###
      circle:
        enumerable: false
        writable: false
        configurable: false
        value: (x, y, radius) ->
          
          #DEBUG
          type_check x, "number", y, "number", radius, "number",
            label: "Graphics.circle"
            params: ["x", "y", "radius"]
            id: gfx_node.id

          
          #END_DEBUG
          
          #update extremas
          @__minX = Math.min(0, -radius + x, @__minX)
          @__minY = Math.min(0, -radius + y, @__minY)
          @__maxX = Math.max(0, x, x + radius, @__maxX)
          @__maxY = Math.max(0, y, y + radius, @__maxY)
          
          #update size for bounding box
          gfx_node.width = -@__minX + @__maxX
          gfx_node.height = -@__minY + @__maxY
          draw_commands.push (ctx) ->
            ctx.beginPath()
            
            #x, y, radius, start_angle, end_angle (Math.PI*2), anti-clockwise
            ctx.arc x, y, radius, 0, 6.283185307179586, true
            ctx.closePath()
            ctx.stroke()

          this

      
      ###
      @name ellipse
      @param {number} x
      @param {number} y
      @param {number} width
      @param {number} height
      ###
      ellipse:
        enumerable: false
        writable: false
        configurable: false
        value: (x, y, width, height) ->
          height = (if (height is `undefined`) then width else height) #default to circle
          #DEBUG
          type_check x, "number", y, "number", width, "number", height, "number",
            label: "Graphics.ellipse"
            params: ["x", "y", "width", "height"]
            id: gfx_node.id

          
          #END_DEBUG
          rx = width / 2
          ry = height / 2
          krx = 0.5522847498 * rx #kappa * radius_x
          kry = 0.5522847498 * ry
          
          #update extremas
          @__minX = Math.min(0, -rx + x, @__minX)
          @__minY = Math.min(0, -ry + y, @__minY)
          @__maxX = Math.max(0, x, x + rx, @__maxX)
          @__maxY = Math.max(0, y, y + ry, @__maxY)
          
          #update size for bounding box
          gfx_node.width = -@__minX + @__maxX
          gfx_node.height = -@__minY + @__maxY
          draw_commands.push (ctx) ->
            ctx.beginPath()
            ctx.moveTo x + rx, y
            
            #(cp1), (cp2), (pt)
            ctx.bezierCurveTo x + rx, y - kry, x + krx, y - ry, x, y - ry
            ctx.bezierCurveTo x - krx, y - ry, x - rx, y - kry, x - rx, y
            ctx.bezierCurveTo x - rx, y + kry, x - krx, y + ry, x, y + ry
            ctx.bezierCurveTo x + krx, y + ry, x + rx, y + kry, x + rx, y
            ctx.closePath()
            ctx.stroke()

          this

      
      ###
      @name roundRect
      @param {number} x
      @param {number} y
      @param {number} width
      @param {number} height
      @param {number} rx
      @param {number} ry
      ###
      roundRect:
        enumerable: false
        writable: false
        configurable: false
        value: (x, y, width, height, rx, ry) ->
          rx = (if (rx is `undefined`) then 0 else rx) #default to rectangle
          ry = (if (ry is `undefined`) then 0 else ry)
          
          #DEBUG
          type_check x, "number", y, "number", width, "number", height, "number", rx, "number", ry, "number",
            label: "Graphics.roundRect"
            params: ["x", "y", "width", "height", "rx", "ry"]
            id: gfx_node.id

          
          #END_DEBUG
          x3 = x + width
          x2 = x3 - rx
          x1 = x + rx
          y3 = y + height
          y2 = y3 - ry
          y1 = y + ry
          
          #update extremas
          @__minX = Math.min(0, x, @__minX)
          @__minY = Math.min(0, y, @__minY)
          @__maxX = Math.max(0, x, x + width, @__maxX)
          @__maxY = Math.max(0, y, y + height, @__maxY)
          
          #update size for bounding box
          gfx_node.width = -@__minX + @__maxX
          gfx_node.height = -@__minY + @__maxY
          draw_commands.push (ctx) ->
            ctx.beginPath()
            
            #clockwise
            ctx.moveTo x1, y
            ctx.beginPath()
            ctx.lineTo x2, y
            ctx.quadraticCurveTo x3, y, x3, y1
            ctx.lineTo x3, y2
            ctx.quadraticCurveTo x3, y3, x2, y3
            ctx.lineTo x1, y3
            ctx.quadraticCurveTo x, y3, x, y2
            ctx.lineTo x, y1
            ctx.quadraticCurveTo x, y, x1, y
            ctx.closePath()
            ctx.stroke()

          this

      
      ###
      @name moveTo
      @param {number} x
      @param {number} y
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-moveto">context.moveTo</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#moveTo">moveTo</a> [Canvas Tutorial]
      ###
      moveTo:
        enumerable: false
        writable: false
        configurable: false
        value: (x, y) ->
          
          #DEBUG
          type_check x, "number", y, "number",
            label: "Graphics.moveTo"
            params: ["x", "y"]
            id: gfx_node.id

          
          #END_DEBUG
          draw_commands.push (ctx) ->
            ctx.moveTo x, y

          
          #update cursor
          cursor_x = x
          cursor_y = y
          this

      
      ###
      @name lineTo
      @param {number} x
      @param {number} y
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-lineto">context.lineTo</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Lines">Lines</a> [Canvas Tutorial]
      ###
      lineTo:
        enumerable: false
        writable: false
        configurable: false
        value: (x, y) ->
          
          #DEBUG
          type_check x, "number", y, "number",
            label: "Graphics.lineTo"
            params: ["x", "y"]
            id: gfx_node.id

          
          #END_DEBUG
          
          #update extremas
          @__minX = Math.min(0, x, cursor_x, @__minX)
          @__minY = Math.min(0, y, cursor_y, @__minY)
          @__maxX = Math.max(0, x, cursor_x, @__maxX)
          @__maxY = Math.max(0, y, cursor_y, @__maxY)
          
          #update size for bounding box
          gfx_node.width = @__maxX - @__minX
          gfx_node.height = @__maxY - @__minY
          draw_commands.push (ctx) ->
            ctx.lineTo x, y

          
          #update cursor
          cursor_x = x
          cursor_y = y
          this

      
      ###
      Quadratic curve to point.
      @name curveTo
      @param {Point} pt1 Control point
      @param {Point} pt2 End point
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-quadraticCurveTo">context.quadraticCurveTo</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Bezier_and_quadratic_curves">Bezier and Quadratic Curves</a> [Canvas Tutorial]
      ###
      curveTo:
        enumerable: false
        writable: false
        configurable: false
        value: (x1, y1, x2, y2) ->
          
          #DEBUG
          type_check x1, "number", y1, "number", x2, "number", y2, "number",
            label: "Graphics.curveTo"
            params: ["x1", "y1", "x2", "y2"]
            id: gfx_node.id

          
          #END_DEBUG
          x0 = cursor_x
          y0 = cursor_y
          t = undefined
          cx = 0
          cy = 0
          
          #curve ratio of extrema
          t = (x0 - x1) / (x0 - 2 * x1 + x2)
          
          #if true, store extrema position
          cx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2  if 0 <= t and t <= 1
          t = (y0 - y1) / (y0 - 2 * y1 + y2)
          cy = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2  if 0 <= t and t <= 1
          
          #update extremas
          @__minX = Math.min(0, x0, cx, x2, @__minX)
          @__minY = Math.min(0, y0, cy, y2, @__minY)
          @__maxX = Math.max(0, x0, cx, x2, @__maxX)
          @__maxY = Math.max(0, y0, cy, y2, @__maxY)
          
          #update size for bounding box
          gfx_node.width = -@__minX + @__maxX
          gfx_node.height = -@__minY + @__maxY
          draw_commands.push (ctx) ->
            ctx.quadraticCurveTo x1, y1, x2, y2

          
          #update cursor
          cursor_x = x2
          cursor_y = y2
          this

      
      ###
      Bezier curve to point.
      @name bezierCurveTo
      @param {Point} pt1 Control point 1
      @param {Point} pt2 Control point 2
      @param {Point} pt3 End point
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-bezierCurveTo">context.bezierCurveTo</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Bezier_and_quadratic_curves">Bezier and Quadratic Curves</a> [Canvas Tutorial]
      ###
      bezierCurveTo:
        enumerable: false
        writable: false
        configurable: false
        value: (x1, y1, x2, y2, x3, y3) ->
          
          #DEBUG
          type_check x1, "number", y1, "number", x2, "number", y2, "number", x3, "number", y3, "number",
            label: "Graphics.bezierCurveTo"
            params: ["x1", "y1", "x2", "y2", "x3", "y3"]
            id: gfx_node.id

          
          #END_DEBUG
          pow = Math.pow
          max = Math.max
          min = Math.min
          x0 = cursor_x
          y0 = cursor_y
          t = undefined
          xt = undefined
          yt = undefined
          cx_max = 0
          cx_min = 0
          cy_max = 0
          cy_min = 0
          
          # Solve for t on curve at various intervals and keep extremas.
          #           * Kinda hacky until I can find a real equation.
          #           * 0 <= t && t <= 1
          #           
          t = 0.1
          while t < 1
            xt = pow(1 - t, 3) * x0 + 3 * pow(1 - t, 2) * t * x1 + 3 * pow(1 - t, 1) * pow(t, 2) * x2 + pow(t, 3) * x3
            
            #extremas
            cx_max = xt  if xt > cx_max
            cx_min = xt  if xt < cx_min
            yt = pow(1 - t, 3) * y0 + 3 * pow(1 - t, 2) * t * y1 + 3 * pow(1 - t, 1) * pow(t, 2) * y2 + pow(t, 3) * y3
            
            #extremas
            cy_max = yt  if yt > cy_max
            cy_min = yt  if yt < cy_min
            t += 0.1
          
          #update extremas
          @__minX = min(0, x0, cx_min, x3, @__minX)
          @__minY = min(0, y0, cy_min, y3, @__minY)
          @__maxX = max(0, x0, cx_max, x3, @__maxX)
          @__maxY = max(0, y0, cy_max, y3, @__maxY)
          
          #update size for bounding box
          gfx_node.width = -@__minX + @__maxX
          gfx_node.height = -@__minY + @__maxY
          draw_commands.push (ctx) ->
            ctx.bezierCurveTo x1, y1, x2, y2, x3, y3

          
          #update cursor
          cursor_x = x3
          cursor_y = y3
          this

      
      ###
      Specifies a simple one-color fill that subsequent calls to other
      graphics methods use when drawing.
      @name beginFill
      @param {Color} color In hex format.
      @param {number} alpha
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Colors">Colors</a> [Canvas Tutorial]
      ###
      beginFill:
        enumerable: false
        writable: false
        configurable: false
        value: (color, alpha) ->
          alpha = (if (alpha is `undefined`) then 1 else alpha)
          
          #DEBUG
          type_check color, "*", alpha, "number",
            label: "Graphics.beginFill"
            params: ["color", "alpha"]
            id: gfx_node.id

          
          #END_DEBUG
          draw_commands.push (ctx) ->
            ctx.fillStyle = hex_to_rgb_str(color, alpha)

          this

      
      ###
      @name beginLinearGradientFill
      @param {number}    x1
      @param {number}    y1
      @param {number}    x2
      @param {number}    y2
      @param {Array}     ratios Array of numbers.
      @param {Array}     colors
      @param {Array}     alphas
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createlineargradient">context.createLinearGradient</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createradialgradient">context.createRadialGradient</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-canvasgradient-addcolorstop">context.addColorStop</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Gradients">Gradients</a> [Canvas Tutorial]
      ###
      beginLinearGradientFill:
        enumerable: true
        writable: false
        configurable: false
        value: (x1, y1, x2, y2, ratios, colors, alphas) ->
          
          #DEBUG
          type_check x1, "number", y1, "number", x2, "number", y2, "number", ratios, "array", colors, "array", alphas, "array",
            label: "Graphics.beginLinearGradientFill"
            params: ["x1", "y1", "x2", "y2", "ratios", "colors", "alphas"]
            id: gfx_node.id

          
          #END_DEBUG
          draw_commands.push (ctx) ->
            hex_to_rgb_str = doodle.utils.hex_to_rgb_str
            
            #not really too keen on creating gfx_node here, but I need access to the context
            gradient = ctx.createLinearGradient(x1, y1, x2, y2)
            len = ratios.length
            i = 0
            
            #add color ratios to our gradient
            while i < len
              
              #DEBUG
              range_check ratios[i] >= 0, ratios[i] <= 1,
                label: "Graphics.beginLinearGradientFill"
                id: gfx_node.id
                message: "ratio must be between 0 and 1."

              
              #END_DEBUG
              gradient.addColorStop ratios[i], hex_to_rgb_str(colors[i], alphas[i])
              i++
            ctx.fillStyle = gradient

          this

      
      ###
      @name beginRadialGradientFill
      @param {number}    x1
      @param {number}    y1
      @param {number}    r1
      @param {number}    x2
      @param {number}    y2
      @param {number}    r2
      @param {Array}     ratios Array of numbers.
      @param {Array}     colors
      @param {Array}     alphas
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createlineargradient">context.createLinearGradient</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createradialgradient">context.createRadialGradient</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-canvasgradient-addcolorstop">context.addColorStop</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Gradients">Gradients</a> [Canvas Tutorial]
      ###
      beginRadialGradientFill:
        enumerable: true
        writable: false
        configurable: false
        value: (x1, y1, r1, x2, y2, r2, ratios, colors, alphas) ->
          
          #DEBUG
          type_check x1, "number", y1, "number", r1, "number", x2, "number", y2, "number", r2, "number", ratios, "array", colors, "array", alphas, "array",
            label: "Graphics.beginRadialGradientFill"
            params: ["x1", "y1", "r1", "x2", "y2", "r2", "ratios", "colors", "alphas"]
            id: gfx_node.id

          
          #END_DEBUG
          draw_commands.push (ctx) ->
            hex_to_rgb_str = doodle.utils.hex_to_rgb_str
            gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
            len = ratios.length
            i = 0
            
            #add color ratios to our gradient
            while i < len
              
              #DEBUG
              range_check ratios[i] >= 0, ratios[i] <= 1,
                label: "Graphics.beginGradientFill"
                id: gfx_node.id
                message: "ratio must be between 0 and 1."

              
              #END_DEBUG
              gradient.addColorStop ratios[i], hex_to_rgb_str(colors[i], alphas[i])
              i++
            ctx.fillStyle = gradient

          this

      
      ###
      @name beginPatternFill
      @param {HTMLImageElement} image
      @param {Pattern} repeat
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createpattern">context.createPattern</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Patterns">Patterns</a> [Canvas Tutorial]
      ###
      beginPatternFill:
        enumerable: true
        writable: false
        configurable: false
        value: (image, repeat) ->
          img_loaded = null #image after loaded
          on_image_error = undefined
          Pattern = doodle.Pattern
          repeat = (if (repeat is `undefined`) then Pattern.REPEAT else repeat)
          
          #DEBUG
          type_check image, "*", repeat, "string",
            label: "Graphics.beginPatternFill"
            params: ["image", "repeat"]
            id: gfx_node.id

          reference_check repeat is Pattern.REPEAT or repeat is Pattern.NO_REPEAT or repeat is Pattern.REPEAT_X or repeat isnt Pattern.REPEAT_Y,
            label: "Graphics.beginPatternFill"
            id: gfx_node.id
            message: "Invalid Pattern type."

          
          #END_DEBUG
          if typeof image is "string"
            
            #element id
            if image[0] is "#"
              image = get_element(image)
            else
              
              #url
              (->
                img_url = window.encodeURI(image)
                image = new window.Image()
                image.src = img_url
              )()
          
          #DEBUG
          reference_check image and image.tagName is "IMG",
            label: "Graphics.beginPatternFill"
            id: gfx_node.id
            message: "Parameter must be an src url, image object, or element id."

          
          #END_DEBUG
          
          #check if image has already been loaded
          if image.complete
            img_loaded = image
          else
            
            #if not, assign load handlers
            image.onload = ->
              img_loaded = image
              gfx_node.emit createEvent(LOAD)

            on_image_error = ->
              throw new URIError(gfx_node.id + "Graphics.beginPatternFill(*image*,repeat): Unable to load " + image.src)

            image.onerror = on_image_error
            image.onabort = on_image_error
          draw_commands.push (ctx) ->
            if img_loaded
              ctx.fillStyle = ctx.createPattern(img_loaded, repeat)
            else
              
              #use transparent fill until image is loaded
              ctx.fillStyle = "rgba(0,0,0,0)"

          this

      
      ###
      @name lineStyle
      @param {number} thickness
      @param {Color} color
      @param {number} alpha
      @param {LineCap} caps
      @param {LineJoin} joints
      @param {number} miterLimit
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.lineWidth</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-strokestyle">context.strokeStyle</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linecap">context.lineCap</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linejoin">context.lineJoin</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.miterLimit</a> [Canvas API]
      ###
      lineStyle:
        enumerable: true
        writable: false
        configurable: false
        value: (thickness, color, alpha, caps, joints, miterLimit) ->
          
          #defaults
          thickness = (if (thickness is `undefined`) then 1 else thickness)
          color = (if (color is `undefined`) then "#000000" else color)
          alpha = (if (alpha is `undefined`) then 1 else alpha)
          caps = (if (caps is `undefined`) then doodle.LineCap.BUTT else caps)
          joints = (if (joints is `undefined`) then doodle.LineJoin.MITER else joints)
          miterLimit = (if (miterLimit is `undefined`) then 10 else miterLimit)
          
          #DEBUG
          type_check thickness, "number", color, "*", alpha, "number", caps, "string", joints, "string", miterLimit, "number",
            label: "Graphics.lineStyle"
            params: ["thickness", "color", "alpha", "caps", "joints", "miterLimit"]
            id: gfx_node.id

          
          #check values
          range_check window.isFinite(thickness), thickness >= 0,
            label: "Graphics.lineStyle"
            id: gfx_node.id
            message: "thickness must have a positive number."

          reference_check caps is doodle.LineCap.BUTT or caps is doodle.LineCap.ROUND or caps is doodle.LineCap.SQUARE,
            label: "Graphics.lineStyle"
            id: gfx_node.id
            message: "Invalid LineCap: " + caps

          reference_check joints is doodle.LineJoin.BEVEL or joints is doodle.LineJoin.MITER or joints is doodle.LineJoin.ROUND,
            label: "Graphics.lineStyle"
            id: gfx_node.id
            message: "Invalid LineJoin: " + joints

          range_check window.isFinite(miterLimit), miterLimit >= 0,
            label: "Graphics.lineStyle"
            id: gfx_node.id
            message: "miterLimit must have a positive number."

          
          #END_DEBUG
          line_width = thickness
          line_join = joints
          line_cap = caps
          line_miter = miterLimit
          
          #convert color to canvas rgb() format
          if typeof color is "string" or typeof color is "number"
            color = hex_to_rgb_str(color, alpha)
          else
            throw new TypeError(gfx_node + " Graphics.lineStyle(thickness,*color*,alpha,caps,joints,miterLimit): Color must be a hex value.")
          draw_commands.push (ctx) ->
            ctx.lineWidth = line_width
            ctx.strokeStyle = color
            ctx.lineCap = line_cap
            ctx.lineJoin = line_join
            ctx.miterLimit = line_miter

          this

      
      ###
      @name beginPath
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-beginpath">context.beginPath</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
      ###
      beginPath:
        enumerable: false
        writable: false
        configurable: false
        value: ->
          draw_commands.push (ctx) ->
            ctx.beginPath()
            ctx.moveTo cursor_x, cursor_y

          this

      
      ###
      @name closePath
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-closepath">context.closePath</a> [Canvas API]
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-stroke">context.stroke</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
      ###
      closePath:
        enumerable: false
        writable: false
        configurable: false
        value: ->
          draw_commands.push (ctx) ->
            ctx.closePath()
            ctx.stroke()

          cursor_x = 0
          cursor_y = 0
          this

      
      ###
      @name endFill
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fill">context.fill</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
      ###
      endFill:
        enumerable: false
        writable: false
        configurable: false
        value: ->
          draw_commands.push (ctx) ->
            ctx.fill()

          this

      
      ###
      @name stroke
      @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-stroke">context.stroke</a> [Canvas API]
      @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
      ###
      stroke:
        enumerable: false
        writable: false
        configurable: false
        value: ->
          draw_commands.push (ctx) ->
            ctx.stroke()

          cursor_x = 0
          cursor_y = 0
          this

    #end defineProperties
    graphics

  
  ###
  Returns the string representation of the specified object.
  @name toString
  @return {string}
  @override
  @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/toString">Object.toString</a> [JS Ref]
  ###
  graphics_static_properties = toString:
    enumerable: false
    writable: false
    configurable: false
    value: ->
      "[object Graphics]"
)() #end class closure
