/**
 * @name doodle.FontStyle
 * @class
 * @static
 */
Object.defineProperty(doodle, 'FontStyle', {
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
     * @name ITALIC
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'ITALIC': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'italic'
    },

    /**
     * @name OBLIQUE
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'OBLIQUE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'oblique'
    }
  })
});
