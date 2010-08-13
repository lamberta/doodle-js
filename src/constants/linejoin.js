
Object.defineProperty(doodle, 'LineJoin', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    // default
    'MITER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'miter'
    },
    'ROUND': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'round'
    },
    'BEVEL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'bevel'
    }
  })
});
