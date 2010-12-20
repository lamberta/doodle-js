/*globals doodle*/

/* DOM 3 Event: KeyboardEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 */
(function () {
  var keyboardevent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.KeyboardEvent
   * @class
   * @augments doodle.events.UIEvent
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {string=} keyIdentifier
   * @param {number=} keyLocation
   * @param {string=} modifiersList White-space separated list of key modifiers.
   * @param {boolean=} repeat
   * @return {doodle.events.KeyboardEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.KeyboardEvent = function (type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat) {
    var keyboardevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_keyboardevent_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 8) {
      throw new SyntaxError("[object KeyboardEvent](type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object KeyboardEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      keyboardevent = Object.create(doodle.events.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object KeyboardEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      keyboardevent = Object.create(doodle.events.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      /*DEBUG*/
      type_check(type, 'string', bubbles, 'boolean', cancelable, 'boolean', view, '*', keyIdentifier, '*', keyLocation, '*', modifiersList, '*', repeat, '*',
                 {label:'KeyboardEvent', params:['type','bubbles','cancelable','view','keyIdentifier','keyLocation','modifiersList','repeat'], id:this.id});
      /*END_DEBUG*/
      keyboardevent = Object.create(doodle.events.UIEvent(type, bubbles, cancelable, view));
    }
    
    Object.defineProperties(keyboardevent, keyboardevent_static_properties);
    //properties that require privacy
    Object.defineProperties(keyboardevent, (function () {
      var evt_keyIdentifier = "",
          evt_keyLocation = 0,
          evt_repeat = false,
          evt_ctrlKey = false,
          evt_altKey = false,
          evt_shiftKey = false,
          evt_metaKey = false,
          evt_altGraphKey = false;

      /**
       * @name copy_keyboardevent_properties
       * @param {doodle.events.KeyboardEvent} evt KeyboardEvent to copy properties from.
       * @throws {TypeError}
       * @private
       */
      copy_keyboardevent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.KeyboardEvent.isKeyboardEvent(evt), "evt is KeyboardEvent");
        /*END_DEBUG*/
        if (evt.keyIdentifier !== undefined) { evt_keyIdentifier = evt.keyIdentifier; }
        if (evt.keyLocation !== undefined) { evt_keyLocation = evt.keyLocation; }
        if (evt.repeat !== undefined) { evt_repeat = evt.repeat; }
        if (evt.ctrlKey !== undefined) { evt_ctrlKey = evt.ctrlKey; }
        if (evt.altKey !== undefined) { evt_altKey = evt.altKey; }
        if (evt.shiftKey !== undefined) { evt_shiftKey = evt.shiftKey; }
        if (evt.metaKey !== undefined) { evt_metaKey = evt.metaKey; }
        if (evt.altGraphKey !== undefined) { evt_altKey = evt.altGraphKey; }
      };
      
      return {
        /**
         * @name keyIdentifier
         * @return {string} [read-only]
         * @property
         */
        'keyIdentifier': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_keyIdentifier; }
        },

        /**
         * @name keyLocation
         * @return {number} [read-only]
         * @property
         */
        'keyLocation': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_keyLocation; }
        },

        /**
         * @name repeat
         * @return {boolean} [read-only]
         * @property
         */
        'repeat': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_repeat; }
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
         * @name altGraphKey
         * @return {boolean} [read-only]
         * @property
         */
        'altGraphKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_altGraphKey; }
        },
        
        /**
         * @name initKeyboardEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} viewArg
         * @param {string} keyIdentifierArg
         * @param {number} keyLocationArg
         * @param {string} modifiersListArg
         * @param {boolean} repeatArg
         * @return {doodle.events.Event}
         * @throws {TypeError}
         */
        'initKeyboardEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, keyIdentifierArg, keyLocationArg, modifiersListArg, repeatArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            keyIdentifierArg = (keyIdentifierArg === undefined) ? "" : keyIdentifierArg;
            keyLocationArg = (keyLocationArg === undefined) ? 0 : keyLocationArg;
            modifiersListArg = (modifiersListArg === undefined) ? "" : modifiersListArg;
            repeatArg = (repeatArg === undefined) ? false : repeatArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg,'boolean', viewArg,'*', keyIdentifierArg,'string', keyLocationArg,'number', modifiersListArg,'string', repeatArg,'boolean',
                       {label:'KeyboardEvent.initKeyboardEvent', id:this.id, params:['typeArg','canBubbleArg','cancelableArg','viewArg','keyIdentifierArg','keyLocationArg','modifiersListArg','repeatArg']});
            /*END_DEBUG*/
            evt_keyIdentifier = keyIdentifierArg;
            evt_keyLocation = keyLocationArg;
            evt_repeat = repeatArg;
            //parse string of white-space separated list of modifier key identifiers
            modifiersListArg.split(" ").forEach(function (modifier) {
              switch (modifier) {
              case 'Alt':
                evt_altKey = true;
                break;
              case 'Control':
                evt_ctrlKey = true;
                break;
              case 'Meta':
                evt_metaKey = true;
                break;
              case 'Shift':
                evt_shiftKey = true;
                break;
              }
            });
            this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg);
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
            type_check(key,'string', {label:'KeyboardEvent.getModifierState', params:'key', id:this.id});
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
         * Copy the properties from another KeyboardEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyKeyboardEventProperties
         * @param {doodle.events.KeyboardEvent} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @return {doodle.events.KeyboardEvent}
         * @throws {TypeError}
         * @private
         */
        '__copyKeyboardEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.KeyboardEvent.isKeyboardEvent(evt), "evt is KeyboardEvent");
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
            /*END_DEBUG*/
            copy_keyboardevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));

    //initialize keyboardevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(keyboardevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (keyboardevent.type === undefined || keyboardevent.type === '' ||
            keyboardevent.bubbles === undefined || keyboardevent.cancelable === undefined) {
          throw new SyntaxError("[object KeyboardEvent](function): Must call 'this.initKeyboardEvent(type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_keyboardevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      keyboardevent.initKeyboardEvent(type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat);
    }
    
    return keyboardevent;
  };
    

  keyboardevent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object KeyboardEvent]"; }
    }
  };

}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a keyboard event.
 * @name isKeyboardEvent
 * @param {doodle.events.Event} event
 * @return {boolean}
 * @static
 */
doodle.events.KeyboardEvent.isKeyboardEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object KeyboardEvent]' || (evt.constructor && evt.constructor.name === 'KeyboardEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};
