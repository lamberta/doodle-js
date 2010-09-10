
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

  doodle.utils.types.check_eventdispatcher_type = function (obj, caller, param) {
    if (doodle.EventDispatcher.inheritsEventDispatcher(obj)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_eventdispatcher_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be an EventDispatcher.");
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
          /*DEBUG*/
          check_function_type(fn, this+'.modify', '*function*');
          /*END_DEBUG*/
          fn.call(this);
          return this;
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
          useCapture = useCapture === true; //default to false, bubble event
          /*DEBUG*/
          check_string_type(type, this+'.addEventListener', '*type*, listener, useCapture');
          check_function_type(listener, this+'.addEventListener', 'type, *listener*, useCapture');
          /*END_DEBUG*/
          
          var self = this;
          //if new event type, create it's array to store callbacks
          if (!this.eventListeners[type]) {
            this.eventListeners[type] = {capture:[], bubble:[]};
          }
          this.eventListeners[type][useCapture ? 'capture':'bubble'].push(listener);
          
          //object ready for events, add to receivers if not already there
          if (dispatcher_queue.every(function(obj) { return self !== obj; })) {
            dispatcher_queue.push(self);
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
          useCapture = useCapture === true; //default to false, bubble event
          /*DEBUG*/
          check_string_type(type, this+'.removeEventListener', '*type*, listener, useCapture');
          check_function_type(listener, this+'.removeEventListener', 'type, *listener*, useCapture');
          /*END_DEBUG*/
          
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
          /*DEBUG*/
          check_event_type(event, this+'.handleEvent');
          /*END_DEBUG*/
          
          //check for listeners that match event type
          //if capture not set, using bubble listeners - like for AT_TARGET phase
          var phase = (event.eventPhase === doodle.Event.CAPTURING_PHASE) ? 'capture' : 'bubble',
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
              check_function_type(listeners[i], this+'.handleEvent::listeners['+i+']');
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
          /*DEBUG*/
          check_string_type(type, this+'.hasEventListener', '*type*');
          /*END_DEBUG*/
          return this.eventListeners !== null && this.eventListeners.hasOwnProperty(type);
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
          /*DEBUG*/
          check_string_type(type, this+'.willTrigger', '*type*');
          /*END_DEBUG*/
          
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
      
    };//end evtdisp_properties definition
  }());
}());//end class closure
