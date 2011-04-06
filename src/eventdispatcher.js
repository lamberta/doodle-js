/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
(function () {
  var evtDisp_static_properties,
      dispatcher_queue,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      CAPTURING_PHASE = doodle.events.Event.CAPTURING_PHASE,
      AT_TARGET = doodle.events.Event.AT_TARGET,
      BUBBLING_PHASE = doodle.events.Event.BUBBLING_PHASE;
  
  /**
   * @name doodle.createEventDispatcher
   * @class
   * @augments Object
   * @return {doodle.EventDispatcher}  
   */
  doodle.EventDispatcher = doodle.createEventDispatcher = function () {
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
      'id': (function () {
        var id = null;
        return {
          enumerable: true,
          configurable: false,
          get: function () { return (id === null) ? this.toString() : id; },
          set: function (idVar) {
            /*DEBUG*/
            if (idVar !== null) {
              type_check(idVar,'string', {label:'EventDispatcher.id', message:"Property must be a string or null.", id:this.id});
            }
            /*END_DEBUG*/
            id = idVar;
          }
        };
      }()),
      
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
      value: function () { return "[object EventDispatcher]"; }
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
        type_check(type,'string', listener,'function', useCapture,'boolean', {label:'EventDispatcher.addEventListener', params:['type','listener','useCapture'], id:this.id});
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
     * Adds an event listener on an EventDispatcher object.
     * This is convenience alias for EventDispatcher.addEventListener(type, listener, useCapture=false).
     * @name on
     * @param {string} type
     * @param {Function} listener
     * @throws {TypeError}
     */
    'on': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, listener) {
        /*DEBUG*/
        type_check(type,'string', listener,'function', {label:'EventDispatcher.on', params:['type','listener'], id:this.id});
        /*END_DEBUG*/
        this.addEventListener(type, listener, false);
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
        type_check(type,'string', listener,'function', useCapture,'boolean', {label:'EventDispatcher.removeEventListener', params:['type','listener','useCapture'], id:this.id});
        /*END_DEBUG*/
        var eventListeners = this.eventListeners,
            handler = eventListeners.hasOwnProperty(type) ? eventListeners[type] : false,
            listeners,
            //lookup help
            disp_queue;
        //make sure event type exists
        if (handler) {
          listeners = handler[useCapture ? 'capture' : 'bubble'];
          //remove handler function
          listeners.splice(listeners.indexOf(listener), 1);
          //if none left, remove handler type
          if (handler.capture.length === 0 && handler.bubble.length === 0) {
            delete eventListeners[type];
          }
          //if no more listeners, remove from object queue
          if (Object.keys(eventListeners).length === 0) {
            disp_queue = dispatcher_queue;
            disp_queue.splice(disp_queue.indexOf(this), 1);
          }
        }
      }
    },

    /**
     * Lookup and call listener if registered for specific event type.
     * @name handleEvent
     * @param {doodle.events.Event} event
     * @return {boolean} true if node has listeners of event type.
     * @throws {TypeError}
     */
    'handleEvent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        /*DEBUG*/
        type_check(event, 'Event', {label:'EventDispatcher.handleEvent', params:'event', inherits:true, id:this.id});
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
            console.assert(typeof listeners[i] === 'function', "listener is a function", listeners[i]);
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
     * @param {doodle.events.Event} event
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
            //check this node for event handler
            evt_handler_p = this.eventListeners.hasOwnProperty(evt_type),
            node,
            node_path = [],
            len, //count of nodes up to root
            i; //counter

        /*DEBUG*/
        type_check(event, 'Event', {label:'EventDispatcher.dispatchEvent', params:'event', inherits:true, id:this.id});
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
            evt_handler_p = node.eventListeners.hasOwnProperty(evt_type);
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
     * @param {doodle.events.Event} event
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
            disp_queue = dispatcher_queue,
            dq_count = disp_queue.length;
        /*DEBUG*/
        type_check(event, 'Event', {label:'EventDispatcher.broadcastEvent', params:'event', inherits:true, id:this.id});
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
          if (disp_queue[dq_count].eventListeners.hasOwnProperty(evt_type)) {
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
        type_check(type,'string', {label:'EventDispatcher.hasEventListener', params:'type', id:this.id});
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
        type_check(type,'string', {label:'EventDispatcher.willTrigger', params:'type', id:this.id});
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
  
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is an event dispatcher.
 * @name isEventDispatcher
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.EventDispatcher.isEventDispatcher = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toString() === '[object EventDispatcher]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
