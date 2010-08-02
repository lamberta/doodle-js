
(function () {
  var evtdisp_properties,
      isEventDispatcher;
  
  /* Super constructor
   * @param {Function} initializer
   * @return {Object}
   */
  doodle.EventDispatcher = function () {
    var arg_len = arguments.length,
        initializer,
        evt_disp = {},
        eventListeners = {};
    
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
    } else if (arg_len > 0) {
      throw new SyntaxError("[object EventDispatcher]: Invalid number of parameters.");
    }

    Object.defineProperties(evt_disp, evtdisp_properties);
    //properties that require privacy
    Object.defineProperties(evt_disp, {
      'eventListeners': {
        enumerable: true,
        configurable: false,
        get: function () { return eventListeners; }
      }
    });

    //passed an initialization object: function
    if (initializer) {
      initializer.call(evt_disp);
    }

    return evt_disp;
  };

  //holds all objects with event listeners
  doodle.EventDispatcher.dispatcher_queue = [];

  /* Test if an object is an event dispatcher.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isEventDispatcher = doodle.EventDispatcher.isEventDispatcher = function (obj) {
    return (obj.toString() === '[object EventDispatcher]');
  };

  /* Check if object inherits from event dispatcher.
   * @param {Object} obj
   * @return {Boolean}
   */
  doodle.EventDispatcher.inheritsEventDispatcher = function (obj) {
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

  doodle.utils.types.check_eventdispatcher_type = function (obj, caller_name) {
    if (!inheritsEventDispatcher(obj)) {
      caller_name = (caller_name === undefined) ? "check_eventdispatcher_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be an eventdispatcher.");
    } else {
      return true;
    }
  };

  
  (function () {
    var dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
        check_string_type = doodle.utils.types.check_string_type,
        check_function_type = doodle.utils.types.check_function_type,
        check_event_type = doodle.utils.types.check_event_type;

    /* Sends event to every dispatcher object with listener for it.
     * Not affected by scene graph, objects come from dispatcher queue array.
     * @param {Event} event
     * @return {Boolean}
     */
    function broadcast_event (event) {
      var receivers, //event listeners of correct type
          len, //count of event listeners
          i, //counter
          rv; //return value for event handler
      
      //pare down to eligible receivers with event type listener
      receivers = dispatcher_queue.filter(function (obj) {
        return obj.hasEventListener(event.type);
      });
      
      //and call each
      for (i = 0, len = receivers.length; i < len; i=i+1) {
        rv = receivers[i].handleEvent(event);
        //event cancelled in listener?
        if (rv === false || event.returnValue === false || event.cancelBubble) {
          return false;
        }
      }
      return true;
    }
    
    
    evtdisp_properties = {
      /*
       * METHODS
       */

      /* Returns the string representation of the specified object.
       * @return {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object EventDispatcher]";
        }
      },

      /* Call function passing object as 'this'.
       * @param {Function} fn
       * @return {Object}
       */
      'modify': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (fn) {
          if (check_function_type(fn, this+'.modify')) {
            fn.call(this);
            return this;
          }
        }
      },

      /* Registers an event listener object with an EventDispatcher object
       * so that the listener receives notification of an event.
       * @param {String} type
       * @param {Function} listener
       * @param {Boolean} useCapture
       */
      'addEventListener': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (type, listener, useCapture) {
          if (check_string_type(type, this+'.addEventListener') &&
              check_function_type(listener, this+'.addEventListener')) {
            
            useCapture = useCapture === true; //default to false, bubble event

            //if new event type, create it's array to store callbacks
            if (!this.eventListeners[type]) {
              this.eventListeners[type] = {capture:[], bubble:[]};
            }
            this.eventListeners[type][useCapture ? 'capture':'bubble'].push(listener);
            
            //now that we're receiving events, add to object queue
            if(!dispatcher_queue.some(function(x) { return x === this; })) {
              dispatcher_queue.push(this);
            }
          }
        }
      },

      /* Removes a listener from the EventDispatcher object.
       * @param {String} type
       * @param {Function} listener
       * @param {Boolean} useCapture
       */
      'removeEventListener': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (type, listener, useCapture) {
          if (check_string_type(type, this+'.removeEventListener') &&
              check_function_type(listener, this+'.removeEventListener')) {
          
            useCapture = useCapture === true; //default to false, bubble event
          
            //make sure event type exists
            if (this.eventListeners[type]) {
              //grab our event type array and remove the callback function
              var evt_type = this.eventListeners[type],
              listeners = evt_type[useCapture ? 'capture':'bubble'];
              listeners.splice(listeners.indexOf(listener), 1);
              
              //if none left, remove event type
              if (evt_type.capture.length === 0 && evt_type.bubble.length === 0) {
                delete this.eventListeners[type];
              }
              //if no more listeners, remove from object queue
              if (Object.keys(this.eventListeners).length === 0) {
                dispatcher_queue.splice(dispatcher_queue.indexOf(this), 1);
              }
            }
          }
        }
      },

      /* Lookup and call listener if registered for specific event type.
       * @param {Event} event
       * @return {Boolean}
       */
      'handleEvent': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (event) {
          if (check_event_type(event, this+'.handleEvent')) {
            //check for listeners that match event type
            var phase = event.bubbles ? 'bubble':'capture',
                listeners = this.eventListeners[event.type], //obj
                len, //listener count
                rv,  //return value of handler
                i = 0; //counter
            
            listeners = listeners && listeners[phase];
            if (listeners && listeners.length > 0) {
              //currentTarget is the object with addEventListener
              event.currentTarget = this;
              //if we have any, call each handler with event object
              len = listeners.length;
              for (; i < len; i += 1) {
                rv = listeners[i].call(this, event);
                //event cancelled inside listener?
                if (rv === false || event.returnValue === false) {
                  event.stopPropagation();
                  return false;
                }
              }
            }
            return true;
          }
        }
      },
      
      /* Dispatches an event into the event flow. The event target is the
       * EventDispatcher object upon which the dispatchEvent() method is called.
       * @param {Event} event
       * @param {Boolean} broadcast Send event to every object, ignore propagation.
       * @return {Boolean} true if the event was successfully dispatched.
       */
      'dispatchEvent': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (event, broadcast) {
          check_event_type(event, this+'.dispatchEvent');
          
          broadcast = broadcast === true; //default is false
          //should clone event if being re-dispatched
          
          //set target to the first object that dispatched it
          if (!event.target) {
            event.target = this;
          }
          //a broadcast event goes out to every registered eventdispatcher object with
          //the proper event type listener, reguardless of tree propagation.
          if (broadcast) {
            return broadcast_event(event);
          }

          //events are dispatched from the child,
          //capturing goes down to the child, bubbling then goes back up
          var target = event.target,
              node = target,
              node_path = [],
              len, //count of nodes up to root
              i, //counter
              rv; //return value of event listener
          while (node && node !== this) {
            node_path.push(node);
            node = node.parent;
          }
          //capture phase, goes down
          i = len = node_path.length;
          while ((i=i-1) >= 0) {
            console.log("dispatchEvent: capture call " + i);
            if (!node_path[i].handleEvent(event)) {
              return false;
            }
          }

          //target phase
          if (!target.handleEvent(event)) {
            return false;
          }

          //bubble phase, goes up
          if (event.bubbles) {
            for (i = 0; i < len; i = i+1) {
              console.log("dispatchEvent: bubble call " + i);
              rv = node_path[i].handleEvent(event);
              //event cancelled in listener?
              if (rv === false || event.cancelBubble) {
                return false;
              }
            }
          }

          return true;
        }
      },

      /* Checks whether the EventDispatcher object has any listeners
       * registered for a specific type of event.
       * @param {String} type
       * @return {Boolean}
       */
      'hasEventListener': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (type) {
          if (check_string_type(type, this+'.hasEventListener')) {
            return this.eventListeners !== null && this.eventListeners.hasOwnProperty(type);
          }
        }
      },

      /* Checks whether an event listener is registered with this EventDispatcher object
       * or any of its ancestors for the specified event type.
       * The difference between the hasEventListener() and the willTrigger() methods is
       * that hasEventListener() examines only the object to which it belongs,
       * whereas the willTrigger() method examines the entire event flow for the
       * event specified by the type parameter.
       * @param {String} type The type of event.
       * @return {Boolean}
       */
      'willTrigger': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (type) {
          if (check_string_type(type, this+'.willTrigger')) {
            if (this.hasEventListener(type)) {
              return true;
            } else if (!this.children || this.children.length === 0) {
              //requires scene graph be in place to proceed down the tree
              return false;
            } else {
              for (var i in this.children) {
                if (this.children[i].willTrigger(type)) {
                  return true;
                }
              }
            }
            return false;
          }
        }
      }
      
    };//end evtdisp_properties definition
  }());
}());//end class closure
