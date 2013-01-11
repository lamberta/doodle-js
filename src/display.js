#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle, Stats
(->
  display_static_properties = undefined
  display_count = 0
  create_frame = undefined
  clear_scene_graph = undefined
  draw_scene_graph = undefined
  dispatch_mouse_event = undefined
  dispatch_mousemove_event = undefined
  dispatch_mouseleave_event = undefined
  dispatch_keyboard_event = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  range_check = doodle.utils.debug.range_check
  
  #END_DEBUG
  create_scene_path = doodle.utils.create_scene_path
  isLayer = doodle.Layer.isLayer
  get_element = doodle.utils.get_element
  get_element_property = doodle.utils.get_element_property
  set_element_property = doodle.utils.set_element_property
  createLayer = doodle.createLayer
  
  #recycle these event objects
  evt_animationFrame = doodle.events.createEvent(doodle.events.Event.ANIMATION_FRAME)
  evt_mouseEvent = doodle.events.createMouseEvent("")
  
  #evt_touchEvent = doodle.events.createTouchEvent(''),
  evt_keyboardEvent = doodle.events.createKeyboardEvent("")
  
  ###
  Doodle Display object.
  @name doodle.createDisplay
  @class
  @augments doodle.ElementNode
  @param {HTMLElement=} element
  @param {object=} options
  @return {doodle.Display}
  @throws {TypeError} Must be a block style element.
  @throws {SyntaxError}
  @example
  var display = doodle.createDisplay;<br/>
  display.width = 400;
  @example
  var display = doodle.createDisplay(function () {<br/>
  &nbsp; this.width = 400;<br/>
  });
  ###
  doodle.Display = doodle.createDisplay = (element) -> #, options
    display = undefined
    id = undefined
    options = (if (typeof arguments_[arguments_.length - 1] is "object") then Array::pop.call(arguments_) else {})
    opt_layercount = 1
    
    #extract id from element
    if element and typeof element isnt "function"
      element = get_element(element)
      
      #DEBUG
      type_check element, "block",
        label: "Display"
        id: @id
        message: "Invalid element."

      
      #END_DEBUG
      id = get_element_property(element, "id")
    id = (if (typeof id is "string") then id else "display" + String("00" + display_count++).slice(-2))
    
    #won't assign element until after display properties are set up
    display = Object.create(doodle.createElementNode(`undefined`, id))
    
    #DEBUG
    
    #check options object
    if options isnt false
      type_check options, "object",
        label: "Display"
        id: @id
        message: "Invalid options object."

    
    #END_DEBUG
    Object.defineProperties display, display_static_properties
    
    #properties that require privacy
    Object.defineProperties display, (->
      #just a reference
      #all descendants
      
      #chrome mouseevent has offset info, otherwise need to calculate
      
      #move to closer scope since they're called frequently
      
      #recycled event objects
      
      # @param {doodle.events.MouseEvent} evt
      #       
      on_mouse_event = (evt) ->
        $dispatch_mouse_event evt, $evt_mouseEvent, display_scene_path, display_scene_path.length, mouseX, mouseY, $display
      
      # @param {doodle.events.MouseEvent} evt
      #       
      on_mouse_move = (evt) ->
        x = undefined
        y = undefined
        mouseX = x = (if evt_offset_p then evt.offsetX else evt.clientX - dom_element.offsetLeft)
        mouseY = y = (if evt_offset_p then evt.offsetY else evt.clientY - dom_element.offsetTop)
        $dispatch_mousemove_event evt, $evt_mouseEvent, display_scene_path, display_scene_path.length, x, y, $display
      
      # @param {doodle.events.MouseEvent} evt
      #       
      on_mouse_leave = (evt) ->
        $dispatch_mouseleave_event evt, $evt_mouseEvent, display_scene_path, layers, layers.length, $display
      
      # @param {doodle.events.KeyboardEvent} evt
      #       
      on_keyboard_event = (evt) ->
        $dispatch_keyboard_event evt, $evt_keyboardEvent, $display
      
      #
      #       
      on_create_frame = ->
        $create_frame layers, layers.length, emitter_queue, emitter_queue.length, $evt_animationFrame, display_scene_path, display_scene_path.length, $display
      width = 0
      height = 0
      dom_element = null
      layers = display.children
      emitter_queue = doodle.Emitter.emitter_queue
      display_scene_path = []
      mouseX = 0
      mouseY = 0
      evt_offset_p = document.createEvent("MouseEvent").offsetX isnt `undefined`
      $display = display
      $dispatch_mouse_event = dispatch_mouse_event
      $dispatch_mousemove_event = dispatch_mousemove_event
      $dispatch_mouseleave_event = dispatch_mouseleave_event
      $dispatch_keyboard_event = dispatch_keyboard_event
      $create_frame = create_frame
      $evt_animationFrame = evt_animationFrame
      $evt_mouseEvent = evt_mouseEvent
      $evt_keyboardEvent = evt_keyboardEvent
      
      #Add display handlers
      #Redraw scene graph when children are added and removed.
      #**when objects removed in event loop, causing it to re-run before its finished
      #$display.addListener(doodle.events.Event.ADDED, on_create_frame);
      #$display.addListener(doodle.events.Event.REMOVED, on_create_frame);
      
      #Add keyboard listeners to document.
      document.addEventListener doodle.events.KeyboardEvent.KEY_PRESS, on_keyboard_event, false
      document.addEventListener doodle.events.KeyboardEvent.KEY_DOWN, on_keyboard_event, false
      document.addEventListener doodle.events.KeyboardEvent.KEY_UP, on_keyboard_event, false
      
      ###
      Display always returns itself as root.
      @name root
      @return {Display}
      @property
      @override
      ###
      root:
        enumerable: true
        writable: false
        configurable: false
        value: $display

      
      ###
      Mouse x position on display.
      @name mouseX
      @return {number} [read-only]
      @property
      ###
      mouseX:
        enumerable: true
        configurable: false
        get: ->
          mouseX

      
      ###
      Mouse y position on display.
      @name mouseY
      @return {number} [read-only]
      @property
      ###
      mouseY:
        enumerable: true
        configurable: false
        get: ->
          mouseY

      
      ###
      Display width. Setting this affects all it's children layers.
      @name width
      @return {number}
      @throws {TypeError}
      @property
      @override
      ###
      width:
        get: ->
          width

        set: (n) ->
          i = layers.length
          
          #DEBUG
          type_check n, "number",
            label: "Display.width"
            id: @id

          range_check window.isFinite(n),
            label: "Display.width"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          set_element_property @element, "width", n + "px"
          width = n
          
          #cascade down to our canvas layers
          layers[i].width = n  while i--
          n

      
      ###
      Display height. Setting this affects all it's children layers.
      @name height
      @return {number}
      @throws {TypeError}
      @property
      @override
      ###
      height:
        get: ->
          height

        set: (n) ->
          i = layers.length
          
          #DEBUG
          type_check n, "number",
            label: "Display.height"
            id: @id

          range_check window.isFinite(n),
            label: "Display.height"
            id: @id
            message: "Parameter must be a finite number."

          
          #END_DEBUG
          set_element_property @element, "height", n + "px"
          height = n
          
          #cascade down to our canvas layers
          layers[i].height = n  while i--
          n

      
      ###
      Will be able to set this in the future, but for now, just return top layer.
      @name activeLayer
      @return {doodle.Layer}
      ###
      activeLayer:
        enumerable: true
        get: ->
          layers[0]

      
      ###
      Gets size of display element and adds event handlers.
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
          type_check elementArg, "block",
            label: "Display.__addDomElement"
            params: "elementArg"
            id: @id

          
          #END_DEBUG
          
          #need to stack the canvas elements on top of each other
          set_element_property elementArg, "position", "relative"
          
          #get computed style
          w = get_element_property(elementArg, "width", "int") or elementArg.width
          h = get_element_property(elementArg, "height", "int") or elementArg.height
          
          #setting this also sets child layers
          @width = w  if typeof w is "number"
          @height = h  if typeof h is "number"
          
          #add event handlers
          #MouseEvents
          elementArg.addEventListener doodle.events.MouseEvent.MOUSE_MOVE, on_mouse_move, false
          
          #this dispatches mouseleave and mouseout for display and layers
          elementArg.addEventListener doodle.events.MouseEvent.MOUSE_OUT, on_mouse_leave, false
          
          #
          elementArg.addEventListener doodle.events.MouseEvent.CLICK, on_mouse_event, false
          elementArg.addEventListener doodle.events.MouseEvent.DOUBLE_CLICK, on_mouse_event, false
          elementArg.addEventListener doodle.events.MouseEvent.MOUSE_DOWN, on_mouse_event, false
          elementArg.addEventListener doodle.events.MouseEvent.MOUSE_UP, on_mouse_event, false
          elementArg.addEventListener doodle.events.MouseEvent.CONTEXT_MENU, on_mouse_event, false
          elementArg.addEventListener doodle.events.MouseEvent.MOUSE_WHEEL, on_mouse_event, false
          
          #//TouchEvents
          #            elementArg.addEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
          #            elementArg.addEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
          #            elementArg.addEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
          #            elementArg.addEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
          #            
          dom_element = elementArg

      
      ###
      Removes event handlers from display element.
      @name __removeDomElement
      @param {HTMLElement} elementArg
      @override
      @private
      ###
      __removeDomElement:
        enumerable: false
        writable: false
        value: (elementArg) ->
          
          #DEBUG
          
          #make sure it exists here
          #END_DEBUG
          
          #remove event handlers
          #MouseEvents
          elementArg.removeEventListener doodle.events.MouseEvent.MOUSE_MOVE, on_mouse_move, false
          
          #
          elementArg.removeEventListener doodle.events.MouseEvent.MOUSE_OUT, on_mouse_leave, false
          
          #
          elementArg.removeEventListener doodle.events.MouseEvent.CLICK, on_mouse_event, false
          elementArg.removeEventListener doodle.events.MouseEvent.DOUBLE_CLICK, on_mouse_event, false
          elementArg.removeEventListener doodle.events.MouseEvent.MOUSE_DOWN, on_mouse_event, false
          elementArg.removeEventListener doodle.events.MouseEvent.MOUSE_UP, on_mouse_event, false
          elementArg.removeEventListener doodle.events.MouseEvent.CONTEXT_MENU, on_mouse_event, false
          elementArg.removeEventListener doodle.events.MouseEvent.MOUSE_WHEEL, on_mouse_event, false
          
          #//TouchEvents
          #            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
          #            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
          #            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
          #            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
          #            
          dom_element = null

      
      ###
      All descendants of the display, in scene graph order.
      @name allChildren
      @return {Array} [read-only]
      @property
      ###
      allChildren:
        enumerable: true
        configurable: false
        get: ->
          display_scene_path

      
      ###
      Re-creates the display's scene path. Called when adding child nodes.
      @name __sortAllChildren
      @throws {RangeError}
      @throws {ReferenceError}
      @private
      ###
      __sortAllChildren:
        enumerable: false
        configurable: false
        value: ->
          create_scene_path(this, display_scene_path, true).reverse()
          
          #DEBUG
          type_check display_scene_path[0], "Display",
            label: "Display.__sortAllChildren"
            id: @id


      
      #END_DEBUG
      
      ###
      Returns a list of nodes under a given display position.
      @name getNodesUnderPoint
      @param {Point} point
      @throws {TypeError}
      @return {Array}
      ###
      getNodesUnderPoint:
        enumerable: true
        configurable: false
        value: (point) ->
          
          #DEBUG
          type_check point, "Point",
            label: "Display.getNodesUnderPoint"
            params: "point"
            id: @id

          
          #END_DEBUG
          nodes = []
          scene_path = display_scene_path
          i = scene_path.length
          x = point.x
          y = point.y
          node = undefined
          while i--
            node = scene_path[i]
            nodes.push node  if node.__getBounds(this).contains(x, y)
          nodes

      
      ###
      Add a layer to the display's children at the given array position.
      Layer inherits the dimensions of the display.
      @name addChildAt
      @param {Layer} layer
      @param {number} index
      @return {Layer}
      @throws {TypeError}
      @override
      ###
      addChildAt:
        enumerable: true
        configurable: false
        value: (->
          super_addChildAt = $display.addChildAt
          (layer, index) ->
            
            #DEBUG
            type_check layer, "Layer", index, "number",
              label: "Display.addChildAt"
              params: ["layer", "index"]
              id: @id

            
            #END_DEBUG
            
            #inherit display dimensions
            layer.width = @width
            layer.height = @height
            
            #add dom element
            @element.appendChild layer.element
            super_addChildAt.call this, layer, index
        ())

      
      ###
      Remove a layer from the display's children at the given array position.
      @name removeChildAt
      @param {number} index
      @throws {TypeError}
      @override
      ###
      removeChildAt:
        enumerable: true
        writable: false
        configurable: false
        value: (->
          super_removeChildAt = $display.removeChildAt
          (index) ->
            
            #DEBUG
            type_check index, "number",
              label: "Display.removeChildAt"
              params: "index"
              id: @id

            
            #END_DEBUG
            
            #remove from dom
            @element.removeChild layers[index].element
            super_removeChildAt.call this, index
        ())

      
      ###
      Change the display order of two child layers at the given index.
      @name swapChildrenAt
      @param {number} idx1
      @param {number} idx2
      @throws {TypeError}
      @override
      ###
      swapChildrenAt:
        enumerable: true
        writable: false
        configurable: false
        value: (->
          super_swapChildrenAt = $display.swapChildrenAt
          (idx1, idx2) ->
            
            #DEBUG
            type_check idx1, "number", idx2, "number",
              label: "Display.swapChildrenAt"
              params: ["index1", "index2"]
              id: @id

            
            #END_DEBUG
            
            #swap dom elements
            if idx1 > idx2
              @element.insertBefore layers[idx2].element, layers[idx1].element
            else
              @element.insertBefore layers[idx1].element, layers[idx2].element
            super_swapChildrenAt.call this, idx1, idx2
        ())

      
      #DEBUG_STATS
      debug:
        enumerable: true
        configurable: false
        value: Object.create(null,
          
          #DEBUG
          
          ###
          Color of the bounding box outline for nodes on the display.
          Display a particular node's bounds with node.debug.boundingBox = true
          @name debug.boundingBox
          @param {string} color
          @return {string}
          @override
          @property
          ###
          boundingBox: (->
            bounds_color = "#0000cc"
            enumerable: true
            configurable: false
            get: ->
              bounds_color

            set: (boundingBoxColor) ->
              bounds_color = boundingBoxColor
          ())
          
          #END_DEBUG
          
          ###
          Overlay a stats meter on the display.
          See http://github.com/mrdoob/stats.js for more info.
          To include in a compiled build, use ./build/make-doodle -S
          @name debug.stats
          @param {boolean}
          @return {Stats|boolean}
          @throws {TypeError}
          @property
          ###
          stats: (->
            debug_stats = false #stats object
            enumerable: true
            configurable: false
            get: ->
              debug_stats

            set: (useStats) ->
              
              #DEBUG
              type_check useStats, "boolean",
                label: "Display.debug.stats"
                params: "useStats"
                id: @id

              
              #END_DEBUG
              if useStats and not debug_stats
                debug_stats = new Stats()
                $display.element.appendChild debug_stats.domElement
              else if not useStats and debug_stats
                $display.element.removeChild debug_stats.domElement
                debug_stats = false
          ())
        )

      
      #END_DEBUG_STATS
      
      ###
      Determines the interval to dispatch the event type Event.ANIMATION_FRAME.
      This event is dispatched simultaneously to all display objects listenting
      for this event. It does not go through a "capture phase" and is dispatched
      directly to the target, whether the target is on the display list or not.
      @name frameRate
      @return {number|false}
      @throws {TypeError}
      @throws {RangeError}
      @property
      ###
      frameRate: (->
        frame_rate = false #fps
        framerate_interval_id = undefined
        get: ->
          frame_rate

        set: (fps) ->
          
          #DEBUG
          if fps isnt false and fps isnt 0
            type_check fps, "number",
              label: "Display.frameRate"
              params: "fps"
              id: @id

            range_check fps >= 0, window.isFinite(1000 / fps),
              label: "Display.frameRate"
              params: "fps"
              id: @id
              message: "Invalid frame rate."

          
          #END_DEBUG
          if fps is 0 or fps is false
            
            #turn off interval
            frame_rate = false
            window.clearInterval framerate_interval_id  if framerate_interval_id isnt `undefined`
          else
            
            #non-zero number, ignore if given same value
            if fps isnt frame_rate
              window.clearInterval framerate_interval_id  if framerate_interval_id isnt `undefined`
              framerate_interval_id = window.setInterval(on_create_frame, 1000 / fps)
              frame_rate = fps
      ())
    #end return object
    ()) #end defineProperties
    
    #check args
    switch arguments_.length
      when 0, 1
        
        #passed function
        if typeof arguments_[0] is "function"
          arguments_[0].call element
          element = `undefined`
        else
          
          #passed element
          #DEBUG
          type_check element, "block",
            label: "Display"
            id: @id
            message: "Invalid initialization."

          
          #END_DEBUG
          display.element = element
      else
        throw new SyntaxError("[object Display](element): Invalid number of parameters.")
    
    #DEBUG
    
    #can't proceed with initialization without an element to work with
    type_check display.element, "block",
      label: "Display.element"
      id: @id
      message: "Invalid initialization."

    
    #END_DEBUG
    
    #draw at least 1 frame
    create_frame display.children, display.children.length, doodle.Emitter.emitter_queue, doodle.Emitter.emitter_queue.length, evt_animationFrame, display.allChildren, display.allChildren.length, display
    
    #parse options object
    display.width = options.width  if options.width isnt `undefined`
    display.height = options.height  if options.height isnt `undefined`
    display.backgroundColor = options.backgroundColor  if options.backgroundColor isnt `undefined`
    display.clearBitmap = options.clearBitmap  if options.clearBitmap isnt `undefined`
    if options.layers isnt `undefined`
      
      #DEBUG
      type_check options.layers, "number",
        label: "createDisplay"
        id: display.id
        message: "options.layers must be a number."

      range_check options.layers >= 0,
        label: "createDisplay"
        id: display.id
        message: "options.layers must be 0 or greater."

      
      #END_DEBUG
      opt_layercount = options.layers
    if options.frameRate isnt `undefined`
      display.frameRate = options.frameRate
    else
      display.frameRate = 24
    
    #create layers, defaults to 1
    display.createLayer()  while opt_layercount--  if display.children.length is 0
    display

  #end doodle.createDisplay
  display_static_properties =
    
    ###
    A Display has no parent.
    @name parent
    @return {null}
    @override
    @property
    ###
    parent:
      enumerable: true
      writable: false
      configurable: false
      value: null

    
    ###
    Alias for display.children, since every child is a Layer.
    @name layers
    @return {array}
    ###
    layers:
      enumerable: true
      configurable: false
      get: ->
        @children

    
    ###
    Returns the string representation of the specified object.
    @name toString
    @return {string}
    @override
    @property
    ###
    toString:
      enumerable: false
      writable: false
      configurable: false
      value: ->
        "[object Display]"

    
    ###
    Add a new layer to the display's children.
    @name createLayer
    @return {Layer}
    @throws {TypeError}
    ###
    createLayer:
      value: ->
        @addChild createLayer.apply(`undefined`, arguments_)

    
    ###
    Remove a layer with a given name from the display's children.
    @name removeLayer
    @param {string} id
    @throws {TypeError}
    ###
    removeLayer:
      value: (id) ->
        
        #DEBUG
        type_check id, "string",
          label: "Display.removeLayer"
          params: "id"
          id: @id

        
        #END_DEBUG
        @removeChildById id

    
    ###
    The bounds of a display is always it's dimensions.
    @name __getBounds
    @return {Rectangle} This object is reused with each call.
    @override
    @private
    ###
    __getBounds:
      enumerable: false
      configurable: true
      value: (->
        rect = doodle.geom.createRectangle(0, 0, 0, 0) #recycle
        ->
          rect.compose 0, 0, @width, @height
      ())

  #end display_static_properties
  
  # Clear, move, draw.
  #   * Dispatches Event.ANIMATION_FRAME to all objects listening to it,
  #   * reguardless if it's on the scene graph or not.
  #   * @this {Display}
  #   
  create_frame = (->
    frame_count = 0
    make_frame = (layers, layer_count, receivers, recv_count, animationFrame, scene_path, path_count, display, clearRect) ->
      
      ###
      new way
      var node,
      i,
      bounds,
      ctx;
      //clear scene - only need top level nodes
      while (layer_count--) {
      ctx = layers[layer_count].context;
      
      node = layers[layer_count].children; //array - top level nodes
      i = node.length;
      
      while (i--) {
      ctx.clearRect.apply(ctx, node[i].__getBounds(display).inflate(2, 2).__toArray());
      }
      }
      
      //update position
      while (recv_count--) {
      if (receivers[recv_count].allListeners.hasOwnProperty('animationFrame')) {
      receivers[recv_count].handleEvent(animationFrame.__setTarget(receivers[recv_count]));
      }
      }
      
      //draw
      while (path_count--) {
      node = scene_path[path_count];
      ctx = node.context;
      
      if (ctx && node.visible) {
      ctx.save();
      ctx.transform.apply(ctx, node.__allTransforms.__toArray());
      
      //apply alpha to node and it's children
      if (!isLayer(node)) {
      if (node.alpha !== 1) {
      ctx.globalAlpha = node.alpha;
      }
      }
      if (typeof node.__draw === 'function') {
      node.__draw(ctx);
      }
      
      //DEBUG//
      if (node.debug.boundingBox) {
      bounds = node.__getBounds(display);
      if (bounds) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0); //reset
      //bounding box
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = display.debug.boundingBox;
      ctx.strokeRect.apply(ctx, bounds.__toArray());
      ctx.restore();
      }
      
      }
      //END_DEBUG//
      ctx.restore();
      }
      }
      ###
      
      ###
      old way **
      ###
      
      #TODO: optimize - this is basically an extra function call every frame
      clear_scene_graph layers, layer_count  if display.clearBitmap is true
      receivers[recv_count].handleEvent animationFrame.__setTarget(receivers[recv_count])  if receivers[recv_count].allListeners.hasOwnProperty("animationFrame")  while recv_count--
      
      #DEBUG
      
      #console.assert(scene_path.length === path_count, "scene_path.length === path_count", scene_path.length, path_count);
      #END_DEBUG
      draw_scene_graph scene_path, path_count
      
      #layer filters
      l = undefined
      filters = undefined
      len = undefined
      w = display.width
      h = display.height
      while layer_count--
        l = layers[layer_count]
        if l.filters
          filters = l.filters
          len = filters.length
          filters[len].__applyFilter l.context, 0, 0, w, h  while len--
      
      #DEBUG_STATS
      
      #update stats monitor if needed
      display.debug.stats.update()  if display.debug.stats isnt false
      
      #END_DEBUG_STATS
      frame_count++
  
  ###
  end old way*
  ###
  ())
  
  #
  #   * @param {Node} node
  #   
  clear_scene_graph = (layers, count) ->
    
    # Brute way, clear entire layer in big rect.
    #     
    layer = undefined
    ctx = undefined
    while count--
      layer = layers[count]
      if layer.clearBitmap is true
        ctx = layer.context
        ctx.save()
        ctx.setTransform 1, 0, 0, 1, 0, 0 #reset
        ctx.clearRect 0, 0, layer.width, layer.height
        ctx.restore()

  
  #
  #   *
  #   
  draw_scene_graph = (scene_path) ->
    node = undefined
    obj = undefined
    count = scene_path.length
    display = scene_path[0]
    ctx = undefined
    bounds = undefined
    alpha_total = undefined
    visiblep = undefined
    i = 1 #ignore display
    while i < count
      
      #while (count--) {
      obj = node = scene_path[i]
      
      #DEBUG
      console.assert Array.isArray(scene_path), "scene_path is an array", scene_path
      console.assert scene_path.length is count, "scene_path.length === count", count, scene_path.length
      console.assert doodle.Node.isNode(node), "node is a Node", node, i, scene_path
      console.assert doodle.Display.isDisplay(display), "display is a Display", display
      console.assert node.context and node.context.toString() is "[object CanvasRenderingContext2D]", "node.context is a context", node.context, node.id
      
      #END_DEBUG
      
      #display = node.root;
      ctx = node.context
      if ctx and node.visible
        
        #check visibility, get cumlative alpha for node and all its parents
        visiblep = true
        alpha_total = 1
        while obj
          unless obj.visible
            visiblep = false
            break
          alpha_total *= obj.alpha
          obj = obj.parent
        continue  unless visiblep
        ctx.save()
        ctx.globalAlpha = alpha_total
        
        #apply alpha to node and it's children
        #if (!isLayer(node)) {
        #  if (node.alpha !== 1) {
        #    ctx.globalAlpha = node.alpha;
        #  }
        #}
        ctx.transform.apply ctx, node.__allTransforms.__toArray()
        node.__draw ctx  if typeof node.__draw is "function"
        ctx.restore()
        
        #DEBUG
        if node.debug.boundingBox
          bounds = node.__getBounds(display)
          if bounds
            ctx.save()
            ctx.setTransform 1, 0, 0, 1, 0, 0 #reset
            #bounding box
            ctx.lineWidth = 0.5
            ctx.strokeStyle = display.debug.boundingBox
            ctx.strokeRect.apply ctx, bounds.__toArray()
            ctx.restore()
      i++

  
  #END_DEBUG
  
  #
  #   * EVENT DISPATCHING
  #   
  
  # Dispatches the following dom mouse events to doodle nodes on the display path:
  #   * 'click', 'doubleclick', 'mousedown', 'mouseup', 'contextmenu', 'mousewheel'.
  #   * An event is dispatched to the first node on the display path which
  #   * mouse position is within their bounds. The event then follows the event path.
  #   * The doodle mouse event is recycled by copying properties from the dom event.
  #   *
  #   * @param {doodle.events.MouseEvent} evt DOM mouse event to copy properties from.
  #   * @param {doodle.events.MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
  #   * @param {Array} path Reference to the display's scene path.
  #   * @param {number} count number of nodes in the scene path array.
  #   * @param {number} x Position of the mouse x coordiante.
  #   * @param {number} y Position of the mouse y coorindate.
  #   * @param {Display} display Reference to the display object.
  #   * @return {boolean} True if event gets dispatched.
  #   * @private
  #   
  dispatch_mouse_event = (evt, mouseEvent, path, count, x, y, display) ->
    
    #DEBUG
    console.assert doodle.events.MouseEvent.isMouseEvent(evt), "evt is a MouseEvent", evt
    console.assert doodle.events.MouseEvent.isMouseEvent(mouseEvent), "mouseEvent is a MouseEvent", mouseEvent
    console.assert Array.isArray(path), "path is an array", path
    console.assert typeof count is "number", "count is a number", count
    console.assert typeof x is "number", "x is a number", x
    console.assert typeof y is "number", "y is a number", y
    console.assert doodle.Display.isDisplay(display), "display is a Display object", display
    
    #END_DEBUG
    while count--
      if path[count].__getBounds(display).contains(x, y)
        path[count].emit mouseEvent.__copyMouseEventProperties(evt, null)
        return true
    false

  (->
    
    # ignores layers until later - not implemented - not sure I want to
    #   
    dispatch_mouse_event_IGNORELAYER = (evt, mouseEvent, evt_type, path, count, x, y, display, layers, layer_count) ->
      
      #check nodes, dispatch if in boundry
      while count--
        break  if count <= layer_count
        if path[count].__getBounds(display).contains(x, y)
          path[count].emit mouseEvent.__copyMouseEventProperties(evt, null)
          return true
      
      #if no layers, dispatch from display
      if layer_count is 0
        display.emit mouseEvent.__copyMouseEventProperties(evt, null)
        return true
      
      #check layers, must have handler to dispatch
      while layer_count--
        if layers[layer_count].allListeners.hasOwnProperty(evt_type)
          layers[layer_count].emit mouseEvent.__copyMouseEventProperties(evt, null)
          return true
      
      #if nothing else, top layer dispatch to display
      layers[--count].emit mouseEvent.__copyMouseEventProperties(evt, null)
      true
  )()
  
  # Called on every mousemove event from the dom.
  #   * Dispatches the following events to doodle nodes on the display path:
  #   * 'mousemove', 'mouseover', 'mouseenter', 'mouseout', 'mouseleave'
  #   * Maintains mouse over/out information by assigning a boolean value to
  #   * the node.__pointInBounds property. This is only accessed in this function,
  #   * and is reset in 'dispatch_mouseleave_event'.
  #   *
  #   * @param {doodle.events.MouseEvent} evt DOM mouse event to copy properties from.
  #   * @param {doodle.events.MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
  #   * @param {Array} path Reference to the display's scene path.
  #   * @param {number} count number of nodes in the scene path array.
  #   * @param {number} x Position of the mouse x coordiante.
  #   * @param {number} y Position of the mouse y coorindate.
  #   * @param {Display} display Reference to the display object.
  #   * @return {boolean} True on dispatch. (Always true because display will trigger it.)
  #   * @private
  #   
  dispatch_mousemove_event = (evt, mouseEvent, path, count, x, y, display) ->
    node = undefined
    while count--
      node = path[count]
      if node.__getBounds(display).contains(x, y)
        
        #point in bounds
        unless node.__pointInBounds
          
          # @type {boolean} 
          node.__pointInBounds = true
          
          #dispatch events to node and up parent chain
          node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseover")
          node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseenter")
          return true
        
        #while in-bounds, dispatch mousemove
        node.emit mouseEvent.__copyMouseEventProperties(evt, null)
        return true
      else
        
        #point not on sprite
        if node.__pointInBounds
          
          # @type {boolean} 
          node.__pointInBounds = false
          
          #dispatch events to node and up parent chain
          node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseout")
          node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseleave")
          return true

  (->
    
    # not implemented
    #   
    dispatch_mousemove_event_IGNORELAYER = (evt, mouseEvent, path, count, x, y, display, layers, layer_count) ->
      node = undefined
      emitter_p = false
      while count--
        break  if count <= layer_count
        node = path[count]
        if node.__getBounds(display).contains(x, y)
          
          #point in bounds
          unless node.__pointInBounds
            
            # @type {boolean} 
            node.__pointInBounds = true
            node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseover")
            node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseenter")
            return true
          
          #while in-bounds, dispatch mousemove
          node.emit mouseEvent.__copyMouseEventProperties(evt, null)
          return true
        else
          
          #point not on sprite
          if node.__pointInBounds
            
            # @type {boolean} 
            node.__pointInBounds = false
            node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseout")
            node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseleave")
            return true
      
      #no layers
      if layer_count is 0
        unless display.__pointInBounds
          display.__pointInBounds = true
          display.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseout")
          display.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseleave")
          return true
        
        #while in-bounds, dispatch mousemove
        display.emit mouseEvent.__copyMouseEventProperties(evt, null)
        return true
      
      #check layers, always in bounds
      while layer_count--
        node = layers[layer_count]
        unless node.__pointInBounds
          
          # @type {boolean} 
          node.__pointInBounds = true
          if node.allListeners.hasOwnProperty("mouseover")
            node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseover")
            emitter_p = true
          if node.allListeners.hasOwnProperty("mouseenter")
            node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseenter")
            emitter_p = true
          return true  if emitter_p
        if node.allListeners.hasOwnProperty("mousemove")
          node.emit mouseEvent.__copyMouseEventProperties(evt, null)
          return true
      
      #nuthin doin, dispatch from top layer to display
      node = layers[--count]
      unless display.__pointInBounds
        display.__pointInBounds = true
        if display.allListeners.hasOwnProperty("mouseover")
          node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseover")
          emitter_p = true
        if display.allListeners.hasOwnProperty("mouseenter")
          node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseenter")
          emitter_p = true
        return true  if emitter_p
      
      #finally check mousemove
      if display.allListeners.hasOwnProperty("mousemove")
        node.emit mouseEvent.__copyMouseEventProperties(evt, null)
        return true
      false
  )()
  
  # Called when the mouse leaves the display element.
  #   * Dispatches 'mouseout' and 'mouseleave' to the display and resets
  #   * the __pointInBounds property for all nodes.
  #   *
  #   * @param {doodle.events.MouseEvent} evt DOM mouse event to copy properties from.
  #   * @param {doodle.events.MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
  #   * @param {Array} path Reference to the display's scene path.
  #   * @param {Array} layers Reference to display's children array.
  #   * @param {number} layer_count number of nodes in the layers array. Later reused to be node scene path count.
  #   * @param {Node} top_node Reference to the display object. Later reused to be the top layer.
  #   * @return {boolean} True on dispatch. (Always true because display will trigger it.)
  #   * @private
  #   
  dispatch_mouseleave_event = (evt, mouseEvent, path, layers, layer_count, top_node) ->
    if layer_count is 0
      
      #no layers so no scene path, display will dispatch
      # @type {boolean} 
      top_node.__pointInBounds = false
      top_node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseout")
      top_node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseleave")
      true
    else
      
      #reusing var - this is the top layer
      top_node = layers[layer_count - 1]
      
      #reusing var - scene path count
      layer_count = path.length
      
      #all nodes out-of-bounds
      # @type {boolean} 
      path[layer_count].__pointInBounds = false  while layer_count--
      
      #top layer dispatch
      top_node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseout")
      top_node.emit mouseEvent.__copyMouseEventProperties(evt, null, "mouseleave")
      true

  
  # Called when the dom detects a keypress.
  #   * Doodle KeyboardEvent is reused by copying the dom event properties.
  #   * @param {doodle.events.Event} evt DOM keyboard event to copy properties from.
  #   * @return {boolean}
  #   * @private
  #   
  dispatch_keyboard_event = (evt, keyboardEvent, display) ->
    display.broadcast keyboardEvent.__copyKeyboardEventProperties(evt, null)
    true
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is a Display.
@name isDisplay
@param {Object} obj
@return {boolean} True if object is a Doodle Display.
@static
###
doodle.Display.isDisplay = (obj) ->
  if typeof obj is "object"
    while obj
      if obj.toString() is "[object Display]"
        return true
      else
        obj = Object.getPrototypeOf(obj)
  false
