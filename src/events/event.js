/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/

/* Will probably want to implement the dom event interface:
 * http://www.w3.org/TR/DOM-Level-3-Events/
 * But this works for now.
 */
(function () {
  var event_prototype,
      event_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent;
  
  /**
   * @name doodle.events.createEvent
   * @class
   * @augments Object
   * @param {string=} type
   * @param {boolean=} bubbles = false
   * @param {boolean=} cancelable = false
   * @return {doodle.events.Event}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.Event = doodle.events.createEvent = function (type, bubbles, cancelable) {
    var event = Object.create(event_prototype),
        arg_len = arguments.length,
        init_obj, //function, event
        copy_event_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 3) {
      throw new SyntaxError("[object Event](type, bubbles, cancelable): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(event, event_static_properties);
    //properties that require privacy
    Object.defineProperties(event, (function () {
      var evt_type,
          evt_bubbles,
          evt_cancelable,
          evt_cancelBubble = false,
          evt_defaultPrevented = false,
          evt_eventPhase = 0,
          evt_currentTarget = null,
          evt_target = null,
          evt_srcElement = null,
          evt_timeStamp = new Date(),
          evt_returnValue = true,
          evt_clipboardData,
          //internal use
          __cancel = false,
          __cancelNow = false;

      /**
       * @name copy_event_properties
       * @param {doodle.events.Event} evt Event to copy properties from.
       * @param {Node|boolean|null=} resetTarget Set new event target or null.
       * @param {string|boolean=} resetType Set new event type.
       * @throws {TypeError}
       * @private
       */
      copy_event_properties = function (evt, resetTarget, resetType) {
        resetTarget = (resetTarget === undefined) ? false : resetTarget;
        resetType = (resetType === undefined) ? false : resetType;
        /*DEBUG*/
        console.assert(doodle.events.Event.isEvent(evt), "evt is Event.", event.id, evt);
        console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is false, null, or Node.", event.id, resetTarget);
        console.assert(resetType === false || typeof resetType === 'string', "resetType is false or string.", event.id, resetType);
        /*END_DEBUG*/
        if (resetTarget !== false) {
          evt_currentTarget = resetTarget;
          evt_target = resetTarget;
        } else {
          evt_currentTarget = evt.currentTarget;
          evt_target = evt.target;
        }
        if (resetType) {
          evt_type = resetType;
        } else {
          evt_type = evt.type;
        }
        evt_bubbles = evt.bubbles;
        evt_cancelable = evt.cancelable;
        evt_cancelBubble = evt.cancelBubble;
        evt_defaultPrevented = evt.defaultPrevented;
        evt_eventPhase = evt.eventPhase;
        evt_srcElement = evt.srcElement;
        evt_timeStamp = evt.timeStamp;
        evt_returnValue = evt.returnValue;
        evt_clipboardData = evt.clipboardData;
        //check for doodle internal event properties
        if (evt.__cancel) { __cancel = true; }
        if (evt.__cancelNow) { __cancelNow = true; }
      };
      
      return {
        /**
         * @name id
         * @return {string}
         */
        'id': (function () {
          var id = null;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return (id === null) ? this.toString()+"[type="+this.type+"]" : id; },
            set: function (idArg) {
              /*DEBUG*/
              if (idArg !== null) {
                type_check(idArg,'string', {label:'Event.id', id:this.id});
              }
              /*END_DEBUG*/
              id = idArg;
            }
          };
        }()),
        
        /**
         * @name type
         * @return {string} [read-only]
         * @property
         */
        'type': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_type; }
        },

        /**
         * @name __setType
         * @param {string} typeArg
         * @throws {TypeError}
         * @private
         */
        '__setType': {
          enumerable: false,
          value: function (typeArg) {
            /*DEBUG*/
            console.assert(typeof typeArg === 'string', "typeArg is a string.");
            /*END_DEBUG*/
            evt_type = typeArg;
          }
        },

        /**
         * @name bubbles
         * @return {boolean} [read-only]
         * @property
         */
        'bubbles': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_bubbles; }
        },

        /**
         * @name cancelable
         * @return {boolean} [read-only]
         * @property
         */
        'cancelable': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_cancelable; }
        },

        /**
         * @name cancelBubble
         * @param {boolean} cancelArg
         * @throws {TypeError}
         */
        'cancelBubble': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_cancelBubble; },
          set: function (cancelArg) {
            /*DEBUG*/
            type_check(cancelArg, 'boolean', {label:'Event.cancelBubble', params:'cancel', id:this.id});
            /*END_DEBUG*/
            evt_cancelBubble = cancelArg;
          }
        },
        
        /**
         * Test if event propagation should stop after this node.
         * @name __cancel
         * @return {boolean} [read-only]
         * @property
         * @private
         */
        '__cancel': {
          enumerable: false,
          configurable: false,
          get: function () { return __cancel; }
        },
        
        /**
         * Test if event propagation should stop immediately,
         * ignore other handlers on this node.
         * @name __cancelNow
         * @return {boolean} [read-only]
         * @property
         * @private
         */
        '__cancelNow': {
          enumerable: false,
          configurable: false,
          get: function () { return __cancelNow; }
        },

        /**
         * @name currentTarget
         * @return {Node} [read-only]
         * @property
         */
        'currentTarget': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_currentTarget; }
        },
        
        /**
         * @name __setCurrentTarget
         * @param {Node} targetArg
         * @private
         */
        '__setCurrentTarget': {
          enumerable: false,
          value: function (targetArg) {
            /*DEBUG*/
            console.assert(targetArg === null || doodle.Node.isNode(targetArg), "targetArg is null or a Node.");
            /*END_DEBUG*/
            evt_currentTarget = targetArg;
            return this;
          }
        },

        /**
         * @name target
         * @return {Node} [read-only]
         * @property
         */
        'target': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_target; }
        },

        /**
         * @name __setTarget
         * @param {Node} targetArg
         * @private
         */
        '__setTarget': {
          enumerable: false,
          value: function (targetArg) {
            /*DEBUG*/
            console.assert(targetArg === null || doodle.Node.isNode(targetArg), "targetArg is null or a Node.");
            /*END_DEBUG*/
            evt_target = targetArg;
            return this;
          }
        },

        /**
         * @name eventPhase
         * @return {number} [read-only]
         * @property
         */
        'eventPhase': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_eventPhase; }
        },

        /**
         * @name __setEventPhase
         * @param {number} phaseArg
         * @throws {TypeError}
         * @private
         */
        '__setEventPhase': {
          enumerable: false,
          value: function (phaseArg) {
            /*DEBUG*/
            console.assert(window.isFinite(phaseArg), "phaseArg is a finite number", phaseArg);
            console.assert(phaseArg >= 0, "phaseArg is greater than 0", phaseArg);
            /*END_DEBUG*/
            evt_eventPhase = phaseArg;
            return this;
          }
        },

        /**
         * @name srcElement
         * @return {EventDispatcher} [read-only]
         * @property
         */
        'srcElement': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_srcElement; }
        },

        /**
         * @name timeStamp
         * @return {Date} [read-only]
         * @property
         */
        'timeStamp': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_timeStamp; }
        },

        /**
         * @name returnValue
         * @return {*} [read-only]
         * @property
         */
        'returnValue': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_returnValue; }
        },
        
        /**
         * @name initEvent
         * @param {string=} typeArg
         * @param {boolean=} canBubbleArg
         * @param {boolean=} cancelableArg
         * @return {doodle.events.Event}
         * @throws {TypeError}
         */
        'initEvent': {
          enumerable: true,
          configurable: false,
          value: function (typeArg, canBubbleArg, cancelableArg) {
            typeArg = (typeArg === undefined) ? "undefined" : typeArg;
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg, 'boolean', {label:'Event.initEvent', params:['type','canBubble','cancelable'], id:this.id});
            /*END_DEBUG*/
            evt_type = typeArg;
            evt_bubbles = canBubbleArg;
            evt_cancelable = cancelableArg;
            return this;
          }
        },

        /**
         * @name preventDefault
         */
        'preventDefault': {
          enumerable: true,
          configurable: false,
          value: function () { evt_defaultPrevented = true; }
        },

        /**
         * @name stopPropagation
         * @throws {Error} If called on event that can not be canceled.
         */
        'stopPropagation': {
          enumerable: true,
          configurable: false,
          value: function () {
            if (!this.cancelable) {
              throw new Error(this.id + " Event.stopPropagation: Event can not be cancelled.");
            } else {
              __cancel = true;
            }
          }
        },

        /**
         * @name stopImmediatePropagation
         * @throws {Error} If called on event that can not be canceled.
         */
        'stopImmediatePropagation': {
          enumerable: true,
          configurable: false,
          value: function () {
            if (!this.cancelable) {
              throw new Error(this.id + " Event.stopImmediatePropagation: Event can not be cancelled.");
            } else {
              __cancel = true;
              __cancelNow = true;
            }
          }
        },

        /**
         * Copy the properties from another Event.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyEventProperties
         * @param {doodle.events.Event} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @throws {TypeError}
         * @private
         */
        '__copyEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.Event.isEvent(evt), "evt is an Event.", this);
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is false, null, or a Node.", this);
            console.assert(resetType === false || typeof resetType === 'string', "resetType is false or a string.", this);
            /*END_DEBUG*/
            copy_event_properties(evt, resetTarget, resetType);
            return this;
          }
        }
      };
    }()));//end defineProperties

    
    //using a function or another event object to init?
    if (arg_len === 1 && (typeof arguments[0] === 'function' || isEvent(arguments[0]))) {
      init_obj = arguments[0];
      type = undefined;
    }

    //initialize event
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(event);
        /*DEBUG*/
        if (event.type === undefined || event.bubbles === undefined || event.cancelable === undefined) {
          throw new SyntaxError(this.id + "(function): Must call 'this.initEvent(type, bubbles, cancelable)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_event_properties(init_obj, false, false);
      }
    } else {
      //standard instantiation
      event.initEvent(type, bubbles, cancelable);
    }

    return event;
  };
  
  
  event_static_properties = {
    /**
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object Event]"; }
    }
  };//end event_static_properties

  event_prototype = Object.create({}, {
    /**
     * @name CAPTURING_PHASE
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'CAPTURING_PHASE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1
    },

    /**
     * @name AT_TARGET
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'AT_TARGET': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2
    },

    /**
     * @name BUBBLING_PHASE
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'BUBBLING_PHASE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 3
    },

    /**
     * @name MOUSEDOWN
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEDOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1
    },

    /**
     * @name MOUSEUP
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEUP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2
    },

    /**
     * @name MOUSEOVER
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEOVER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 4
    },

    /**
     * @name MOUSEOUT
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEOUT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 8
    },

    /**
     * @name MOUSEMOVE
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEMOVE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 16
    },

    /**
     * @name MOUSEDRAG
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEDRAG': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 32
    },

    /**
     * @name CLICK
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 64
    },

    /**
     * @name DBLCLICK
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'DBLCLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 128
    },

    /**
     * @name KEYDOWN
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'KEYDOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 256
    },

    /**
     * @name KEYUP
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'KEYUP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 512
    },

    /**
     * @name KEYPRESS
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'KEYPRESS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1024
    },

    /**
     * @name DRAGDROP
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'DRAGDROP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2048
    },

    /**
     * @name FOCUS
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'FOCUS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 4096
    },

    /**
     * @name BLUR
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'BLUR': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 8192
    },

    /**
     * @name SELECT
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'SELECT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 16384
    },

    /**
     * @name CHANGE
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'CHANGE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 32768
    }
  });//end event_prototype

  /*
   * CLASS METHODS
   */

  /**
   * Test if an object is an event of any kind (Event/MouseEvent/etc).
   * Returns true on Doodle events as well as DOM events.
   * @name isEvent
   * @param {doodle.events.Event} event
   * @return {boolean}
   * @static
   */
  isEvent = doodle.events.Event.isEvent = function (evt) {
    if (typeof evt === 'object') {
      while (evt) {
        //for DOM events we need to check it's constructor name
        if (evt.toString() === '[object Event]' || (evt.constructor && evt.constructor.name === 'Event')) {
          return true;
        } else {
          evt = Object.getPrototypeOf(evt);
        }
      }
    }
    return false;
  };
  
}());//end class closure
