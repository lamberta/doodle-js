/*globals doodle*/

/* TouchEvent support is expermental.
 * http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html
 */
(function () {
  var touchevent_static_properties,
      isTouchEvent,
      /*DEBUG*/
      check_touchevent_type,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      /*END_DEBUG*/
      isEvent = doodle.Event.isEvent;
  
  /**
   * @class doodle.TouchEvent
   * @extends UIEvent
   * @constructor
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {number=} detail
   * @param {number=} screenX
   * @param {number=} screenY
   * @param {number=} clientX
   * @param {number=} clientY
   * @param {boolean=} ctrlKey
   * @param {boolean=} altKey
   * @param {boolean=} shiftKey
   * @param {boolean=} metaKey
   * @param {Array=} touches ?
   * @param {Array=} targetTouches ?
   * @param {Array=} changedTouches ?
   * @param {number=} scale
   * @param {number=} rotation
   * @return {doodle.TouchEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.TouchEvent = function (type, bubbles, cancelable, view, detail,
                                screenX, screenY, clientX, clientY,
                                ctrlKey, altKey, shiftKey, metaKey,
                                touches, targetTouches, changedTouches,
                                scale, rotation) {
    var touchevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_touchevent_properties; //fn declared per event for private vars
    
    /*DEBUG*/
    if (arg_len === 0 || arg_len > 18) {
      throw new SyntaxError("[object TouchEvent](type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TouchEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      touchevent = Object.create(doodle.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TouchEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      touchevent = Object.create(doodle.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      detail = (detail === undefined) ? 0 : detail;
      /*DEBUG*/
      check_string_type(type, '[object TouchEvent]', '*type*, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
      check_boolean_type(bubbles, '[object TouchEvent]', 'type, *bubbles*, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
      check_boolean_type(cancelable, '[object TouchEvent]', 'type, bubbles, *cancelable*, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
      check_number_type(detail, '[object TouchEvent]', 'type, bubbles, cancelable, view, *detail*, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
      /*END_DEBUG*/
      touchevent = Object.create(doodle.UIEvent(type, bubbles, cancelable, view, detail));
    }
    
    Object.defineProperties(touchevent, touchevent_static_properties);
    //properties that require privacy
    Object.defineProperties(touchevent, (function () {
      var evt_screenX = 0,
          evt_screenY = 0,
          evt_clientX = 0,
          evt_clientY = 0,
          evt_ctrlKey = false,
          evt_altKey = false,
          evt_shiftKey = false,
          evt_metaKey = false,
          evt_touches = null,
          evt_targetTouches = null,
          evt_changedTouches = null,
          evt_scale = 1,
          evt_rotation = 0;

      /**
       * @name copy_touchevent_properties
       * @param {TouchEvent} evt TouchEvent to copy properties from.
       * @private
       */
      copy_touchevent_properties = function (evt) {
        /*DEBUG*/
        check_touchevent_type(evt, 'copy_touchevent_properties', '*event*');
        /*END_DEBUG*/
        if (evt.screenX !== undefined) { evt_screenX = evt.screenX; }
        if (evt.screenY !== undefined) { evt_screenY = evt.screenY; }
        if (evt.clientX !== undefined) { evt_clientX = evt.clientX; }
        if (evt.clientY !== undefined) { evt_clientY = evt.clientY; }
        if (evt.ctrlKey !== undefined) { evt_ctrlKey = evt.ctrlKey; }
        if (evt.altKey !== undefined) { evt_altKey = evt.altKey; }
        if (evt.shiftKey !== undefined) { evt_shiftKey = evt.shiftKey; }
        if (evt.metaKey !== undefined) { evt_metaKey = evt.metaKey; }
        if (evt.touches !== undefined) { evt_touches = evt.touches; }
        if (evt.targetTouches !== undefined) { evt_targetTouches = evt.targetTouches; }
        if (evt.changedTouches !== undefined) { evt_changedTouches = evt.changedTouches; }
        if (evt.scale !== undefined) { evt_scale = evt.scale; }
        if (evt.rotation !== undefined) { evt_rotation = evt.rotation; }
      };
      
      return {
        /**
         * @name screenX
         * @return {number} [read-only]
         * @property
         */
        'screenX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_screenX; }
        },

        /**
         * @name screenY
         * @return {number} [read-only]
         * @property
         */
        'screenY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_screenY; }
        },

        /**
         * @name clientX
         * @return {number} [read-only]
         * @property
         */
        'clientX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_clientX; }
        },

        /**
         * @name clientY
         * @return {number} [read-only]
         * @property
         */
        'clientY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_clientY; }
        },

        /**
         * @name ctrlKey
         * @return {boolean} [read-only]
         * @property
         */
        'ctrlKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_ctrlKey; }
        },

        /**
         * @name altKey
         * @return {boolean} [read-only]
         * @property
         */
        'altKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_altKey; }
        },

        /**
         * @name shiftKey
         * @return {boolean} [read-only]
         * @property
         */
        'shiftKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_shiftKey; }
        },

        /**
         * @name metaKey
         * @return {boolean} [read-only]
         * @property
         */
        'metaKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_metaKey; }
        },

        /**
         * @name touches
         * @return {Array} [read-only]
         * @property
         */
        'touches': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_touches; }
        },

        /**
         * @name targetTouches
         * @return {Array} [read-only]
         * @property
         */
        'targetTouches': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_targetTouches; }
        },

        /**
         * @name changedTouches
         * @return {Array} [read-only]
         * @property
         */
        'changedTouches': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_changedTouches; }
        },

        /**
         * @name scale
         * @return {number} [read-only]
         * @property
         */
        'scale': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_scale; }
        },

        /**
         * @name rotation
         * @return {number} [read-only]
         * @property
         */
        'rotation': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_rotation; }
        },

        /**
         * @name initTouchEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} viewArg
         * @param {number} detailArg
         * @param {number} screenXArg
         * @param {number} screenYArg
         * @param {number} clientXArg
         * @param {number} clientYArg
         * @param {boolean} ctrlKeyArg
         * @param {boolean} altKeyArg
         * @param {boolean} shiftKeyArg
         * @param {boolean} metaKeyArg
         * @param {Array} touchesArg
         * @param {Array} targetTouchesArg
         * @param {Array} changedTouchesArg
         * @param {number} scaleArg
         * @param {number} rotationArg
         * @return {TouchEvent}
         * @throws {TypeError}
         */
        'initTouchEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg,
                           screenXArg, screenYArg, clientXArg, clientYArg,
                           ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg,
                           touchesArg, targetTouchesArg, changedTouchesArg,
                           scaleArg, rotationArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            detailArg = (detailArg === undefined) ? 0 : detailArg;
            screenXArg = (screenXArg === undefined) ? 0 : screenXArg;
            screenYArg = (screenYArg === undefined) ? 0 : screenYArg;
            clientXArg = (clientXArg === undefined) ? 0 : clientXArg;
            clientYArg = (clientYArg === undefined) ? 0 : clientYArg;
            ctrlKeyArg = (ctrlKeyArg === undefined) ? false : ctrlKeyArg;
            altKeyArg = (altKeyArg === undefined) ? false : altKeyArg;
            shiftKeyArg = (shiftKeyArg === undefined) ? false : shiftKeyArg;
            metaKeyArg = (metaKeyArg === undefined) ? false : metaKeyArg;
            touchesArg = (touchesArg === undefined) ? null : touchesArg;
            targetTouchesArg = (targetTouchesArg === undefined) ? null : targetTouchesArg;
            changedTouchesArg = (changedTouchesArg === undefined) ? null : changedTouchesArg;
            scaleArg = (scaleArg === undefined) ? 1 : scaleArg;
            rotationArg = (rotationArg === undefined) ? 0 : rotationArg;
            /*DEBUG*/
            check_string_type(typeArg, this+'.initTouchEvent', '*type*, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_boolean_type(canBubbleArg, this+'.initTouchEvent', 'type, *bubbles*, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_boolean_type(cancelableArg, this+'.initTouchEvent', 'type, bubbles, *cancelable*, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_number_type(detailArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, *detail*, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_number_type(screenXArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, *screenX*, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_number_type(screenYArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, *screenY*, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_number_type(clientXArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, screenY, *clientX*, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_number_type(clientYArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, screenY, clientX, *clientY*, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_boolean_type(ctrlKeyArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, *ctrlKey*, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_boolean_type(altKeyArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, *altKey*, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_boolean_type(shiftKeyArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, *shiftKey*, metaKey, touches, targetTouches, changedTouches, scale, rotation');
            check_boolean_type(metaKeyArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, *metaKey*, touches, targetTouches, changedTouches, scale, rotation');
            check_number_type(scaleArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, *scale*, rotation');
            check_number_type(rotationArg, this+'.initTouchEvent', 'type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, *rotation*');
            /*END_DEBUG*/
            evt_screenX = screenXArg;
            evt_screenY = screenYArg;
            evt_clientX = clientXArg;
            evt_clientY = clientYArg;
            evt_ctrlKey = ctrlKeyArg;
            evt_altKey = altKeyArg;
            evt_shiftKey = shiftKeyArg;
            evt_metaKey = metaKeyArg;
            evt_touches = touchesArg;
            evt_targetTouches = targetTouchesArg;
            evt_changedTouches = changedTouchesArg;
            evt_scale = scaleArg;
            evt_rotation = rotationArg;

            this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg, detailArg);
            return this;
          }
        },

        /**
         * Queries the state of a modifier using a key identifier.
         * @name getModifierState
         * @param {string} key A modifier key identifier
         * @return {boolean} True if it is a modifier key and the modifier is activated, false otherwise.
         * @throws {TypeError}
         */
        'getModifierState': {
          value: function (key) {
            /*DEBUG*/
            check_string_type(key, this+'.getModifierState', '*key*');
            /*END_DEBUG*/
            switch (key) {
            case 'Alt':
              return evt_altKey;
            case 'Control':
              return evt_ctrlKey;
            case 'Meta':
              return evt_metaKey;
            case 'Shift':
              return evt_shiftKey;
            default:
              return false;
            }
          }
        },

        /**
         * Copy the properties from another TouchEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyTouchEventProperties
         * @param {TouchEvent} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @return {TouchEvent}
         * @throws {TypeError}
         * @private
         */
        '__copyTouchEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            check_touchevent_type(evt, this+'.__copyTouchEventProperties', '*event*, target, type');
            if (resetTarget !== false && resetTarget !== null) {
              check_node_type(evt, this+'.__copyTouchEventProperties', 'event, *target*, type');
            }
            if (resetType !== false) {
              check_string_type(resetType, this+'.__copyTouchEventProperties', 'event, target, *type*');
            }
            /*END_DEBUG*/
            copy_touchevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));//end defineProperties


    //initialize touchevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(touchevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (touchevent.type === undefined || touchevent.type === '' ||
            touchevent.bubbles === undefined ||
            touchevent.cancelable === undefined) {
          throw new SyntaxError("[object TouchEvent](function): Must call 'this.initTouchEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_touchevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      touchevent.initTouchEvent(type, bubbles, cancelable, view, detail,
                                screenX, screenY, clientX, clientY,
                                ctrlKey, altKey, shiftKey, metaKey,
                                touches, targetTouches, changedTouches, scale, rotation);
    }
    
    return touchevent;
  };
    
  
  touchevent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object TouchEvent]"; }
    }
  };

  /*
   * CLASS METHODS
   */

  /**
   * Test if an object is a TouchEvent.
   * @name isTouchEvent
   * @param {TouchEvent} event
   * @return {boolean}
   * @static
   */
  isTouchEvent = doodle.TouchEvent.isTouchEvent = function (event) {
    if (!event || typeof event !== 'object' || typeof event.toString !== 'function') {
      return false;
    } else {
      event = event.toString();
    }
    return (event === '[object TouchEvent]');
  };

  /*DEBUG*/
  /**
   * @name check_touchevent_type
   * @param {TouchEvent} event
   * @param {string} caller
   * @param {string} params
   * @return {boolean}
   * @throws {TypeError}
   * @memberOf utils.types
   * @static
   */
  check_touchevent_type = doodle.utils.types.check_touchevent_type = function (event, caller, params) {
    if (isTouchEvent(event)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_touchevent_type" : caller;
      params = (params === undefined) ? "" : '('+params+')';
      throw new TypeError(caller + params +": Parameter must be an TouchEvent.");
    }
  };
  /*END_DEBUG*/

}());//end class closure
