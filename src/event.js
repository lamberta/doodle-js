
(function () {
  var event_properties;
  
  /* Super constructor
   * @param {Function} initializer
   * @return {Object}
   */
  doodle.Event = function (type, bubbles, cancelable) {
    var arg_len = arguments.length,
        initializer,
				event;
		
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

		event = document.createEvent(type);
		event.initEvent(type, bubbles, cancelable);
		
		return event;
	};


	(function () {
		
		event_properties = {
			
		};//end event_properties
	}());
}());//end class closure



//constants
Object.defineProperties(doodle.Event, {

	'ENTER_FRAME': {
		enumerable: true,
    writable: false,
    configurable: false,
		value: "enterFrame";
	}
	
});
