/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
(function () {
  var emitter_static_properties,
      emitter_queue,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      CAPTURING_PHASE = doodle.events.Event.CAPTURING_PHASE,
      AT_TARGET = doodle.events.Event.AT_TARGET,
      BUBBLING_PHASE = doodle.events.Event.BUBBLING_PHASE;
  
  /**
   * @name doodle.createEmitter
   * @class
   * @augments Object
   * @return {doodle.Emitter}  
   */
  doodle.Emitter = doodle.createEmitter = function () {
    /** @type {doodle.Emitter} */
    var emitter = {};
    /*DEBUG*/
    if (typeof arguments[0] !== 'function') {
      if (arguments.length > 0) {
        throw new SyntaxError("[object Emitter]: Invalid number of parameters.");
      }
    }
    /*END_DEBUG*/

    Object.defineProperties(emitter, emitter_static_properties);
    //properties that require privacy
    Object.defineProperties(emitter, {
      'id': (function () {
        var id = null;
        return {
          enumerable: true,
          configurable: false,
          get: function () { return (id === null) ? this.toString() : id; },
          set: function (idVar) {
            /*DEBUG*/
            if (idVar !== null) {
              type_check(idVar,'string', {label:'Emitter.id', message:"Property must be a string or null.", id:this.id});
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
      arguments[0].call(emitter);
    }
    
    return emitter;
  };

  
  emitter_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object Emitter]"; }
    },

    /**
     * Registers an event listener object with an Emitter object
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
        type_check(type,'string', listener,'function', useCapture,'boolean', {label:'Emitter.addEventListener', params:['type','listener','useCapture'], id:this.id});
        /*END_DEBUG*/
        var eventListeners = this.eventListeners;
        
        //if new event type, create it's array to store callbacks
        if (!eventListeners.hasOwnProperty(type)) {
          eventListeners[type] = {capture:[], bubble:[]};
        }
        eventListeners[type][useCapture ? 'capture' : 'bubble'].push(listener);
        
        //object ready for events, add to receivers if not already there
        if (emitter_queue.indexOf(this) === -1) {
          emitter_queue.push(this);
        }
      }
    },

    /**
     * Adds an event listener on an Emitter object.
     * This is convenience alias for Emitter.addEventListener(type, listener, useCapture=false).
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
        type_check(type,'string', listener,'function', {label:'Emitter.on', params:['type','listener'], id:this.id});
        /*END_DEBUG*/
        this.addEventListener(type, listener, false);
      }
    },

    /**
     * Adds a one time listener for the event. The listener is invoked only
     * the first time the event is fired, after which it is removed.
     * @name once
     * @param {string} type
     * @param {Function} listener
     * @throws {TypeError}
     */
    'once': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, listener) {
        /*DEBUG*/
        type_check(type,'string', listener,'function', {label:'Emitter.once', params:['type','listener'], id:this.id});
        /*END_DEBUG*/
        var callback = (function () {
          listener();
          this.removeEventListener(type, callback, false);
        }).bind(this);
        this.addEventListener(type, callback, false);
      }
    },

    /**
     * Removes a listener from the Emitter object.
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
        type_check(type,'string', listener,'function', useCapture,'boolean', {label:'Emitter.removeEventListener', params:['type','listener','useCapture'], id:this.id});
        /*END_DEBUG*/
        var eventListeners = this.eventListeners,
            handler = eventListeners.hasOwnProperty(type) ? eventListeners[type] : false,
            listeners,
            i;
        //make sure event type exists
        /*DEBUG*/
        if (!handler) {
          console.warn("[id="+this.id+"] Emitter.removeEventListener(*type*, listener, useCapture): No event listener for type: '"+type+"'.");
          console.trace();
        }
        /*END_DEBUG*/
        if (handler) {
          listeners = handler[useCapture ? 'capture' : 'bubble']; //array of functions
          i = listeners.indexOf(listener);
          /*DEBUG*/
          if (i === -1) {
            console.warn("[id="+this.id+"] Emitter.removeEventListener(type, *listener*, useCapture): No listener function for type: '"+type+"'.");
            console.trace();
          }
          /*END_DEBUG*/
          if (i !== -1) {
            //remove handler function
            listeners.splice(i, 1);
          }
          //if none left, remove handler type
          if (handler.capture.length === 0 && handler.bubble.length === 0) {
            delete eventListeners[type];
          }
          //if no more listeners, remove from object queue
          if (Object.keys(eventListeners).length === 0) {
            emitter_queue.splice(emitter_queue.indexOf(this), 1);
          }
        }
      }
    },

    /**
     * Removes all listeners from the Emitter for the specified event.
     * @name removeAllListeners
     * @param {string} type
     * @param {=boolean} useCapture If undefined, remove all handlers of any type.
     * @throws {TypeError}
     */
    'removeAllListeners': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, useCapture) {
        useCapture = (useCapture === undefined) ? null : useCapture;
        var listeners = this.eventListeners;
        /*DEBUG*/
        type_check(type,'string', {label:'Emitter.removeAllListeners', params:'type', id:this.id});
        if (useCapture !== null) {
          type_check(useCapture,'boolean', {label:'Emitter.removeAllListeners', params:'useCapture', id:this.id, message:"If provided, useCapture must be a boolean."});
        }
        //do we have the type?
        if (!listeners.hasOwnProperty(type)) {
            console.warn("[id="+this.id+"] Emitter.removeAllListeners(*type*, useCapture): No event listener for type: '"+type+"'.");
            console.trace();
        }
        /*END_DEBUG*/
        if (useCapture === null) {
          //remove all
          delete listeners[type];
        } else {
          /*DEBUG*/
          if (listeners[type][useCapture ? 'capture' : 'bubble'].length === 0) {
            console.warn("[id="+this.id+"] Emitter.removeAllListeners(type, *useCapture*): No event listeners for type: '"+type+"'.");
            console.trace();
          }
          /*END_DEBUG*/
          listeners[type][useCapture ? 'capture' : 'bubble'].length = 0; //empty array
          //if none left, remove handler type
          if (listeners[type].capture.length === 0 && listeners[type].bubble.length === 0) {
            delete listeners[type];
          }
        }
        //if no more listeners, remove from object queue
        if (Object.keys(listeners).length === 0) {
          emitter_queue.splice(emitter_queue.indexOf(this), 1);
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
        type_check(event, 'Event', {label:'Emitter.handleEvent', params:'event', inherits:true, id:this.id});
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
     * Emitter object upon which the dispatchEvent() method is called.
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
        type_check(event, 'Event', {label:'Emitter.dispatchEvent', params:'event', inherits:true, id:this.id});
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
            emitters = emitter_queue,
            dq_count = emitters.length;
        /*DEBUG*/
        type_check(event, 'Event', {label:'Emitter.broadcastEvent', params:'event', inherits:true, id:this.id});
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
          if (emitters[dq_count].eventListeners.hasOwnProperty(evt_type)) {
            emitters[dq_count].handleEvent(event);
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
     * Checks whether the Emitter object has any listeners
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
        type_check(type,'string', {label:'Emitter.hasEventListener', params:'type', id:this.id});
        /*END_DEBUG*/
        return this.eventListeners.hasOwnProperty(type);
      }
    },

    /**
     * Checks whether an event listener is registered with this Emitter object
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
        type_check(type,'string', {label:'Emitter.willTrigger', params:'type', id:this.id});
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
    
  };//end emitter_static_properties definition

  
  /*
   * CLASS PROPERTIES
   */
  
  //holds all objects with event listeners
  emitter_queue = doodle.Emitter.emitter_queue = [];
  
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is an event emitter.
 * @name isEmitter
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.Emitter.isEmitter = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toString() === '[object Emitter]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
