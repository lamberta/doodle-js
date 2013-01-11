#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

# DOM 3 Event: KeyboardEvent:UIEvent
# * http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
# 
(->
  keyboardevent_static_properties = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  
  #END_DEBUG
  isEvent = doodle.events.Event.isEvent
  
  ###
  @name doodle.events.createKeyboardEvent
  @class
  @augments doodle.events.UIEvent
  @param {string=} type
  @param {boolean=} bubbles
  @param {boolean=} cancelable
  @param {HTMLElement=} view
  @param {string=} keyIdentifier
  @param {number=} keyLocation
  @param {string=} modifiersList White-space separated list of key modifiers.
  @param {boolean=} repeat
  @return {doodle.events.KeyboardEvent}
  @throws {TypeError}
  @throws {SyntaxError}
  ###
  doodle.events.KeyboardEvent = doodle.events.createKeyboardEvent = (type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat) ->
    keyboardevent = undefined
    arg_len = arguments_.length
    init_obj = undefined
    copy_keyboardevent_properties = undefined
    #function, event
    #fn declared per event for private vars
    
    #DEBUG
    throw new SyntaxError("[object KeyboardEvent](type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat): Invalid number of parameters.")  if arg_len is 0 or arg_len > 8
    
    #END_DEBUG
    
    #initialize uievent prototype with another event, function, or args
    if isEvent(arguments_[0])
      
      #DEBUG
      throw new SyntaxError("[object KeyboardEvent](event): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      keyboardevent = Object.create(doodle.events.createUIEvent(init_obj))
    else if typeof arguments_[0] is "function"
      
      #DEBUG
      throw new SyntaxError("[object KeyboardEvent](function): Invalid number of parameters.")  if arg_len > 1
      
      #END_DEBUG
      init_obj = arguments_[0]
      type = `undefined`
      
      #use empty event type for now, will check after we call the init function.
      keyboardevent = Object.create(doodle.events.createUIEvent(""))
    else
      
      #parameter defaults
      bubbles = (if (bubbles is `undefined`) then false else bubbles)
      cancelable = (if (cancelable is `undefined`) then false else cancelable)
      view = (if (view is `undefined`) then null else view)
      
      #DEBUG
      type_check type, "string", bubbles, "boolean", cancelable, "boolean", view, "*", keyIdentifier, "*", keyLocation, "*", modifiersList, "*", repeat, "*",
        label: "KeyboardEvent"
        params: ["type", "bubbles", "cancelable", "view", "keyIdentifier", "keyLocation", "modifiersList", "repeat"]
        id: @id

      
      #END_DEBUG
      keyboardevent = Object.create(doodle.events.createUIEvent(type, bubbles, cancelable, view))
    Object.defineProperties keyboardevent, keyboardevent_static_properties
    
    #properties that require privacy
    Object.defineProperties keyboardevent, (->
      evt_keyIdentifier = ""
      evt_keyLocation = 0
      evt_repeat = false
      evt_ctrlKey = false
      evt_altKey = false
      evt_shiftKey = false
      evt_metaKey = false
      evt_altGraphKey = false
      
      ###
      @name copy_keyboardevent_properties
      @param {doodle.events.KeyboardEvent} evt KeyboardEvent to copy properties from.
      @throws {TypeError}
      @private
      ###
      copy_keyboardevent_properties = (evt) ->
        
        #DEBUG
        console.assert doodle.events.KeyboardEvent.isKeyboardEvent(evt), "evt is KeyboardEvent", keyboardevent.id, evt
        
        #END_DEBUG
        evt_keyIdentifier = evt.keyIdentifier  if evt.keyIdentifier isnt `undefined`
        evt_keyLocation = evt.keyLocation  if evt.keyLocation isnt `undefined`
        evt_repeat = evt.repeat  if evt.repeat isnt `undefined`
        evt_ctrlKey = evt.ctrlKey  if evt.ctrlKey isnt `undefined`
        evt_altKey = evt.altKey  if evt.altKey isnt `undefined`
        evt_shiftKey = evt.shiftKey  if evt.shiftKey isnt `undefined`
        evt_metaKey = evt.metaKey  if evt.metaKey isnt `undefined`
        evt_altKey = evt.altGraphKey  if evt.altGraphKey isnt `undefined`

      
      ###
      @name keyIdentifier
      @return {string} [read-only]
      @property
      ###
      keyIdentifier:
        enumerable: true
        configurable: false
        get: ->
          evt_keyIdentifier

      
      ###
      @name keyLocation
      @return {number} [read-only]
      @property
      ###
      keyLocation:
        enumerable: true
        configurable: false
        get: ->
          evt_keyLocation

      
      ###
      @name repeat
      @return {boolean} [read-only]
      @property
      ###
      repeat:
        enumerable: true
        configurable: false
        get: ->
          evt_repeat

      
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
      @name altGraphKey
      @return {boolean} [read-only]
      @property
      ###
      altGraphKey:
        enumerable: true
        configurable: false
        get: ->
          evt_altGraphKey

      
      ###
      @name initKeyboardEvent
      @param {string} typeArg
      @param {boolean} canBubbleArg
      @param {boolean} cancelableArg
      @param {HTMLElement} viewArg
      @param {string} keyIdentifierArg
      @param {number} keyLocationArg
      @param {string} modifiersListArg
      @param {boolean} repeatArg
      @return {doodle.events.Event}
      @throws {TypeError}
      ###
      initKeyboardEvent:
        value: (typeArg, canBubbleArg, cancelableArg, viewArg, keyIdentifierArg, keyLocationArg, modifiersListArg, repeatArg) ->
          
          #parameter defaults
          canBubbleArg = (if (canBubbleArg is `undefined`) then false else canBubbleArg)
          cancelableArg = (if (cancelableArg is `undefined`) then false else cancelableArg)
          viewArg = (if (viewArg is `undefined`) then null else viewArg)
          keyIdentifierArg = (if (keyIdentifierArg is `undefined`) then "" else keyIdentifierArg)
          keyLocationArg = (if (keyLocationArg is `undefined`) then 0 else keyLocationArg)
          modifiersListArg = (if (modifiersListArg is `undefined`) then "" else modifiersListArg)
          repeatArg = (if (repeatArg is `undefined`) then false else repeatArg)
          
          #DEBUG
          type_check typeArg, "string", canBubbleArg, "boolean", cancelableArg, "boolean", viewArg, "*", keyIdentifierArg, "string", keyLocationArg, "number", modifiersListArg, "string", repeatArg, "boolean",
            label: "KeyboardEvent.initKeyboardEvent"
            id: @id
            params: ["typeArg", "canBubbleArg", "cancelableArg", "viewArg", "keyIdentifierArg", "keyLocationArg", "modifiersListArg", "repeatArg"]

          
          #END_DEBUG
          evt_keyIdentifier = keyIdentifierArg
          evt_keyLocation = keyLocationArg
          evt_repeat = repeatArg
          
          #parse string of white-space separated list of modifier key identifiers
          modifiersListArg.split(" ").forEach (modifier) ->
            switch modifier
              when "Alt"
                evt_altKey = true
              when "Control"
                evt_ctrlKey = true
              when "Meta"
                evt_metaKey = true
              when "Shift"
                evt_shiftKey = true

          @initUIEvent typeArg, canBubbleArg, cancelableArg, viewArg
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
            label: "KeyboardEvent.getModifierState"
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
      Copy the properties from another KeyboardEvent.
      Allows for the reuse of this object for further dispatch.
      @name __copyKeyboardEventProperties
      @param {doodle.events.KeyboardEvent} evt
      @param {Node} resetTarget
      @param {string} resetType
      @return {doodle.events.KeyboardEvent}
      @throws {TypeError}
      @private
      ###
      __copyKeyboardEventProperties:
        enumerable: false
        configurable: false
        value: (evt, resetTarget, resetType) ->
          resetTarget = (if (resetTarget is `undefined`) then false else resetTarget)
          resetType = (if (resetType is `undefined`) then false else resetType)
          
          #DEBUG
          console.assert doodle.events.KeyboardEvent.isKeyboardEvent(evt), "evt is KeyboardEvent"
          console.assert resetTarget is false or resetTarget is null or doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false."
          console.assert resetType is false or typeof resetType is "string", "resetType is a string or false."
          
          #END_DEBUG
          copy_keyboardevent_properties evt
          @__copyUIEventProperties evt, resetTarget, resetType
    ())
    
    #initialize keyboardevent
    if init_obj
      if typeof init_obj is "function"
        init_obj.call keyboardevent
        
        #DEBUG
        
        #make sure we've checked our dummy type string
        throw new SyntaxError("[object KeyboardEvent](function): Must call 'this.initKeyboardEvent(type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat)' within the function argument.")  if keyboardevent.type is `undefined` or keyboardevent.type is "" or keyboardevent.bubbles is `undefined` or keyboardevent.cancelable is `undefined`
      
      #END_DEBUG
      else
        
        #passed a doodle or dom event object
        copy_keyboardevent_properties init_obj
    else
      
      #standard instantiation
      keyboardevent.initKeyboardEvent type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat
    keyboardevent

  
  ###
  @name toString
  @return {string}
  @override
  ###
  keyboardevent_static_properties = toString:
    enumerable: true
    writable: false
    configurable: false
    value: ->
      "[object KeyboardEvent]"
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is a keyboard event.
@name isKeyboardEvent
@param {doodle.events.Event} event
@return {boolean}
@static
###
doodle.events.KeyboardEvent.isKeyboardEvent = (evt) ->
  if typeof evt is "object"
    while evt
      
      #for DOM events we need to check it's constructor name
      if evt.toString() is "[object KeyboardEvent]" or (evt.constructor and evt.constructor.name is "KeyboardEvent")
        return true
      else
        evt = Object.getPrototypeOf(evt)
  false
