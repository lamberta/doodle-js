/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
(function () {
  var emitter_static_properties,
      emitter_queue,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
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
    Object.defineProperties(emitter, (function () {
      var allListeners = {};
      
      return {
        /*
         * Attached event handlers.
         * @return {object}
         * @property
         */
        'allListeners': {
          enumerable: true,
          configurable: false,
          get: function () { return allListeners; }
        },
        /**
         * Returns an array of listeners for the specified event.
         * @name listeners
         * @param {string} type
         * @return {array}
         */
        'listeners': {
          enumerable: true,
          configurable: false,
          value: function (type) {
            return (allListeners.hasOwnProperty(type)) ? allListeners[type] : [];
          }
        }
      };
    }()));//end defineProperties
    
    /**
     * Adds an event listener on an Emitter object.
     * This is convenience alias for Emitter.addListener(type, listener, useCapture=false).
     * @name on
     * @param {string} type
     * @param {Function} listener
     * @throws {TypeError}
     */
    emitter.on = emitter.addListener;
    
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
     * Registers an event listener object with an Emitter object so that the listener receives notification of an event.
     * @name addListener
     * @param {string} type
     * @param {Function} listener
     * @throws {TypeError}
     */
    'addListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, listener) {
        /*DEBUG*/
        type_check(type,'string', listener,'function', {label:'Emitter.addListener', params:['type','listener'], id:this.id});
        /*END_DEBUG*/
        var listeners = this.allListeners;
        
        //if new event type, create it's array to store callbacks
        if (!listeners.hasOwnProperty(type)) {
          listeners[type] = [];
        }
        listeners[type].push(listener);
        
        //object ready for events, add to receivers if not already there
        if (emitter_queue.indexOf(this) === -1) {
          emitter_queue.push(this);
        }
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
        var callback = (function (evt) {
          listener(evt);
          this.removeListener(type, callback);
        }).bind(this);
        this.addListener(type, callback);
      }
    },

    /**
     * Removes a listener from the Emitter object.
     * @name removeListener
     * @param {string} type
     * @param {Function} listener
     * @throws {TypeError}
     */
    'removeListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, listener) {
        /*DEBUG*/
        type_check(type,'string', listener,'function', {label:'Emitter.removeListener', params:['type','listener'], id:this.id});
        /*END_DEBUG*/
        var all_listeners = this.allListeners,
            type_listeners = this.listeners(type),
            i = type_listeners.length;
        /*DEBUG*/
        if (i === 0) {
          console.warn("[id="+this.id+"] Emitter.removeListener(*type*, listener): No event listener for type: '"+type+"'.");
          console.trace();
        }
        /*END_DEBUG*/
        if (i > 0) {
          i = type_listeners.indexOf(listener);
          /*DEBUG*/
          if (i === -1) {
            console.warn("[id="+this.id+"] Emitter.removeListener(type, *listener*): No listener function for type: '"+type+"'.");
            console.trace();
          }
          /*END_DEBUG*/
          if (i !== -1) {
            //remove handler function
            type_listeners.splice(i, 1);
          }
          //if none left, remove handler type
          if (type_listeners.length === 0) {
            delete all_listeners[type];
          }
          //if no more listeners, remove from object queue
          if (Object.keys(all_listeners).length === 0) {
            emitter_queue.splice(emitter_queue.indexOf(this), 1);
          }
        }
      }
    },

    /**
     * Removes all listeners from the Emitter for the specified event.
     * @name removeAllListeners
     * @param {string} type
     * @throws {TypeError}
     */
    'removeAllListeners': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type) {
        /*DEBUG*/
        type_check(type,'string', {label:'Emitter.removeAllListeners', params:'type', id:this.id});
        if (!this.hasListener(type)) {
          console.warn("[id="+this.id+"] Emitter.removeAllListeners(type): No event listeners for type: '"+type+"'.");
          console.trace();
        }
        /*END_DEBUG*/
        var all_listeners = this.allListeners;
        delete all_listeners[type];

        //if no more listeners, remove from object queue
        if (Object.keys(all_listeners).length === 0) {
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
        type_check(event,'Event', {label:'Emitter.handleEvent', params:'event', inherits:true, id:this.id});
        /*END_DEBUG*/
        var listeners = this.listeners(event.type),
            len = listeners.length,
            rv,     //return value of handler
            i = 0;

        if (len > 0) {
          event.__setCurrentTarget(this); //currentTarget is the object with listener

          for (; i < len; i++) {
            /*DEBUG*/
            console.assert(typeof listeners[i] === 'function', "listener is a function", listeners[i]);
            /*END_DEBUG*/
            rv = listeners[i].call(this, event); //pass event to handler
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
        //any listeners on this node?
        return (len > 0) ? true : false;
      }
    },
    
    /**
     * Dispatches an event into the event flow. The event target is the
     * Emitter object upon which the emit() method is called.
     * @name emit
     * @param {doodle.events.Event} event
     * @return {boolean} true if the event was successfully dispatched.
     * @throws {TypeError}
     */
    'emit': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        /*DEBUG*/
        type_check(event, 'Event', {label:'Emitter.emit', params:'event', inherits:true, id:this.id});
        /*END_DEBUG*/
        var node = this,
            target,
            evt_type = event.type;

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
        
        //enter bubble phase: up the tree
        event.__setEventPhase(BUBBLING_PHASE);
        
        while (node) {
          if (node.allListeners.hasOwnProperty(evt_type)) {
            //if at target, change event status, handle, then change back
            if (node === target) {
              event.__setEventPhase(AT_TARGET);
              node.handleEvent(event);
              event.__setEventPhase(BUBBLING_PHASE);
            } else {
              node.handleEvent(event);
            }
            //was the event stopped inside the handler?
            if (event.__cancel || !event.bubbles || event.cancelBubble) {
              return true;
            }
          }
          node = node.parent;
        }

        return true; //dispatched successfully
      }
    },

    /**
     * Dispatches an event to every object with an active listener.
     * Ignores propagation path, objects come from
     * @name broadcast
     * @param {doodle.events.Event} event
     * @return {boolean} True if the event was successfully dispatched.
     * @throws {TypeError}
     * @throws {Error}
     */
    'broadcast': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        var evt_type = event.type,
            emitters = emitter_queue,
            i = emitters.length;
        /*DEBUG*/
        type_check(event, 'Event', {label:'Emitter.broadcast', params:'event', inherits:true, id:this.id});
        /*END_DEBUG*/

        if (event.__cancel) {
          throw new Error(this+'.broadcast: Can not dispatch a cancelled event.');
        }
        
        //set target to the object that dispatched it
        //if already set, then we're re-dispatching an event for another target
        if (!event.target) {
          event.__setTarget(this);
        }

        while (i--) {
          //hasListener
          if (emitters[i].allListeners.hasOwnProperty(evt_type)) {
            emitters[i].handleEvent(event);
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
     * @name hasListener
     * @param {string} type
     * @return {boolean}
     * @throws {TypeError}
     */
    'hasListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type) {
        /*DEBUG*/
        type_check(type,'string', {label:'Emitter.hasListener', params:'type', id:this.id});
        /*END_DEBUG*/
        return this.allListeners.hasOwnProperty(type);
      }
    },

    /**
     * Checks whether an event listener is registered with this Emitter object
     * or any of its ancestors for the specified event type.
     * The difference between the hasListener() and the willTrigger() methods is
     * that hasListener() examines only the object to which it belongs,
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
        if (this.allListeners.hasOwnProperty(type)) {
          //hasListener
          return true;
        }
        var children = this.children,
            i = children ? children.length : 0;

        while (i--) {
          if (children[i].willTrigger(type)) {
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
