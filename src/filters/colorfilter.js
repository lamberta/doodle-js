#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: false, newcap: true

#globals doodle
(->
  filter_static_properties = {}
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  
  #END_DEBUG
  temp_array = new Array(8)
  
  ###
  @name doodle.filters.createColorFilter
  @class
  @augments Object
  @param {number=} x
  @param {number=} y
  @return {doodle.filters.ColorFilter}
  @throws {TypeError}
  @throws {SyntaxError}
  ###
  doodle.filters.ColorFilter = doodle.filters.createColorFilter = (redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) ->
    filter = {}
    arg_len = arguments_.length
    init_obj = undefined
    Object.defineProperties filter, filter_static_properties
    
    #properties that require privacy
    Object.defineProperties filter, (->
      id = null
      $temp_array = temp_array #local ref
      red_multiplier = 1
      green_multiplier = 1
      blue_multiplier = 1
      alpha_multiplier = 1
      red_offset = 0
      green_offset = 0
      blue_offset = 0
      alpha_offset = 0
      
      ###
      @name redMultiplier
      @return {number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      redMultiplier:
        enumerable: true
        configurable: false
        get: ->
          red_multiplier

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ColorFilter.redMultiplier"
            id: @id

          range_check window.isFinite(n),
            label: "ColorFilter.redMultiplier"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          red_multiplier = n

      
      ###
      @name greenMultiplier
      @return {number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      greenMultiplier:
        enumerable: true
        configurable: false
        get: ->
          green_multiplier

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ColorFilter.greenMultiplier"
            id: @id

          range_check window.isFinite(n),
            label: "ColorFilter.greenMultiplier"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          green_multiplier = n

      
      ###
      @name blueMultiplier
      @return {number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      blueMultiplier:
        enumerable: true
        configurable: false
        get: ->
          blue_multiplier

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ColorFilter.blueMultiplier"
            id: @id

          range_check window.isFinite(n),
            label: "ColorFilter.blueMultiplier"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          blue_multiplier = n

      
      ###
      @name alphaMultiplier
      @return {number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      alphaMultiplier:
        enumerable: true
        configurable: false
        get: ->
          alpha_multiplier

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ColorFilter.alphaMultiplier"
            id: @id

          range_check window.isFinite(n),
            label: "ColorFilter.alphaMultiplier"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          alpha_multiplier = n

      
      ###
      @name redOffset
      @return {number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      redOffset:
        enumerable: true
        configurable: false
        get: ->
          red_offset

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ColorFilter.redOffset"
            id: @id

          range_check window.isFinite(n),
            label: "ColorFilter.redOffset"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          red_offset = n

      
      ###
      @name greenOffset
      @return {number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      greenOffset:
        enumerable: true
        configurable: false
        get: ->
          green_offset

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ColorFilter.greenOffset"
            id: @id

          range_check window.isFinite(n),
            label: "ColorFilter.greenOffset"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          green_offset = n

      
      ###
      @name blueOffset
      @return {number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      blueOffset:
        enumerable: true
        configurable: false
        get: ->
          blue_offset

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ColorFilter.blueOffset"
            id: @id

          range_check window.isFinite(n),
            label: "ColorFilter.blueOffset"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          blue_offset = n

      
      ###
      @name alphaOffset
      @return {number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      alphaOffset:
        enumerable: true
        configurable: false
        get: ->
          alpha_offset

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ColorFilter.alphaOffset"
            id: @id

          range_check window.isFinite(n),
            label: "ColorFilter.alphaOffset"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          alpha_offset = n

      
      ###
      @name id
      @return {string}
      @throws {TypeError}
      @property
      ###
      id:
        enumerable: true
        configurable: false
        get: ->
          (if (id is null) then @toString() else id)

        set: (idArg) ->
          
          #DEBUG
          if idArg isnt null
            type_check idArg, "string",
              label: "ColorFilter.id"
              id: @id

          
          #END_DEBUG
          id = idArg

      
      ###
      Applies filter to a specified region of a context.
      Called when rendering the scene.
      @name __applyFilter
      @param {CanvasRenderingContext2D} ctx
      @throws {TypeError}
      @private
      ###
      __applyFilter:
        enumerable: true
        configurable: false
        value: (ctx, x, y, width, height) ->
          
          #DEBUG
          console.assert ctx.toString() is "[object CanvasRenderingContext2D]", "ColorFilter.__applyFilter: context available."
          console.assert typeof x is "number", "ColorFilter.__applyFilter: x is a number."
          console.assert typeof y is "number", "ColorFilter.__applyFilter: y is a number."
          console.assert typeof width is "number", "ColorFilter.__applyFilter: width is a number."
          console.assert typeof height is "number", "ColorFilter.__applyFilter: height is a number."
          
          #END_DEBUG
          img = ctx.getImageData(x, y, width, height)
          img_data = img.data
          pixels = width * height
          p = undefined
          
          #faster lookup, but more vars
          rm = red_multiplier
          ro = red_offset
          gm = green_multiplier
          go = green_offset
          bm = blue_multiplier
          bo = blue_offset
          am = alpha_multiplier
          ao = alpha_offset
          while --pixels
            p = pixels << 2
            img_data[p] = img_data[p] * rm + ro
            img_data[p + 1] = img_data[p + 1] * gm + go
            img_data[p + 2] = img_data[p + 2] * bm + bo
            img_data[p + 3] = img_data[p + 3] * am + ao
          img.data = img_data
          ctx.putImageData img, x, y

      
      ###
      Same as toArray, but reuses array object.
      @name __toArray
      @return {Point}
      @private
      ###
      __toArray:
        enumerable: false
        writable: false
        configurable: false
        value: ->
          $temp_array[0] = red_multiplier
          $temp_array[1] = green_multiplier
          $temp_array[2] = blue_multiplier
          $temp_array[3] = alpha_multiplier
          $temp_array[4] = red_offset
          $temp_array[5] = green_offset
          $temp_array[6] = blue_offset
          $temp_array[7] = alpha_offset
          $temp_array
    ()) #end defineProperties
    
    #initialize filter
    switch arg_len
      
      #defaults to 1,1,1,1,0,0,0,0
      when 0, 8
        
        #standard instantiation
        filter.compose redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset
      when 1
        
        #passed an initialization obj: ColorFilter, array, function
        init_obj = arguments_[0]
        redMultiplier = `undefined`
        if typeof init_obj is "function"
          init_obj.call filter
        else if Array.isArray(init_obj)
          
          #DEBUG
          throw new SyntaxError("[object ColorFilter]([redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset]): Invalid array parameter.")  if init_obj.length isnt 8
          
          #END_DEBUG
          filter.compose.apply filter, init_obj
        else
          
          #DEBUG
          type_check init_obj, "ColorFilter",
            label: "doodle.filters.ColorFilter"
            id: @id
            message: "Unable to initialize from ColorFilter object."

          
          #END_DEBUG
          filter.compose.apply filter, init_obj.__toArray()
      else
        
        #DEBUG
        throw new SyntaxError("[object ColorFilter](redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset): Invalid number of parameters.")
    
    #END_DEBUG
    filter

  #end ColorFilter definition
  filter_static_properties =
    
    ###
    Returns the string representation of the specified object.
    @name toString
    @return {string}
    ###
    toString:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        "[object ColorFilter]"

    
    ###
    Returns an array that contains the values of the color multipliers and offsets.
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
    Set ColorFilter values.
    @name compose
    @param {number} redMultiplier
    @param {number} greenMultiplier
    @param {number} blueMultiplier
    @param {number} alphaMultiplier
    @param {number} redOffset
    @param {number} blueOffset
    @param {number} greenOffset
    @param {number} alphaOffset
    @return {ColorFilter}
    @throws {TypeError}
    @throws {RangeError}
    ###
    compose:
      enumerable: true
      writable: false
      configurable: false
      value: (redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) ->
        
        #DEBUG
        type_check redMultiplier, "number", greenMultiplier, "number", blueMultiplier, "number", alphaMultiplier, "number", redOffset, "number", blueOffset, "number", greenOffset, "number", alphaOffset, "number",
          label: "ColorFilter.compose"
          params: ["redMultiplier", "greenMultiplier", "blueMultiplier", "alphaMultiplier", "redOffset", "greenOffset", "blueOffset", "alphaOffset"]
          id: @id

        range_check window.isFinite(redMultiplier), window.isFinite(greenMultiplier), window.isFinite(blueMultiplier), window.isFinite(alphaMultiplier), window.isFinite(redOffset), window.isFinite(greenOffset), window.isFinite(blueOffset), window.isFinite(alphaOffset),
          label: "ColorFilter.compose"
          params: ["redMultiplier", "greenMultiplier", "blueMultiplier", "alphaMultiplier", "redOffset", "greenOffset", "blueOffset", "alphaOffset"]
          id: @id
          message: "Parameters must be finite numbers."

        
        #END_DEBUG
        @redMultiplier = redMultiplier
        @greenMultiplier = greenMultiplier
        @blueMultiplier = blueMultiplier
        @alphaMultiplier = alphaMultiplier
        @redOffset = redOffset
        @greenOffset = greenOffset
        @blueOffset = blueOffset
        @alphaOffset = alphaOffset
        this

    
    ###
    Creates a copy of this ColorFilter object.
    @name clone
    @return {ColorFilter}
    ###
    clone:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        doodle.filters.createColorFilter @__toArray()

    
    ###
    Determines whether two ColorFilters are equal.
    @name equals
    @param {ColorFilter} filter The ColorFilter to be compared.
    @return {boolean}
    @throws {TypeError}
    ###
    equals:
      enumerable: true
      writable: false
      configurable: false
      value: (filter) ->
        
        #DEBUG
        type_check filter, "ColorFilter",
          label: "ColorFilter.equals"
          params: "filter"
          id: @id

        
        #END_DEBUG
        @redMultiplier is filter.redMultiplier and @greenMultiplier is filter.greenMultiplier and @blueMultiplier is filter.blueMultiplier and @alphaMultiplier is filter.alphaMultiplier and @redOffset is filter.redOffset and @greenOffset is filter.greenOffset and @blueOffset is filter.blueOffset and @alphaOffset is filter.alphaOffset
#end filter_static_properties definition
)() #end class closure
