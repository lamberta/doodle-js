#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: false, newcap: true

#globals doodle
(->
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  
  #END_DEBUG
  
  ###
  Doodle utilty functions.
  @name doodle.utils
  @class
  @augments Object
  @static
  ###
  Object.defineProperties doodle.utils,
    
    #
    #     * COLOR UTILS
    #     
    
    ###
    @name hex_to_rgb
    @param {Color} color
    @return {Array} [r, g, b]
    @throws {TypeError}
    @static
    ###
    hex_to_rgb:
      enumerable: true
      writable: false
      configurable: false
      value: (color) ->
        
        #number in octal format or string prefixed with #
        if typeof color is "string"
          color = (if (color[0] is "#") then color.slice(1) else color)
          color = window.parseInt(color, 16)
        
        #DEBUG
        type_check color, "number",
          label: "hex_to_rgb"
          params: "color"
          message: "Invalid color format [0xffffff|#ffffff]."

        
        #END_DEBUG
        [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff]

    
    ###
    @name hex_to_rgb_str
    @param {Color} color
    @param {number} alpha
    @return {string}
    @throws {TypeError}
    @static
    ###
    hex_to_rgb_str:
      enumerable: true
      writable: false
      configurable: false
      value: (color, alpha) ->
        doodle_utils = doodle.utils
        alpha = (if (alpha is `undefined`) then 1 else alpha)
        
        #DEBUG
        type_check color, "*", alpha, "number",
          label: "hex_to_rgb_str"
          params: ["color", "alpha"]

        
        #END_DEBUG
        color = doodle_utils.hex_to_rgb(color)
        doodle_utils.rgb_to_rgb_str color[0], color[1], color[2], alpha

    
    ###
    @name rgb_str_to_hex
    @param {string} rgb_str
    @return {string}
    @throws {TypeError}
    @static
    ###
    rgb_str_to_hex:
      enumerable: true
      writable: false
      configurable: false
      value: (rgb_str) ->
        
        #DEBUG
        type_check rgb_str, "string",
          label: "rgb_str_to_hex"
          params: "color"
          message: "Paramater must be a RGB string."

        
        #END_DEBUG
        doodle_utils = doodle.utils
        rgb = doodle_utils.rgb_str_to_rgb(rgb_str)
        
        #DEBUG
        console.assert Array.isArray(rgb), "rgb is an array", rgb
        
        #END_DEBUG
        doodle_utils.rgb_to_hex window.parseInt(rgb[0], 10), window.parseInt(rgb[1], 10), window.parseInt(rgb[2], 10)

    
    ###
    @name rgb_str_to_rgb
    @param {Color} color
    @return {Array}
    @throws {TypeError}
    @throws {SyntaxError}
    @static
    ###
    rgb_str_to_rgb:
      enumerable: true
      writable: false
      configurable: false
      value: (->
        rgb_regexp = new RegExp("^rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,?(.*)\\)$")
        (color) ->
          
          #DEBUG
          type_check color, "string",
            label: "rgb_str_to_rgb"
            params: "color"
            message: "Parameter must be in RGB string format: 'rgba(n, n, n, n)'."

          
          #END_DEBUG
          color = color.trim().match(rgb_regexp)
          
          #DEBUG
          
          #if it's not an array, it didn't parse correctly
          console.assert Array.isArray(color), "color is an array", color
          
          #END_DEBUG
          rgb = [window.parseInt(color[1], 10), window.parseInt(color[2], 10), window.parseInt(color[3], 10)]
          alpha = window.parseFloat(color[4])
          rgb.push alpha  if typeof alpha is "number" and not window.isNaN(alpha)
          rgb
      ())

    
    ###
    @name rgb_to_hex
    @param {number} r
    @param {number} g
    @param {number} b
    @return {string}
    @throws {TypeError}
    @static
    ###
    rgb_to_hex:
      enumerable: true
      writable: false
      configurable: false
      value: (r, g, b) ->
        
        #DEBUG
        type_check r, "number", g, "number", b, "number",
          label: "rgb_to_hex"
          params: ["r", "g", "b"]

        
        #END_DEBUG
        hex_color = (b | (g << 8) | (r << 16)).toString(16)
        "#" + String("000000" + hex_color).slice(-6) #pad out

    
    ###
    @name rgb_to_rgb_str
    @param {number} r
    @param {number} g
    @param {number} b
    @param {number} a
    @return {string}
    @throws {TypeError}
    @static
    ###
    rgb_to_rgb_str:
      enumerable: true
      writable: false
      configurable: false
      value: (r, g, b, a) ->
        a = (if (a is `undefined`) then 1 else a)
        
        #DEBUG
        type_check r, "number", g, "number", b, "number", a, "number",
          label: "rgb_to_rgb_str"
          params: ["r", "g", "b", "a"]

        
        #END_DEBUG
        a = (if (a < 0) then 0 else ((if (a > 1) then 1 else a)))
        if a is 1
          "rgb(" + r + "," + g + "," + b + ")"
        else
          "rgba(" + r + "," + g + "," + b + "," + a + ")"

    
    #
    #     * DOM ACCESS
    #     
    
    ###
    Returns HTML element from id name or element itself.
    @name get_element
    @param {HTMLElement|string} element
    @return {HTMLElement}
    @static
    ###
    get_element:
      enumerable: true
      writable: false
      configurable: false
      value: (element) ->
        if typeof element is "string"
          
          #lop off pound-sign if given
          element = (if (element[0] is "#") then element.slice(1) else element)
          document.getElementById element
        else
          
          #if it has an element property, we'll call it an element
          (if (element and element.tagName) then element else null)

    
    ###
    Returns css property of element, it's own or inherited.
    @name get_style_property
    @param {HTMLElement} element
    @param {string} property
    @param {boolean} useComputedStyle
    @return {*}
    @throws {TypeError}
    @throws {ReferenceError}
    @static
    ###
    get_style_property:
      enumerable: true
      writable: false
      configurable: false
      value: (element, property, useComputedStyle) ->
        useComputedStyle = (if (useComputedStyle is `undefined`) then true else false)
        
        #DEBUG
        type_check element, "*", property, "string", useComputedStyle, "boolean",
          label: "get_style_property"
          params: ["element", "property", "useComputedStyle"]

        
        #END_DEBUG
        try
          if useComputedStyle and document.defaultView and document.defaultView.getComputedStyle
            return document.defaultView.getComputedStyle(element, null)[property]
          else if element.currentStyle
            return element.currentStyle[property]
          else if element.style
            return element.style[property]
          else
            throw new ReferenceError("get_style_property: Cannot read property '" + property + "' of " + element + ".")
        catch e
          throw new ReferenceError("get_style_property: Cannot read property '" + property + "' of " + element + ".")

    
    ###
    Returns property of an element. CSS properties take precedence over HTML attributes.
    @name get_element_property
    @param {HTMLElement} element
    @param {string} property
    @param {string} returnType 'int'|'float' Return type.
    @param {boolean} useComputedStyle
    @return {*}
    @throws {ReferenceError}
    @static
    ###
    get_element_property:
      enumerable: true
      writable: false
      configurable: false
      value: (element, property, returnType, useComputedStyle) ->
        returnType = returnType or false
        val = undefined
        obj = undefined
        try
          val = doodle.utils.get_style_property(element, property, useComputedStyle)
        catch e
          val = `undefined`
        if val is `undefined` or val is null or val is ""
          
          #DEBUG
          throw new ReferenceError("get_element_property(*element*, property, returnType, useComputedStyle): Parameter is not a valid element.")  if typeof element.getAttribute isnt "function"
          
          #END_DEBUG
          val = element.getAttribute(property)
        if returnType isnt false
          switch returnType
            when "int"
              val = window.parseInt(val, 10)
              val = (if window.isNaN(val) then null else val)
            when "number", "float"
              val = window.parseFloat(val)
              val = (if window.isNaN(val) then null else val)
            when "string"
              val = String(val)
            when "object"
              obj = {}
              val = obj[property] = val
            else
        val

    
    ###
    @name set_element_property
    @param {HTMLElement} element
    @param {string} property
    @param {*} value
    @param {string} type 'css'|'html' Set CSS property or HTML attribute.
    @return {*}
    @throws {TypeError}
    @throws {SyntaxError}
    @static
    ###
    set_element_property:
      enumerable: true
      writable: false
      configurable: false
      value: (element, property, value, type) ->
        type = (if (type is `undefined`) then "css" else type)
        
        #DEBUG
        type_check element, "*", property, "string", value, "*", type, "string",
          label: "set_style_property"
          params: ["element", "property", "value", "type"]

        
        #END_DEBUG
        switch type
          when "css"
            element.style[property] = value
          when "html"
            element.setAttribute property, value
          else
            throw new SyntaxError("set_element_property: type must be 'css' property or 'html' attribute.")
        value

    
    #
    #     * SCENE GRAPH
    #     
    
    ###
    Creates a scene graph path from a given node and all it's descendants.
    @name create_scene_path
    @param {Node} node
    @param {Array} array Array to store the path nodes in.
    @param {boolean} clearArray Empty array passed as parameter before storing nodes in it.
    @return {Array} The array passed to the function (modified in place).
    @throws {TypeError}
    @static
    ###
    create_scene_path:
      enumerable: true
      writable: false
      configurable: false
      value: create_scene_path = (node, array, clearArray) ->
        array = (if (array is `undefined`) then [] else array)
        clearArray = (if (clearArray is `undefined`) then false else clearArray)
        
        #DEBUG
        type_check node, "Node", array, "array", clearArray, "boolean",
          label: "create_scene_path"
          params: ["node", "array", "clearArray"]
          inherits: true

        
        #END_DEBUG
        i = node.children.length
        array.splice 0, array.length  if clearArray
        create_scene_path node.children[i], array, false  while i--  if i isnt 0
        array.push node
        array #return for further operations on array (reverse)

)()
