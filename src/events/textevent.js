/*globals doodle*/

/* DOM 3 Event: TextEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-textevents
 */
(function () {
  var textevent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.TextEvent
   * @class
   * @augments doodle.events.UIEvent
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {string=} data
   * @param {number=} inputMode
   * @return {doodle.events.TextEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.TextEvent = function (type, bubbles, cancelable, view, data, inputMode) {
    var textevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_textevent_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 6) {
      throw new SyntaxError("[object TextEvent](type, bubbles, cancelable, view, data, inputMode): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TextEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      textevent = Object.create(doodle.events.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TextEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      textevent = Object.create(doodle.events.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      /*DEBUG*/
      type_check(type,'string', bubbles,'boolean', cancelable,'boolean', view,'*', data,'*', inputMode,'*',
                 {label:'TextEvent', id:this.id, params:['type','bubbles','cancelable','view','data','inputMode']});
      /*END_DEBUG*/
      textevent = Object.create(doodle.events.UIEvent(type, bubbles, cancelable, view));
    }
    
    Object.defineProperties(textevent, textevent_static_properties);
    //properties that require privacy
    Object.defineProperties(textevent, (function () {
      var evt_data = '',
          evt_inputMode = doodle.events.TextEvent.INPUT_METHOD_UNKNOWN;

      /**
       * @name copy_textevent_properties
       * @param {doodle.events.TextEvent} evt TextEvent to copy properties from.
       * @private
       */
      copy_textevent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.TextEvent.isTextEvent(evt), "evt is TextEvent.", this.id, evt);
        /*END_DEBUG*/
        if (evt.data !== undefined) { evt_data = evt.data; }
        if (evt.inputMode !== undefined) { evt_inputMode = evt.inputMode; }
      };
      
      return {
        /**
         * @name data
         * @return {string} [read-only]
         * @property
         */
        'data': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_data; }
        },

        /**
         * @name inputMode
         * @return {number} [read-only]
         * @property
         */
        'inputMode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_inputMode; }
        },

        /**
         * @name initTextEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} view
         * @param {string} dataArg
         * @param {number} inputModeArg
         * @return {doodle.events.TextEvent}
         */
        'initTextEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, dataArg, inputModeArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            dataArg = (dataArg === undefined) ? '' : dataArg;
            inputModeArg = (inputModeArg === undefined) ? doodle.events.TextEvent.INPUT_METHOD_UNKNOWN : inputModeArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg,'boolean', viewArg,'*', dataArg,'string', inputModeArg,'number',
                       {label:'TextEvent.initTextEvent', id:this.id, params:['typeArg','canBubbleArg','cancelableArg','viewArg','dataArg','inputModeArg']});
            /*END_DEBUG*/
            evt_data = dataArg;
            evt_inputMode = inputModeArg;
            this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg);
            return this;
          }
        },

        /**
         * Copy the properties from another TextEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyTextEventProperties
         * @param {doodle.events.TextEvent} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @return {doodle.events.TextEvent}
         * @private
         */
        '__copyTextEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.TextEvent.isTextEvent(evt), "evt is TextEvent", this.id);
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
            /*END_DEBUG*/
            copy_textevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));

    //initialize textevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(textevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (textevent.type === undefined || textevent.type === '' ||
            textevent.bubbles === undefined || textevent.cancelable === undefined) {
          throw new SyntaxError("[object TextEvent](function): Must call 'this.initTextEvent(type, bubbles, cancelable, view, data, inputMode)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_textevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      textevent.initTextEvent(type, bubbles, cancelable, view, data, inputMode);
    }
    
    return textevent;
  };
  
  
  textevent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object TextEvent]"; }
    }
  };
  
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a TextEvent.
 * @name isTextEvent
 * @param {doodle.events.TextEvent} event
 * @return {boolean}
 * @static
 */
doodle.events.TextEvent.isTextEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object TextEvent]' || (evt.constructor && evt.constructor.name === 'TextEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};
