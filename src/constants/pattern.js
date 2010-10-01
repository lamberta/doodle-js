/**
 * @class Pattern
 * @static
 */
Object.defineProperty(doodle, 'Pattern', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name REPEAT
     * @return {String} [read-only]
     * @property
     * @constant
     * @static
     */
    'REPEAT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat'
    },

    /**
     * @name REPEAT_X
     * @return {String} [read-only]
     * @property
     * @constant
     * @static
     */
    'REPEAT_X': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat-x'
    },

    /**
     * @name REPEAT_Y
     * @return {String} [read-only]
     * @property
     * @constant
     * @static
     */
    'REPEAT_Y': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat-y'
    },

    /**
     * @name NO_REPEAT
     * @return {String} [read-only]
     * @property
     * @constant
     * @static
     */
    'NO_REPEAT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'no-repeat'
    }
  })
});
