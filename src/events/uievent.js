#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

# DOM 2 Event: UIEvent:Event
# * http://www.w3.org/TR/DOM-Level-3-Events/#events-Events-UIEvent
# 
(->
  uievent_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  
  #END_DEBUG
  isEvent = doodle.events.Event.isEvent
  
  ###
  @name doodle.events.createUIEvent
  @class
  @augments doodle.events.Event
  @param {string=} type
  @param {boolean=} bubbles
  @param {boolean=} cancelable
  @param {HTMLElement=} view
  @param {number=} detail
  @return {doodle.events.UIEvent}
  @throws {TypeError}
  @throws {SyntaxError}
  ###
  doodle.events.UIEvent = doodle.events.createUIEvent = (type, bubbles, cancelable, view, detail) ->
    uievent = undefined
    arg_len = arguments_.length
    init_obj = undefined
    copy_uievent_properties = undefined
    #function, event
    #fn declared per event for private vars
    
    #DEBUG
    throw new SyntaxError("[object UIEvent](type, bubbles, cancelable, view, detail): Invalid number of parameters.")  if arg_len is 0 or arg_len > 5
    
    #END_DEBUG
    
    #initialize uievent prototype with another event, function, or args
    if isEvent(arguments_[0])
      
      #DEBUG
      throw new SyntaxError("[object UIEvent](event): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      uievent = Object.create(doodle.events.createEvent(init_obj))
    else if typeof arguments_[0] is "function"
      
      #DEBUG
      throw new SyntaxError("[object UIEvent](function): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      
      #use empty event type for now, will check after we call the init function.
      uievent = Object.create(doodle.events.createEvent(""))
    else
      
      #parameter defaults
      bubbles = (if (bubbles is `undefined`) then false else bubbles)
      cancelable = (if (cancelable is `undefined`) then false else cancelable)
      
      #DEBUG
      type_check type, "string", bubbles, "boolean", cancelable, "boolean", view, "*", detail, "*",
        label: "UIEvent"
        params: ["type", "bubbles", "cancelable", "view", "detail"]
        id: @id

      
      #END_DEBUG
      uievent = Object.create(doodle.events.createEvent(type, bubbles, cancelable))
    Object.defineProperties uievent, uievent_static_properties
    
    #properties that require privacy
    Object.defineProperties uievent, (->
      evt_view = null
      evt_detail = 0
      evt_which = 0
      evt_charCode = 0
      evt_keyCode = 0
      evt_layerX = 0
      evt_layerY = 0
      evt_pageX = 0
      evt_pageY = 0
      
      ###
      @name copy_uievent_properties
      @param {doodle.events.UIEvent} evt UIEvent to copy properties from.
      @throws {TypeError}
      @private
      ###
      copy_uievent_properties = (evt) ->
        
        #DEBUG
        console.assert doodle.events.UIEvent.isUIEvent(evt), "evt is UIEvent.", uievent.id, evt
        
        #END_DEBUG
        evt_view = evt.view  if evt.view isnt `undefined`
        evt_detail = evt.detail  if evt.detail isnt `undefined`
        evt_which = evt.which  if evt.which isnt `undefined`
        evt_charCode = evt.charCode  if evt.charCode isnt `undefined`
        evt_keyCode = evt.keyCode  if evt.keyCode isnt `undefined`
        evt_layerX = evt.layerX  if evt.layerX isnt `undefined`
        evt_layerY = evt.layerY  if evt.layerY isnt `undefined`
        evt_pageX = evt.pageX  if evt.pageX isnt `undefined`
        evt_pageY = evt.pageY  if evt.pageY isnt `undefined`

      
      ###
      @name view
      @return {HTMLElement} [read-only]
      @property
      ###
      view:
        enumerable: true
        configurable: false
        get: ->
          evt_view

      
      ###
      @name detail
      @return {number} [read-only]
      @property
      ###
      detail:
        enumerable: true
        configurable: false
        get: ->
          evt_detail

      
      ###
      @name which
      @return {number} [read-only]
      @property
      ###
      which:
        enumerable: true
        configurable: false
        get: ->
          evt_which

      
      ###
      @name charCode
      @return {number} [read-only]
      @property
      ###
      charCode:
        enumerable: true
        configurable: false
        get: ->
          evt_charCode

      
      ###
      @name keyCode
      @return {number} [read-only]
      @property
      ###
      keyCode:
        enumerable: true
        configurable: false
        get: ->
          evt_keyCode

      
      ###
      @name layerX
      @return {number} [read-only]
      @property
      ###
      layerX:
        enumerable: true
        configurable: false
        get: ->
          evt_layerX

      
      ###
      @name layerY
      @return {number} [read-only]
      @property
      ###
      layerY:
        enumerable: true
        configurable: false
        get: ->
          evt_layerY

      
      ###
      @name pageX
      @return {number} [read-only]
      @property
      ###
      pageX:
        enumerable: true
        configurable: false
        get: ->
          evt_pageX

      
      ###
      @name pageY
      @return {number} [read-only]
      @property
      ###
      pageY:
        enumerable: true
        configurable: false
        get: ->
          evt_pageY

      
      ###
      @name initUIEvent
      @param {string} typeArg
      @param {boolean} canBubbleArg
      @param {boolean} cancelableArg
      @param {HTMLElement} viewArg
      @param {number} detailArg
      @return {doodle.events.UIEvent}
      @throws {TypeError}
      ###
      initUIEvent:
        value: (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg) ->
          canBubbleArg = (if (canBubbleArg is `undefined`) then false else canBubbleArg)
          cancelableArg = (if (cancelableArg is `undefined`) then false else cancelableArg)
          viewArg = (if (viewArg is `undefined`) then null else viewArg)
          detailArg = (if (detailArg is `undefined`) then 0 else detailArg)
          
          #DEBUG
          type_check typeArg, "string", canBubbleArg, "boolean", cancelableArg, "boolean", viewArg, "*", detailArg, "number",
            label: "UIEvent.initUIEvent"
            params: ["type", "canBubble", "cancelable", "view", "detail"]
            id: @id

          
          #END_DEBUG
          evt_view = viewArg
          evt_detail = detailArg
          @initEvent typeArg, canBubbleArg, cancelableArg
          this

      
      ###
      Copy the properties from another UIEvent.
      Allows for the reuse of this object for further dispatch.
      @name __copyUIEventProperties
      @param {doodle.events.UIEvent} evt
      @param {Node=} resetTarget
      @param {string=} resetType
      @return {Event}
      @throws {TypeError}
      @private
      ###
      __copyUIEventProperties:
        enumerable: false
        configurable: false
        value: (evt, resetTarget, resetType) ->
          resetTarget = (if (resetTarget is `undefined`) then false else resetTarget)
          resetType = (if (resetType is `undefined`) then false else resetType)
          
          #DEBUG
          console.assert doodle.events.UIEvent.isUIEvent(evt), "evt is UIEvent"
          console.assert resetTarget is false or resetTarget is null or doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false."
          console.assert resetType is false or typeof resetType is "string", "resetType is a string or false."
          
          #END_DEBUG
          copy_uievent_properties evt
          @__copyEventProperties evt, resetTarget, resetType
    ()) #end defineProperties
    
    #initialize uievent
    if init_obj
      if typeof init_obj is "function"
        init_obj.call uievent
        
        #DEBUG
        
        #make sure we've checked our dummy type string
        throw new SyntaxError("[object UIEvent](function): Must call 'this.initUIEvent(type, bubbles, cancelable, view, detail)' within the function argument.")  if uievent.type is `undefined` or uievent.type is "" or uievent.bubbles is `undefined` or uievent.cancelable is `undefined`
      
      #END_DEBUG
      else
        
        #passed a doodle or dom event object
        copy_uievent_properties init_obj
    else
      
      #standard instantiation
      uievent.initUIEvent type, bubbles, cancelable, view, detail
    uievent

  
  ###
  @name toString
  @return {string}
  @override
  ###
  uievent_static_properties = toString:
    enumerable: true
    writable: false
    configurable: false
    value: ->
      "[object UIEvent]"
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is an UIEvent or inherits from it.
Returns true on Doodle events as well as DOM events.
@name isUIEvent
@param {doodle.events.Event} event
@return {boolean}
@static
###
doodle.events.UIEvent.isUIEvent = (evt) ->
  if typeof evt is "object"
    while evt
      
      #for DOM events we need to check it's constructor name
      if evt.toString() is "[object UIEvent]" or (evt.constructor and evt.constructor.name is "UIEvent")
        return true
      else
        evt = Object.getPrototypeOf(evt)
  false
