/**
 * @name doodle.FontVariant
 * @class
 * @static
 */
Object.defineProperty(doodle, 'FontVariant', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name NORMAL
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'NORMAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'normal'
    },

    /**
     * @name SMALL_CAPS
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'SMALL_CAPS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'small-caps'
    }
  })
});
