#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  rect_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  
  #END_DEBUG
  temp_array = new Array(4)
  
  ###
  @name doodle.geom.createRectangle
  @class
  @augments Object
  @param {number=} x
  @param {number=} y
  @param {number=} width
  @param {number=} height
  @return {doodle.geom.Rectangle}
  @throws {TypeError}
  @throws {SyntaxError}
  ###
  doodle.geom.Rectangle = doodle.geom.createRectangle = (x, y, width, height) ->
    rect = {}
    arg_len = arguments_.length
    init_obj = undefined
    Object.defineProperties rect, rect_static_properties
    
    #properties that require privacy
    Object.defineProperties rect, (->
      x = 0
      y = 0
      width = 0
      height = 0
      $temp_array = temp_array
      
      ###
      @name x
      @return {number}
      @throws {TypeError}
      @property
      ###
      x:
        enumerable: true
        configurable: false
        get: ->
          x

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Rectangle.x"
            id: @id

          range_check window.isFinite(n),
            label: "Rectangle.x"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          x = n

      
      ###
      @name y
      @return {number}
      @throws {TypeError}
      @property
      ###
      y:
        enumerable: true
        configurable: false
        get: ->
          y

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Rectangle.y"
            id: @id

          range_check window.isFinite(n),
            label: "Rectangle.y"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          y = n

      
      ###
      @name width
      @return {number}
      @throws {TypeError}
      @property
      ###
      width:
        enumerable: true
        configurable: false
        get: ->
          width

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Rectangle.width"
            id: @id

          range_check window.isFinite(n),
            label: "Rectangle.width"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          width = n

      
      ###
      @name height
      @return {number}
      @throws {TypeError}
      @property
      ###
      height:
        enumerable: true
        configurable: false
        get: ->
          height

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Rectangle.height"
            id: @id

          range_check window.isFinite(n),
            label: "Rectangle.height"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          height = n

      
      ###
      Same as toArray, but reuses array object.
      @name __toArray
      @return {Array}
      @private
      ###
      __toArray:
        enumerable: false
        writable: false
        configurable: false
        value: ->
          $temp_array[0] = x
          $temp_array[1] = y
          $temp_array[2] = width
          $temp_array[3] = height
          $temp_array

      
      ###
      @name id
      @return {string}
      ###
      id: (->
        id = null
        enumerable: true
        configurable: false
        get: ->
          (if (id is null) then @toString() else id)

        set: (idArg) ->
          
          #DEBUG
          if idArg isnt null
            type_check idArg, "string",
              label: "Point.id"
              id: @id

          
          #END_DEBUG
          id = idArg
      ())
    ()) #end defineProperties
    
    #initialize rectangle
    switch arg_len
      
      #defaults to {x:0, y:0, width:0, height:0}
      when 0, 4
        
        #standard instantiation
        rect.compose x, y, width, height
      when 1
        
        #passed an initialization obj: point, array, function
        init_obj = arguments_[0]
        x = `undefined`
        if typeof init_obj is "function"
          init_obj.call rect
        else if Array.isArray(init_obj)
          
          #DEBUG
          throw new SyntaxError("[object Rectangle]([x, y, width, height]): Invalid array parameter.")  if init_obj.length isnt 4
          
          #END_DEBUG
          rect.compose.apply rect, init_obj
        else
          
          #DEBUG
          type_check init_obj, "Rectangle",
            label: "Rectangle"
            id: @id
            params: "rectangle"
            message: "Unable to initialize with Rectangle object."

          
          #END_DEBUG
          rect.compose init_obj.x, init_obj.y, init_obj.width, init_obj.height
      else
        
        #DEBUG
        throw new SyntaxError("[object Rectangle](x, y, width, height): Invalid number of parameters.")
    
    #END_DEBUG
    rect

  #end Rectangle definition
  rect_static_properties =
    
    ###
    @name top
    @return {number}
    @throws {TypeError}
    @property
    ###
    top:
      enumerable: true
      configurable: false
      get: ->
        @y

      set: (n) ->
        
        #DEBUG
        type_check n, "number",
          label: "Rectangle.top"
          id: @id

        range_check window.isFinite(n),
          label: "Rectangle.top"
          id: @id
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        @y = n
        @height -= n

    
    ###
    @name right
    @return {number}
    @throws {TypeError}
    @property
    ###
    right:
      enumerable: true
      configurable: false
      get: ->
        @x + @width

      set: (n) ->
        
        #DEBUG
        type_check n, "number",
          label: "Rectangle.right"
          id: @id

        range_check window.isFinite(n),
          label: "Rectangle.right"
          id: @id
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        @width = n - @x

    
    ###
    @name bottom
    @return {number}
    @throws {TypeError}
    @property
    ###
    bottom:
      enumerable: true
      configurable: false
      get: ->
        @y + @height

      set: (n) ->
        
        #DEBUG
        type_check n, "number",
          label: "Rectangle.bottom"
          id: @id

        range_check window.isFinite(n),
          label: "Rectangle.bottom"
          id: @id
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        @height = n - @y

    
    ###
    @name left
    @return {number}
    @throws {TypeError}
    @property
    ###
    left:
      enumerable: true
      configurable: false
      get: ->
        @x

      set: (n) ->
        
        #DEBUG
        type_check n, "number",
          label: "Rectangle.left"
          id: @id

        range_check window.isFinite(n),
          label: "Rectangle.left"
          id: @id
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        @x = n
        @width -= n

    
    ###
    @name toString
    @return {string}
    ###
    toString:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        "(x=" + @x + ",y=" + @y + ",w=" + @width + ",h=" + @height + ")"

    
    ###
    @name toArray
    @return {Array}
    ###
    toArray:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        @__toArray().concat()

    
    ###
    Sets this rectangle's parameters.
    @name compose
    @param {number} x
    @param {number} y
    @param {number} w
    @param {number} h
    @return {Rectangle}
    @throws {TypeError}
    ###
    compose:
      enumerable: true
      writable: false
      configurable: false
      value: (x, y, w, h) ->
        
        #DEBUG
        type_check x, "number", y, "number", w, "number", h, "number",
          label: "Rectangle.compose"
          params: ["x", "y", "width", "height"]
          id: @id

        range_check window.isFinite(x), window.isFinite(y), window.isFinite(w), window.isFinite(h),
          label: "Rectangle.compose"
          id: @id
          params: ["x", "y", "width", "height"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        @x = x
        @y = y
        @width = w
        @height = h
        this

    
    ###
    Same as compose, but takes a rectangle parameter.
    @name __compose
    @param {Rectangle} rect
    @return {Rectangle}
    @throws {TypeError}
    @private
    ###
    __compose:
      enumerable: false
      writable: false
      configurable: false
      value: (rect) ->
        
        #DEBUG
        type_check rect, "Rectangle",
          label: "Rectangle.__compose"
          params: "rectangle"
          id: @id

        
        #END_DEBUG
        @compose.apply this, rect.__toArray()
        this

    
    ###
    @name clone
    @return {Rectangle}
    ###
    clone:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        doodle.geom.createRectangle @x, @y, @width, @height

    
    ###
    Adjusts the location of the rectangle, as determined by
    its top-left corner, by the specified amounts.
    @name offset
    @param {number} dx
    @param {number} dy
    @return {Rectangle}
    @throws {TypeError}
    ###
    offset:
      enumerable: true
      writable: false
      configurable: false
      value: (dx, dy) ->
        
        #DEBUG
        type_check dx, "number", dy, "number",
          label: "Rectangle.offset"
          params: ["dx", "dy"]
          id: @id

        range_check window.isFinite(dx), window.isFinite(dy),
          label: "Rectangle.offset"
          id: @id
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        @x += dx
        @y += dy
        this

    
    ###
    Increases the size of the rectangle by the specified amounts, in pixels.
    The center point of the Rectangle object stays the same, and its size
    increases to the left and right by the dx value, and to the top and the
    bottom by the dy value.
    @name inflate
    @param {number} dx
    @param {number} dy
    @return {Rectangle}
    @throws {TypeError}
    ###
    inflate:
      enumerable: true
      writable: false
      configurable: false
      value: (dx, dy) ->
        
        #DEBUG
        type_check dx, "number", dy, "number",
          label: "Rectangle.inflate"
          params: ["dx", "dy"]
          id: @id

        range_check window.isFinite(dx), window.isFinite(dy),
          label: "Rectangle.inflate"
          id: @id
          params: ["dx", "dy"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        @x -= dx
        @width += 2 * dx
        @y -= dy
        @height += 2 * dy
        this

    
    ###
    Determines whether the rectangle argument is equal to this rectangle.
    @name equals
    @param {Rectangle} rect
    @return {boolean}
    @throws {TypeError}
    ###
    equals:
      enumerable: true
      writable: false
      configurable: false
      value: (rect) ->
        
        #DEBUG
        type_check rect, "Rectangle",
          label: "Rectangle.equals"
          params: "rectangle"
          id: @id

        
        #END_DEBUG
        @x is rect.x and @y is rect.y and @width is rect.width and @height is rect.height

    
    ###
    Determines whether or not this Rectangle object is empty.
    @name isEmpty
    @return {boolean}
    ###
    isEmpty:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        @width >= 0 or @height >= 0

    
    ###
    Determines whether the specified point is contained within the
    rectangular region defined by this Rectangle object.
    @name contains
    @param {number} x
    @param {number} y
    @return {boolean}
    @throws {TypeError}
    ###
    contains:
      enumerable: false
      writable: false
      configurable: false
      value: (x, y) ->
        
        #DEBUG
        type_check x, "number", y, "number",
          label: "Rectangle.contains"
          params: ["x", "y"]
          id: @id

        range_check window.isFinite(x), window.isFinite(y),
          label: "Rectangle.contains"
          params: ["x", "y"]
          id: @id
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        x >= @left and x <= @right and y >= @top and y <= @bottom

    
    ###
    Determines whether the specified point is contained within
    this rectangle object.
    @name containsPoint
    @param {Point} pt
    @return {boolean}
    @throws {TypeError}
    ###
    containsPoint:
      enumerable: true
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Rectangle.containsPoint"
          params: "point"
          id: @id

        
        #END_DEBUG
        @contains pt.x, pt.y

    
    ###
    Determines whether the rectangle argument is contained within this rectangle.
    @name containsRect
    @param {Rectangle} rect
    @return {boolean}
    @throws {TypeError}
    ###
    containsRect:
      enumerable: true
      writable: false
      configurable: false
      value: (rect) ->
        
        #DEBUG
        type_check rect, "Rectangle",
          label: "Rectangle.containsRect"
          params: "rectangle"
          id: @id

        
        #END_DEBUG
        right = rect.x + rect.width
        bot = rect.y + rect.height
        
        #check corners: tl, tr, br, bl
        @contains(rect.x, rect.y) and @contains(right, rect.y) and @contains(right, bot) and @contains(rect.x, bot)

    
    ###
    Determines whether the rectangle argument intersects with this rectangle.
    @name intersects
    @param {Rectangle} rect
    @return {boolean}
    @throws {TypeError}
    ###
    intersects:
      enumerable: true
      writable: false
      configurable: false
      value: (rect) ->
        
        #DEBUG
        type_check rect, "Rectangle",
          label: "Rectangle.intersects"
          params: "rectangle"
          id: @id

        
        #END_DEBUG
        right = rect.x + rect.width
        bot = rect.y + rect.height
        
        #check corners: tl, tr, br, bl
        @contains(rect.x, rect.y) or @contains(right, rect.y) or @contains(right, bot) or @contains(rect.x, bot)

    
    ###
    If the rectangle argument intersects with this rectangle, returns
    the area of intersection as a Rectangle object.
    If the rectangles do not intersect, this method returns an empty
    Rectangle object with its properties set to 0.
    @name intersection
    @param {Rectangle} rect
    @return {Rectangle}
    @throws {TypeError}
    ###
    intersection:
      enumerable: true
      writable: false
      configurable: false
      value: (rect) ->
        
        #DEBUG
        type_check rect, "Rectangle",
          label: "Rectangle.intersection"
          params: "rectangle"
          id: @id

        
        #END_DEBUG
        r = doodle.geom.createRectangle(0, 0, 0, 0)
        if @intersects(rect)
          r.left = Math.max(@left, rect.x)
          r.top = Math.max(@top, rect.y)
          r.right = Math.min(@right, rect.x + rect.width)
          r.bottom = Math.min(@bottom, rect.y + rect.height)
        r

    
    ###
    Same as intersection, but modifies this rectangle in place.
    @name __intersection
    @param {Rectangle} rect
    @return {Rectangle}
    @throws {TypeError}
    @private
    ###
    __intersection:
      enumerable: false
      writable: false
      configurable: false
      value: (rect) ->
        
        #DEBUG
        type_check rect, "Rectangle",
          label: "Rectangle.__intersection"
          params: "rectangle"
          id: @id

        
        #END_DEBUG
        if @intersects(rect)
          @left = Math.max(@left, rect.x)
          @top = Math.max(@top, rect.y)
          @right = Math.min(@right, rect.x + rect.width)
          @bottom = Math.min(@bottom, rect.y + rect.height)
        this

    
    ###
    Adds two rectangles together to create a new Rectangle object,
    by filling in the horizontal and vertical space between the two.
    @name union
    @param {Rectangle} rect
    @return {Rectangle}
    @throws {TypeError}
    ###
    union:
      enumerable: true
      writable: false
      configurable: false
      value: (rect) ->
        
        #DEBUG
        type_check rect, "Rectangle",
          label: "Rectangle.union"
          params: "rectangle"
          id: @id

        
        #END_DEBUG
        r = doodle.geom.createRectangle(0, 0, 0, 0)
        r.left = Math.min(@left, rect.x)
        r.top = Math.min(@top, rect.y)
        r.right = Math.max(@right, rect.x + rect.width)
        r.bottom = Math.max(@bottom, rect.y + rect.height)
        r

    
    ###
    Same as union, but modifies this rectangle in place.
    @name __union
    @param {Rectangle} rect
    @return {Rectangle}
    @throws {TypeError}
    @private
    ###
    __union:
      enumerable: false
      writable: false
      configurable: false
      value: (rect) ->
        
        #DEBUG
        type_check rect, "Rectangle",
          label: "Rectangle.__union"
          params: "rectangle"
          id: @id

        
        #END_DEBUG
        
        #a bit tricky, if applied directly it doesn't work
        l = Math.min(@left, rect.x)
        t = Math.min(@top, rect.y)
        r = Math.max(@right, rect.x + rect.width)
        b = Math.max(@bottom, rect.y + rect.height)
        @left = l
        @top = t
        @right = r
        @bottom = b
        this
#end rect_static_properties definition
)() #end class closure

#
# * CLASS FUNCTIONS
# 

###
Check if a given object contains a numeric rectangle properties including
x, y, width, height, top, bottom, right, left.
Does not check if a rectangle is actually a doodle.geom.rectangle.
@name isRect
@param {Rectangle} rect Object with numeric rectangle parameters.
@return {boolean}
@static
###
doodle.geom.Rectangle.isRectangle = (rect) ->
  typeof rect is "object" and typeof rect.x is "number" and typeof rect.y is "number" and typeof rect.width is "number" and typeof rect.height is "number"
