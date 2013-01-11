#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  image_sprite_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  
  #END_DEBUG
  get_element = doodle.utils.get_element
  createEvent = doodle.events.createEvent
  LOAD = doodle.events.Event.LOAD
  CHANGE = doodle.events.Event.CHANGE
  
  ###
  A image sprite to display.
  @name doodle.createImage
  @class
  @augments doodle.Sprite
  @param {string=} imageSrc Image element or url.
  @return {doodle.Image} A text object.
  @throws {SyntaxError} Invalid parameters.
  @throws {TypeError} Text argument not a string.
  ###
  doodle.Image = doodle.createImage = (imageSrc) ->
    image_sprite = Object.create(doodle.createSprite())
    Object.defineProperties image_sprite, image_sprite_static_properties
    
    #properties that require privacy
    Object.defineProperties image_sprite, (->
      add_image_element = (img) ->
        img_element = img
        if img_element.id isnt ""
          
          #DEBUG
          console.assert typeof img_element.id is "string", "img_element.id is a string", img_element.id
          
          #END_DEBUG
          image_sprite.id = img_element.id
        image_sprite.width = img_element.width
        image_sprite.height = img_element.height
        image_sprite.graphics.draw (ctx) ->
          ctx.drawImage img_element, 0, 0

        image_sprite.emit createEvent(LOAD)
      remove_image_element = ->
        if img_element isnt null
          img_element = null
          image_sprite.graphics.clear()
          image_sprite.emit createEvent(CHANGE)
      load_image = (img_elem) ->
        image = get_element(img_elem)
        
        #element id
        image_sprite.id = img_elem  if typeof img_elem is "string"
        
        #DEBUG
        throw new TypeError(this + "::load_image(*img_elem*): Parameter must be an image object, or element id.")  if not image or (image and image.tagName isnt "IMG")
        
        #END_DEBUG
        
        #check if image has already been loaded
        if image.complete
          add_image_element image
        else
          
          #if not, assign load handlers
          image.onload = ->
            add_image_element image

          image.onerror = ->
            throw new URIError("[object Image](imageSrc): Unable to load " + image.src)

          image.onabort = ->
            throw new URIError("[object Image](imageSrc): Unable to load " + image.src)
      img_element = null
      
      ###
      @name element
      @return {HTMLImageElement}
      @throws {TypeError}
      @throws {URIError}
      @property
      ###
      element:
        enumerable: true
        configurable: false
        get: ->
          img_element

        set: (imageVar) ->
          if imageVar is null or imageVar is false
            remove_image_element()
          else
            load_image imageVar

      
      ###
      @name src
      @return {string}
      @throws {TypeError}
      @throws {URIError}
      @property
      ###
      src:
        enumerable: true
        configurable: false
        get: ->
          (if (img_element is null) then null else img_element.src)

        set: (srcVar) ->
          if srcVar is null or srcVar is false
            remove_image_element()
          else
            
            #DEBUG
            type_check srcVar, "string",
              label: "Image.id"
              id: @id

            
            #END_DEBUG
            image = new window.Image()
            image.src = window.encodeURI(srcVar)
            load_image image
    ()) #end defineProperties
    switch arguments_.length
      when 0, 1
        
        #passed function or text string
        if typeof arguments_[0] is "function"
          arguments_[0].call image_sprite
          imageSrc = `undefined`
        else
          
          #constructor param can be an image element or url
          if typeof imageSrc isnt "string"
            image_sprite.element = imageSrc
          else if typeof imageSrc is "string" and imageSrc[0] is "#"
            image_sprite.element = imageSrc
          else
            image_sprite.src = imageSrc
      else
        
        #DEBUG
        throw new SyntaxError("[object Image](imageSrc): Invalid number of parameters.")
    
    #END_DEBUG
    image_sprite

  
  ###
  Returns the string representation of the specified object.
  @name toString
  @return {string}
  @override
  ###
  image_sprite_static_properties = toString:
    enumerable: false
    writable: false
    configurable: false
    value: ->
      "[object Image]"
)() #end class closure
