
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
        initializer,
        uievent,
        //default ui-event read-only properties
        e_view = null,
        e_detail = 0,
        e_which = 0,
        e_charCode = 0,
        e_keyCode = 0,
        e_layerX = 0,
        e_layerY = 0,
        e_pageX = 0,
        e_pageY = 0;

    //check if given an init event to wrap
    if (arg_len === 1 && isEvent(arguments[0])) {
      initializer = arguments[0];
      //handle properties derived from UIEvent objects
      if (initializer.toString() === '[object UIEvent]' ||
          initializer.toString() === '[object MouseEvent]') {
        //copy properties over - we'll check these when we init the new event
        type = initializer.type;
        bubbles = initializer.bubbles;
        cancelable = initializer.cancelable;
        view = initializer.view;
        detail = initializer.detail;
        //the rest we'll have to assume the previous event is good
        e_which = initializer.which;
        e_charCode = initializer.charCode;
        e_keyCode = initializer.keyCode;
        e_layerX = initializer.layerX;
        e_layerY = initializer.layerY;
        e_pageX = initializer.pageX;
        e_pageY = initializer.pageY;
      }
      //init uiobject with event
      uievent = Object.create(doodle.Event(initializer));
      
    } else if (arg_len === 0 || arg_len > 5) {
      //check arg count
      throw new SyntaxError("[object UIEvent]: Invalid number of parameters.");
    } else {
      //regular instantiation
      uievent = Object.create(doodle.Event(type, bubbles, cancelable));
    }
    
    Object.defineProperties(uievent, uievent_properties);
    Object.defineProperties(uievent, {
      /* PROPERTIES
       */
      'view': {
        enumerable: true,
        configurable: false,
        get: function () { return e_view; }
      },

      'detail': {
        enumerable: true,
        configurable: false,
        get: function () { return e_detail; }
      },

      'which': {
        enumerable: true,
        configurable: false,
        get: function () { return e_which; }
      },

      'charCode': {
        enumerable: true,
        configurable: false,
        get: function () { return e_charCode; }
      },

      'keyCode': {
        enumerable: true,
        configurable: false,
        get: function () { return e_keyCode; }
      },

      'layerX': {
        enumerable: true,
        configurable: false,
        get: function () { return e_layerX; }
      },

      'layerY': {
        enumerable: true,
        configurable: false,
        get: function () { return e_layerY; }
      },

      'pageX': {
        enumerable: true,
        configurable: false,
        get: function () { return e_pageX; }
      },

      'pageY': {
        enumerable: true,
        configurable: false,
        get: function () { return e_pageY; }
      },

      /* METHODS
       */
      'initUIEvent': {
        value: function (type, bubbles, cancelable, view, detail) {
          //parameter defaults
          bubbles = bubbles === true; //false
          cancelable = cancelable === true; //false
          e_view = (view === undefined) ? null : view;
          e_detail = (detail === undefined) ? 0 : detail;
          //type-check
          check_string_type(type, this+'.initUIEvent');
          check_boolean_type(bubbles, this+'.initUIEvent');
          check_boolean_type(cancelable, this+'.initUIEvent');
          check_number_type(e_detail, this+'.initUIEvent');
          
          this.initEvent(type, bubbles, cancelable);
          return this;
        }
      }

    });

    //init event
    uievent.initUIEvent(type, bubbles, cancelable, view, detail);
    
    return uievent;
  };
    
  
  (function () {

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

  }());

  //constants
  Object.defineProperties(doodle.UIEvent, {

    'FOCUS_IN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "focusIn"
    }
    
  });

}());//end class closure
