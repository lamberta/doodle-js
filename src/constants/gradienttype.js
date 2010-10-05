/**
 * The GradientType class provides values for the type parameter in the
 * beginGradientFill() and lineGradientStyle() methods of the Graphics class.
 * @class doodle.GradientType
 * @static
 */
Object.defineProperty(doodle, 'GradientType', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name LINEAR
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'LINEAR': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'linearGradient'
    },
    
    /**
     * @name RADIAL
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'RADIAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'radialGradient'
    }
  })
});
