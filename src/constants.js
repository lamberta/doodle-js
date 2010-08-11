
Object.defineProperty(doodle, 'GradientType', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    'LINEAR': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'linearGradient'
    },
    'RADIAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'radialGradient'
    }
  })
});

Object.defineProperty(doodle, 'Pattern', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    'REPEAT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat'
    },
    
    'REPEAT_X': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat-x'
    },
    
    'REPEAT_Y': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat-y'
    },
    
    'NO_REPEAT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'no-repeat'
    }
  })
});
