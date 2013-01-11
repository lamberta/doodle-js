#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  matrix_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  
  #END_DEBUG
  temp_array = new Array(6)
  temp_point =
    x: null
    y: null

  temp_matrix =
    a: null
    b: null
    c: null
    d: null
    tx: null
    ty: null

  
  #lookup help
  createPoint = doodle.geom.createPoint
  
  ###
  @name doodle.geom.createMatrix
  @class
  @augments Object
  @param {number=} a
  @param {number=} b
  @param {number=} c
  @param {number=} d
  @param {number=} tx
  @param {number=} ty
  @return {doodle.geom.Matrix}
  @throws {TypeError}
  @throws {SyntaxError}
  ###
  doodle.geom.Matrix = doodle.geom.createMatrix = (a, b, c, d, tx, ty) ->
    matrix = {}
    arg_len = arguments_.length
    init_obj = undefined
    Object.defineProperties matrix, matrix_static_properties
    
    #properties that require privacy
    Object.defineProperties matrix, (->
      a = 1
      b = 0
      c = 0
      d = 1
      tx = 0
      ty = 0
      $temp_array = temp_array
      
      ###
      The value that affects the positioning of pixels along the x axis
      when scaling or rotating an image.
      @name a
      @return {number}
      @throws {TypeError}
      @property
      ###
      a:
        enumerable: true
        configurable: false
        get: ->
          a

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Matrix.a"
            id: @id

          
          #range_check(window.isFinite(n), {label:'Matrix.a', id:this.id, message:"Parameter must be a finite number."});
          #END_DEBUG
          a = n

      
      ###
      The value that affects the positioning of pixels along the y axis
      when rotating or skewing an image.
      @name b
      @return {number}
      @throws {TypeError}
      @property
      ###
      b:
        enumerable: true
        configurable: false
        get: ->
          b

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Matrix.b"
            id: @id

          
          #range_check(window.isFinite(n), {label:'Matrix.b', id:this.id, message:"Parameter must be a finite number."});
          #END_DEBUG
          b = n

      
      ###
      The value that affects the positioning of pixels along the x axis
      when rotating or skewing an image.
      @name c
      @return {number}
      @throws {TypeError}
      @property
      ###
      c:
        enumerable: true
        configurable: false
        get: ->
          c

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Matrix.c"
            id: @id

          
          #range_check(window.isFinite(n), {label:'Matrix.c', id:this.id, message:"Parameter must be a finite number."});
          #END_DEBUG
          c = n

      
      ###
      The value that affects the positioning of pixels along the y axis
      when scaling or rotating an image.
      @name d
      @return {number}
      @throws {TypeError}
      @property
      ###
      d:
        enumerable: true
        configurable: false
        get: ->
          d

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Matrix.d"
            id: @id

          
          #range_check(window.isFinite(n), {label:'Matrix.d', id:this.id, message:"Parameter must be a finite number."});
          #END_DEBUG
          d = n

      
      ###
      The distance by which to translate each point along the x axis.
      @name tx
      @return {number}
      @throws {TypeError}
      @property
      ###
      tx:
        enumerable: true
        configurable: false
        get: ->
          tx

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Matrix.tx"
            id: @id

          
          #range_check(window.isFinite(n), {label:'Matrix.tx', id:this.id, message:"Parameter must be a finite number."});
          #END_DEBUG
          tx = n

      
      ###
      The distance by which to translate each point along the y axis.
      @name ty
      @return {number}
      @throws {TypeError}
      @property
      ###
      ty:
        enumerable: true
        configurable: false
        get: ->
          ty

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Matrix.ty"
            id: @id

          
          #range_check(window.isFinite(n), {label:'Matrix.ty', id:this.id, message:"Parameter must be a finite number."});
          #END_DEBUG
          ty = n

      
      ###
      Same as toArray, but reuses array object.
      @return {Array}
      @private
      ###
      __toArray:
        enumerable: false
        writable: false
        configurable: false
        value: ->
          $temp_array[0] = a
          $temp_array[1] = b
          $temp_array[2] = c
          $temp_array[3] = d
          $temp_array[4] = tx
          $temp_array[5] = ty
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
    
    # initialize matrix
    #     
    switch arg_len
      
      #defaults to 1,0,0,1,0,0
      when 0, 6
        
        #standard instantiation
        matrix.compose a, b, c, d, tx, ty
      when 1
        
        #passed an initialization obj: matrix, array, function
        init_obj = arguments_[0]
        a = `undefined`
        if typeof init_obj is "function"
          init_obj.call matrix
        else if Array.isArray(init_obj)
          
          #DEBUG
          throw new SyntaxError("[object Matrix]([a, b, c, d, tx, ty]): Invalid array parameter.")  if init_obj.length isnt 6
          
          #END_DEBUG
          matrix.compose.apply matrix, init_obj
        else
          
          #DEBUG
          type_check init_obj, "Matrix",
            label: "doodle.geom.Matrix"
            id: @id
            params: "matrix"
            message: "Invalid initialization object."

          
          #END_DEBUG
          matrix.compose init_obj.a, init_obj.b, init_obj.c, init_obj.d, init_obj.tx, init_obj.ty
      else
        
        #DEBUG
        throw new SyntaxError("[object Matrix](a, b, c, d, tx, ty): Invalid number of parameters.")
    
    #END_DEBUG
    matrix

  #end Matrix defintion
  matrix_static_properties =
    
    ###
    Set values of this matrix with the specified parameters.
    @name compose
    @param {number} a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
    @param {number} b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
    @param {number} c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
    @param {number} d The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
    @param {number} tx The distance by which to translate each point along the x axis.
    @param {number} ty The distance by which to translate each point along the y axis.
    @return {Matrix}
    @throws {TypeError}
    ###
    compose:
      enumerable: true
      writable: false
      configurable: false
      value: (a, b, c, d, tx, ty) ->
        
        #DEBUG
        type_check a, "number", b, "number", c, "number", d, "number", tx, "number", ty, "number",
          label: "Matrix.compose"
          id: @id
          params: ["a", "b", "c", "d", "tx", "ty"]

        
        #range_check(window.isFinite(a), window.isFinite(b), window.isFinite(c), window.isFinite(d), window.isFinite(tx), window.isFinite(ty), {label:'Matrix.compose', id:this.id, params:['a','b','c','d','tx','ty'], message:"Parameters must be finite numbers."});
        #END_DEBUG
        @a = a
        @b = b
        @c = c
        @d = d
        @tx = tx
        @ty = ty
        this

    
    ###
    Returns an array value containing the properties of the Matrix object.
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
    Returns a text value listing the properties of the Matrix object.
    @name toString
    @return {string}
    ###
    toString:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        "(a=" + @a + ",b=" + @b + ",c=" + @c + ",d=" + @d + ",tx=" + @tx + ",ty=" + @ty + ")"

    
    ###
    Test if matrix is equal to this one.
    @name equals
    @param {Matrix} m
    @return {boolean}
    @throws {TypeError}
    ###
    equals:
      enumerable: true
      writable: false
      configurable: false
      value: (m) ->
        
        #DEBUG
        type_check m, "Matrix",
          label: "Matrix.equals"
          id: @id
          params: "matrix"

        
        #END_DEBUG
        @a is m.a and @b is m.b and @c is m.c and @d is m.d and @tx is m.tx and @ty is m.ty

    
    ###
    Sets each matrix property to a value that causes a null transformation.
    @name identity
    @return {Matrix}
    ###
    identity:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        @a = 1
        @b = 0
        @c = 0
        @d = 1
        @tx = 0
        @ty = 0
        this

    
    ###
    Returns a new Matrix object that is a clone of this matrix,
    with an exact copy of the contained object.
    @name clone
    @return {Matrix}
    ###
    clone:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        doodle.geom.createMatrix @a, @b, @c, @d, @tx, @ty

    
    ###
    Multiplies a matrix with the current matrix,
    effectively combining the geometric effects of the two.
    @name multiply
    @param {Matrix} m The matrix to be concatenated to the source matrix.
    @return {Matrix}
    @throws {TypeError}
    ###
    multiply:
      enumerable: true
      writable: false
      configurable: false
      value: (m) ->
        
        #DEBUG
        type_check m, "Matrix",
          label: "Matrix.multiply"
          id: @id
          params: "matrix"

        
        #END_DEBUG
        a = @a * m.a + @c * m.b
        b = @b * m.a + @d * m.b
        c = @a * m.c + @c * m.d
        d = @b * m.c + @d * m.d
        tx = @a * m.tx + @c * m.ty + @tx
        ty = @b * m.tx + @d * m.ty + @ty
        @compose a, b, c, d, tx, ty

    
    ###
    Applies a rotation transformation to the Matrix object.
    @name rotate
    @param {number} angle The rotation angle in radians.
    @return {Matrix}
    @throws {TypeError}
    ###
    rotate:
      enumerable: true
      writable: false
      configurable: false
      value: (r) ->
        
        #DEBUG
        type_check r, "number",
          label: "Matrix.rotate"
          id: @id
          params: "radians"

        range_check window.isFinite(r),
          label: "Matrix.rotate"
          id: @id
          params: "radians"
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        c = Math.cos(r)
        s = Math.sin(r)
        m = temp_matrix
        m.a = c
        m.b = s
        m.c = -s
        m.d = c
        m.tx = 0
        m.ty = 0
        @multiply m

    
    ###
    Applies a rotation transformation to the Matrix object, ignore translation.
    @name deltaRotate
    @param {number} angle The rotation angle in radians.
    @return {Matrix}
    @throws {TypeError}
    ###
    deltaRotate:
      enumerable: true
      writable: false
      configurable: false
      value: (r) ->
        
        #DEBUG
        type_check r, "number",
          label: "Matrix.deltaRotate"
          id: @id
          params: "radians"

        range_check window.isFinite(r),
          label: "Matrix.deltaRotate"
          id: @id
          params: "radians"
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        x = @tx
        y = @ty
        @rotate r
        @tx = x
        @ty = y
        this

    
    ###
    Return the angle of rotation in radians.
    @name rotation
    @return {number} radians
    @throws {TypeError}
    @property
    ###
    rotation:
      enumerable: true
      configurable: false
      get: ->
        Math.atan2 @b, @a

      set: (r) ->
        
        #DEBUG
        type_check r, "number",
          label: "Matrix.rotation"
          id: @id
          message: "Parameter must be a number in radians."

        range_check window.isFinite(r),
          label: "Matrix.rotation"
          id: @id
          params: "radians"
          message: "Parameter must be a finite number."

        
        #END_DEBUG
        c = Math.cos(r)
        s = Math.sin(r)
        @compose c, s, -s, c, @tx, @ty

    
    ###
    Applies a scaling transformation to the matrix.
    @name scale
    @param {number} sx A multiplier used to scale the object along the x axis.
    @param {number} sy A multiplier used to scale the object along the y axis.
    @return {Matrix}
    @throws {TypeError}
    ###
    scale:
      enumerable: true
      writable: false
      configurable: false
      value: (sx, sy) ->
        
        #DEBUG
        type_check sx, "number", sy, "number",
          label: "Matrix.scale"
          id: @id
          params: ["sx", "sy"]

        range_check window.isFinite(sx), window.isFinite(sy),
          label: "Matrix.scale"
          id: @id
          params: ["sx", "sy"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        temp_matrix.a = sx
        temp_matrix.b = 0
        temp_matrix.c = 0
        temp_matrix.d = sy
        temp_matrix.tx = 0
        temp_matrix.ty = 0
        @multiply temp_matrix

    
    ###
    Applies a scaling transformation to the matrix, ignores translation.
    @name deltaScale
    @param {number} sx A multiplier used to scale the object along the x axis.
    @param {number} sy A multiplier used to scale the object along the y axis.
    @return {Matrix}
    @throws {TypeError}
    ###
    deltaScale:
      enumerable: true
      writable: false
      configurable: false
      value: (sx, sy) ->
        
        #DEBUG
        type_check sx, "number", sy, "number",
          label: "Matrix.deltaScale"
          id: @id
          params: ["sx", "sy"]

        range_check window.isFinite(sx), window.isFinite(sy),
          label: "Matrix.deltaScale"
          id: @id
          params: ["sx", "sy"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        x = @tx
        y = @ty
        @scale sx, sy
        @tx = x
        @ty = y
        this

    
    ###
    Translates the matrix along the x and y axes.
    @name translate
    @param {number} dx The amount of movement along the x axis to the right, in pixels.
    @param {number} dy The amount of movement down along the y axis, in pixels.
    @return {Matrix}
    @throws {TypeError}
    ###
    translate:
      enumerable: true
      writable: false
      configurable: false
      value: (dx, dy) ->
        
        #DEBUG
        type_check dx, "number", dy, "number",
          label: "Matrix.translate"
          id: @id
          params: ["dx", "dy"]

        range_check window.isFinite(dx), window.isFinite(dy),
          label: "Matrix.translate"
          id: @id
          params: ["dx", "dy"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        @tx += dx
        @ty += dy
        this

    
    ###
    @name skew
    @param {number} skewX
    @param {number} skewY
    @return {Matrix}
    @throws {TypeError}
    ###
    skew:
      enumerable: true
      writable: false
      configurable: false
      value: (skewX, skewY) ->
        
        #DEBUG
        type_check skewX, "number", skewY, "number",
          label: "Matrix.skew"
          id: @id
          params: ["skewX", "skewY"]

        range_check window.isFinite(skewX), window.isFinite(skewY),
          label: "Matrix.skew"
          id: @id
          params: ["skewX", "skewY"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        sx = Math.tan(skewX)
        sy = Math.tan(skewY)
        m = temp_matrix
        m.a = 1
        m.b = sy
        m.c = sx
        m.d = 1
        m.tx = 0
        m.ty = 0
        @multiply m

    
    ###
    Skew matrix and ignore translation.
    @name deltaSkew
    @param {number} skewX
    @param {number} skewY
    @return {Matrix}
    @throws {TypeError}
    ###
    deltaSkew:
      enumerable: true
      writable: false
      configurable: false
      value: (skewX, skewY) ->
        
        #DEBUG
        type_check skewX, "number", skewY, "number",
          label: "Matrix.deltaSkew"
          id: @id
          params: ["skewX", "skewY"]

        range_check window.isFinite(skewX), window.isFinite(skewY),
          label: "Matrix.deltaSkew"
          id: @id
          params: ["skewX", "skewY"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        x = @tx
        y = @ty
        @skew skewX, skewY
        @tx = x
        @ty = y
        this

    
    ###
    Add a matrix with the current matrix.
    @name add
    @param {Matrix} m
    @return {Matrix}
    @throws {TypeError}
    ###
    add:
      enumerable: true
      writable: false
      configurable: false
      value: (m) ->
        
        #DEBUG
        type_check m, "Matrix",
          label: "Matrix.add"
          id: @id
          params: "matrix"

        
        #END_DEBUG
        @a += m.a
        @b += m.b
        @c += m.c
        @d += m.d
        @tx += m.tx
        @ty += m.ty
        this

    
    ###
    Performs the opposite transformation of the original matrix.
    @name invert
    @return {Matrix}
    ###
    invert:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        det = @a * @d - @b * @c
        a = @d / det
        b = -@b / det
        c = -@c / det
        d = @a / det
        tx = (@ty * @c - @d * @tx) / det
        ty = -(@ty * @a - @b * @tx) / det
        @compose a, b, c, d, tx, ty

    
    ###
    Returns the result of applying the geometric transformation
    represented by the Matrix object to the specified point.
    @name transformPoint
    @param {Point} pt
    @return {Point}
    @throws {TypeError}
    ###
    transformPoint:
      enumerable: true
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Matrix.transformPoint"
          id: @id
          params: "point"

        
        #END_DEBUG
        createPoint @a * pt.x + @c * pt.y + @tx, @b * pt.x + @d * pt.y + @ty

    
    ###
    Same as transformPoint, but modifies the point object argument.
    @name __transformPoint
    @throws {TypeError}
    @private
    ###
    __transformPoint:
      enumerable: false
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Matrix.__transformPoint"
          id: @id
          params: "point"

        
        #END_DEBUG
        x = pt.x
        y = pt.y
        pt.x = @a * x + @c * y + @tx
        pt.y = @b * x + @d * y + @ty
        pt

    
    ###
    Given a point in the pretransform coordinate space, returns
    the coordinates of that point after the transformation occurs.
    Unlike 'transformPoint', does not consider translation.
    @name deltaTransformPoint
    @param {Point} pt
    @return {Point}
    @throws {TypeError}
    ###
    deltaTransformPoint:
      enumerable: true
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Matrix.deltaTransformPoint"
          id: @id
          params: "point"

        
        #END_DEBUG
        createPoint @a * pt.x + @c * pt.y, @b * pt.x + @d * pt.y

    
    ###
    Same as deltaTransformPoint, but modifies the point object argument.
    @name __deltaTransformPoint
    @throws {TypeError}
    @private
    ###
    __deltaTransformPoint:
      enumerable: false
      writable: false
      configurable: false
      value: (pt) ->
        
        #DEBUG
        type_check pt, "Point",
          label: "Matrix.__deltaTransformPoint"
          id: @id
          params: "point"

        
        #END_DEBUG
        x = pt.x
        y = pt.y
        pt.x = @a * x + @c * y
        pt.y = @b * x + @d * y
        pt

    
    ###
    @name rotateAroundExternalPoint
    @throws {TypeError}
    ###
    rotateAroundExternalPoint:
      enumerable: true
      writable: false
      configurable: false
      value: (pt, r) ->
        
        #DEBUG
        type_check pt, "Point", r, "number",
          label: "Matrix.rotateAroundExternalPoint"
          id: @id
          params: ["point", "radians"]

        range_check window.isFinite(r),
          label: "Matrix.rotateAroundExternalPoint"
          id: @id
          params: ["point", "radians"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        c = Math.cos(r)
        s = Math.sin(r)
        m = temp_matrix
        reg_pt = temp_point #new registration point
        #parent rotation matrix, global space
        m.a = c
        m.b = s
        m.c = -s
        m.d = c
        m.tx = 0
        m.ty = 0
        
        #move this matrix
        @translate -pt.x, -pt.y
        
        #parent transform this position
        reg_pt.x = m.a * @tx + m.c * @ty + m.tx
        reg_pt.y = m.b * @tx + m.d * @ty + m.ty
        
        #assign new position
        @tx = reg_pt.x
        @ty = reg_pt.y
        
        #apply parents rotation, and put back
        @multiply(m).translate pt.x, pt.y

    
    ###
    @name rotateAroundInternalPoint
    @throws {TypeError}
    ###
    rotateAroundInternalPoint:
      enumerable: true
      writable: false
      configurable: false
      value: (point, r) ->
        
        #DEBUG
        type_check point, "Point", r, "number",
          label: "Matrix.rotateAroundInternalPoint"
          id: @id
          params: ["point", "radians"]

        range_check window.isFinite(r),
          label: "Matrix.rotateAroundInternalPoint"
          id: @id
          params: ["point", "radians"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        pt = temp_point
        pt.x = @a * point.x + @c * point.y + @tx
        pt.y = @b * point.x + @d * point.y + @ty
        @rotateAroundExternalPoint pt, r

    
    ###
    @name matchInternalPointWithExternal
    @throws {TypeError}
    ###
    matchInternalPointWithExternal:
      enumerable: true
      writable: false
      configurable: false
      value: (pt_int, pt_ext) ->
        
        #DEBUG
        type_check pt_int, "Point", pt_ext, "Point",
          label: "Matrix.matchInternalPointWithExternal"
          id: @id
          params: ["point", "point"]

        
        #END_DEBUG
        pt = temp_point
        
        #transform point
        pt.x = @a * pt_int.x + @c * pt_int.y + @tx
        pt.y = @b * pt_int.x + @d * pt_int.y + @ty
        @translate pt_ext.x - pt.x, pt_ext.y - pt.y

    
    ###
    Update matrix 'in-between' this and another matrix
    given a value of t bewteen 0 and 1.
    @name interpolate
    @return {Matrix}
    @throws {TypeError}
    ###
    interpolate:
      enumerable: true
      writable: false
      configurable: false
      value: (m, t) ->
        
        #DEBUG
        type_check m, "Matrix", t, "number",
          label: "Matrix.interpolate"
          id: @id
          params: ["matrix", "time"]

        range_check window.isFinite(t),
          label: "Matrix.interpolate"
          id: @id
          params: ["matrix", "*time*"]
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        @a = @a + (m.a - @a) * t
        @b = @b + (m.b - @b) * t
        @c = @c + (m.c - @c) * t
        @d = @d + (m.d - @d) * t
        @tx = @tx + (m.tx - @tx) * t
        @ty = @ty + (m.ty - @ty) * t
        this
#end matrix_static_properties defintion
)() #end class closure

#
# * CLASS FUNCTIONS
# 

###
Check if a given object contains a numeric matrix properties.
Does not check if a matrix is actually a doodle.geom.matrix.
@name isMatrix
@param {Object} m
@return {boolean}
@static
###
doodle.geom.Matrix.isMatrix = (m) ->
  typeof m is "object" and typeof m.a is "number" and typeof m.b is "number" and typeof m.c is "number" and typeof m.d is "number" and typeof m.tx is "number" and typeof m.ty is "number"
