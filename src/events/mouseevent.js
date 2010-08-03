

(function () {
  var mouseevent_properties,
      isEvent = doodle.Event.isEvent,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type;
  
  /* Super constructor
   * @param {String} type
   * @param {Boolean} bubbles
   * @param {Boolean} cancelable
   * @param {DOM Object} view
   * @param {Number} detail
   * @param {Number} screenX
   * @param {Number} screenY
   * @param {Number} clientX
   * @param {Number} clientY
   * @param {Boolean} ctrlKey
   * @param {Boolean} altKey
   * @param {Boolean} shiftKey
   * @param {Boolean} metaKey
   * @param {Number} button Mouse button that caused the event (0|1|2)
   * @param {Node} relatedTarget Secondary target for event (only for some events)
   *
   * @alternative instantiation
   * @param {Event} initializer event to wrap
   *
   * @return {MouseEvent}
   */
  doodle.MouseEvent = function (type, bubbles, cancelable, view, detail,
                                screenX, screenY, clientX, clientY, 
                                ctrlKey, altKey, shiftKey, metaKey,
                                button, relatedTarget) {
    var arg_len = arguments.length,
        initializer,
        mouseevent,
        //mouse-event read-only properties
        e_x = 0,
        e_y = 0,
        e_screenX = 0,
        e_screenY = 0,
        e_clientX = 0,
        e_clientY = 0,
        e_offsetX = 0,
        e_offsetY = 0,
        e_ctrlKey = false,
        e_altKey = false,
        e_shiftKey = false,
        e_metaKey = false,
        e_button = 0,
        e_relatedTarget = null,
        e_toElement = null,
        e_fromElement = null,
        e_dataTransfer = null;

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0];
      //handle properties derived from MouseEvent objects
      if (initializer.toString() === '[object MouseEvent]') {
        //copy properties over - we'll check these when we init the new event
        type = initializer.type;
        bubbles = initializer.bubbles;
        cancelable = initializer.cancelable;
        view = initializer.view;
        detail = initializer.detail;
        screenX = initializer.screenX;
        screenY = initializer.screenY;
        clientX = initializer.clientX;
        clientY = initializer.clientY;
        ctrlKey = initializer.ctrlKey;
        altKey = initializer.altKey;
        shiftKey = initializer.shiftKey;
        metaKey = initializer.metaKey;
        button = initializer.button;
        relatedTarget = initializer.relatedTarget;
        //the rest we'll have to assume the previous event is good
        e_dataTransfer = initializer.dataTransfer;
        e_toElement = initializer.toElement;
        e_fromElement = initializer.fromElement;
        e_x = initializer.x;
        e_y = initializer.y;
        e_offsetX = initializer.offsetX;
        e_offsetY = initializer.offsetY;
      }
      //init mouse-event object with uievent
      mouseevent = Object.create(doodle.UIEvent(initializer));

    } else if (arg_len === 0 || arg_len > 15) {
      //check arg count
      throw new SyntaxError("[object MouseEvent]: Invalid number of parameters.");
    } else {
      //regular instantiation
      mouseevent = Object.create(doodle.UIEvent(type, bubbles, cancelable, view, detail));
    }
    
    Object.defineProperties(mouseevent, mouseevent_properties);
    Object.defineProperties(mouseevent, {
      /* PROPERTIES
       */

      'x': {
        enumerable: true,
        configurable: false,
        get: function () { return e_x; }
      },

      'y': {
        enumerable: true,
        configurable: false,
        get: function () { return e_y; }
      },

      'screenX': {
        enumerable: true,
        configurable: false,
        get: function () { return e_screenX; }
      },

      'screenY': {
        enumerable: true,
        configurable: false,
        get: function () { return e_screenY; }
      },

      'clientX': {
        enumerable: true,
        configurable: false,
        get: function () { return e_clientX; }
      },

      'clientY': {
        enumerable: true,
        configurable: false,
        get: function () { return e_clientY; }
      },

      'offsetX': {
        enumerable: true,
        configurable: false,
        get: function () { return e_offsetX; }
      },

      'offsetY': {
        enumerable: true,
        configurable: false,
        get: function () { return e_offsetY; }
      },

      'ctrlKey': {
        enumerable: true,
        configurable: false,
        get: function () { return e_ctrlKey; }
      },

      'altKey': {
        enumerable: true,
        configurable: false,
        get: function () { return e_altKey; }
      },

      'shiftKey': {
        enumerable: true,
        configurable: false,
        get: function () { return e_shiftKey; }
      },

      'metaKey': {
        enumerable: true,
        configurable: false,
        get: function () { return e_metaKey; }
      },

      'button': {
        enumerable: true,
        configurable: false,
        get: function () { return e_button; }
      },

      'relatedTarget': {
        enumerable: true,
        configurable: false,
        get: function () { return e_relatedTarget; }
      },

      'toElement': {
        enumerable: true,
        configurable: false,
        get: function () { return e_toElement; }
      },

      'fromElement': {
        enumerable: true,
        configurable: false,
        get: function () { return e_fromElement; }
      },

      'dataTransfer': {
        enumerable: true,
        configurable: false,
        get: function () { return e_dataTransfer; }
      },

      /* METHODS
       */

      'initMouseEvent': {
        value: function (type, bubbles, cancelable, view, detail,
                         screenX, screenY, clientX, clientY, 
                         ctrlKey, altKey, shiftKey, metaKey,
                         button, relatedTarget) {
          //parameter defaults
          bubbles = bubbles === true; //false
          cancelable = cancelable === true; //false
          view = (view === undefined) ? null : view;
          detail = (detail === undefined) ? 0 : detail;
          //position is zero
          e_screenX = (screenX === undefined) ? 0 : screenX;
          e_screenY = (screenY === undefined) ? 0 : screenY;
          e_clientX = (clientX === undefined) ? 0 : clientX;
          e_clientY = (clientY === undefined) ? 0 : clientY;
          //keys are false
          e_ctrlKey = ctrlKey === true;
          e_altKey = altKey === true;
          e_shiftKey = shiftKey === true;
          e_metaKey = metaKey === true;
          //else
          e_button = (button === undefined) ? 0 : button;
          e_relatedTarget = (relatedTarget === undefined) ? null : relatedTarget;
          
          //type-check
          check_string_type(type, this+'.initMouseEvent');
          check_boolean_type(bubbles, this+'.initMouseEvent');
          check_boolean_type(cancelable, this+'.initMouseEvent');
          check_number_type(detail, this+'.initMouseEvent');
          check_number_type(e_screenX, this+'.initMouseEvent');
          check_number_type(e_screenY, this+'.initMouseEvent');
          check_number_type(e_clientX, this+'.initMouseEvent');
          check_number_type(e_clientY, this+'.initMouseEvent');
          check_boolean_type(e_ctrlKey, this+'.initMouseEvent');
          check_boolean_type(e_altKey, this+'.initMouseEvent');
          check_boolean_type(e_shiftKey, this+'.initMouseEvent');
          check_boolean_type(e_metaKey, this+'.initMouseEvent');
          check_number_type(e_button, this+'.initMouseEvent');
          
          this.initUIEvent(type, bubbles, cancelable, view, detail);
          return this;
        }
      }

    });

    //init event
    mouseevent.initMouseEvent(type, bubbles, cancelable, view, detail,
                              screenX, screenY, clientX, clientY, 
                              ctrlKey, altKey, shiftKey, metaKey,
                              button, relatedTarget);
    
    return mouseevent;
  };
    
  
  (function () {

    mouseevent_properties = {
      'toString': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function () {
          return "[object MouseEvent]";
        }
      }
    };

  }());

  //constants
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

    'MIDDLE_CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "middleClick"
    },

    'RIGHT_CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "rightClick"
    },

    'MOUSE_DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseDown"
    },

    'MIDDLE_MOUSE_DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "middleMouseDown"
    },

    'RIGHT_MOUSE_DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "rightMouseDown"
    },

    'MOUSE_UP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseUp"
    },

    'MIDDLE_MOUSE_UP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "middleMouseUp"
    },

    'RIGHT_MOUSE_UP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "rightMouseUp"
    },

    'MOUSE_MOVE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseMove"
    },

    'MOUSE_OUT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseOut"
    },

    'MOUSE_OVER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseOver"
    },

    'ROLL_OVER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "rollOver"
    },

    'ROLL_OUT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "rollOut"
    },

    'MOUSE_WHEEL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseWheel"
    }
    
  });

}());//end class closure
