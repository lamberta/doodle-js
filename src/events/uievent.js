
/* DOM 2 Event: UIEvent:Event
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-Events-UIEvent
 */

(function () {
  var uievent_properties,
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
   *
   * @alternative instantiation
   * @param {Event} initializer event to wrap
   *
   * @return {UIEvent}
   */
  doodle.UIEvent = function (type, bubbles, cancelable, view, detail) {
    var arg_len = arguments.length,
        initializer, //if passed another event object
        uievent, //super-object to construct
        //read-only properties
        which = 0,
        charCode = 0,
        keyCode = 0,
        layerX = 0,
        layerY = 0,
        pageX = 0,
        pageY = 0;

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0]; //event object
      
      //copy event properties to our args that'll be used for initialization
      //initUIEvent() will typecheck these
      type = initializer.type;
      bubbles = initializer.bubbles;
      cancelable = initializer.cancelable;
      view = initializer.view;
      detail = initializer.detail;
      //initUIEvent() won't touch these
      which = initializer.which || 0;
      charCode = initializer.charCode || 0;
      keyCode = initializer.keyCode || 0;
      layerX = initializer.layerX || 0;
      layerY = initializer.layerY || 0;
      pageX = initializer.pageX || 0;
      pageY = initializer.pageY || 0;

      //init uiobject with event
      uievent = Object.create(doodle.Event(initializer));
      
    } else if (arg_len === 0 || arg_len > 5) {
      //check arg count
      throw new SyntaxError("[object UIEvent]: Invalid number of parameters.");
    } else {
      //regular instantiation of prototype
      bubbles = bubbles === true; //false
      cancelable = cancelable === true;

      /*DEBUG*/
      check_string_type(type, '[object UIEvent].constructor', '*type*');
      check_boolean_type(bubbles, '[object UIEvent].constructor', '*bubbles*');
      check_boolean_type(cancelable, '[object UIEvent].constructor', '*cancelable*');
      /*END_DEBUG*/
      uievent = Object.create(doodle.Event(type, bubbles, cancelable));
    }
    
    Object.defineProperties(uievent, uievent_properties);
    Object.defineProperties(uievent, {
      /* PROPERTIES
       */
      'view': {
        enumerable: true,
        configurable: false,
        get: function () { return view; }
      },

      'detail': {
        enumerable: true,
        configurable: false,
        get: function () { return detail; }
      },

      'which': {
        enumerable: true,
        configurable: false,
        get: function () { return which; }
      },

      'charCode': {
        enumerable: true,
        configurable: false,
        get: function () { return charCode; }
      },

      'keyCode': {
        enumerable: true,
        configurable: false,
        get: function () { return keyCode; }
      },

      'layerX': {
        enumerable: true,
        configurable: false,
        get: function () { return layerX; }
      },

      'layerY': {
        enumerable: true,
        configurable: false,
        get: function () { return layerY; }
      },

      'pageX': {
        enumerable: true,
        configurable: false,
        get: function () { return pageX; }
      },

      'pageY': {
        enumerable: true,
        configurable: false,
        get: function () { return pageY; }
      },

      /* METHODS
       */
      'initUIEvent': {
        value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg) {
          //parameter defaults
          type = typeArg;
          bubbles = canBubbleArg === true; //false
          cancelable = cancelableArg === true;
          view = (viewArg === undefined) ? null : viewArg;
          detail = (detailArg === undefined) ? 0 : detailArg;

          /*DEBUG*/
          check_string_type(type, this+'.initUIEvent', '*type*');
          check_boolean_type(bubbles, this+'.initUIEvent', '*bubbles*');
          check_boolean_type(cancelable, this+'.initUIEvent', '*cancelable*');
          check_number_type(detail, this+'.initUIEvent', '*detail*');
          /*END_DEBUG*/
          
          this.initEvent(type, bubbles, cancelable);
          return this;
        }
      }

    });

    //init event
    uievent.initUIEvent(type, bubbles, cancelable, view, detail);
    
    return uievent;
  };

  //static
  uievent_properties = {
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object UIEvent]";
      }
    }
  };

}());//end class closure
