/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
/*
 * EVENT
 */
Object.defineProperties(doodle.events.Event, {
  /**
   * @name CAPTURING_PHASE
   * @return {number} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
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
   * @memberOf Event
   * @property
   * @constant
   * @static
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
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'BUBBLING_PHASE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 3
  },

  /**
   * Dispatched when object is added to display path.
   * @name ADDED
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'ADDED': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "added"
  },

  /**
   * Dispatched when object is removed from display path.
   * @name REMOVED
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'REMOVED': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "removed"
  },

  /**
   * @name ANIMATION_FRAME
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'ANIMATION_FRAME': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "animationFrame"
  },

  /**
   * This has been deprecated in favor of 'animationFrame' which stylistically is
   * similar to the new browser implementation of window.requestAnimationFrame.
   * @name ENTER_FRAME
   * @deprecated
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'ENTER_FRAME': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "animationFrame"
  },

  /**
   * Dispatched when element is loaded.
   * @name LOAD
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'LOAD': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "load"
  },

  /**
   * @name CHANGE
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'CHANGE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "change"
  }
});


/*
 * UI EVENT
 */
Object.defineProperties(doodle.events.UIEvent, {
  /**
   * @name FOCUS_IN
   * @return {string} [read-only]
   * @memberOf UIEvent
   * @property
   * @constant
   * @static
   */
  'FOCUS_IN': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "focusIn"
  }
});


/*
 * MOUSE EVENT
 * Compatibility tables: http://www.quirksmode.org/dom/events/index.html
 */
Object.defineProperties(doodle.events.MouseEvent, {
  /**
   * To test for left/middle/right button check value for event.which (0,1,2).
   * @name CLICK
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'CLICK': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "click"
  },

  /**
   * @name DOUBLE_CLICK
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'DOUBLE_CLICK': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "dblclick"
  },

  /**
   * @name CONTEXT_MENU
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'CONTEXT_MENU': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "contextmenu"
  },

  /**
   * @name MOUSE_DOWN
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_DOWN': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mousedown"
  },

  /**
   * @name MOUSE_UP
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_UP': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseup"
  },

  /**
   * @name MOUSE_WHEEL
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_WHEEL': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mousewheel"
  },

  /**
   * @name MOUSE_MOVE
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_MOVE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mousemove"
  },

  /**
   * @name MOUSE_OUT
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_OUT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseout"
  },

  /**
   * @name MOUSE_OVER
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_OVER': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseover"
  },

  /**
   * @name MOUSE_ENTER
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_ENTER': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseenter"
  },

  /**
   * @name MOUSE_LEAVE
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_LEAVE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseleave"
  }
  
});


/*
 * TOUCH EVENT
 * http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html
 */
Object.defineProperties(doodle.events.TouchEvent, {
  /**
   * @name TOUCH_START
   * @return {string} [read-only]
   * @memberOf TouchEvent
   * @property
   * @constant
   * @static
   */
  'TOUCH_START': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "touchstart"
  },

  /**
   * @name TOUCH_MOVE
   * @return {string} [read-only]
   * @memberOf TouchEvent
   * @property
   * @constant
   * @static
   */
  'TOUCH_MOVE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "touchmove"
  },

  /**
   * @name TOUCH_END
   * @return {string} [read-only]
   * @memberOf TouchEvent
   * @property
   * @constant
   * @static
   */
  'TOUCH_END': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "touchend"
  },

  /**
   * @name TOUCH_CANCEL
   * @return {string} [read-only]
   * @memberOf TouchEvent
   * @property
   * @constant
   * @static
   */
  'TOUCH_CANCEL': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "touchcancel"
  }
  
});

/*
 * KEYBOARD EVENT
 */
Object.defineProperties(doodle.events.KeyboardEvent, {
  /**
   * @name KEY_PRESS
   * @return {string} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_PRESS': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "keypress"
  },

  /**
   * @name KEY_UP
   * @return {string} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_UP': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "keyup"
  },

  /**
   * @name KEY_DOWN
   * @return {string} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_DOWN': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "keydown"
  },

  /**
   * @name KEY_LOCATION_STANDARD
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_STANDARD': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x00
  },

  /**
   * @name KEY_LOCATION_LEFT
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_LEFT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x01
  },

  /**
   * @name KEY_LOCATION_RIGHT
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_RIGHT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x02
  },

  /**
   * @name KEY_LOCATION_NUMPAD
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_NUMPAD': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x03
  },

  /**
   * @name KEY_LOCATION_MOBILE
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_MOBILE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x04
  },

  /**
   * @name KEY_LOCATION_JOYSTICK
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_JOYSTICK': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x05
  }  
});


/* TEXT EVENT
 */
Object.defineProperties(doodle.events.TextEvent, {
  /**
   * @name TEXT_INPUT
   * @return {string} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'TEXT_INPUT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "textInput"
  },

  /**
   * @name INPUT_METHOD_UNKNOWN
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_UNKNOWN': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x00
  },

  /**
   * @name INPUT_METHOD_KEYBOARD
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_KEYBOARD': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x01
  },

  /**
   * @name INPUT_METHOD_PASTE
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_PASTE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x02
  },

  /**
   * @name INPUT_METHOD_DROP
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_DROP': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x03
  },

  /**
   * @name INPUT_METHOD_IME
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_IME': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x04
  },

  /**
   * @name INPUT_METHOD_OPTION
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_OPTION': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x05
  },

  /**
   * @name INPUT_METHOD_HANDWRITING
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_HANDWRITING': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x06
  },

  /**
   * @name INPUT_METHOD_VOICE
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_VOICE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x07
  },

  /**
   * @name INPUT_METHOD_MULTIMODAL
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_MULTIMODAL': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x08
  },
  
  /**
   * @name INPUT_METHOD_SCRIPT
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_SCRIPT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x09
  }  
});
