#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

# DOM 3 Event: TextEvent:UIEvent
# * http://www.w3.org/TR/DOM-Level-3-Events/#events-textevents
# 
(->
  textevent_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  
  #END_DEBUG
  isEvent = doodle.events.Event.isEvent
  
  ###
  @name doodle.events.createTextEvent
  @class
  @augments doodle.events.UIEvent
  @param {string=} type
  @param {boolean=} bubbles
  @param {boolean=} cancelable
  @param {HTMLElement=} view
  @param {string=} data
  @param {number=} inputMode
  @return {doodle.events.TextEvent}
  @throws {TypeError}
  @throws {SyntaxError}
  ###
  doodle.events.TextEvent = doodle.events.createTextEvent = (type, bubbles, cancelable, view, data, inputMode) ->
    textevent = undefined
    arg_len = arguments_.length
    init_obj = undefined
    copy_textevent_properties = undefined
    #function, event
    #fn declared per event for private vars
    
    #DEBUG
    throw new SyntaxError("[object TextEvent](type, bubbles, cancelable, view, data, inputMode): Invalid number of parameters.")  if arg_len is 0 or arg_len > 6
    
    #END_DEBUG
    
    #initialize uievent prototype with another event, function, or args
    if isEvent(arguments_[0])
      
      #DEBUG
      throw new SyntaxError("[object TextEvent](event): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      textevent = Object.create(doodle.events.createUIEvent(init_obj))
    else if typeof arguments_[0] is "function"
      
      #DEBUG
      throw new SyntaxError("[object TextEvent](function): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      
      #use empty event type for now, will check after we call the init function.
      textevent = Object.create(doodle.events.createUIEvent(""))
    else
      
      #parameter defaults
      bubbles = (if (bubbles is `undefined`) then false else bubbles)
      cancelable = (if (cancelable is `undefined`) then false else cancelable)
      view = (if (view is `undefined`) then null else view)
      
      #DEBUG
      type_check type, "string", bubbles, "boolean", cancelable, "boolean", view, "*", data, "*", inputMode, "*",
        label: "TextEvent"
        id: @id
        params: ["type", "bubbles", "cancelable", "view", "data", "inputMode"]

      
      #END_DEBUG
      textevent = Object.create(doodle.events.createUIEvent(type, bubbles, cancelable, view))
    Object.defineProperties textevent, textevent_static_properties
    
    #properties that require privacy
    Object.defineProperties textevent, (->
      evt_data = ""
      evt_inputMode = doodle.events.TextEvent.INPUT_METHOD_UNKNOWN
      
      ###
      @name copy_textevent_properties
      @param {doodle.events.TextEvent} evt TextEvent to copy properties from.
      @private
      ###
      copy_textevent_properties = (evt) ->
        
        #DEBUG
        console.assert doodle.events.TextEvent.isTextEvent(evt), "evt is TextEvent.", textevent.id, evt
        
        #END_DEBUG
        evt_data = evt.data  if evt.data isnt `undefined`
        evt_inputMode = evt.inputMode  if evt.inputMode isnt `undefined`

      
      ###
      @name data
      @return {string} [read-only]
      @property
      ###
      data:
        enumerable: true
        configurable: false
        get: ->
          evt_data

      
      ###
      @name inputMode
      @return {number} [read-only]
      @property
      ###
      inputMode:
        enumerable: true
        configurable: false
        get: ->
          evt_inputMode

      
      ###
      @name initTextEvent
      @param {string} typeArg
      @param {boolean} canBubbleArg
      @param {boolean} cancelableArg
      @param {HTMLElement} view
      @param {string} dataArg
      @param {number} inputModeArg
      @return {doodle.events.TextEvent}
      ###
      initTextEvent:
        value: (typeArg, canBubbleArg, cancelableArg, viewArg, dataArg, inputModeArg) ->
          
          #parameter defaults
          canBubbleArg = (if (canBubbleArg is `undefined`) then false else canBubbleArg)
          cancelableArg = (if (cancelableArg is `undefined`) then false else cancelableArg)
          viewArg = (if (viewArg is `undefined`) then null else viewArg)
          dataArg = (if (dataArg is `undefined`) then "" else dataArg)
          inputModeArg = (if (inputModeArg is `undefined`) then doodle.events.TextEvent.INPUT_METHOD_UNKNOWN else inputModeArg)
          
          #DEBUG
          type_check typeArg, "string", canBubbleArg, "boolean", cancelableArg, "boolean", viewArg, "*", dataArg, "string", inputModeArg, "number",
            label: "TextEvent.initTextEvent"
            id: @id
            params: ["typeArg", "canBubbleArg", "cancelableArg", "viewArg", "dataArg", "inputModeArg"]

          
          #END_DEBUG
          evt_data = dataArg
          evt_inputMode = inputModeArg
          @initUIEvent typeArg, canBubbleArg, cancelableArg, viewArg
          this

      
      ###
      Copy the properties from another TextEvent.
      Allows for the reuse of this object for further dispatch.
      @name __copyTextEventProperties
      @param {doodle.events.TextEvent} evt
      @param {Node} resetTarget
      @param {string} resetType
      @return {doodle.events.TextEvent}
      @private
      ###
      __copyTextEventProperties:
        enumerable: false
        configurable: false
        value: (evt, resetTarget, resetType) ->
          resetTarget = (if (resetTarget is `undefined`) then false else resetTarget)
          resetType = (if (resetType is `undefined`) then false else resetType)
          
          #DEBUG
          console.assert doodle.events.TextEvent.isTextEvent(evt), "evt is TextEvent", @id
          console.assert resetTarget is false or resetTarget is null or doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false."
          console.assert resetType is false or typeof resetType is "string", "resetType is a string or false."
          
          #END_DEBUG
          copy_textevent_properties evt
          @__copyUIEventProperties evt, resetTarget, resetType
    ())
    
    #initialize textevent
    if init_obj
      if typeof init_obj is "function"
        init_obj.call textevent
        
        #DEBUG
        
        #make sure we've checked our dummy type string
        throw new SyntaxError("[object TextEvent](function): Must call 'this.initTextEvent(type, bubbles, cancelable, view, data, inputMode)' within the function argument.")  if textevent.type is `undefined` or textevent.type is "" or textevent.bubbles is `undefined` or textevent.cancelable is `undefined`
      
      #END_DEBUG
      else
        
        #passed a doodle or dom event object
        copy_textevent_properties init_obj
    else
      
      #standard instantiation
      textevent.initTextEvent type, bubbles, cancelable, view, data, inputMode
    textevent

  
  ###
  @name toString
  @return {string}
  @override
  ###
  textevent_static_properties = toString:
    enumerable: true
    writable: false
    configurable: false
    value: ->
      "[object TextEvent]"
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is a TextEvent.
@name isTextEvent
@param {doodle.events.TextEvent} event
@return {boolean}
@static
###
doodle.events.TextEvent.isTextEvent = (evt) ->
  if typeof evt is "object"
    while evt
      
      #for DOM events we need to check it's constructor name
      if evt.toString() is "[object TextEvent]" or (evt.constructor and evt.constructor.name is "TextEvent")
        return true
      else
        evt = Object.getPrototypeOf(evt)
  false
