/*globals doodle*/

(function () {
  var evtDisp_static_properties,
      dispatcher_queue,
      isEventDispatcher,
      inheritsEventDispatcher,
      /*DEBUG*/
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_function_type = doodle.utils.types.check_function_type,
      check_event_type = doodle.utils.types.check_event_type,
      /*END_DEBUG*/
      //lookup help
      CAPTURING_PHASE = doodle.Event.CAPTURING_PHASE,
      AT_TARGET = doodle.Event.AT_TARGET,
      BUBBLING_PHASE = doodle.Event.BUBBLING_PHASE,
      //lookup help
      Array_indexOf = Array.prototype.indexOf,
      Array_splice = Array.prototype.splice;
  
  /**
   * @name doodle.EventDispatcher
   * @class
   * @augments Object
   * @return {doodle.EventDispatcher}  
   */
  doodle.EventDispatcher = function () {
    /** @type {doodle.EventDispatcher} */
    var evt_disp = {};

    /*DEBUG*/
    if (typeof arguments[0] !== 'function') {
      if (arguments.length > 0) {
        throw new SyntaxError("[object EventDispatcher]: Invalid number of parameters.");
      }
    }
    /*END_DEBUG*/

    Object.defineProperties(evt_disp, evtDisp_static_properties);
    //properties that require privacy
    Object.defineProperties(evt_disp, {
      'eventListeners': (function () {
        var event_listeners = {};
        return {
          enumerable: true,
          configurable: false,
          get: function () { return event_listeners; }
        };
      }())
    });//end defineProperties

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      arguments[0].call(evt_disp);
    }
    
    return evt_disp;
  };

  
  evtDisp_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object EventDispatcher]";
      }
    },

    /**
     * Call function passing object as 'this'.
     * @name modify
     * @param {Function} fn
     * @return {Object}
     * @throws {TypeError}
     */
    'modify': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (fn) {
        /*DEBUG*/
        check_function_type(fn, this+'.modify', '*function*');
        /*END_DEBUG*/
        fn.call(this);
        return this;
      }
    },

    /**
     * Registers an event listener object with an EventDispatcher object
     * so that the listener receives notification of an event.
     * @name addEventListener
     * @param {string} type
     * @param {Function} listener
     * @param {boolean} useCapture
     * @throws {TypeError}
     */
    'addEventListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, listener, useCapture) {
        useCapture = (useCapture === undefined) ? false : useCapture;
        /*DEBUG*/
        check_string_type(type, this+'.addEventListener', '*type*, listener, useCapture');
        check_function_type(listener, this+'.addEventListener', 'type, *listener*, useCapture');
        check_boolean_type(useCapture, this+'.addEventListener', 'type, listener, *useCapture*');
        /*END_DEBUG*/
        var eventListeners = this.eventListeners;
        
        //if new event type, create it's array to store callbacks
        if (!eventListeners.hasOwnProperty(type)) {
          eventListeners[type] = {capture:[], bubble:[]};
        }
        eventListeners[type][useCapture ? 'capture' : 'bubble'].push(listener);
        
        //object ready for events, add to receivers if not already there
        if (dispatcher_queue.indexOf(this) === -1) {
          dispatcher_queue.push(this);
        }
      }
    },

    /**
     * Removes a listener from the EventDispatcher object.
     * @name removeEventListener
     * @param {string} type
     * @param {Function} listener
     * @param {boolean} useCapture
     * @throws {TypeError}
     */
    'removeEventListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, listener, useCapture) {
        useCapture = (useCapture === undefined) ? false : useCapture;
        /*DEBUG*/
        check_string_type(type, this+'.removeEventListener', '*type*, listener, useCapture');
        check_function_type(listener, this+'.removeEventListener', 'type, *listener*, useCapture');
        check_boolean_type(useCapture, this+'.removeEventListener', 'type, listener, *useCapture*');
        /*END_DEBUG*/
        var eventListeners = this.eventListeners,
            handler = eventListeners.hasOwnProperty(type) ? eventListeners[type] : false,
            listeners,
            //lookup help
            disp_queue,
            indexOf = Array_indexOf,
            splice = Array_splice;
        
        //make sure event type exists
        if (handler) {
          listeners = handler[useCapture ? 'capture' : 'bubble'];
          //remove handler function
          splice.call(listeners, indexOf.call(listeners, listener), 1);
          //if none left, remove handler type
          if (handler.capture.length === 0 && handler.bubble.length === 0) {
            delete eventListeners[type];
          }
          //if no more listeners, remove from object queue
          if (Object.keys(eventListeners).length === 0) {
            disp_queue = dispatcher_queue;
            splice.call(disp_queue, indexOf.call(disp_queue, this), 1);
          }
        }
      }
    },

    /**
     * Lookup and call listener if registered for specific event type.
     * @name handleEvent
     * @param {Event} event
     * @return {boolean} true if node has listeners of event type.
     * @throws {TypeError}
     */
    'handleEvent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        /*DEBUG*/
        check_event_type(event, this+'.handleEvent');
        /*END_DEBUG*/
        
        //check for listeners that match event type
        //if capture not set, using bubble listeners - like for AT_TARGET phase
        var phase = (event.eventPhase === CAPTURING_PHASE) ? 'capture' : 'bubble',
            listeners = this.eventListeners[event.type], //obj
            count = 0, //listener count
            rv,  //return value of handler
            i; //counter

        listeners = listeners && listeners[phase];
        if (listeners && listeners.length > 0) {
          //currentTarget is the object with addEventListener
          event.__setCurrentTarget(this);
          
          //if we have any, call each handler with event object
          count = listeners.length;
          for (i = 0; i < count; i += 1) {
            /*DEBUG*/
            check_function_type(listeners[i], this+'.handleEvent::listeners['+i+']');
            /*END_DEBUG*/
            //pass event to handler
            rv = listeners[i].call(this, event);
            
            //when event.stopPropagation is called
            //cancel event for other nodes, but check other handlers on this one
            //returning false from handler does the same thing
            if (rv === false || event.returnValue === false) {
              //set event stopped if not already
              if (!event.__cancel) {
                event.stopPropagation();
              }
            }
            //when event.stopImmediatePropagation is called
            //ignore other handlers on this target
            if (event.__cancelNow) {
              break;
            }
          }
        }
        
        //any handlers found on this node?
        return (count > 0) ? true : false;
      }
    },
    
    /**
     * Dispatches an event into the event flow. The event target is the
     * EventDispatcher object upon which the dispatchEvent() method is called.
     * @name dispatchEvent
     * @param {Event} event
     * @return {boolean} true if the event was successfully dispatched.
     * @throws {TypeError}
     */
    'dispatchEvent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        //events are dispatched from the child,
        //capturing goes down to the child, bubbling then goes back up
        var target,
            evt_type = event.type,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            //check this node for event handler
            evt_handler_p = hasOwnProperty.call(this.eventListeners, evt_type),
            node,
            node_path = [],
            len, //count of nodes up to root
            i; //counter

        /*DEBUG*/
        check_event_type(event, this+'.dispatchEvent', '*event*');
        /*END_DEBUG*/

        //can't dispatch an event that's already stopped
        if (event.__cancel) {
          return false;
        }
        
        //set target to the object that dispatched it
        //if already set, then we're re-dispatching an event for another target
        if (!event.target) {
          event.__setTarget(this);
        }

        target = event.target;
        //path starts at node parent
        node = target.parent || null;
        
        //create path from node's parent to top of tree
        while (node) {
          //only want to dispatch if there's a reason to
          if (!evt_handler_p) {
            evt_handler_p = hasOwnProperty.call(node.eventListeners, evt_type);
          }
          node_path.push(node);
          node = node.parent;
        }

        //if no handlers for event type, no need to dispatch
        if (!evt_handler_p) {
          return true;
        }

        //enter capture phase: down the tree
        event.__setEventPhase(CAPTURING_PHASE);
        i = len = node_path.length;
        while (i--) {
          node_path[i].handleEvent(event);
          //was the event stopped inside the handler?
          if (event.__cancel) {
            return true;
          }
        }

        //enter target phase
        event.__setEventPhase(AT_TARGET);
        target.handleEvent(event);
        //was the event stopped inside the handler?
        if (event.__cancel) {
          return true;
        }

        //does event bubble, or bubbling cancelled in capture/target phase?
        if (!event.bubbles || event.cancelBubble) {
          return true;
        }

        //enter bubble phase: back up the tree
        event.__setEventPhase(BUBBLING_PHASE);
        for (i = 0; i < len; i = i+1) {
          node_path[i].handleEvent(event);
          //was the event stopped inside the handler?
          if (event.__cancel || event.cancelBubble) {
            return true;
          }
        }

        return true; //dispatched successfully
      }
    },

    /**
     * Dispatches an event to every object with an active listener.
     * Ignores propagation path, objects come from
     * @name broadcastEvent
     * @param {Event} event
     * @return {boolean} True if the event was successfully dispatched.
     * @throws {TypeError}
     * @throws {Error}
     */
    'broadcastEvent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        var evt_type = event.type,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            disp_queue = dispatcher_queue,
            dq_count = disp_queue.length;
        
        /*DEBUG*/
        check_event_type(event, this+'.broadcastEvent', '*event*');
        /*END_DEBUG*/

        if (event.__cancel) {
          throw new Error(this+'.broadcastEvent: Can not dispatch a cancelled event.');
        }
        
        //set target to the object that dispatched it
        //if already set, then we're re-dispatching an event for another target
        if (!event.target) {
          event.__setTarget(this);
        }

        while (dq_count--) {
          //hasEventListener
          if (hasOwnProperty.call(disp_queue[dq_count].eventListeners, evt_type)) {
            disp_queue[dq_count].handleEvent(event);
          }
          //event cancelled in listener?
          if (event.__cancel) {
            break;
          }
        }
        
        return true;
      }
    },

    /**
     * Checks whether the EventDispatcher object has any listeners
     * registered for a specific type of event.
     * @name hasEventListener
     * @param {string} type
     * @return {boolean}
     * @throws {TypeError}
     */
    'hasEventListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type) {
        /*DEBUG*/
        check_string_type(type, this+'.hasEventListener', '*type*');
        /*END_DEBUG*/
        return this.eventListeners.hasOwnProperty(type);
      }
    },

    /**
     * Checks whether an event listener is registered with this EventDispatcher object
     * or any of its ancestors for the specified event type.
     * The difference between the hasEventListener() and the willTrigger() methods is
     * that hasEventListener() examines only the object to which it belongs,
     * whereas the willTrigger() method examines the entire event flow for the
     * event specified by the type parameter.
     * @name willTrigger
     * @param {string} type The type of event.
     * @return {boolean}
     * @throws {TypeError}
     */
    'willTrigger': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type) {
        /*DEBUG*/
        check_string_type(type, this+'.willTrigger', '*type*');
        /*END_DEBUG*/
        if (this.eventListeners.hasOwnProperty(type)) {
          //hasEventListener
          return true;
        }
        var children = this.children,
            child_count = children ? children.length : 0;

        while (child_count--) {
          if (children[child_count].willTrigger(type)) {
            return true;
          }
        }
        return false;
      }
    }
    
  };//end evtDisp_static_properties definition

  
  /*
   * CLASS PROPERTIES
   */
  
  //holds all objects with event listeners
  dispatcher_queue = doodle.EventDispatcher.dispatcher_queue = [];

  /**
   * Test if an object is an event dispatcher.
   * @name isEventDispatcher
   * @param {Object} obj
   * @return {boolean}
   * @static
   */
  isEventDispatcher = doodle.EventDispatcher.isEventDispatcher = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object EventDispatcher]');
  };

  /**
   * Check if object inherits from event dispatcher.
   * @name inheritsEventDispatcher
   * @param {Object} obj
   * @return {boolean}
   * @static
   */
  inheritsEventDispatcher = doodle.EventDispatcher.inheritsEventDispatcher = function (obj) {
    while (obj) {
      if (isEventDispatcher(obj)) {
        return true;
      } else {
        if (typeof obj !== 'object') {
          return false;
        }
        obj = Object.getPrototypeOf(obj);
      }
    }
    return false;
  };

  /*DEBUG*/
  /**
   * @name check_eventdispatcher_type
   * @param {EventDispatcher} obj
   * @param {string} caller
   * @param {string} params
   * @return {boolean}
   * @throws {TypeError}
   * @memberOf utils.types
   * @static
   */
  doodle.utils.types.check_eventdispatcher_type = function (obj, caller, param) {
    if (inheritsEventDispatcher(obj)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_eventdispatcher_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be an EventDispatcher.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
