#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle
(->
  emitter_static_properties = undefined
  emitter_queue = undefined
  
  #DEBUG
  type_check = doodle.utils.debug.type_check
  
  #END_DEBUG
  AT_TARGET = doodle.events.Event.AT_TARGET
  BUBBLING_PHASE = doodle.events.Event.BUBBLING_PHASE
  
  ###
  @name doodle.createEmitter
  @class
  @augments Object
  @return {doodle.Emitter}
  ###
  doodle.Emitter = doodle.createEmitter = ->
    
    ###
    @type {doodle.Emitter}
    ###
    emitter = {}
    
    #DEBUG
    throw new SyntaxError("[object Emitter]: Invalid number of parameters.")  if arguments_.length > 0  if typeof arguments_[0] isnt "function"
    
    #END_DEBUG
    Object.defineProperties emitter, emitter_static_properties
    
    #properties that require privacy
    Object.defineProperties emitter, (->
      allListeners = {}
      
      #
      #         * Attached event handlers.
      #         * @return {object}
      #         * @property
      #         
      allListeners:
        enumerable: true
        configurable: false
        get: ->
          allListeners

      
      ###
      Returns an array of listeners for the specified event.
      @name listeners
      @param {string} type
      @return {array}
      ###
      listeners:
        enumerable: true
        configurable: false
        value: (type) ->
          (if (allListeners.hasOwnProperty(type)) then allListeners[type] else [])
    ()) #end defineProperties
    
    ###
    Adds an event listener on an Emitter object.
    This is convenience alias for Emitter.addListener(type, listener, useCapture=false).
    @name on
    @param {string} type
    @param {Function} listener
    @throws {TypeError}
    ###
    emitter.on = emitter.addListener
    
    #passed an initialization function
    arguments_[0].call emitter  if typeof arguments_[0] is "function"
    emitter

  emitter_static_properties =
    
    ###
    Returns the string representation of the specified object.
    @name toString
    @return {string}
    ###
    toString:
      enumerable: true
      writable: false
      configurable: false
      value: ->
        "[object Emitter]"

    
    ###
    Registers an event listener object with an Emitter object so that the listener receives notification of an event.
    @name addListener
    @param {string} type
    @param {Function} listener
    @throws {TypeError}
    ###
    addListener:
      enumerable: true
      writable: false
      configurable: false
      value: (type, listener) ->
        
        #DEBUG
        type_check type, "string", listener, "function",
          label: "Emitter.addListener"
          params: ["type", "listener"]
          id: @id

        
        #END_DEBUG
        listeners = @allListeners
        
        #if new event type, create it's array to store callbacks
        listeners[type] = []  unless listeners.hasOwnProperty(type)
        listeners[type].push listener
        
        #object ready for events, add to receivers if not already there
        emitter_queue.push this  if emitter_queue.indexOf(this) is -1

    
    ###
    Adds a one time listener for the event. The listener is invoked only
    the first time the event is fired, after which it is removed.
    @name once
    @param {string} type
    @param {Function} listener
    @throws {TypeError}
    ###
    once:
      enumerable: true
      writable: false
      configurable: false
      value: (type, listener) ->
        
        #DEBUG
        type_check type, "string", listener, "function",
          label: "Emitter.once"
          params: ["type", "listener"]
          id: @id

        
        #END_DEBUG
        callback = ((evt) ->
          listener evt
          @removeListener type, callback
        ).bind(this)
        @addListener type, callback

    
    ###
    Removes a listener from the Emitter object.
    @name removeListener
    @param {string} type
    @param {Function} listener
    @throws {TypeError}
    ###
    removeListener:
      enumerable: true
      writable: false
      configurable: false
      value: (type, listener) ->
        
        #DEBUG
        type_check type, "string", listener, "function",
          label: "Emitter.removeListener"
          params: ["type", "listener"]
          id: @id

        
        #END_DEBUG
        all_listeners = @allListeners
        type_listeners = @listeners(type)
        i = type_listeners.length
        
        #DEBUG
        if i is 0
          console.warn "[id=" + @id + "] Emitter.removeListener(*type*, listener): No event listener for type: '" + type + "'."
          console.trace()
        
        #END_DEBUG
        if i > 0
          i = type_listeners.indexOf(listener)
          
          #DEBUG
          if i is -1
            console.warn "[id=" + @id + "] Emitter.removeListener(type, *listener*): No listener function for type: '" + type + "'."
            console.trace()
          
          #END_DEBUG
          
          #remove handler function
          type_listeners.splice i, 1  if i isnt -1
          
          #if none left, remove handler type
          delete all_listeners[type]  if type_listeners.length is 0
          
          #if no more listeners, remove from object queue
          emitter_queue.splice emitter_queue.indexOf(this), 1  if Object.keys(all_listeners).length is 0

    
    ###
    Removes all listeners from the Emitter for the specified event.
    @name removeAllListeners
    @param {string} type
    @throws {TypeError}
    ###
    removeAllListeners:
      enumerable: true
      writable: false
      configurable: false
      value: (type) ->
        
        #DEBUG
        type_check type, "string",
          label: "Emitter.removeAllListeners"
          params: "type"
          id: @id

        unless @hasListener(type)
          console.warn "[id=" + @id + "] Emitter.removeAllListeners(type): No event listeners for type: '" + type + "'."
          console.trace()
        
        #END_DEBUG
        all_listeners = @allListeners
        delete all_listeners[type]

        
        #if no more listeners, remove from object queue
        emitter_queue.splice emitter_queue.indexOf(this), 1  if Object.keys(all_listeners).length is 0

    
    ###
    Lookup and call listener if registered for specific event type.
    @name handleEvent
    @param {doodle.events.Event} event
    @return {boolean} true if node has listeners of event type.
    @throws {TypeError}
    ###
    handleEvent:
      enumerable: true
      writable: false
      configurable: false
      value: (event) ->
        
        #DEBUG
        type_check event, "Event",
          label: "Emitter.handleEvent"
          params: "event"
          inherits: true
          id: @id

        
        #END_DEBUG
        listeners = @listeners(event.type)
        len = listeners.length
        rv = undefined
        #return value of handler
        i = 0
        if len > 0
          event.__setCurrentTarget this #currentTarget is the object with listener
          while i < len
            
            #DEBUG
            console.assert typeof listeners[i] is "function", "listener is a function", listeners[i]
            
            #END_DEBUG
            rv = listeners[i].call(this, event) #pass event to handler
            #when event.stopPropagation is called
            #cancel event for other nodes, but check other handlers on this one
            #returning false from handler does the same thing
            
            #set event stopped if not already
            event.stopPropagation()  unless event.__cancel  if rv is false or event.returnValue is false
            
            #when event.stopImmediatePropagation is called
            #ignore other handlers on this target
            break  if event.__cancelNow
            i++
        
        #any listeners on this node?
        (if (len > 0) then true else false)

    
    ###
    Dispatches an event into the event flow. The event target is the
    Emitter object upon which the emit() method is called.
    @name emit
    @param {doodle.events.Event} event
    @return {boolean} true if the event was successfully dispatched.
    @throws {TypeError}
    ###
    emit:
      enumerable: true
      writable: false
      configurable: false
      value: (event) ->
        
        #DEBUG
        type_check event, "Event",
          label: "Emitter.emit"
          params: "event"
          inherits: true
          id: @id

        
        #END_DEBUG
        node = this
        target = undefined
        evt_type = event.type
        
        #can't dispatch an event that's already stopped
        return false  if event.__cancel
        
        #set target to the object that dispatched it
        #if already set, then we're re-dispatching an event for another target
        event.__setTarget this  unless event.target
        target = event.target
        
        #enter bubble phase: up the tree
        event.__setEventPhase BUBBLING_PHASE
        while node
          if node.allListeners.hasOwnProperty(evt_type)
            
            #if at target, change event status, handle, then change back
            if node is target
              event.__setEventPhase AT_TARGET
              node.handleEvent event
              event.__setEventPhase BUBBLING_PHASE
            else
              node.handleEvent event
            
            #was the event stopped inside the handler?
            return true  if event.__cancel or not event.bubbles or event.cancelBubble
          node = node.parent
        true #dispatched successfully

    
    ###
    Dispatches an event to every object with an active listener.
    Ignores propagation path, objects come from
    @name broadcast
    @param {doodle.events.Event} event
    @return {boolean} True if the event was successfully dispatched.
    @throws {TypeError}
    @throws {Error}
    ###
    broadcast:
      enumerable: true
      writable: false
      configurable: false
      value: (event) ->
        evt_type = event.type
        emitters = emitter_queue
        i = emitters.length
        
        #DEBUG
        type_check event, "Event",
          label: "Emitter.broadcast"
          params: "event"
          inherits: true
          id: @id

        
        #END_DEBUG
        throw new Error(this + ".broadcast: Can not dispatch a cancelled event.")  if event.__cancel
        
        #set target to the object that dispatched it
        #if already set, then we're re-dispatching an event for another target
        event.__setTarget this  unless event.target
        while i--
          
          #hasListener
          emitters[i].handleEvent event  if emitters[i].allListeners.hasOwnProperty(evt_type)
          
          #event cancelled in listener?
          break  if event.__cancel
        true

    
    ###
    Checks whether the Emitter object has any listeners
    registered for a specific type of event.
    @name hasListener
    @param {string} type
    @return {boolean}
    @throws {TypeError}
    ###
    hasListener:
      enumerable: true
      writable: false
      configurable: false
      value: (type) ->
        
        #DEBUG
        type_check type, "string",
          label: "Emitter.hasListener"
          params: "type"
          id: @id

        
        #END_DEBUG
        @allListeners.hasOwnProperty type

    
    ###
    Checks whether an event listener is registered with this Emitter object
    or any of its ancestors for the specified event type.
    The difference between the hasListener() and the willTrigger() methods is
    that hasListener() examines only the object to which it belongs,
    whereas the willTrigger() method examines the entire event flow for the
    event specified by the type parameter.
    @name willTrigger
    @param {string} type The type of event.
    @return {boolean}
    @throws {TypeError}
    ###
    willTrigger:
      enumerable: true
      writable: false
      configurable: false
      value: (type) ->
        
        #DEBUG
        type_check type, "string",
          label: "Emitter.willTrigger"
          params: "type"
          id: @id

        
        #END_DEBUG
        
        #hasListener
        return true  if @allListeners.hasOwnProperty(type)
        children = @children
        i = (if children then children.length else 0)
        return true  if children[i].willTrigger(type)  while i--
        false

  #end emitter_static_properties definition
  
  #
  #   * CLASS PROPERTIES
  #   
  
  #holds all objects with event listeners
  emitter_queue = doodle.Emitter.emitter_queue = []
)() #end class closure

#
# * CLASS METHODS
# 

###
Test if an object is an event emitter.
@name isEmitter
@param {Object} obj
@return {boolean}
@static
###
doodle.Emitter.isEmitter = (obj) ->
  if typeof obj is "object"
    while obj
      if obj.toString() is "[object Emitter]"
        return true
      else
        obj = Object.getPrototypeOf(obj)
  false
