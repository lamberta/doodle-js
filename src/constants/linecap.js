/**
 * @class LineCap
 * @static
 */
Object.defineProperty(doodle, 'LineCap', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name BUTT
     * @return {String} [read-only] Default
     * @property
     * @constant
     * @static
     */
    'BUTT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'butt'
    },

    /**
     * @name ROUND
     * @return {String} [read-only]
     * @property
     * @constant
     * @static
     */
    'ROUND': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'round'
    },

    /**
     * @name SQUARE
     * @return {String} [read-only]
     * @property
     * @constant
     * @static
     */
    'SQUARE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'square'
    }
  })
});
