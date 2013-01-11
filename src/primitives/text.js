#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  text_sprite_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  reference_check = doodle.utils.debug.reference_check
  
  #END_DEBUG
  hex_to_rgb_str = doodle.utils.hex_to_rgb_str
  FontStyle = doodle.FontStyle
  FontVariant = doodle.FontVariant
  FontWeight = doodle.FontWeight
  TextAlign = doodle.TextAlign
  TextBaseline = doodle.TextBaseline
  
  ###
  A text sprite to display.
  @name doodle.createText
  @class
  @augments doodle.Sprite
  @param {string=} text Text to display.
  @return {doodle.Text} A text object.
  @throws {SyntaxError} Invalid parameters.
  @throws {TypeError} Text argument not a string.
  ###
  doodle.Text = doodle.createText = (text) ->
    text_sprite = Object.create(doodle.createSprite())
    Object.defineProperties text_sprite, text_sprite_static_properties
    
    #properties that require privacy
    Object.defineProperties text_sprite, (->
      #px
      
      ###
      @name redraw
      @private
      ###
      redraw = ->
        
        #if not part of the scene graph we'll have to whip up a context
        $ctx = text_sprite.context or document.createElement("canvas").getContext("2d")
        sprite_width = undefined
        sprite_height = undefined
        graphics = text_sprite.graphics
        extrema_minX = 0
        extrema_maxX = 0
        extrema_minY = 0
        extrema_maxY = 0
        
        #need to apply font style to measure width, but don't save it
        $ctx.save()
        $ctx.font = (font_style + " " + font_variant + " " + font_weight + " " + font_size + "px" + " " + font_family)
        sprite_width = $ctx.measureText($text).width
        sprite_height = font_size
        
        #estimate font height since there's no built-in functionality
        font_height = $ctx.measureText("m").width
        $ctx.restore()
        
        #clears sprite dimensions and drawing commands
        text_sprite.graphics.clear()
        text_sprite.graphics.draw (ctx) ->
          if text_bgcolor
            ctx.fillStyle = text_bgcolor
            ctx.fillRect 0, 0, sprite_width, sprite_height
          ctx.lineWidth = text_strokewidth #why do i need to set this?
          ctx.textAlign = text_align
          ctx.textBaseline = text_baseline
          ctx.font = (font_style + " " + font_variant + " " + font_weight + " " + font_size + "px" + " " + font_family)
          if text_color
            ctx.fillStyle = text_color
            ctx.fillText $text, 0, 0
          if text_strokecolor
            ctx.strokeStyle = text_strokecolor
            ctx.strokeText $text, 0, 0

        
        #assign sprite dimensions after graphics.clear()
        text_sprite.width = sprite_width
        text_sprite.height = sprite_height
        
        #calculate bounding box extrema
        switch text_baseline
          when TextBaseline.TOP
            extrema_minY = font_size - font_height
            extrema_maxY = font_size
          when TextBaseline.MIDDLE
            extrema_minY = -font_height / 2
            extrema_maxY = font_height / 2
          when TextBaseline.BOTTOM
            extrema_minY = -font_size
          when TextBaseline.HANGING
            extrema_minY = font_size - font_height
            extrema_maxY = font_size
          when TextBaseline.ALPHABETIC
            extrema_minY = -font_height
          when TextBaseline.IDEOGRAPHIC
            extrema_minY = -font_size
        switch text_align
          when TextAlign.START, TextAlign.END
            extrema_minX = -sprite_width
          when TextAlign.LEFT, TextAlign.RIGHT
            extrema_minX = -sprite_width
          when TextAlign.CENTER
            extrema_minX = -sprite_width / 2
        
        #set extrema for bounds
        graphics.__minX = extrema_minX
        graphics.__maxX = extrema_maxX
        graphics.__minY = extrema_minY
        graphics.__maxY = extrema_maxY
      $text = ""
      font_family = "sans-serif"
      font_size = 10
      font_height = font_size
      font_style = FontStyle.NORMAL
      font_variant = FontVariant.NORMAL
      font_weight = FontWeight.NORMAL
      text_align = TextAlign.START
      text_baseline = TextBaseline.ALPHABETIC
      text_color = "#000000"
      text_strokecolor = "#000000"
      text_strokewidth = 1
      text_bgcolor = undefined
      
      ###
      @name text
      @return {String}
      @throws {TypeError}
      @property
      ###
      text:
        enumerable: true
        configurable: false
        get: ->
          $text

        set: (textVar) ->
          
          #DEBUG
          type_check textVar, "string",
            label: "Text.text"
            id: @id

          
          #END_DEBUG
          $text = textVar
          redraw()

      
      ###
      @name font
      @return {String}
      @throws {TypeError}
      @throws {SyntaxError}
      @throws {ReferenceError}
      @property
      ###
      font:
        enumerable: true
        configurable: false
        get: ->
          font_style + " " + font_variant + " " + font_weight + " " + font_size + "px" + " " + font_family

        set: (fontVars) ->
          len = undefined
          
          #DEBUG
          type_check fontVars, "string",
            label: "Text.font"
            id: @id

          
          #END_DEBUG
          
          #parse elements from string
          fontVars = fontVars.split(" ")
          len = fontVars.length
          
          #DEBUG
          throw new SyntaxError(this + ".font: Invalid font string.")  if len < 2 or len > 5
          
          #END_DEBUG
          
          #fill in unspecified values with defaults
          if len is 2
            fontVars.unshift FontStyle.NORMAL, FontVariant.NORMAL, FontWeight.NORMAL
          else if len is 3
            fontVars.splice 1, 0, FontVariant.NORMAL, FontWeight.NORMAL
          else fontVars.splice 1, 0, FontVariant.NORMAL  if len is 4
          
          #DEBUG
          throw new ReferenceError(this + ".font::fontArgs: Unable to parse font string.")  if fontVars.length isnt 5
          
          #END_DEBUG
          text_sprite.fontStyle = fontVars[0]
          text_sprite.fontVariant = fontVars[1]
          text_sprite.fontWeight = fontVars[2]
          text_sprite.fontSize = fontVars[3]
          text_sprite.fontFamily = fontVars[4]

      
      ###
      @name fontFamily
      @return {String}
      @throws {TypeError}
      @property
      ###
      fontFamily:
        enumerable: true
        configurable: false
        get: ->
          font_family

        set: (fontFamilyVar) ->
          
          #DEBUG
          type_check fontFamilyVar, "string",
            label: "Text.fontFamily"
            id: @id

          
          #END_DEBUG
          font_family = fontFamilyVar
          redraw()

      
      ###
      @name fontSize
      @return {Number} In pixels.
      @throws {TypeError}
      @property
      ###
      fontSize:
        enumerable: true
        configurable: false
        get: ->
          font_size

        set: (fontSizeVar) ->
          fontSizeVar = window.parseInt(fontSizeVar, 10)  if typeof fontSizeVar is "string"
          
          #DEBUG
          type_check fontSizeVar, "number",
            label: "Text.fontSize"
            id: @id

          
          #END_DEBUG
          font_size = fontSizeVar
          redraw()

      
      ###
      @name fontStyle
      @return {FontStyle}
      @throws {TypeError}
      @throws {SyntaxError}
      @property
      ###
      fontStyle:
        enumerable: true
        configurable: false
        get: ->
          font_style

        set: (fontStyleVar) ->
          
          #DEBUG
          type_check fontStyleVar, "string",
            label: "Text.fontStyle"
            id: @id

          reference_check fontStyleVar is FontStyle.NORMAL or fontStyleVar is FontStyle.ITALIC or fontStyleVar is FontStyle.OBLIQUE,
            label: "Text.fontStyle"
            id: @id
            message: "Invalid FontStyle property"

          
          #END_DEBUG
          font_style = fontStyleVar
          redraw()

      
      ###
      @name fontVariant
      @return {FontVariant}
      @throws {TypeError}
      @throws {SyntaxError}
      @property
      ###
      fontVariant:
        enumerable: true
        configurable: false
        get: ->
          font_variant

        set: (fontVariantVar) ->
          
          #DEBUG
          type_check fontVariantVar, "string",
            label: "Text.fontVariant"
            id: @id

          reference_check fontVariantVar is FontVariant.NORMAL or fontVariantVar is FontVariant.SMALL_CAPS,
            label: "Text.fontVariant"
            id: @id
            message: "Invalid FontVariant property"

          
          #END_DEBUG
          font_variant = fontVariantVar
          redraw()

      
      ###
      @name fontWeight
      @return {FontWeight}
      @throws {TypeError}
      @throws {SyntaxError}
      @property
      ###
      fontWeight:
        enumerable: true
        configurable: false
        get: ->
          font_weight

        set: (fontWeightVar) ->
          
          #DEBUG
          if typeof fontWeightVar is "string"
            reference_check fontWeightVar is FontWeight.NORMAL or fontWeightVar is FontVariant.BOLD or fontWeightVar is FontVariant.BOLDER or fontWeightVar is FontVariant.LIGHTER,
              label: "Text.fontWeight"
              id: @id
              message: "Invalid FontWeight property"

          else if typeof fontWeightVar is "number"
            range_check fontWeightVar is 100 or fontWeightVar is 200 or fontWeightVar is 300 or fontWeightVar is 400 or fontWeightVar is 500 or fontWeightVar is 600 or fontWeightVar is 700 or fontWeightVar is 800 or fontWeightVar is 900,
              label: "Text.fontWeight"
              id: @id
              message: "Invalid font weight."

          else
            throw new RangeError(@id + " Text.fontWeight(weight): Invalid font weight.")
          
          #END_DEBUG
          font_weight = fontWeightVar
          redraw()

      
      ###
      @name align
      @return {TextAlign}
      @throws {TypeError}
      @throws {SyntaxError}
      @property
      ###
      align:
        enumerable: true
        configurable: false
        get: ->
          text_align

        set: (alignVar) ->
          
          #DEBUG
          type_check alignVar, "string",
            label: "Text.align"
            id: @id

          reference_check alignVar is TextAlign.START or alignVar is TextAlign.END or alignVar is TextAlign.LEFT or alignVar is TextAlign.RIGHT or alignVar is TextAlign.CENTER,
            label: "Text.align"
            id: @id
            message: "Invalid TextAlign property."

          
          #END_DEBUG
          text_align = alignVar
          redraw()

      
      ###
      @name baseline
      @return {TextBaseline}
      @throws {TypeError}
      @throws {SyntaxError}
      @property
      ###
      baseline:
        enumerable: true
        configurable: false
        get: ->
          text_baseline

        set: (baselineVar) ->
          
          #DEBUG
          type_check baselineVar, "string",
            label: "Text.baseline"
            id: @id

          reference_check baselineVar is TextBaseline.TOP or baselineVar is TextBaseline.MIDDLE or baselineVar is TextBaseline.BOTTOM or baselineVar is TextBaseline.HANGING or baselineVar is TextBaseline.ALPHABETIC or baselineVar is TextBaseline.IDEOGRAPHIC,
            label: "Text.baseline"
            id: @id
            message: "Invalid TextBaseline property."

          
          #END_DEBUG
          text_baseline = baselineVar
          redraw()

      
      ###
      @name strokeWidth
      @return {Number}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      strokeWidth:
        enumerable: true
        configurable: false
        get: ->
          text_strokewidth

        set: (widthVar) ->
          
          #DEBUG
          type_check widthVar, "number",
            label: "Text.strokeWidth"
            id: @id

          range_check widthVar > 0,
            label: "Text.strokeWidth"
            id: @id
            message: "Stroke width must be greater than zero."

          
          #END_DEBUG
          text_strokewidth = widthVar

      
      ###
      @name color
      @return {Color}
      @throws {TypeError}
      @property
      ###
      color:
        enumerable: true
        configurable: false
        get: ->
          text_color

        set: (color) ->
          color = hex_to_rgb_str(color)  if typeof color is "number"
          
          #DEBUG
          if color isnt null and color isnt false
            type_check color, "string",
              label: "Text.color"
              id: @id

          
          #END_DEBUG
          text_color = color

      
      ###
      @name strokeColor
      @return {Color}
      @throws {TypeError}
      @property
      ###
      strokeColor:
        enumerable: true
        configurable: false
        get: ->
          text_strokecolor

        set: (color) ->
          color = hex_to_rgb_str(color)  if typeof color is "number"
          
          #DEBUG
          if color isnt null and color isnt false
            type_check color, "string",
              label: "Text.strokeColor"
              id: @id

          
          #END_DEBUG
          text_strokecolor = color

      
      ###
      @name backgroundColor
      @return {Color}
      @throws {TypeError}
      @property
      ###
      backgroundColor:
        enumerable: true
        configurable: false
        get: ->
          text_bgcolor

        set: (color) ->
          color = hex_to_rgb_str(color)  if typeof color is "number"
          
          #DEBUG
          if color isnt null and color isnt false
            type_check color, "string",
              label: "Text.backgroundColor"
              id: @id

          
          #END_DEBUG
          text_bgcolor = color
    ())
    switch arguments_.length
      when 0, 1
        
        #passed function or text string
        if typeof arguments_[0] is "function"
          arguments_[0].call text_sprite
          text = `undefined`
        else
          
          #DEBUG
          type_check text, "string",
            label: "Text"
            id: @id
            message: "Invalid initialization."

          
          #END_DEBUG
          text_sprite.text = text
      else
        
        #DEBUG
        throw new SyntaxError("[object Text](text): Invalid number of parameters.")
    
    #END_DEBUG
    text_sprite

  
  ###
  Returns the string representation of the specified object.
  @name toString
  @return {string}
  @override
  ###
  text_sprite_static_properties = toString:
    enumerable: false
    writable: false
    configurable: false
    value: ->
      "[object Text]"
)() #end class closure
