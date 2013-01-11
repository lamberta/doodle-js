#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  layer_static_properties = undefined
  layer_count = 0
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  
  #END_DEBUG
  set_element_property = doodle.utils.set_element_property
  
  ###
  @name doodle.createLayer
  @class
  @augments doodle.ElementNode
  @param {string=} id
  @param {HTMLCanvasElement=} element
  @return {doodle.Layer}
  @throws {SyntaxError}
  ###
  doodle.Layer = doodle.createLayer = (id, element) ->
    layer_name = (if (typeof id is "string") then id else "layer" + String("00" + layer_count).slice(-2))
    layer = Object.create(doodle.createElementNode(`undefined`, layer_name))
    Object.defineProperties layer, layer_static_properties
    
    #properties that require privacy
    Object.defineProperties layer, (->
      
      #defaults
      width = 0
      height = 0
      filters = null
      context = null
      
      ###
      Canvas dimensions need to apply to HTML attributes.
      @name width
      @return {number}
      @throws {TypeError}
      @property
      @override
      ###
      width:
        enumerable: true
        configurable: true
        get: ->
          width

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Layer.width"
            id: @id

          range_check window.isFinite(n),
            label: "Layer.width"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          width = set_element_property(@element, "width", n, "html")

      
      ###
      @name height
      @return {number}
      @throws {TypeError}
      @property
      @override
      ###
      height:
        enumerable: true
        configurable: true
        get: ->
          height

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "Layer.height"
            id: @id

          range_check window.isFinite(n),
            label: "Layer.height"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          height = set_element_property(@element, "height", n, "html")

      
      ###
      @name context
      @return {CanvasRenderingContext2D}
      @property
      @override
      ###
      context:
        enumerable: true
        configurable: true
        get: ->
          context

      
      ###
      Collection of filters to apply to the canvas bitmap.
      @name filters
      @return {Array}
      @property
      ###
      filters:
        enumerable: true
        configurable: true
        get: ->
          filters

        set: (filtersVar) ->
          
          #DEBUG
          if filtersVar isnt null
            type_check filtersVar, "array",
              label: "Layer.filters"
              id: @id

          
          #END_DEBUG
          filters = filtersVar

      
      ###
      Layer specific things to setup when adding a dom element.
      Called in ElementNode.element
      @name __addDomElement
      @param {HTMLElement} elementArg
      @throws {TypeError}
      @override
      @private
      ###
      __addDomElement:
        enumerable: false
        writable: false
        value: (elementArg) ->
          
          #DEBUG
          console.assert typeof elementArg is "object" and elementArg.toString() is "[object HTMLCanvasElement]", "elementArg is a canvas", elementArg
          
          #END_DEBUG
          
          #need to stack canvas elements inside div
          set_element_property elementArg, "position", "absolute"
          
          #set to display dimensions if there
          if @parent
            @width = @parent.width
            @height = @parent.height
          
          #set rendering context
          context = elementArg.getContext("2d")

      
      ###
      Layer specific things to setup when removing a dom element.
      Called in ElementNode.element
      @name __removeDomElement
      @param {HTMLElement} elementArg
      @override
      @private
      ###
      __removeDomElement:
        enumerable: false
        writable: false
        value: (elementArg) ->
          context = null
    ()) #end defineProperties
    switch arguments_.length
      when 0, 1
        
        #passed function or id string
        if typeof arguments_[0] is "function"
          arguments_[0].call layer
          id = `undefined`
      when 2
        
        #DEBUG
        type_check element, "canvas",
          label: "Layer"
          id: @id
          message: "Invalid initialization."

        
        #END_DEBUG
        layer.element = element
      else
        throw new SyntaxError("[object Layer](id, element): Invalid number of parameters.")
    layer.element = document.createElement("canvas")  if layer.element is null
    layer_count += 1
    layer

  layer_static_properties =
    
    ###
    Returns the string representation of the specified object.
    @name toString
    @return {string}
    @override
    ###
    toString:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        "[object Layer]"

    
    ###
    This is always the same size, so we'll save some computation.
    @name __getBounds
    @return {Rectangle}
    @override
    @private
    ###
    __getBounds:
      enumerable: true
      configurable: true
      value: (->
        rect = doodle.geom.createRectangle(0, 0, 0, 0) #recycle
        ->
          rect.compose 0, 0, @width, @height
      ())
#end layer_static_properties
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is a Layer.
@name isLayer
@param {Object} obj
@return {boolean}
@static
###
doodle.Layer.isLayer = (obj) ->
  if typeof obj is "object"
    while obj
      if obj.toString() is "[object Layer]"
        return true
      else
        obj = Object.getPrototypeOf(obj)
  false
