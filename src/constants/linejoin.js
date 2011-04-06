/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
/**
 * @name doodle.LineJoin
 * @class
 * @static
 */
Object.defineProperty(doodle, 'LineJoin', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name MITER
     * @return {string} [read-only] Default
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
     * @name BEVEL
     * @return {string} [read-only]
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
