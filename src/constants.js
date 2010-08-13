
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

Object.defineProperty(doodle, 'LineCap', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    //default
    'BUTT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'butt'
    },
    'ROUND': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'round'
    },
    'SQUARE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'square'
    }
  })
});

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

Object.defineProperty(doodle, 'Keyboard', {
	enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
		'LEFT': {
			enumerable: true,
      writable: false,
      configurable: false,
      value: 37
		},
		'UP': {
			enumerable: true,
      writable: false,
      configurable: false,
      value: 38
		},
		'RIGHT': {
			enumerable: true,
      writable: false,
      configurable: false,
      value: 39
		},
		'DOWN': {
			enumerable: true,
      writable: false,
      configurable: false,
      value: 40
		}
	})
});
