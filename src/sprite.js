#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  sprite_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  
  #END_DEBUG
  createRectangle = doodle.geom.createRectangle
  
  ###
  An node to display.
  @name doodle.createSprite
  @class
  @augments doodle.Node
  @param {string=} id Name or initialization function.
  @return {doodle.Sprite} A sprite object.
  @throws {SyntaxError} Invalid parameters.
  ###
  doodle.Sprite = doodle.createSprite = createSprite = (id) ->
    
    #only pass id if string, an init function will be called later
    sprite = Object.create(doodle.createNode((if (typeof id is "string") then id else `undefined`)))
    
    #DEBUG
    throw new SyntaxError("[object Sprite](id): Invalid number of parameters.")  if arguments_.length > 1
    
    #END_DEBUG
    Object.defineProperties sprite, sprite_static_properties
    
    #properties that require privacy
    Object.defineProperties sprite, (->
      draw_commands = []
      
      ###
      The graphics object contains drawing operations to be stored in draw_commands.
      Objects and Arrays are passed by reference, so these will be modified
      @name graphics
      @return {Graphics}
      @property
      ###
      graphics:
        enumerable: false
        configurable: false
        value: Object.create(doodle.createGraphics.call(sprite, draw_commands))

      
      ###
      Indicates the width of the sprite, in pixels.
      @name width
      @return {number}
      @throws {TypeError}
      @property
      ###
      width: (->
        width = 0
        enumerable: true
        configurable: false
        get: ->
          width

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Sprite.width"
            id: @id

          range_check window.isFinite(n),
            label: "Sprite.width"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          width = n
      ())
      
      ###
      Indicates the height of the sprite, in pixels.
      @name height
      @return {number}
      @throws {TypeError}
      @property
      ###
      height: (->
        height = 0
        enumerable: true
        configurable: false
        get: ->
          height

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Sprite.height"
            id: @id

          range_check window.isFinite(n),
            label: "Sprite.height"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          height = n
      ())
      
      ###
      @name getBounds
      @param {Node} targetCoordSpace
      @return {Rectangle}
      @throws {TypeError}
      @override
      ###
      getBounds:
        enumerable: true
        writable: true
        configurable: false
        value: (targetCoordSpace) ->
          
          #DEBUG
          type_check targetCoordSpace, "Node",
            label: "Sprite.getBounds"
            id: @id
            params: "targetCoordSpace"
            inherits: true

          
          #END_DEBUG
          @__getBounds(targetCoordSpace).clone()

      
      # Same as getBounds, but reuses an internal rectangle.
      #         * Since it's passed by reference, you don't want to modify it, but
      #         * it's more efficient for checking bounds.
      #         * @name __getBounds
      #         * @private
      #         
      __getBounds:
        enumerable: false
        writable: true
        configurable: false
        value: (->
          rect = createRectangle(0, 0, 0, 0) #recycle
          (targetCoordSpace) ->
            
            #DEBUG
            type_check targetCoordSpace, "Node",
              label: "Sprite.__getBounds"
              id: @id
              params: "targetCoordSpace"
              inherits: true

            
            #END_DEBUG
            children = @children
            len = children.length
            bounding_box = rect
            child_bounds = undefined
            w = @width
            h = @height
            
            #extrema points
            graphics = @graphics
            tl =
              x: graphics.__minX
              y: graphics.__minY

            tr =
              x: graphics.__minX + w
              y: graphics.__minY

            br =
              x: graphics.__minX + w
              y: graphics.__minY + h

            bl =
              x: graphics.__minX
              y: graphics.__minY + h

            min = Math.min
            max = Math.max
            
            #transform corners to global
            @__localToGlobal tl #top left
            @__localToGlobal tr #top right
            @__localToGlobal br #bot right
            @__localToGlobal bl #bot left
            #transform global to target space
            targetCoordSpace.__globalToLocal tl
            targetCoordSpace.__globalToLocal tr
            targetCoordSpace.__globalToLocal br
            targetCoordSpace.__globalToLocal bl
            
            #set rect with extremas
            bounding_box.left = min(tl.x, tr.x, br.x, bl.x)
            bounding_box.right = max(tl.x, tr.x, br.x, bl.x)
            bounding_box.top = min(tl.y, tr.y, br.y, bl.y)
            bounding_box.bottom = max(tl.y, tr.y, br.y, bl.y)
            
            #add child bounds to this
            while len--
              child_bounds = children[len].__getBounds(targetCoordSpace)
              bounding_box.__union child_bounds  if child_bounds isnt null
            bounding_box
        ())

      
      ###
      not ready
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
      ###
      
      ###
      @name hitTestObject
      @param {Node} node
      @return {boolean}
      @throws {TypeError}
      ###
      hitTestObject:
        enumerable: true
        writable: true
        configurable: false
        value: (node) ->
          
          #DEBUG
          type_check node, "Node",
            label: "Sprite.hitTestObject"
            id: @id
            params: "node"
            inherits: true

          
          #END_DEBUG
          @getBounds(this).intersects node.getBounds(this)

      
      ###
      @name hitTestPoint
      @param {number} x
      @param {number} y
      @return {boolean}
      @throws {TypeError}
      ###
      hitTestPoint:
        enumerable: true
        writable: true
        configurable: false
        value: (x, y) ->
          
          #DEBUG
          type_check x, "number", y, "number",
            label: "Sprite.hitTestPoint"
            id: @id
            params: "x,y"

          
          #END_DEBUG
          @getBounds(this).containsPoint @globalToLocal(
            x: x
            y: y
          )

      
      # When called execute all the draw commands in the stack.
      #         * This draws from screen 0,0 - transforms are applied when the
      #         * entire scene graph is drawn.
      #         * @name __draw
      #         * @param {Context} ctx 2d canvas context to draw on.
      #         * @private
      #         
      __draw:
        enumerable: false
        writable: false
        configurable: false
        value: (ctx) ->
          i = 0
          len = draw_commands.length
          
          #DEBUG
          type_check ctx, "context",
            label: "Sprite.__draw"
            id: @id
            params: "context"

          
          #END_DEBUG
          while i < len
            
            #DEBUG
            console.assert typeof draw_commands[i] is "function", "draw command is a function", draw_commands[i]
            
            #END_DEBUG
            draw_commands[i].call sprite, ctx
            i++
    ()) #end defineProperties
    
    #passed an initialization function
    arguments_[0].call sprite  if typeof arguments_[0] is "function"
    sprite

  sprite_static_properties =
    
    ###
    @name rotation
    @return {number}
    @throws {TypeError}
    @property
    ###
    rotation: (->
      to_degrees = 180 / Math.PI
      to_radians = Math.PI / 180
      enumerable: true
      configurable: false
      get: ->
        @transform.rotation * to_degrees

      set: (deg) ->
        
        #DEBUG
        type_check deg, "number",
          label: "Sprite.rotation"
          id: @id
          message: "Property must be a number specified in degrees."

        range_check window.isFinite(deg),
          label: "Sprite.rotation"
          id: @id
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        @transform.rotation = deg * to_radians
    ())
    
    ###
    Returns the string representation of the specified object.
    @name toString
    @return {string}
    @override
    ###
    toString:
      enumerable: false
      writable: false
      configurable: false
      value: ->
        "[object Sprite]"

    
    ###
    Updates the position and size of this sprite.
    @name compose
    @param {number} x
    @param {number} y
    @param {number} w
    @param {number} h
    @return {Sprite}
    @throws {TypeError}
    ###
    compose:
      enumerable: false
      writable: false
      configurable: false
      value: (x, y, w, h) ->
        
        #DEBUG
        type_check x, "number", y, "number", w, "number", h, "number",
          label: "Sprite.compose"
          id: @id
          params: ["x", "y", "width", "height"]

        range_check window.isFinite(x), window.isFinite(y), window.isFinite(w), window.isFinite(h),
          label: "Sprite.compose"
          id: @id
          message: "Parameters must all be finite numbers."

        
        #END_DEBUG
        @x = x
        @y = y
        @width = w
        @height = h
        this
#end sprite_static_properties
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is a Sprite or inherits from one.
@name isSprite
@param {Object} obj
@return {boolean}
@static
###
doodle.Sprite.isSprite = (obj) ->
  if typeof obj is "object"
    while obj
      if obj.toLocaleString() is "[object Sprite]"
        return true
      else
        obj = Object.getPrototypeOf(obj)
  false
