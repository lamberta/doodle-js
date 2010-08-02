
/* Will propbably want to implement the dom event interface:
 * http://www.w3.org/TR/DOM-Level-3-Events/
 * But this works for now.
 */

(function () {
  var event_prototype = {},
      event_properties,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type;
  
  /* Super constructor
   * @param {Function} initializer
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
        e_srcElement = null;
    
    
    
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
    } else if (arg_len > 3) {
      throw new SyntaxError("[object Event]: Invalid number of parameters.");
    } else {
      //parameter defaults
      bubbles = bubbles === true; //false
      cancelable = cancelable === true; //false
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
      
      /*
       * METHODS
       */

      'initEvent': {
        enumerable: true,
        configurable: false,
        value: function (type, bubbles, cancelable) {
          bubbles = bubbles || false;
          cancelable = cancelable || false;
          check_string_type(type, this+'.initEvent');
          check_boolean_type(bubbles, this+'.initEvent');
          check_boolean_type(cancelable, this+'.initEvent');
          e_type = type;
          e_bubbles = bubbles;
          e_cancelable = cancelable;
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

    //needed for mouseevent
    /*for (var attr in event_temp) {
      if (event_temp.hasOwnProperty(attr)) {
        event[attr] = event_temp[attr];
      }
    }*/
    
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


    
    event_properties = {

      'returnValue': {
        enumerable: true,
        writable: true,
        configurable: false,
        value: true
      },

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

  

  //constants
  Object.defineProperties(doodle.Event, {

    'ENTER_FRAME': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "enterFrame"
    }
    
  });

  


  


  doodle.MouseEvent = function (type, bubbles, cancelable) {
    var arg_len = arguments.length,
        initializer,
        event;
    
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
    } else if (arg_len > 3) {
      throw new SyntaxError("[object MouseEvent]: Invalid number of parameters.");
    } else {
      //parameter defaults
      check_string_type(type); //required
      bubbles = bubbles === true; //false
      cancelable = cancelable === true; //false
    }
    
    event = document.createEvent("MouseEvent");
    event.initEvent(type, bubbles, cancelable);
    
    return event;
  };


  //constants
  //more need to be added
  Object.defineProperties(doodle.MouseEvent, {

    'CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "click"
    },

    'DOUBLE_CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "doubleClick"
    },

    'MOUSE_DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseDown"
    },

    'MOUSE_MOVE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseMove"
    }
    
  });

  
}());//end class closure
