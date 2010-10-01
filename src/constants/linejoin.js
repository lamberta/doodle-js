/**
 * @class LineJoin
 * @static
 */
Object.defineProperty(doodle, 'LineJoin', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name MITER
     * @return {String} [read-only] Default
     * @property
     * @constant
     * @static
     */
    'MITER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'miter'
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
     * @name BEVEL
     * @return {String} [read-only]
     * @property
     * @constant
     * @static
     */
    'BEVEL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'bevel'
    }
  })
});
