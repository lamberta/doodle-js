
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
   * @param {Boolean} bubbles
   * @param {Boolean} cancelable
   *
   * @alternative instantiation
   * @param {Event} initializer event to wrap
   *
   * @return {Object}
   */
  doodle.Event = function (type, bubbles, cancelable) {
    var arg_len = arguments.length,
        initializer,
        event = Object.create(event_prototype), //doodle event
        //generate dom event that we'll copy values from - mouseevent
        //event_temp = document.createEvent('Event'),
        //read-only event properties
        e_type,
        e_bubbles,
        e_cancelable,
        e_cancel = false, //internal use
        e_cancelNow = false, //internal use
        e_cancelBubble = false,
        e_defaultPrevented = false,
        e_eventPhase = 0,
        e_target = null,
        e_currentTarget = null,
        e_timeStamp = new Date(),
        e_clipboardData,
        e_srcElement = null,
        e_returnValue = true;

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0];
      //copy properties over - we'll check these when we init the new event
      type = initializer.type;
      bubbles = initializer.bubbles;
      cancelable = initializer.cancelable;
      //the rest we'll have to assume the previous event is good
      e_cancelBubble = initializer.cancelBubble;
      e_defaultPrevented = initializer.defaultPrevented;
      e_eventPhase = initializer.eventPhase;
      e_target = initializer.target;
      e_currentTarget = initializer.currentTarget;
      e_timeStamp = initializer.timeStamp;
      e_clipboardData = initializer.clipboardData;
      e_srcElement = initializer.srcElement;
      e_returnValue = initializer.returnValue;
      //check for doodle internal event properties
      if (initializer.__cancel) {
        e_cancel = initializer.__cancel;
      }
      if (initializer.__cancelNow) {
        e_cancelNow = initializer.__cancelNow;
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
        get: function () { return e_bubbles; }
      },

      'cancelBubble': {
        enumerable: true,
        configurable: false,
        get: function () { return e_cancelBubble; },
        set: function (cancelp) {
          check_boolean_type(cancelp, this+'.cancelBubble');
          e_cancelBubble = cancelp;
        }
      },

      'cancelable': {
        enumerable: true,
        configurable: false,
        get: function () { return e_cancelable; }
      },

      //test if event propagation should stop after this node
      //@internal
      '__cancel': {
        enumerable: false,
        configurable: false,
        get: function () { return e_cancel; }
      },

      //test if event propagation should stop immediately,
      //ignore other handlers on this node
      //@internal
      '__cancelNow': {
        enumerable: false,
        configurable: false,
        get: function () { return e_cancelNow; }
      },

      'currentTarget': {
        enumerable: true,
        configurable: false,
        get: function () { return e_currentTarget; }
      },

      //currentTarget is read-only, but damnit I need to set it sometimes
      '__setCurrentTarget': {
        enumerable: false,
        value: function (target) {
          e_currentTarget = target;
        }
      },

      'target': {
        enumerable: true,
        configurable: false,
        get: function () { return e_target; }
      },

      '__setTarget': {
        enumerable: false,
        value: function (target) {
          e_target = target;
        }
      },

      'eventPhase': {
        enumerable: true,
        configurable: false,
        get: function () { return e_eventPhase; }
      },
      
      '__setEventPhase': {
        enumerable: false,
        value: function (phase) {
          check_number_type(phase);
          e_eventPhase = phase;
        }
      },

      'srcElement': {
        enumerable: true,
        configurable: false,
        get: function () { return e_srcElement; }
      },

      'timeStamp': {
        enumerable: true,
        configurable: false,
        get: function () { return e_timeStamp; }
      },

      'type': {
        enumerable: true,
        configurable: false,
        get: function () { return e_type; }
      },

      'returnValue': {
        enumerable: true,
        configurable: false,
        get: function () { return e_returnValue; }
      },
      
      /*
       * METHODS
       */

      'initEvent': {
        enumerable: true,
        configurable: false,
        value: function (type, bubbles, cancelable) {
          //parameter defaults
          bubbles = bubbles === true; //false
          cancelable = cancelable === true; //false
          check_string_type(type, this+'.initEvent');
          check_boolean_type(bubbles, this+'.initEvent');
          check_boolean_type(cancelable, this+'.initEvent');
          e_type = type;
          e_bubbles = bubbles;
          e_cancelable = cancelable;
          return this;
        }
      },

      'preventDefault': {
        enumerable: true,
        configurable: false,
        value: function () {
          e_defaultPrevented = true;
        },
      },

      'stopPropagation': {
        enumerable: true,
        configurable: false,
        value: function () {
          if (!this.cancelable) {
            throw new Error(this+'.stopPropagation: Event can not be cancelled.');
          } else {
            e_cancel = true;
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
            e_cancel = true;
            e_cancelNow = true;
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

    'ENTER_FRAME': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "enterFrame"
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
            evt_name === '[object MouseEvent]');
  };
  
}());//end class closure
