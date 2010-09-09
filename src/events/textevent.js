
/* DOM 3 Event: TextEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-textevents
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
        initializer, //if passed another event object
        textevent; //super-object to construct

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0]; //event object
      
      //copy event properties to our args that'll be used for initialization
      //initTextEvent() will typecheck these
      type = initializer.type;
      bubbles = initializer.bubbles;
      cancelable = initializer.cancelable;
      view = initializer.view;
      data = initializer.data;
      inputMode = initializer.inputMode;
      
      //pass on the event arg to init our uievent prototype
      textevent = Object.create(doodle.UIEvent(initializer));

    } else if (arg_len === 0 || arg_len > 6) {
      //check arg count
      throw new SyntaxError("[object TextEvent]: Invalid number of parameters.");
    } else {
      //regular instantiation of prototype
      bubbles = bubbles === true; //false
      cancelable = cancelable === true;
      view = (viewArg === undefined) ? null : view;

      /*DEBUG*/
      check_string_type(type, '[object TextEvent].constructor', '*type*');
      check_boolean_type(bubbles, '[object TextEvent].constructor', '*bubbles*');
      check_boolean_type(cancelable, '[object TextEvent].constructor', '*cancelable*');
      /*END_DEBUG*/
      textevent = Object.create(doodle.UIEvent(type, bubbles, cancelable, view));
    }
    
    Object.defineProperties(textevent, textevent_properties);
    Object.defineProperties(textevent, {
      /* PROPERTIES
       */

      'data': {
        enumerable: true,
        configurable: false,
        get: function () { return data; }
      },

      'inputMode': {
        enumerable: true,
        configurable: false,
        get: function () { return inputMode; }
      },

      /* METHODS
       */

      'initTextEvent': {
        value: function (typeArg, canBubbleArg, cancelableArg,
                         viewArg, dataArg, inputModeArg) {
          //parameter defaults
          type = typeArg;
          bubbles = canBubbleArg === true; //false
          cancelable = cancelableArg === true;
          view = (viewArg === undefined) ? null : viewArg;
          data = (dataArg === undefined) ? "" : dataArg;
          inputMode = (inputModeArg === undefined) ? doodle.TextEvent.INPUT_METHOD_UNKNOWN : inputModeArg;

          /*DEBUG*/
          check_string_type(type, this+'.initTextEvent', '*type*');
          check_boolean_type(bubbles, this+'.initTextEvent', '*bubbles*');
          check_boolean_type(cancelable, this+'.initTextEvent', '*cancelable*');
          check_string_type(data, this+'.initTextEvent', '*data*');
          check_number_type(inputMode, this+'.initTextEvent', '*inputMode*');
          /*END_DEBUG*/
          
          this.initUIEvent(type, bubbles, cancelable, view);
          return this;
        }
      }

    });

    //init event
    textevent.initTextEvent(type, bubbles, cancelable, view, data, inputMode);
    
    return textevent;
  };
    
  //static
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
  
}());//end class closure
