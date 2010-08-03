
/* TextEvent applies only to characters and is designed for use with
 * any text input devices, not just keyboards.
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-textevents
 *
 * It's here for now, I don't know how important this is to implement.
 */

(function () {
  var textevent_properties,
      isEvent = doodle.Event.isEvent,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type;
  
  /* Super constructor
   * @param {String} type
   * @param {Boolean} bubbles
   * @param {Boolean} cancelable
   * @param {DOM Object} view
   * @param {String} data
   * @param {Number} inputMode
   *
   * @alternative instantiation
   * @param {Event} initializer event to wrap
   *
   * @return {TextEvent}
   */
  doodle.TextEvent = function (type, bubbles, cancelable, view, data, inputMode) {
    var arg_len = arguments.length,
        initializer,
        textevent,
        //text-event read-only properties
        e_data = "",
        e_inputMode = doodle.TextEvent.INPUT_METHOD_UNKNOWN;

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0];
      //handle properties derived from TextEvent objects
      if (initializer.toString() === '[object TextEvent]') {
        //copy properties over - we'll check these when we init the new event
        type = initializer.type;
        bubbles = initializer.bubbles;
        cancelable = initializer.cancelable;
        view = initializer.view;
        data = initializer.data;
        inputMode = initializer.inputMode;
        //the rest we'll have to assume the previous event is good
        //e_data = initializer.data;
      }
      //init mouse-event object with uievent
      textevent = Object.create(doodle.UIEvent(initializer));

    } else if (arg_len === 0 || arg_len > 6) {
      //check arg count
      throw new SyntaxError("[object TextEvent]: Invalid number of parameters.");
    } else {
      //regular instantiation
      textevent = Object.create(doodle.UIEvent(type, bubbles, cancelable, view));
    }
    
    Object.defineProperties(textevent, textevent_properties);
    Object.defineProperties(textevent, {
      /* PROPERTIES
       */

      'data': {
        enumerable: true,
        configurable: false,
        get: function () { return e_data; }
      },

      'inputMode': {
        enumerable: true,
        configurable: false,
        get: function () { return e_inputMode; }
      },

      /* METHODS
       */

      'initTextEvent': {
        value: function (type, bubbles, cancelable, view, data, inputMode) {
          //parameter defaults
          bubbles = bubbles === true; //false
          cancelable = cancelable === true; //false
          view = (view === undefined) ? null : view;
          e_data = (data === undefined) ? "" : data;
          e_inputMode = (inputMode === undefined) ? doodle.TextEvent.INPUT_METHOD_UNKNOWN : inputMode;
          
          //type-check
          check_string_type(type, this+'.initTextEvent');
          check_boolean_type(bubbles, this+'.initTextEvent');
          check_boolean_type(cancelable, this+'.initTextEvent');
          check_string_type(e_data, this+'.initTextEvent');
          check_number_type(e_inputMode, this+'.initTextEvent');
          
          this.initUIEvent(type, bubbles, cancelable, view);
          return this;
        }
      }

    });

    //init event
    textevent.initTextEvent(type, bubbles, cancelable, view, data, inputMode);
    
    return textevent;
  };
    
  
  (function () {

    textevent_properties = {
      'toString': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function () {
          return "[object TextEvent]";
        }
      }
    };

  }());

  //constants
  Object.defineProperties(doodle.TextEvent, {

    'TEXT_INPUT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "textInput"
    },

    'INPUT_METHOD_UNKNOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x00
    },

    'INPUT_METHOD_KEYBOARD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x01
    },

    'INPUT_METHOD_PASTE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x02
    },

    'INPUT_METHOD_DROP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x03
    },

    'INPUT_METHOD_IME': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x04
    },

    'INPUT_METHOD_OPTION': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x05
    },

    'INPUT_METHOD_HANDWRITING': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x06
    },

    'INPUT_METHOD_VOICE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x07
    },

    'INPUT_METHOD_MULTIMODAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x08
    },

    'INPUT_METHOD_SCRIPT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 0x09
    }
    
  });

}());//end class closure
