
/* Will propbably want to implement the dom event interface:
 * http://www.w3.org/TR/DOM-Level-3-Events/
 * But this works for now.
 */

(function () {
  var event_prototype = {},
      event_properties,
      isEvent,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type;
  
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
    var arg_len = arguments.length,
        initializer, //if passed another event object
        event = Object.create(event_prototype), //super-object
        //read-only properties
        cancel = false, //internal use
        cancelNow = false, //internal use
        cancelBubble = false,
        defaultPrevented = false,
        eventPhase = 0,
        target = null,
        currentTarget = null,
        timeStamp = new Date(),
        clipboardData,
        srcElement = null,
        returnValue = true;

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0];
      //copy event properties to our args that'll be used for initialization
      //initEvent() will typecheck these
      type = initializer.type;
      bubbles = initializer.bubbles;
      cancelable = initializer.cancelable;
      //initEvent() won't touch these
      cancelBubble = initializer.cancelBubble;
      defaultPrevented = initializer.defaultPrevented;
      eventPhase = initializer.eventPhase;
      target = initializer.target;
      currentTarget = initializer.currentTarget;
      timeStamp = initializer.timeStamp;
      clipboardData = initializer.clipboardData;
      srcElement = initializer.srcElement;
      returnValue = initializer.returnValue;
      //check for doodle internal event properties
      if (initializer.__cancel) {
        cancel = initializer.__cancel;
      }
      if (initializer.__cancelNow) {
        cancelNow = initializer.__cancelNow;
      }
      
    } else if (arg_len === 0 || arg_len > 3) {
      //check arg count
      throw new SyntaxError("[object Event]: Invalid number of parameters.");
    }

    Object.defineProperties(event, event_properties);
    //properties that require privacy
    Object.defineProperties(event, {
      /*
       * PROPERTIES
       */

      'bubbles': {
        enumerable: true,
        configurable: false,
        get: function () { return bubbles; }
      },

      'cancelBubble': {
        enumerable: true,
        configurable: false,
        get: function () { return cancelBubble; },
        set: function (cancelArg) {
          check_boolean_type(cancelArg, this+'.cancelBubble');
          cancelBubble = cancelp;
        }
      },

      'cancelable': {
        enumerable: true,
        configurable: false,
        get: function () { return cancelable; }
      },

      //test if event propagation should stop after this node
      //@internal
      '__cancel': {
        enumerable: false,
        configurable: false,
        get: function () { return cancel; }
      },

      //test if event propagation should stop immediately,
      //ignore other handlers on this node
      //@internal
      '__cancelNow': {
        enumerable: false,
        configurable: false,
        get: function () { return cancelNow; }
      },

      'currentTarget': {
        enumerable: true,
        configurable: false,
        get: function () { return currentTarget; }
      },

      //currentTarget is read-only, but damnit I need to set it sometimes
      '__setCurrentTarget': {
        enumerable: false,
        value: function (targetArg) {
          currentTarget = targetArg;
        }
      },

      'target': {
        enumerable: true,
        configurable: false,
        get: function () { return target; }
      },

      '__setTarget': {
        enumerable: false,
        value: function (targetArg) {
          target = targetArg;
        }
      },

      'eventPhase': {
        enumerable: true,
        configurable: false,
        get: function () { return eventPhase; }
      },
      
      '__setEventPhase': {
        enumerable: false,
        value: function (phaseArg) {
          check_number_type(phaseArg);
          eventPhase = phaseArg;
        }
      },

      'srcElement': {
        enumerable: true,
        configurable: false,
        get: function () { return srcElement; }
      },

      'timeStamp': {
        enumerable: true,
        configurable: false,
        get: function () { return timeStamp; }
      },

      'type': {
        enumerable: true,
        configurable: false,
        get: function () { return type; }
      },

      'returnValue': {
        enumerable: true,
        configurable: false,
        get: function () { return returnValue; }
      },
      
      /*
       * METHODS
       */

      'initEvent': {
        enumerable: true,
        configurable: false,
        value: function (typeArg, canBubbleArg, cancelableArg) {
          //parameter defaults
          bubbles = canBubbleArg === true; //false
          cancelable = cancelableArg === true;
          //typecheck
          check_string_type(type, this+'.initEvent', 'type');
          check_boolean_type(bubbles, this+'.initEvent', 'bubbles');
          check_boolean_type(cancelable, this+'.initEvent', 'cancelable');
          
          return this;
        }
      },

      'preventDefault': {
        enumerable: true,
        configurable: false,
        value: function () {
          defaultPrevented = true;
        },
      },

      'stopPropagation': {
        enumerable: true,
        configurable: false,
        value: function () {
          if (!this.cancelable) {
            throw new Error(this+'.stopPropagation: Event can not be cancelled.');
          } else {
            cancel = true;
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
            cancel = true;
            cancelNow = true;
          }
        }
      }
    });

    //init event
    event.initEvent(type, bubbles, cancelable);
    
    return event;
  };


  (function () {

    var dom_event_proto = Object.getPrototypeOf(document.createEvent('Event'));

    //copy event property constants, will add my own methods later
    for (var prop in dom_event_proto) {
      if (typeof dom_event_proto[prop] !== 'function') {
        event_prototype[prop] = dom_event_proto[prop];
      }
    }


    //static event properties
    event_properties = {

      'toString': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function () {
          return "[object Event]";
        }
      }
      
    };//end event_properties
  }());

  /*
   * CLASS CONSTANTS
   */
  Object.defineProperties(doodle.Event, {

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

    /* Dispatched when object is added to display path.
     */
    'ADDED': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "added"
    },

    /* Dispatched when object is removed from display path.
     */
    'REMOVED': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "removed"
    },

    'ENTER_FRAME': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "enterFrame"
    },

    /* Dispatched when element is loaded.
     */
    'LOAD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "load"
    }
    
  });

  /*
   * CLASS METHODS
   */

  /* Test if an object is an event of any kind (Event/MouseEvent/etc).
   * Returns true on Doodle events as well as DOM events.
   * @param {Event} event
   * @return {Boolean}
   */
  isEvent = doodle.Event.isEvent = function (event) {
    var evt_name;
    if (typeof event !== 'object') {
          return false;
    } else {
      evt_name = event.toString();
    }
    return (evt_name === '[object Event]' ||
            evt_name === '[object UIEvent]' ||
            evt_name === '[object MouseEvent]' ||
            evt_name === '[object KeyboardEvent]' ||
            evt_name === '[object TextEvent]');
  };
  
}());//end class closure
