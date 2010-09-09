
/* DOM 2 Event: MouseEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-mouseevents
 */

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
        x = 0,
        y = 0,
        offsetX = 0,
        offsetY = 0;

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0]; //event object
      //copy event properties to our args that'll be used for initialization
      //initMouseEvent() will typecheck these
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
      //initMouseEvent() won't touch these
      x = initializer.x || 0;
      y = initializer.y || 0;
      offsetX = initializer.offsetX || 0;
      offsetY = initializer.offsetY || 0;

      //init mouse-event object with uievent
      mouseevent = Object.create(doodle.UIEvent(initializer));

    } else if (arg_len === 0 || arg_len > 15) {
      //check arg count
      throw new SyntaxError("[object MouseEvent]: Invalid number of parameters.");
    } else {
      //regular instantiation
      bubbles = bubbles === true; //false
      cancelable = cancelable === true;
      view = (view === undefined) ? null : view;
      detail = (detail === undefined) ? 0 : detail;

      /*DEBUG*/
      check_string_type(type, '[object MouseEvent].constructor', '*type*');
      check_boolean_type(bubbles, '[object MouseEvent].constructor', '*bubbles*');
      check_boolean_type(cancelable, '[object MouseEvent].constructor', '*cancelable*');
      check_number_type(detail, '[object MouseEvent].constructor', '*detail*');
      /*END_DEBUG*/
      
      mouseevent = Object.create(doodle.UIEvent(type, bubbles, cancelable, view, detail));
    }
    
    Object.defineProperties(mouseevent, mouseevent_properties);
    Object.defineProperties(mouseevent, {
      /* PROPERTIES
       */

      'x': {
        enumerable: true,
        configurable: false,
        get: function () { return x; }
      },

      'y': {
        enumerable: true,
        configurable: false,
        get: function () { return y; }
      },

      'screenX': {
        enumerable: true,
        configurable: false,
        get: function () { return screenX; }
      },

      'screenY': {
        enumerable: true,
        configurable: false,
        get: function () { return screenY; }
      },

      'clientX': {
        enumerable: true,
        configurable: false,
        get: function () { return clientX; }
      },

      'clientY': {
        enumerable: true,
        configurable: false,
        get: function () { return clientY; }
      },

      'offsetX': {
        enumerable: true,
        configurable: false,
        get: function () { return offsetX; }
      },

      'offsetY': {
        enumerable: true,
        configurable: false,
        get: function () { return offsetY; }
      },

      'ctrlKey': {
        enumerable: true,
        configurable: false,
        get: function () { return ctrlKey; }
      },

      'altKey': {
        enumerable: true,
        configurable: false,
        get: function () { return altKey; }
      },

      'shiftKey': {
        enumerable: true,
        configurable: false,
        get: function () { return shiftKey; }
      },

      'metaKey': {
        enumerable: true,
        configurable: false,
        get: function () { return metaKey; }
      },

      'button': {
        enumerable: true,
        configurable: false,
        get: function () { return button; }
      },

      'relatedTarget': {
        enumerable: true,
        configurable: false,
        get: function () { return relatedTarget; }
      },

      /* METHODS
       */

      'initMouseEvent': {
        value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg,
                         screenXArg, screenYArg, clientXArg, clientYArg, 
                         ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg,
                         buttonArg, relatedTargetArg) {
          //parameter defaults, assign to outer constructor vars
          bubbles = canBubbleArg === true; //false
          cancelable = cancelableArg === true;
          view = (viewArg === undefined) ? null : viewArg;
          detail = (detailArg === undefined) ? 0 : detailArg;
          //position is zero
          screenX = (screenXArg === undefined) ? 0 : screenXArg;
          screenY = (screenYArg === undefined) ? 0 : screenYArg;
          clientX = (clientXArg === undefined) ? 0 : clientXArg;
          clientY = (clientYArg === undefined) ? 0 : clientYArg;
          //modifier keys are false
          ctrlKey = ctrlKeyArg === true;
          altKey = altKeyArg === true;
          shiftKey = shiftKeyArg === true;
          metaKey = metaKeyArg === true;
          //else
          button = (buttonArg === undefined) ? 0 : buttonArg;
          relatedTarget = (relatedTargetArg === undefined) ? null : relatedTargetArg;
          
          /*DEBUG*/
          check_string_type(type, this+'.initMouseEvent', '*type*');
          check_boolean_type(bubbles, this+'.initMouseEvent', '*bubbles*');
          check_boolean_type(cancelable, this+'.initMouseEvent', '*cancelable*');
          check_number_type(detail, this+'.initMouseEvent', '*detail*');
          check_number_type(screenX, this+'.initMouseEvent', '*screenX*');
          check_number_type(screenY, this+'.initMouseEvent', '*screenY*');
          check_number_type(clientX, this+'.initMouseEvent', '*clientX*');
          check_number_type(clientY, this+'.initMouseEvent', '*clientY*');
          check_boolean_type(ctrlKey, this+'.initMouseEvent', '*ctrlKey*');
          check_boolean_type(altKey, this+'.initMouseEvent', '*altKey*');
          check_boolean_type(shiftKey, this+'.initMouseEvent', '*shiftKey*');
          check_boolean_type(metaKey, this+'.initMouseEvent', '*metaKey*');
          check_number_type(button, this+'.initMouseEvent', '*button*');
          /*END_DEBUG*/
          
          this.initUIEvent(type, bubbles, cancelable, view, detail);
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
    mouseevent.initMouseEvent(type, bubbles, cancelable, view, detail,
                              screenX, screenY, clientX, clientY, 
                              ctrlKey, altKey, shiftKey, metaKey,
                              button, relatedTarget);
    
    return mouseevent;
  };
    
  //static
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

}());//end class closure
