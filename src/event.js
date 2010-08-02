
/* Will propbably want to implement the dom event interface:
 * http://www.w3.org/TR/DOM-Level-3-Events/
 * But this works for now.
 */

(function () {
  var event_properties,
      check_string_type = doodle.utils.types.check_string_type;
  
  /* Super constructor
   * @param {Function} initializer
   * @return {Object}
   */
  doodle.Event = function (type, bubbles, cancelable) {
    var arg_len = arguments.length,
        initializer,
				//some event properties aren't writable, so we'll copy over
				event_temp = document.createEvent("Event"),
				event = Object.create(Object.getPrototypeOf(event_temp));
		
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
    } else if (arg_len > 3) {
      throw new SyntaxError("[object Event]: Invalid number of parameters.");
    } else {
      //parameter defaults
      check_string_type(type); //required
      bubbles = bubbles === true; //false
      cancelable = cancelable === true; //false
    }

		//can't call this on the copy
		event_temp.initEvent(type, bubbles, cancelable);
		//copy over properties to our malleable event object
		for (var attr in event_temp) {
			if (event_temp.hasOwnProperty(attr)) {
				event[attr] = event_temp[attr];
			}
		}

		//add my own event methods, adjust property privacy
		Object.defineProperties(event, event_properties);

		//init
    //
    
    return event;
  };


  (function () {
    
    event_properties = {

			'toString': {
        enumerable: false,
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
