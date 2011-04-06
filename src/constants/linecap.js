/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
/**
 * @name doodle.LineCap
 * @class
 * @static
 */
Object.defineProperty(doodle, 'LineCap', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name BUTT
     * @return {string} [read-only] Default
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
     * @return {string} [read-only]
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
     * @return {string} [read-only]
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
