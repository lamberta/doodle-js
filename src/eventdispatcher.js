
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
       * @return {Boolean} true if node has listeners of event type.
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
        }
      },
      
      /* Dispatches an event into the event flow. The event target is the
       * EventDispatcher object upon which the dispatchEvent() method is called.
       * @param {Event} event
       * @return {Boolean} true if the event was successfully dispatched.
       */
      'dispatchEvent': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (event) {
          //events are dispatched from the child,
          //capturing goes down to the child, bubbling then goes back up
          var target,
              node,
              node_path = [],
              len, //count of nodes up to root
              i, //counter
              rv; //return value of event listener
          
          check_event_type(event, this+'.dispatchEvent');

          //can't dispatch an event that's already stopped
          if (event.__cancel) {
            return false;
          }
          
          //set target to the object that dispatched it
          //if already set, then we're re-dispatching an event for another target
          if (!event.target) {
            event.__setTarget(this);
          } else {
            //this is a bit confusing, show warning for now
            console.log(this+'.dispatchEvent: event.target already set to ' + event.target);
          }

          target = event.target;
          //path starts at node parent
          node = target.parent || null;

          //create path from node's parent to top of tree
          while (node) {
            node_path.push(node);
            node = node.parent;
          }

          //enter capture phase: down the tree
          event.__setEventPhase(event.CAPTURING_PHASE);
          i = len = node_path.length;
          while ((i=i-1) >= 0) {
            node_path[i].handleEvent(event);
            //was the event stopped inside the handler?
            if (event.__cancel) {
              return true;
            }
          }

          //enter target phase
          event.__setEventPhase(event.AT_TARGET);
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
          event.__setEventPhase(event.BUBBLING_PHASE);
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

      /* Dispatches an event to every object with an active listener.
       * Ignores propagation path, objects come from 
       * @param {Event} event
       * @return {Boolean} true if the event was successfully dispatched.
       */
      'broadcastEvent': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (event) {
          var receivers, //event listeners of correct type
              len, //count of event listeners
              i; //counter
          
          check_event_type(event, this+'.broadcastEvent');

          if (event.__cancel) {
            throw new Error(this+'.broadcastEvent: Can not dispatch a cancelled event.');
          }
          
          //set target to the object that dispatched it
          //if already set, then we're re-dispatching an event for another target
          if (!event.target) {
            event.__setTarget(this);
          }
      
          //pare down to eligible receivers with event type listener
          receivers = dispatcher_queue.filter(function (obj) {
            return obj.hasEventListener(event.type);
          });
          
          //and call each
          for (i = 0, len = receivers.length; i < len; i=i+1) {
            receivers[i].handleEvent(event);
            //event cancelled in listener?
            if (event.__cancel) {
              break;
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