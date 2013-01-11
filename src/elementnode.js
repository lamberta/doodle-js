#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  node_static_properties = undefined
  url_regexp = new RegExp("^url\\((.*)\\)")
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  reference_check = doodle.utils.debug.reference_check
  
  #END_DEBUG
  
  #lookup help
  doodle_Rectangle = doodle.geom.createRectangle
  rgb_str_to_hex = doodle.utils.rgb_str_to_hex
  hex_to_rgb_str = doodle.utils.hex_to_rgb_str
  get_element = doodle.utils.get_element
  get_element_property = doodle.utils.get_element_property
  set_element_property = doodle.utils.set_element_property
  
  ###
  @name doodle.createElementNode
  @class
  @augments doodle.Node
  @param {HTMLElement=} element
  @param {string=} id
  @return {doodle.ElementNode}
  @throws {SyntaxError}
  ###
  doodle.ElementNode = doodle.createElementNode = (element, id) ->
    element_node = Object.create(doodle.createNode((if (typeof id is "string") then id else `undefined`)))
    Object.defineProperties element_node, node_static_properties
    
    #properties that require privacy
    Object.defineProperties element_node, (->
      
      #defaults
      dom_element = null
      node_id = element_node.id #inherit from node
      alpha = element_node.alpha
      visible = element_node.visible
      width = 0
      height = 0
      bg_color = null
      bg_image = null
      bg_repeat = "repeat"
      clear_bitmap = true
      
      ###
      @name element
      @return {HTMLElement}
      @property
      ###
      element:
        enumerable: true
        configurable: true
        get: ->
          dom_element

        set: (elementArg) ->
          color = undefined
          image = undefined
          id = undefined
          if elementArg is null
            
            #check if removing an element
            if dom_element isnt null
              
              #class specific tasks when removing an element
              @__removeDomElement dom_element  if typeof @__removeDomElement is "function"
              
              #reset some values on the doodle object
              bg_color = null
              bg_image = null
              bg_repeat = "repeat"
              
              #keep values of parent
              unless @parent
                width = 0
                height = 0
            
            #element be'gone!
            dom_element = null
          else
            
            #assign a dom element
            elementArg = get_element(elementArg)
            
            #DEBUG
            throw new ReferenceError(this + ".element: Invalid element.")  unless elementArg
            
            #END_DEBUG
            dom_element = elementArg
            
            # Some classes require special handling of their element.
            #               
            @__addDomElement dom_element #may be overridden
            
            # These go for every dom element passed.
            #               
            id = get_element_property(dom_element, "id")
            
            #if element has an id, rename node. Else, set element to this id.
            if id
              node_id = id
            else
              @id = node_id
            
            #background color and image
            bg_repeat = get_element_property(dom_element, "backgroundRepeat") or bg_repeat
            color = get_element_property(dom_element, "backgroundColor", false, false)
            bg_color = (if color then rgb_str_to_hex(color) else bg_color)
            
            #parse image path from url format
            image = get_element_property(dom_element, "backgroundImage")
            image = (if (not image or image is "none") then null else bg_image.match(url_regexp))
            bg_image = (if image then image[1] else bg_image)

      
      # Evidently it's not very efficent to query the dom for property values,
      #         * as it might initiate a re-flow. Cache values instead.
      #         
      
      ###
      @name id
      @return {string}
      @throws {TypeError}
      @override
      @property
      ###
      id:
        enumerable: true
        configurable: true
        get: ->
          node_id

        set: (idVar) ->
          
          #DEBUG
          type_check idVar, "string",
            label: "ElementNode.id"
            id: @id

          
          #END_DEBUG
          node_id = set_element_property(@element, "id", idVar, "html")

      
      ###
      @name width
      @return {number}
      @throws {TypeError}
      @override
      @property
      ###
      width:
        enumerable: true
        configurable: true
        get: ->
          width

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ElementNode.width"
            id: @id

          
          #END_DEBUG
          set_element_property @element, "width", n + "px"
          width = n

      
      ###
      @name height
      @return {number}
      @throws {TypeError}
      @override
      @property
      ###
      height:
        enumerable: true
        configurable: true
        get: ->
          height

        set: (n) ->
          
          #DEBUG
          type_check n, "number",
            label: "ElementNode.height"
            id: @id

          
          #END_DEBUG
          set_element_property @element, "height", n + "px"
          height = n

      
      ###
      @name backgroundColor
      @return {Color}
      @property
      ###
      backgroundColor:
        enumerable: true
        configurable: true
        get: ->
          bg_color

        set: (color) ->
          color = hex_to_rgb_str(color)  if typeof color is "number"
          set_element_property @element, "backgroundColor", color
          
          #the dom will convert the color to 'rgb(n,n,n)' format
          bg_color = rgb_str_to_hex(get_element_property(@element, "backgroundColor"))

      
      ###
      @name backgroundImage
      @return {HTMLImageElement}
      @throws {TypeError}
      @property
      ###
      backgroundImage:
        enumerable: true
        configurable: true
        get: ->
          bg_image

        set: (image) ->
          unless image
            bg_image = set_element_property(@element, "backgroundImage", null)
            return
          
          #a string can be a page element or url
          if typeof image is "string"
            image = get_element(image).src  if image[0] is "#"
          
          #passed an image element
          else image = image.src  if image and image.tagName is "IMG"
          
          #DEBUG
          type_check image, "string",
            label: "ElementNode.backgroundImage"
            id: @id

          
          #END_DEBUG
          
          #url path at this point, make sure it's in the proper format
          image = "url(" + window.encodeURI(image) + ")"  unless url_regexp.test(image)
          bg_image = set_element_property(@element, "backgroundImage", image)

      
      ###
      @name backgroundRepeat
      @return {string}
      @throws {TypeError}
      @throws {SyntaxError}
      @property
      ###
      backgroundRepeat:
        enumerable: true
        configurable: true
        get: ->
          bg_repeat

        set: (repeat) ->
          
          #DEBUG
          type_check repeat, "string",
            label: "ElementNode.backgroundRepeat"
            id: @id

          reference_check repeat is "repeat" or repeat is "repeat-x" or repeat is "repeat-y" or repeat is "no-repeat" or repeat is "inherit",
            label: "ElementNode.backgroundRepeat"
            id: @id
            message: "Invalid CSS value."

          
          #END_DEBUG
          bg_repeat = set_element_property(@element, "backgroundRepeat", repeat)

      
      ###
      @name alpha
      @return {number}
      @throws {TypeError}
      @override
      @property
      ###
      alpha:
        enumerable: true
        configurable: true
        get: ->
          alpha

        set: (alpha) ->
          
          #DEBUG
          type_check alpha, "number",
            label: "ElementNode.alpha"
            id: @id

          alpha = (if (alpha < 0) then 0 else ((if (alpha > 1) then 1 else alpha)))
          
          #END_DEBUG
          alpha = set_element_property(@element, "opacity", alpha)

      
      ###
      @name visible
      @return {boolean}
      @throws {TypeError}
      @override
      @property
      ###
      visible:
        enumerable: true
        configurable: true
        get: ->
          visible

        set: (isVisible) ->
          
          #DEBUG
          type_check isVisible, "boolean",
            label: "ElementNode.visible"
            id: @id

          
          #END_DEBUG
          if isVisible
            set_element_property @element, "visibility", "visible"
          else
            set_element_property @element, "visibility", "hidden"
          visible = isVisible

      
      ###
      @name clearBitmap
      @return {boolean}
      @throws {TypeError}
      @property
      ###
      clearBitmap:
        enumerable: false
        configurable: true
        get: ->
          clear_bitmap

        set: (isClear) ->
          
          #DEBUG
          type_check isClear, "boolean",
            label: "ElementNode.clearBitmap"
            id: @id

          
          #END_DEBUG
          clear_bitmap = isClear

      
      ###
      Called when a dom element is added. This function will be overridden
      for sub-class specific behavior.
      @name __addDomElement
      @param {HTMLElement} elementArg
      @private
      ###
      __addDomElement:
        enumerable: false
        configurable: true
        value: (elementArg) ->
          
          #default method obtaining element dimensions  
          w = get_element_property(elementArg, "width", "int") or elementArg.width
          h = get_element_property(elementArg, "height", "int") or elementArg.height
          width = w  if typeof w is "number"
          height = h  if typeof h is "number"

      
      ###
      @name __addDomElement
      @param {HTMLElement} elementArg
      @return {Rectangle} Rectangle object is reused for each call.
      @throws {TypeError} targetCoordSpace must inherit from Node.
      @override
      @private
      ###
      __getBounds:
        enumerable: true
        configurable: true
        value: (->
          rect = doodle_Rectangle(0, 0, 0, 0) #recycle
          (targetCoordSpace) ->
            
            #DEBUG
            console.assert doodle.Node.isNode(targetCoordSpace), "targetCoordSpace is a Node", targetCoordSpace
            
            #END_DEBUG
            children = @children
            len = children.length
            bounding_box = rect
            child_bounds = undefined
            w = @width
            h = @height
            tl =
              x: 0
              y: 0

            tr =
              x: w
              y: 0

            br =
              x: w
              y: h

            bl =
              x: 0
              y: h

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
    ()) #end defineProperties
    
    #check args
    switch arguments_.length
      when 0, 1
        
        #passed function
        if typeof arguments_[0] is "function"
          arguments_[0].call element_node
          element = `undefined`
        else
          
          #passed element
          element_node.element = element
      when 2
        
        #standard instantiation (element, id)
        
        #can be undefined
        element_node.element = element  if element
      else
        throw new SyntaxError("[object ElementNode](element, id): Invalid number of parameters.")
    element_node

  
  ###
  Returns the string representation of the specified object.
  @name toString
  @return {string}
  @override
  ###
  node_static_properties = toString:
    enumerable: true
    writable: false
    configurable: false
    value: ->
      "[object ElementNode]"
#end node_static_properties
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is an ElementNode.
@name isElementNode
@param {Object} obj
@return {boolean}
@static
###
doodle.ElementNode.isElementNode = (obj) ->
  if typeof obj is "object"
    while obj
      if obj.toString() is "[object ElementNode]"
        return true
      else
        obj = Object.getPrototypeOf(obj)
  false
