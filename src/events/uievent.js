/*globals doodle*/

/* DOM 2 Event: UIEvent:Event
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-Events-UIEvent
 */
(function () {
  var uievent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.UIEvent
   * @class
   * @augments doodle.events.Event
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {number=} detail
   * @return {doodle.events.UIEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.UIEvent = function (type, bubbles, cancelable, view, detail) {
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
      uievent = Object.create(doodle.events.Event(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object UIEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      uievent = Object.create(doodle.events.Event(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      /*DEBUG*/
      type_check(type,'string', bubbles,'boolean', cancelable,'boolean', view,'*', detail,'*',
                 {label:'UIEvent', params:['type','bubbles','cancelable','view','detail'], id:this.id});
      /*END_DEBUG*/
      uievent = Object.create(doodle.events.Event(type, bubbles, cancelable));
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

      /**
       * @name copy_uievent_properties
       * @param {doodle.events.UIEvent} evt UIEvent to copy properties from.
       * @throws {TypeError}
       * @private
       */
      copy_uievent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.UIEvent.isUIEvent(evt), "evt is UIEvent.", this.id, evt);
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
        /**
         * @name view
         * @return {HTMLElement} [read-only]
         * @property
         */
        'view': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_view; }
        },

        /**
         * @name detail
         * @return {number} [read-only]
         * @property
         */
        'detail': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_detail; }
        },

        /**
         * @name which
         * @return {number} [read-only]
         * @property
         */
        'which': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_which; }
        },

        /**
         * @name charCode
         * @return {number} [read-only]
         * @property
         */
        'charCode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_charCode; }
        },

        /**
         * @name keyCode
         * @return {number} [read-only]
         * @property
         */
        'keyCode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_keyCode; }
        },

        /**
         * @name layerX
         * @return {number} [read-only]
         * @property
         */
        'layerX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_layerX; }
        },

        /**
         * @name layerY
         * @return {number} [read-only]
         * @property
         */
        'layerY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_layerY; }
        },

        /**
         * @name pageX
         * @return {number} [read-only]
         * @property
         */
        'pageX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_pageX; }
        },

        /**
         * @name pageY
         * @return {number} [read-only]
         * @property
         */
        'pageY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_pageY; }
        },

        /**
         * @name initUIEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} viewArg
         * @param {number} detailArg
         * @return {doodle.events.UIEvent}
         * @throws {TypeError}
         */
        'initUIEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg) {
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            detailArg = (detailArg === undefined) ? 0 : detailArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg,'boolean', viewArg,'*', detailArg,'number', {label:'UIEvent.initUIEvent', params:['type','canBubble','cancelable','view','detail'], id:this.id});
            /*END_DEBUG*/
            evt_view = viewArg;
            evt_detail = detailArg;
            this.initEvent(typeArg, canBubbleArg, cancelableArg);
            return this;
          }
        },

        /**
         * Copy the properties from another UIEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyUIEventProperties
         * @param {doodle.events.UIEvent} evt
         * @param {Node=} resetTarget
         * @param {string=} resetType
         * @return {Event}
         * @throws {TypeError}
         * @private
         */
        '__copyUIEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.UIEvent.isUIEvent(evt), "evt is UIEvent");
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
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
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object UIEvent]"; }
    }
  };

}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is an UIEvent or inherits from it.
 * Returns true on Doodle events as well as DOM events.
 * @name isUIEvent
 * @param {doodle.events.Event} event
 * @return {boolean}
 * @static
 */
doodle.events.UIEvent.isUIEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object UIEvent]' || (evt.constructor && evt.constructor.name === 'UIEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};
