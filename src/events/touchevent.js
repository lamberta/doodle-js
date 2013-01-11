#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

# TouchEvent support is expermental.
# * http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html
# 
(->
  touchevent_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  
  #END_DEBUG
  isEvent = doodle.events.Event.isEvent
  
  ###
  @name doodle.events.createTouchEvent
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
  @param {Array=} touches ?
  @param {Array=} targetTouches ?
  @param {Array=} changedTouches ?
  @param {number=} scale
  @param {number=} rotation
  @return {doodle.events.TouchEvent}
  @throws {TypeError}
  @throws {SyntaxError}
  ###
  doodle.events.TouchEvent = doodle.events.createTouchEvent = (type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation) ->
    touchevent = undefined
    arg_len = arguments_.length
    init_obj = undefined
    copy_touchevent_properties = undefined
    #function, event
    #fn declared per event for private vars
    
    #DEBUG
    throw new SyntaxError("[object TouchEvent](type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation")  if arg_len is 0 or arg_len > 18
    
    #END_DEBUG
    
    #initialize uievent prototype with another event, function, or args
    if isEvent(arguments_[0])
      
      #DEBUG
      throw new SyntaxError("[object TouchEvent](event): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      touchevent = Object.create(doodle.events.createUIEvent(init_obj))
    else if typeof arguments_[0] is "function"
      
      #DEBUG
      throw new SyntaxError("[object TouchEvent](function): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      
      #use empty event type for now, will check after we call the init function.
      touchevent = Object.create(doodle.events.createUIEvent(""))
    else
      
      #parameter defaults
      bubbles = (if (bubbles is `undefined`) then false else bubbles)
      cancelable = (if (cancelable is `undefined`) then false else cancelable)
      view = (if (view is `undefined`) then null else view)
      detail = (if (detail is `undefined`) then 0 else detail)
      
      #DEBUG
      type_check type, "string", bubbles, "boolean", cancelable, "boolean", view, "*", detail, "number", screenX, "*", screenY, "*", clientX, "*", clientY, "*", ctrlKey, "*", altKey, "*", shiftKey, "*", metaKey, "*", touches, "*", targetTouches, "*", changedTouches, "*", scale, "*", rotation, "*",
        label: "TouchEvent"
        id: @id
        params: ["type", "bubbles", "cancelable", "view", "detail", "screenX", "screenY", "clientX", "clientY", "ctrlKey", "altKey", "shiftKey", "metaKey", "touches", "targetTouches", "changedTouches", "scale", "rotation"]

      
      #END_DEBUG
      touchevent = Object.create(doodle.events.createUIEvent(type, bubbles, cancelable, view, detail))
    Object.defineProperties touchevent, touchevent_static_properties
    
    #properties that require privacy
    Object.defineProperties touchevent, (->
      evt_screenX = 0
      evt_screenY = 0
      evt_clientX = 0
      evt_clientY = 0
      evt_ctrlKey = false
      evt_altKey = false
      evt_shiftKey = false
      evt_metaKey = false
      evt_touches = null
      evt_targetTouches = null
      evt_changedTouches = null
      evt_scale = 1
      evt_rotation = 0
      
      ###
      @name copy_touchevent_properties
      @param {doodle.events.TouchEvent} evt TouchEvent to copy properties from.
      @private
      ###
      copy_touchevent_properties = (evt) ->
        
        #DEBUG
        console.assert doodle.events.TouchEvent.isTouchEvent(evt), "evt is TouchEvent.", touchevent.id, evt
        
        #END_DEBUG
        evt_screenX = evt.screenX  if evt.screenX isnt `undefined`
        evt_screenY = evt.screenY  if evt.screenY isnt `undefined`
        evt_clientX = evt.clientX  if evt.clientX isnt `undefined`
        evt_clientY = evt.clientY  if evt.clientY isnt `undefined`
        evt_ctrlKey = evt.ctrlKey  if evt.ctrlKey isnt `undefined`
        evt_altKey = evt.altKey  if evt.altKey isnt `undefined`
        evt_shiftKey = evt.shiftKey  if evt.shiftKey isnt `undefined`
        evt_metaKey = evt.metaKey  if evt.metaKey isnt `undefined`
        evt_touches = evt.touches  if evt.touches isnt `undefined`
        evt_targetTouches = evt.targetTouches  if evt.targetTouches isnt `undefined`
        evt_changedTouches = evt.changedTouches  if evt.changedTouches isnt `undefined`
        evt_scale = evt.scale  if evt.scale isnt `undefined`
        evt_rotation = evt.rotation  if evt.rotation isnt `undefined`

      
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
      @name touches
      @return {Array} [read-only]
      @property
      ###
      touches:
        enumerable: true
        configurable: false
        get: ->
          evt_touches

      
      ###
      @name targetTouches
      @return {Array} [read-only]
      @property
      ###
      targetTouches:
        enumerable: true
        configurable: false
        get: ->
          evt_targetTouches

      
      ###
      @name changedTouches
      @return {Array} [read-only]
      @property
      ###
      changedTouches:
        enumerable: true
        configurable: false
        get: ->
          evt_changedTouches

      
      ###
      @name scale
      @return {number} [read-only]
      @property
      ###
      scale:
        enumerable: true
        configurable: false
        get: ->
          evt_scale

      
      ###
      @name rotation
      @return {number} [read-only]
      @property
      ###
      rotation:
        enumerable: true
        configurable: false
        get: ->
          evt_rotation

      
      ###
      @name initTouchEvent
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
      @param {Array} touchesArg
      @param {Array} targetTouchesArg
      @param {Array} changedTouchesArg
      @param {number} scaleArg
      @param {number} rotationArg
      @return {doodle.events.TouchEvent}
      @throws {TypeError}
      ###
      initTouchEvent:
        value: (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg, screenXArg, screenYArg, clientXArg, clientYArg, ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg, touchesArg, targetTouchesArg, changedTouchesArg, scaleArg, rotationArg) ->
          
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
          touchesArg = (if (touchesArg is `undefined`) then null else touchesArg)
          targetTouchesArg = (if (targetTouchesArg is `undefined`) then null else targetTouchesArg)
          changedTouchesArg = (if (changedTouchesArg is `undefined`) then null else changedTouchesArg)
          scaleArg = (if (scaleArg is `undefined`) then 1 else scaleArg)
          rotationArg = (if (rotationArg is `undefined`) then 0 else rotationArg)
          
          #DEBUG
          type_check typeArg, "string", canBubbleArg, "boolean", cancelableArg, "boolean", viewArg, "*", detailArg, "number", screenXArg, "number", screenYArg, "number", clientXArg, "number", clientYArg, "number", ctrlKeyArg, "boolean", altKeyArg, "boolean", shiftKeyArg, "boolean", metaKeyArg, "boolean", touchesArg, "*", targetTouchesArg, "*", changedTouchesArg, "*", scaleArg, "number", rotationArg, "number",
            label: "TouchEvent"
            id: @id
            params: ["type", "bubbles", "cancelable", "view", "detail", "screenX", "screenY", "clientX", "clientY", "ctrlKey", "altKey", "shiftKey", "metaKey", "touches", "targetTouches", "changedTouches", "scale", "rotation"]

          
          #END_DEBUG
          evt_screenX = screenXArg
          evt_screenY = screenYArg
          evt_clientX = clientXArg
          evt_clientY = clientYArg
          evt_ctrlKey = ctrlKeyArg
          evt_altKey = altKeyArg
          evt_shiftKey = shiftKeyArg
          evt_metaKey = metaKeyArg
          evt_touches = touchesArg
          evt_targetTouches = targetTouchesArg
          evt_changedTouches = changedTouchesArg
          evt_scale = scaleArg
          evt_rotation = rotationArg
          @initUIEvent typeArg, canBubbleArg, cancelableArg, viewArg, detailArg
          this

      
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
            label: "TouchEvent.getModifierState"
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
      Copy the properties from another TouchEvent.
      Allows for the reuse of this object for further dispatch.
      @name __copyTouchEventProperties
      @param {doodle.events.TouchEvent} evt
      @param {Node} resetTarget
      @param {string} resetType
      @return {doodle.events.TouchEvent}
      @throws {TypeError}
      @private
      ###
      __copyTouchEventProperties:
        enumerable: false
        configurable: false
        value: (evt, resetTarget, resetType) ->
          resetTarget = (if (resetTarget is `undefined`) then false else resetTarget)
          resetType = (if (resetType is `undefined`) then false else resetType)
          
          #DEBUG
          console.assert doodle.events.TouchEvent.isTouchEvent(evt), "evt is TouchEvent"
          console.assert resetTarget is false or resetTarget is null or doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false."
          console.assert resetType is false or typeof resetType is "string", "resetType is a string or false."
          
          #END_DEBUG
          copy_touchevent_properties evt
          @__copyUIEventProperties evt, resetTarget, resetType
    ()) #end defineProperties
    
    #initialize touchevent
    if init_obj
      if typeof init_obj is "function"
        init_obj.call touchevent
        
        #DEBUG
        
        #make sure we've checked our dummy type string
        throw new SyntaxError("[object TouchEvent](function): Must call 'this.initTouchEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation)' within the function argument.")  if touchevent.type is `undefined` or touchevent.type is "" or touchevent.bubbles is `undefined` or touchevent.cancelable is `undefined`
      
      #END_DEBUG
      else
        
        #passed a doodle or dom event object
        copy_touchevent_properties init_obj
    else
      
      #standard instantiation
      touchevent.initTouchEvent type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation
    touchevent

  
  ###
  @name toString
  @return {string}
  @override
  ###
  touchevent_static_properties = toString:
    enumerable: true
    writable: false
    configurable: false
    value: ->
      "[object TouchEvent]"
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is a TouchEvent.
@name isTouchEvent
@param {doodle.events.TouchEvent} event
@return {boolean}
@static
###
doodle.events.TouchEvent.isTouchEvent = (evt) ->
  if typeof evt is "object"
    while evt
      
      #for DOM events we need to check it's constructor name
      if evt.toString() is "[object TouchEvent]" or (evt.constructor and evt.constructor.name is "TouchEvent")
        return true
      else
        evt = Object.getPrototypeOf(evt)
  false
