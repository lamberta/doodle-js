#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

# DOM 2 Event: MouseEvent:UIEvent
# * http://www.w3.org/TR/DOM-Level-3-Events/#events-mouseevents
# 
(->
  mouseevent_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  
  #END_DEBUG
  isEvent = doodle.events.Event.isEvent
  
  ###
  @name doodle.events.createMouseEvent
  @class
  @augments doodle.events.UIEvent
  @param {string=} type
  @param {boolean=} bubbles
  @param {boolean=} cancelable
  @param {HTMLElement=} view
  @param {number=} detail
  @param {number=} screenX
  @param {number=} screenY
  @param {number=} clientX
  @param {number=} clientY
  @param {boolean=} ctrlKey
  @param {boolean=} altKey
  @param {boolean=} shiftKey
  @param {boolean=} metaKey
  @param {number=} button Mouse button that caused the event (0|1|2)
  @param {Node=} relatedTarget Secondary target for event (only for some events)
  @return {doodle.events.MouseEvent}
  @throws {TypeError}
  @throws {SyntaxError}
  ###
  doodle.events.MouseEvent = doodle.events.createMouseEvent = (type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) ->
    mouseevent = undefined
    arg_len = arguments_.length
    init_obj = undefined
    copy_mouseevent_properties = undefined
    #function, event
    #fn declared per event for private vars
    
    #DEBUG
    throw new SyntaxError("[object MouseEvent](type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget): Invalid number of parameters.")  if arg_len is 0 or arg_len > 15
    
    #END_DEBUG
    
    #initialize uievent prototype with another event, function, or args
    if isEvent(arguments_[0])
      
      #DEBUG
      throw new SyntaxError("[object MouseEvent](event): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      mouseevent = Object.create(doodle.events.createUIEvent(init_obj))
    else if typeof arguments_[0] is "function"
      
      #DEBUG
      throw new SyntaxError("[object MouseEvent](function): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      
      #use empty event type for now, will check after we call the init function.
      mouseevent = Object.create(doodle.events.createUIEvent(""))
    else
      
      #parameter defaults
      bubbles = (if (bubbles is `undefined`) then false else bubbles)
      cancelable = (if (cancelable is `undefined`) then false else cancelable)
      view = (if (view is `undefined`) then null else view)
      detail = (if (detail is `undefined`) then 0 else detail)
      
      #DEBUG
      type_check type, "string", bubbles, "boolean", cancelable, "boolean", view, "*", detail, "number", screenX, "*", screenY, "*", clientX, "*", clientY, "*", ctrlKey, "*", altKey, "*", shiftKey, "*", metaKey, "*", button, "*", relatedTarget, "*",
        label: "MouseEvent"
        id: @id
        params: ["type", "bubbles", "cancelable", "view", "detail", "screenX", "screenY", "clientX", "clientY", "ctrlKey", "altKey", "shiftKey", "metaKey", "button", "relatedTarget"]

      
      #END_DEBUG
      mouseevent = Object.create(doodle.events.createUIEvent(type, bubbles, cancelable, view, detail))
    Object.defineProperties mouseevent, mouseevent_static_properties
    
    #properties that require privacy
    Object.defineProperties mouseevent, (->
      evt_x = 0
      evt_y = 0
      evt_offsetX = 0
      evt_offsetY = 0
      evt_screenX = 0
      evt_screenY = 0
      evt_clientX = 0
      evt_clientY = 0
      evt_ctrlKey = false
      evt_altKey = false
      evt_shiftKey = false
      evt_metaKey = false
      evt_button = 0
      evt_relatedTarget = null
      
      ###
      @name copy_mouseevent_properties
      @param {doodle.events.MouseEvent} evt MouseEvent to copy properties from.
      @throws {TypeError}
      @private
      ###
      copy_mouseevent_properties = (evt) ->
        
        #DEBUG
        console.assert doodle.events.MouseEvent.isMouseEvent(evt), "evt is MouseEvent.", mouseevent.id, evt
        
        #END_DEBUG
        evt_x = (if (evt.x isnt `undefined`) then evt.x else 0)
        evt_y = (if (evt.y isnt `undefined`) then evt.y else 0)
        evt_offsetX = (if (evt.offsetX isnt `undefined`) then evt.offsetX else 0)
        evt_offsetY = (if (evt.offsetY isnt `undefined`) then evt.offsetY else 0)
        evt_screenX = evt.screenX  if evt.screenX isnt `undefined`
        evt_screenY = evt.screenY  if evt.screenY isnt `undefined`
        evt_clientX = evt.clientX  if evt.clientX isnt `undefined`
        evt_clientY = evt.clientY  if evt.clientY isnt `undefined`
        evt_ctrlKey = evt.ctrlKey  if evt.ctrlKey isnt `undefined`
        evt_altKey = evt.altKey  if evt.altKey isnt `undefined`
        evt_shiftKey = evt.shiftKey  if evt.shiftKey isnt `undefined`
        evt_metaKey = evt.metaKey  if evt.metaKey isnt `undefined`
        evt_button = evt.button  if evt.button isnt `undefined`
        evt_relatedTarget = evt.relatedTarget  if evt.relatedTarget isnt `undefined`

      
      ###
      @name x
      @return {number} [read-only]
      @property
      ###
      x:
        enumerable: true
        configurable: false
        get: ->
          evt_x

      
      ###
      @name y
      @return {number} [read-only]
      @property
      ###
      y:
        enumerable: true
        configurable: false
        get: ->
          evt_y

      
      ###
      @name screenX
      @return {number} [read-only]
      @property
      ###
      screenX:
        enumerable: true
        configurable: false
        get: ->
          evt_screenX

      
      ###
      @name screenY
      @return {number} [read-only]
      @property
      ###
      screenY:
        enumerable: true
        configurable: false
        get: ->
          evt_screenY

      
      ###
      @name clientX
      @return {number} [read-only]
      @property
      ###
      clientX:
        enumerable: true
        configurable: false
        get: ->
          evt_clientX

      
      ###
      @name clientY
      @return {number} [read-only]
      @property
      ###
      clientY:
        enumerable: true
        configurable: false
        get: ->
          evt_clientY

      
      ###
      @name offsetX
      @return {number} [read-only]
      @property
      ###
      offsetX:
        enumerable: true
        configurable: false
        get: ->
          evt_offsetX

      
      ###
      @name offsetY
      @return {number} [read-only]
      @property
      ###
      offsetY:
        enumerable: true
        configurable: false
        get: ->
          evt_offsetY

      
      ###
      @name ctrlKey
      @return {boolean} [read-only]
      @property
      ###
      ctrlKey:
        enumerable: true
        configurable: false
        get: ->
          evt_ctrlKey

      
      ###
      @name altKey
      @return {boolean} [read-only]
      @property
      ###
      altKey:
        enumerable: true
        configurable: false
        get: ->
          evt_altKey

      
      ###
      @name shiftKey
      @return {boolean} [read-only]
      @property
      ###
      shiftKey:
        enumerable: true
        configurable: false
        get: ->
          evt_shiftKey

      
      ###
      @name metaKey
      @return {boolean} [read-only]
      @property
      ###
      metaKey:
        enumerable: true
        configurable: false
        get: ->
          evt_metaKey

      
      ###
      @name button
      @return {number} [read-only]
      @property
      ###
      button:
        enumerable: true
        configurable: false
        get: ->
          evt_button

      
      ###
      @name relatedTarget
      @return {Node} [read-only]
      @property
      ###
      relatedTarget:
        enumerable: true
        configurable: false
        get: ->
          evt_relatedTarget

      
      ###
      @name initMouseEvent
      @param {string} typeArg
      @param {boolean} canBubbleArg
      @param {boolean} cancelableArg
      @param {HTMLElement} viewArg
      @param {number} detailArg
      @param {number} screenXArg
      @param {number} screenYArg
      @param {number} clientXArg
      @param {number} clientYArg
      @param {boolean} ctrlKeyArg
      @param {boolean} altKeyArg
      @param {boolean} shiftKeyArg
      @param {boolean} metaKeyArg
      @param {number} buttonArg
      @param {Node} relatedTargetArg
      @return {doodle.events.MouseEvent}
      @throws {TypeError}
      ###
      initMouseEvent:
        value: (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg, screenXArg, screenYArg, clientXArg, clientYArg, ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg, buttonArg, relatedTargetArg) ->
          
          #parameter defaults
          canBubbleArg = (if (canBubbleArg is `undefined`) then false else canBubbleArg)
          cancelableArg = (if (cancelableArg is `undefined`) then false else cancelableArg)
          viewArg = (if (viewArg is `undefined`) then null else viewArg)
          detailArg = (if (detailArg is `undefined`) then 0 else detailArg)
          screenXArg = (if (screenXArg is `undefined`) then 0 else screenXArg)
          screenYArg = (if (screenYArg is `undefined`) then 0 else screenYArg)
          clientXArg = (if (clientXArg is `undefined`) then 0 else clientXArg)
          clientYArg = (if (clientYArg is `undefined`) then 0 else clientYArg)
          ctrlKeyArg = (if (ctrlKeyArg is `undefined`) then false else ctrlKeyArg)
          altKeyArg = (if (altKeyArg is `undefined`) then false else altKeyArg)
          shiftKeyArg = (if (shiftKeyArg is `undefined`) then false else shiftKeyArg)
          metaKeyArg = (if (metaKeyArg is `undefined`) then false else metaKeyArg)
          buttonArg = (if (buttonArg is `undefined`) then 0 else buttonArg)
          relatedTarget = (if (relatedTargetArg is `undefined`) then null else relatedTargetArg)
          
          #DEBUG
          type_check typeArg, "string", canBubbleArg, "boolean", canBubbleArg, "boolean", viewArg, "*", detailArg, "number", screenXArg, "number", screenYArg, "number", clientXArg, "number", clientYArg, "number", ctrlKeyArg, "boolean", altKeyArg, "boolean", shiftKeyArg, "boolean", metaKeyArg, "boolean", buttonArg, "number", relatedTargetArg, "*",
            label: "MouseEvent.initMouseEvent"
            id: @id
            params: ["typeArg", "canBubbleArg", "cancelableArg", "viewArg", "detailArg", "screenXArg", "screenYArg", "clientXArg", "clientYArg", "ctrlKeyArg", "altKeyArg", "shiftKeyArg", "metaKeyArg", "buttonArg", "relatedTargetArg"]

          
          #END_DEBUG
          evt_screenX = screenXArg
          evt_screenY = screenYArg
          evt_clientX = clientXArg
          evt_clientY = clientYArg
          evt_ctrlKey = ctrlKeyArg
          evt_altKey = altKeyArg
          evt_shiftKey = shiftKeyArg
          evt_metaKey = metaKeyArg
          evt_button = buttonArg
          evt_relatedTarget = relatedTargetArg
          @initUIEvent typeArg, canBubbleArg, cancelableArg, viewArg, detailArg

      
      ###
      Queries the state of a modifier using a key identifier.
      @name getModifierState
      @param {string} key A modifier key identifier
      @return {boolean} True if it is a modifier key and the modifier is activated, false otherwise.
      @throws {TypeError}
      ###
      getModifierState:
        value: (key) ->
          
          #DEBUG
          type_check key, "string",
            label: "MouseEvent.getModifierState"
            params: "key"
            id: @id

          
          #END_DEBUG
          switch key
            when "Alt"
              evt_altKey
            when "Control"
              evt_ctrlKey
            when "Meta"
              evt_metaKey
            when "Shift"
              evt_shiftKey
            else
              false

      
      ###
      Copy the properties from another MouseEvent.
      Allows for the reuse of this object for further dispatch.
      @name __copyMouseEventProperties
      @param {doodle.events.MouseEvent} evt
      @param {Node} resetTarget
      @param {string} resetType
      @return {doodle.events.MouseEvent}
      @throws {TypeError}
      @private
      ###
      __copyMouseEventProperties:
        enumerable: false
        configurable: false
        value: (evt, resetTarget, resetType) ->
          resetTarget = (if (resetTarget is `undefined`) then false else resetTarget)
          resetType = (if (resetType is `undefined`) then false else resetType)
          
          #DEBUG
          console.assert doodle.events.MouseEvent.isMouseEvent(evt), "evt is MouseEvent", @id
          console.assert resetTarget is false or resetTarget is null or doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false."
          console.assert resetType is false or typeof resetType is "string", "resetType is a string or false."
          
          #END_DEBUG
          copy_mouseevent_properties evt
          @__copyUIEventProperties evt, resetTarget, resetType
    ()) #end defineProperties
    
    #initialize mouseevent
    if init_obj
      if typeof init_obj is "function"
        init_obj.call mouseevent
        
        #DEBUG
        
        #make sure we've checked our dummy type string
        throw new SyntaxError("[object MouseEvent](function): Must call 'this.initMouseEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget)' within the function argument.")  if mouseevent.type is `undefined` or mouseevent.type is "" or mouseevent.bubbles is `undefined` or mouseevent.cancelable is `undefined`
      
      #END_DEBUG
      else
        
        #passed a doodle or dom event object
        copy_mouseevent_properties init_obj
    else
      
      #standard instantiation
      mouseevent.initMouseEvent type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget
    mouseevent

  
  ###
  @name toString
  @return {string}
  @override
  ###
  mouseevent_static_properties = toString:
    enumerable: true
    writable: false
    configurable: false
    value: ->
      "[object MouseEvent]"
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is a MouseEvent.
@name isMouseEvent
@param {doodle.events.MouseEvent} event
@return {boolean}
@static
###
doodle.events.MouseEvent.isMouseEvent = (evt) ->
  if typeof evt is "object"
    while evt
      
      #for DOM events we need to check it's constructor name
      if evt.toString() is "[object MouseEvent]" or (evt.constructor and (evt.constructor.name is "MouseEvent" or evt.constructor.name is "WheelEvent"))
        return true
      else
        evt = Object.getPrototypeOf(evt)
  false
