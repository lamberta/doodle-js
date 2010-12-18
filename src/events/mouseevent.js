/*globals doodle*/

/* DOM 2 Event: MouseEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-mouseevents
 */
(function () {
  var mouseevent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.MouseEvent
   * @class
   * @augments doodle.events.UIEvent
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
   * @param {number=} button Mouse button that caused the event (0|1|2)
   * @param {Node=} relatedTarget Secondary target for event (only for some events)
   * @return {doodle.events.MouseEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.MouseEvent = function (type, bubbles, cancelable, view, detail,
                                       screenX, screenY, clientX, clientY,
                                       ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) {
    var mouseevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_mouseevent_properties; //fn declared per event for private vars
    
    /*DEBUG*/
    if (arg_len === 0 || arg_len > 15) {
      throw new SyntaxError("[object MouseEvent](type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object MouseEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      mouseevent = Object.create(doodle.events.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object MouseEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      mouseevent = Object.create(doodle.events.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      detail = (detail === undefined) ? 0 : detail;
      /*DEBUG*/
      type_check(type, 'string', bubbles, 'boolean', cancelable, 'boolean', view, '*', detail, 'number', screenX, '*', screenY, '*', clientX, '*', clientY, '*', ctrlKey, '*', altKey, '*', shiftKey, '*', metaKey, '*', button, '*', relatedTarget, '*',
                 {label:'MouseEvent', id:this.toString()+"[type="+this.type+"]", params:['type','bubbles','cancelable','view','detail','screenX','screenY', 'clientX','clientY','ctrlKey','altKey','shiftKey','metaKey', 'button','relatedTarget']});
      /*END_DEBUG*/
      mouseevent = Object.create(doodle.events.UIEvent(type, bubbles, cancelable, view, detail));
    }
    
    Object.defineProperties(mouseevent, mouseevent_static_properties);
    //properties that require privacy
    Object.defineProperties(mouseevent, (function () {
      var evt_x = 0,
          evt_y = 0,
          evt_offsetX = 0,
          evt_offsetY = 0,
          evt_screenX = 0,
          evt_screenY = 0,
          evt_clientX = 0,
          evt_clientY = 0,
          evt_ctrlKey = false,
          evt_altKey = false,
          evt_shiftKey = false,
          evt_metaKey = false,
          evt_button = 0,
          evt_relatedTarget = null;

      /**
       * @name copy_mouseevent_properties
       * @param {doodle.events.MouseEvent} evt MouseEvent to copy properties from.
       * @throws {TypeError}
       * @private
       */
      copy_mouseevent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.MouseEvent.isMouseEvent(evt), "evt is MouseEvent.", this.toString()+"[type="+this.type+"]", evt);
        /*END_DEBUG*/
        evt_x = (evt.x !== undefined) ? evt.x : 0;
        evt_y = (evt.y !== undefined) ? evt.y : 0;
        evt_offsetX = (evt.offsetX !== undefined) ? evt.offsetX : 0;
        evt_offsetY = (evt.offsetY !== undefined) ? evt.offsetY : 0;
        if (evt.screenX !== undefined) { evt_screenX = evt.screenX; }
        if (evt.screenY !== undefined) { evt_screenY = evt.screenY; }
        if (evt.clientX !== undefined) { evt_clientX = evt.clientX; }
        if (evt.clientY !== undefined) { evt_clientY = evt.clientY; }
        if (evt.ctrlKey !== undefined) { evt_ctrlKey = evt.ctrlKey; }
        if (evt.altKey !== undefined) { evt_altKey = evt.altKey; }
        if (evt.shiftKey !== undefined) { evt_shiftKey = evt.shiftKey; }
        if (evt.metaKey !== undefined) { evt_metaKey = evt.metaKey; }
        if (evt.button !== undefined) { evt_button = evt.button; }
        if (evt.relatedTarget !== undefined) { evt_relatedTarget = evt.relatedTarget; }
      };
      
      return {
        /**
         * @name x
         * @return {number} [read-only]
         * @property
         */
        'x': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_x; }
        },

        /**
         * @name y
         * @return {number} [read-only]
         * @property
         */
        'y': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_y; }
        },

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
         * @name offsetX
         * @return {number} [read-only]
         * @property
         */
        'offsetX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_offsetX; }
        },

        /**
         * @name offsetY
         * @return {number} [read-only]
         * @property
         */
        'offsetY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_offsetY; }
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
         * @name button
         * @return {number} [read-only]
         * @property
         */
        'button': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_button; }
        },

        /**
         * @name relatedTarget
         * @return {Node} [read-only]
         * @property
         */
        'relatedTarget': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_relatedTarget; }
        },

        /**
         * @name initMouseEvent
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
         * @param {number} buttonArg
         * @param {Node} relatedTargetArg
         * @return {doodle.events.MouseEvent}
         * @throws {TypeError}
         */
        'initMouseEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg,
                           screenXArg, screenYArg, clientXArg, clientYArg,
                           ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg,
                           buttonArg, relatedTargetArg) {
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
            buttonArg = (buttonArg === undefined) ? 0 : buttonArg;
            relatedTarget = (relatedTargetArg === undefined) ? null : relatedTargetArg;
            /*DEBUG*/
            type_check(typeArg, 'string', canBubbleArg, 'boolean', canBubbleArg, 'boolean', viewArg, '*', detailArg, 'number', screenXArg, 'number', screenYArg, 'number', clientXArg, 'number', clientYArg, 'number', ctrlKeyArg, 'boolean', altKeyArg, 'boolean', shiftKeyArg, 'boolean', metaKeyArg, 'boolean', buttonArg, 'number', relatedTargetArg, '*',
                       {label:'MouseEvent.initMouseEvent', id:this.toString()+"[type="+this.type+"]",
                        params:['typeArg','canBubbleArg','cancelableArg','viewArg','detailArg','screenXArg','screenYArg','clientXArg','clientYArg','ctrlKeyArg','altKeyArg','shiftKeyArg','metaKeyArg','buttonArg','relatedTargetArg']});
            /*END_DEBUG*/
            evt_screenX = screenXArg;
            evt_screenY = screenYArg;
            evt_clientX = clientXArg;
            evt_clientY = clientYArg;
            evt_ctrlKey = ctrlKeyArg;
            evt_altKey = altKeyArg;
            evt_shiftKey = shiftKeyArg;
            evt_metaKey = metaKeyArg;
            evt_button = buttonArg;
            evt_relatedTarget = relatedTargetArg;
            return this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg, detailArg);
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
            type_check(key, 'string', {label:'MouseEvent.getModifierState', params:'key', id:this.toString()+"[type="+this.type+"]"});
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
         * Copy the properties from another MouseEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyMouseEventProperties
         * @param {doodle.events.MouseEvent} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @return {doodle.events.MouseEvent}
         * @throws {TypeError}
         * @private
         */
        '__copyMouseEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.MouseEvent.isMouseEvent(evt), "evt is MouseEvent");
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
            /*END_DEBUG*/
            copy_mouseevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));//end defineProperties


    //initialize mouseevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(mouseevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (mouseevent.type === undefined || mouseevent.type === '' ||
            mouseevent.bubbles === undefined || mouseevent.cancelable === undefined) {
          throw new SyntaxError("[object MouseEvent](function): Must call 'this.initMouseEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_mouseevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      mouseevent.initMouseEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
    }
    
    return mouseevent;
  };
    
  mouseevent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object MouseEvent]"; }
    }
  };

}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a MouseEvent.
 * @name isMouseEvent
 * @param {doodle.events.MouseEvent} event
 * @return {boolean}
 * @static
 */
doodle.events.MouseEvent.isMouseEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object MouseEvent]' || (evt.constructor && evt.constructor.name === 'MouseEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};
