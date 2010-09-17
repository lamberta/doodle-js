/*globals doodle*/

/* Will probably want to implement the dom event interface:
 * http://www.w3.org/TR/DOM-Level-3-Events/
 * But this works for now.
 */
(function () {
  var event_prototype,
      event_static_properties,
      /*DEBUG*/
      check_event_type,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      /*END_DEBUG*/
      isEvent;
  
  /* Super constructor
   * @param {String} type
   * @param {Boolean} bubbles = false
   * @param {Boolean} cancelable = false
   *
   * @alternative instantiation
   * @param {Event} initializer event to wrap
   *
   * @return {Object}
   */
  doodle.Event = function (type, bubbles, cancelable) {
    var event = Object.create(event_prototype),
        arg_len = arguments.length,
        init_obj, //function, event
        copy_event_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 3) {
      throw new SyntaxError("[object Event](type, bubbles, cancelable): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(event, event_static_properties);
    //properties that require privacy
    Object.defineProperties(event, (function () {
      var evt_type,
          evt_bubbles,
          evt_cancelable,
          evt_cancelBubble = false,
          evt_defaultPrevented = false,
          evt_eventPhase = 0,
          evt_currentTarget = null,
          evt_target = null,
          evt_srcElement = null,
          evt_timeStamp = new Date(),
          evt_returnValue = true,
          evt_clipboardData,
          //internal use
          __cancel = false,
          __cancelNow = false;

      copy_event_properties = function  (evt, resetTarget, resetType) {
        resetTarget = (resetTarget === undefined) ? false : resetTarget;
        if (resetType) {
          /*DEBUG*/
          check_string_type(resetType, event+'::copy_event_properties', 'evt, resetTarget, *resetType*');
          /*END_DEBUG*/
          evt_type = resetType;
        } else {
          evt_type = evt.type;
        }
        evt_bubbles = evt.bubbles;
        evt_cancelable = evt.cancelable;
        evt_cancelBubble = evt.cancelBubble;
        evt_defaultPrevented = evt.defaultPrevented;
        evt_eventPhase = evt.eventPhase;
        if (resetTarget === false) {
          evt_currentTarget = evt.currentTarget;
          evt_target = evt.target;
        } else {
          evt_currentTarget = resetTarget;
          evt_target = resetTarget;
        }
        evt_srcElement = evt.srcElement;
        evt_timeStamp = evt.timeStamp;
        evt_returnValue = evt.returnValue;
        evt_clipboardData = evt.clipboardData;
        //check for doodle internal event properties
        if (evt.__cancel) {
          __cancel = true;
        }
        if (evt.__cancelNow) {
          __cancelNow = true;
        }
      };
      
      return {
        'type': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_type; }
        },
        
        '__setType': {
          enumerable: false,
          value: function (typeArg) {
            /*DEBUG*/
            check_string_type(typeArg, this+'.__setType', '*type*');
            /*END_DEBUG*/
            evt_type = typeArg;
          }
        },
        
        'bubbles': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_bubbles; }
        },
        
        'cancelable': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_cancelable; }
        },
        
        'cancelBubble': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_cancelBubble; },
          set: function (cancelArg) {
            /*DEBUG*/
            check_boolean_type(cancelArg, this+'.cancelBubble');
            /*END_DEBUG*/
            evt_cancelBubble = cancelArg;
          }
        },
        
        /* test if event propagation should stop after this node
         * @internal
         */
        '__cancel': {
          enumerable: false,
          configurable: false,
          get: function () { return __cancel; }
        },
        
        /* test if event propagation should stop immediately,
         * ignore other handlers on this node
         * @internal
         */
        '__cancelNow': {
          enumerable: false,
          configurable: false,
          get: function () { return __cancelNow; }
        },
        
        'currentTarget': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_currentTarget; }
        },
        
        /* currentTarget is read-only, but damnit I need to set it sometimes
         * @internal
         */
        '__setCurrentTarget': {
          enumerable: false,
          value: function (targetArg) {
            evt_currentTarget = targetArg;
          }
        },
        
        'target': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_target; }
        },

        /* @internal
         */
        '__setTarget': {
          enumerable: false,
          value: function (targetArg) {
            evt_target = targetArg;
          }
        },
        
        'eventPhase': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_eventPhase; }
        },

        /* @internal
         */
        '__setEventPhase': {
          enumerable: false,
          value: function (phaseArg) {
            /*DEBUG*/
            check_number_type(phaseArg, this+'.__setEventPhase', '*phase*');
            /*END_DEBUG*/
            evt_eventPhase = phaseArg;
          }
        },
        
        'srcElement': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_srcElement; }
        },
        
        'timeStamp': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_timeStamp; }
        },
        
        'returnValue': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_returnValue; }
        },
        
        /*
         * METHODS
         */
        'initEvent': {
          enumerable: true,
          configurable: false,
          value: function (typeArg, canBubbleArg, cancelableArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            /*DEBUG*/
            check_string_type(typeArg, this+'.initEvent', '*type*, bubbles, cancelable');
            check_boolean_type(canBubbleArg, this+'.initEvent', 'type, *bubbles*, cancelable');
            check_boolean_type(cancelableArg, this+'.initEvent', 'type, bubbles, *cancelable*');
            /*END_DEBUG*/

            evt_type = typeArg;
            evt_bubbles = canBubbleArg;
            evt_cancelable = cancelableArg;
            
            return this;
          }
        },

        'preventDefault': {
          enumerable: true,
          configurable: false,
          value: function () {
            evt_defaultPrevented = true;
          }
        },

        'stopPropagation': {
          enumerable: true,
          configurable: false,
          value: function () {
            if (!this.cancelable) {
              throw new Error(this+'.stopPropagation: Event can not be cancelled.');
            } else {
              __cancel = true;
            }
          }
        },

        'stopImmediatePropagation': {
          enumerable: true,
          configurable: false,
          value: function () {
            if (!this.cancelable) {
              throw new Error(this+'.stopImmediatePropagation: Event can not be cancelled.');
            } else {
              __cancel = true;
              __cancelNow = true;
            }
          }
        },

        /* Copy the properties from another Event.
         * Allows for the reuse of this object for further dispatch.
         * @internal
         * @param {Event} evt
         */
        '__copyEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            /*DEBUG*/
            check_event_type(evt, this+'.__copyEventProperties', '*event*, resetTarget, resetType');
            /*END_DEBUG*/
            copy_event_properties(evt, resetTarget, resetType);
            return this;
          }
        }
      };
    }()));//end defineProperties

    
    //using a function or another event object to init?
    if (arg_len === 1 && (typeof arguments[0] === 'function' || isEvent(arguments[0]))) {
      init_obj = arguments[0];
      type = undefined;
    }

    //initialize event
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(event);
        /*DEBUG*/
        if (event.type === undefined ||
            event.bubbles === undefined ||
            event.cancelable === undefined) {
          throw new SyntaxError("[object Event](function): Must call 'this.initEvent(type, bubbles, cancelable)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_event_properties(init_obj);
      }
    } else {
      //standard instantiation
      event.initEvent(type, bubbles, cancelable);
    }

    return event;
  };
  
  
  event_static_properties = {
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Event]";
      }
    }
  };//end event_static_properties

  event_prototype = Object.create({}, {
    'CAPTURING_PHASE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1
    },
    'AT_TARGET': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2
    },
    'BUBBLING_PHASE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 3
    },
    
    'MOUSEDOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1
    },
    'MOUSEUP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2
    },
    'MOUSEOVER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 4
    },
    'MOUSEOUT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 8
    },
    'MOUSEMOVE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 16
    },
    'MOUSEDRAG': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 32
    },
    'CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 64
    },
    'DBLCLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 128
    },
    'KEYDOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 256
    },
    'KEYUP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 512
    },
    'KEYPRESS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1024
    },
    'DRAGDROP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2048
    },
    'FOCUS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 4096
    },
    'BLUR': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 8192
    },
    'SELECT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 16384
    },
    'CHANGE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 32768
    }
  });//end event_prototype

  /*
   * CLASS METHODS
   */

  /* Test if an object is an event of any kind (Event/MouseEvent/etc).
   * Returns true on Doodle events as well as DOM events.
   * @param {Event} event
   * @return {Boolean}
   */
  isEvent = doodle.Event.isEvent = function (event) {
    if (!event || typeof event !== 'object' || typeof event.toString !== 'function') {
      return false;
    } else {
      event = event.toString();
    }
    return (event === '[object Event]' ||
            event === '[object UIEvent]' ||
            event === '[object MouseEvent]' ||
            event === '[object TouchEvent]' ||
            event === '[object KeyboardEvent]' ||
            event === '[object TextEvent]' ||
            event === '[object WheelEvent]');
  };

  /*DEBUG*/
  check_event_type = doodle.utils.types.check_event_type = function (event, caller, param) {
    if (isEvent(event)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_event_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be an Event.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
