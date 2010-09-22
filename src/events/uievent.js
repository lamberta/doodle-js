/*globals doodle*/

/* DOM 2 Event: UIEvent:Event
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-Events-UIEvent
 */
(function () {
  var uievent_static_properties,
      isUIEvent,
      /*DEBUG*/
      check_uievent_type,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      /*END_DEBUG*/
      isEvent = doodle.Event.isEvent;
  
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
    var uievent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_uievent_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 5) {
      throw new SyntaxError("[object UIEvent](type, bubbles, cancelable, view, detail): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object UIEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      uievent = Object.create(doodle.Event(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object UIEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      uievent = Object.create(doodle.Event(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      /*DEBUG*/
      check_string_type(type, '[object UIEvent]', '*type*, bubbles, cancelable, view, detail');
      check_boolean_type(bubbles, '[object UIEvent]', 'type, *bubbles*, cancelable, view, detail');
      check_boolean_type(cancelable, '[object UIEvent]', 'type, bubbles, *cancelable*, view, detail');
      /*END_DEBUG*/
      uievent = Object.create(doodle.Event(type, bubbles, cancelable));
    }
    
    Object.defineProperties(uievent, uievent_static_properties);
    //properties that require privacy
    Object.defineProperties(uievent, (function () {
      var evt_view = null,
          evt_detail = 0,
          evt_which = 0,
          evt_charCode = 0,
          evt_keyCode = 0,
          evt_layerX = 0,
          evt_layerY = 0,
          evt_pageX = 0,
          evt_pageY = 0;

      /* @param {UIEvent} evt UIEvent to copy properties from.
       */
      copy_uievent_properties = function (evt) {
        /*DEBUG*/
        check_uievent_type(evt, 'copy_uievent_properties', '*event*');
        /*END_DEBUG*/
        if (evt.view !== undefined) { evt_view = evt.view; }
        if (evt.detail !== undefined) { evt_detail = evt.detail; }
        if (evt.which !== undefined) { evt_which = evt.which; }
        if (evt.charCode !== undefined) { evt_charCode = evt.charCode; }
        if (evt.keyCode !== undefined) { evt_keyCode = evt.keyCode; }
        if (evt.layerX !== undefined) { evt_layerX = evt.layerX; }
        if (evt.layerY !== undefined) { evt_layerY = evt.layerY; }
        if (evt.pageX !== undefined) { evt_pageX = evt.pageX; }
        if (evt.pageY !== undefined) { evt_pageY = evt.pageY; }
      };
      
      return {
        'view': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_view; }
        },

        'detail': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_detail; }
        },

        'which': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_which; }
        },

        'charCode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_charCode; }
        },

        'keyCode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_keyCode; }
        },

        'layerX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_layerX; }
        },

        'layerY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_layerY; }
        },

        'pageX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_pageX; }
        },

        'pageY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_pageY; }
        },
        
        'initUIEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            detailArg = (detailArg === undefined) ? 0 : detailArg;
            /*DEBUG*/
            check_string_type(typeArg, this+'.initUIEvent', '*type*, bubbles, cancelable, view, detail');
            check_boolean_type(canBubbleArg, this+'.initUIEvent', 'type, *bubbles*, cancelable, view, detail');
            check_boolean_type(cancelableArg, this+'.initUIEvent', 'type, bubbles, *cancelable*, view, detail');
            check_number_type(detailArg, this+'.initUIEvent', 'type, bubbles, cancelable, view, *detail*');
            /*END_DEBUG*/
            evt_view = viewArg;
            evt_detail = detailArg;
            
            this.initEvent(typeArg, canBubbleArg, cancelableArg);
            return this;
          }
        },

        /* Copy the properties from another UIEvent.
         * Allows for the reuse of this object for further dispatch.
         * @internal
         * @param {UIEvent} evt
         * @param {Node=} resetTarget
         * @param {String=} resetType
         */
        '__copyUIEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            check_uievent_type(evt, this+'.__copyUIEventProperties', '*event*, target, type');
            if (resetTarget !== false && resetTarget !== null) {
              check_node_type(evt, this+'.__copyUIEventProperties', 'event, *target*, type');
            }
            if (resetType !== false) {
              check_string_type(resetType, this+'.__copyUIEventProperties', 'event, target, *type*');
            }
            /*END_DEBUG*/
            copy_uievent_properties(evt);
            return this.__copyEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));//end defineProperties

    
    //initialize uievent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(uievent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (uievent.type === undefined || uievent.type === '' ||
            uievent.bubbles === undefined ||
            uievent.cancelable === undefined) {
          throw new SyntaxError("[object UIEvent](function): Must call 'this.initUIEvent(type, bubbles, cancelable, view, detail)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_uievent_properties(init_obj);
      }
    } else {
      //standard instantiation
      uievent.initUIEvent(type, bubbles, cancelable, view, detail);
    }
    
    return uievent;
  };

  
  uievent_static_properties = {
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object UIEvent]";
      }
    }
  };

  /*
   * CLASS METHODS
   */

  isUIEvent = doodle.UIEvent.isUIEvent = function (event) {
    if (!event || typeof event !== 'object' || typeof event.toString !== 'function') {
      return false;
    } else {
      event = event.toString();
    }
    return (event === '[object UIEvent]' ||
            event === '[object MouseEvent]' ||
            event === '[object TouchEvent]' ||
            event === '[object KeyboardEvent]' ||
            event === '[object TextEvent]' ||
            event === '[object WheelEvent]');
  };

  /*DEBUG*/
  check_uievent_type = doodle.utils.types.check_uievent_type = function (event, caller, param) {
    if (isUIEvent(event)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_uievent_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be an UIEvent.");
    }
  };
  /*END_DEBUG*/

}());//end class closure
