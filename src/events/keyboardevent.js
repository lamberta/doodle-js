
/* DOM 3 Event: KeyboardEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 */

(function () {
  var keyboardevent_properties,
      isEvent = doodle.Event.isEvent,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type;
  
  /* Super constructor
   * @param {String} type
   * @param {Boolean} bubbles
   * @param {Boolean} cancelable
   * @param {DOM Object} view
   * @param {String} keyIdentifier
   * @param {Number} keyLocation
   * @param {String} modifiersList White-space separated list of key modifiers.
   * @param {Boolean} repeat
   *
   * @alternative instantiation
   * @param {Event} initializer event to wrap
   *
   * @return {KeyboardEvent}
   */
  doodle.KeyboardEvent = function (type, bubbles, cancelable, view,
                                   keyIdentifier, keyLocation, modifiersList, repeat) {
    var arg_len = arguments.length,
        initializer, //if passed another event object
        keyboardevent, //this super-object we'll be constructing
        //read-only properties
        ctrlKey = false,
        shiftKey = false,
        altKey = false,
        metaKey = false;

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0]; //event object
      
      //copy event properties to our args that'll be used for initialization
      //initKeyboardEvent() will typecheck these
      type = initializer.type;
      bubbles = initializer.bubbles;
      cancelable = initializer.cancelable;
      view = initializer.view;
      keyIdentifier = initializer.keyIdentifier;
      keyLocation = initializer.keyLocation;
      repeat = initializer.repeat;
      //get modifiers, use defaults to avoid contructing a new modifiers list string
      //initKeyboardEvent() won't touch these
      ctrlKey = initializer.ctrlKey || false;
      shiftKey = initializer.shiftKey || false;
      altKey = initializer.altKey || false;
      metaKey = initializer.metaKey || false;
      
      //pass on the event arg to init our uievent prototype
      keyboardevent = Object.create(doodle.UIEvent(initializer));

    } else if (arg_len === 0 || arg_len > 8) {
      //check arg count
      throw new SyntaxError("[object KeyboardEvent]: Invalid number of parameters.");
    } else {
      //regular instantiation of our prototype
      bubbles = bubbles === true; //false
      cancelable = cancelable === true;
      view = (view === undefined) ? null : view;
      
      /*DEBUG*/
      check_string_type(type, '[object KeyboardEvent].constructor', '*type*');
      check_boolean_type(bubbles, '[object KeyboardEvent].constructor', '*bubbles*');
      check_boolean_type(cancelable, '[object KeyboardEvent].constructor', '*cancelable*');
      /*END_DEBUG*/
      
      keyboardevent = Object.create(doodle.UIEvent(type, bubbles, cancelable, view));
    }
    
    Object.defineProperties(keyboardevent, keyboardevent_properties);
    Object.defineProperties(keyboardevent, {
      /* PROPERTIES
       */

      'keyIdentifier': {
        enumerable: true,
        configurable: false,
        get: function () { return keyIdentifier; }
      },

      'keyLocation': {
        enumerable: true,
        configurable: false,
        get: function () { return keyLocation; }
      },

      'repeat': {
        enumerable: true,
        configurable: false,
        get: function () { return repeat; }
      },

      'altKey': {
        enumerable: true,
        configurable: false,
        get: function () { return altKey; }
      },

      'ctrlKey': {
        enumerable: true,
        configurable: false,
        get: function () { return ctrlKey; }
      },

      'metaKey': {
        enumerable: true,
        configurable: false,
        get: function () { return metaKey; }
      },

      'shiftKey': {
        enumerable: true,
        configurable: false,
        get: function () { return shiftKey; }
      },

      /* METHODS
       */

      'initKeyboardEvent': {
        value: function (typeArg, canBubbleArg, cancelableArg, viewArg,
                         keyIdentifierArg, keyLocationArg, modifiersListArg, repeatArg) {
          //parameter defaults, assign to outer constructor vars
          type = typeArg;
          bubbles = canBubbleArg === true; //false
          cancelable = cancelableArg === true;
          view = (viewArg === undefined) ? null : viewArg;
          keyIdentifier = (keyIdentifierArg === undefined) ? "" : keyIdentifierArg;
          keyLocation = (keyLocationArg === undefined) ? 0 : keyLocationArg;
          modifiersList = (modifiersListArg === undefined) ? "" : modifiersListArg;
          repeat = repeatArg === true;

          /*DEBUG*/
          check_string_type(type, this+'.initKeyboardEvent', 'type');
          check_boolean_type(bubbles, this+'.initKeyboardEvent', 'bubbles');
          check_boolean_type(cancelable, this+'.initKeyboardEvent', 'cancelable');
          check_string_type(keyIdentifier, this+'.initKeyboardEvent', 'keyIdentifier');
          check_number_type(keyLocation, this+'.initKeyboardEvent', 'keyLocation');
          check_string_type(modifiersList, this+'.initKeyboardEvent', 'modifiersList');
          check_boolean_type(repeat, this+'.initKeyboardEvent', 'repeat');
          /*END_DEBUG*/

          //parse string of white-space separated list of modifier key identifiers
          modifiersList.split(" ").forEach(function (modifier) {
            switch (modifier) {
            case 'Alt':
              altKey = true;
              break;
            case 'Control':
              ctrlKey = true;
              break;
            case 'Meta':
              metaKey = true;
              break;
            case 'Shift':
              shiftKey = true;
              break;
            }
          });
          
          this.initUIEvent(type, bubbles, cancelable, view);
          return this;
        }
      },

      /* Queries the state of a modifier using a key identifier.
       * @param {String} key A modifier key identifier
       * @return {Boolean} True if it is a modifier key and the modifier is activated, false otherwise.
       * This is an incomplete list of modifiers.
       */
      'getModifierState': {
        value: function (key) {
          check_string_type(key, this+'.getModifierState');
          switch (key) {
          case 'Alt':
            return altKey;
          case 'Control':
            return ctrlKey;
          case 'Meta':
            return metaKey;
          case 'Shift':
            return shiftKey;
          default:
            return false;
          }
        }
      }

    });

    //init event
    keyboardevent.initKeyboardEvent(type, bubbles, cancelable, view,
                                    keyIdentifier, keyLocation, modifiersList, repeat);
    
    return keyboardevent;
  };
    
  //static
  keyboardevent_properties = {
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object KeyboardEvent]";
      }
    }
  };

}());//end class closure
