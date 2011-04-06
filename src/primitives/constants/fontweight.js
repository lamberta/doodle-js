/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
/**
 * @name doodle.FontWeight
 * @class
 * @static
 */
Object.defineProperty(doodle, 'FontWeight', {
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
     * @name BOLD
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'BOLD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'bold'
    },

    /**
     * @name BOLDER
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'BOLDER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'bolder'
    },

    /**
     * @name LIGHTER
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'LIGHTER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'lighter'
    }
  })
});
