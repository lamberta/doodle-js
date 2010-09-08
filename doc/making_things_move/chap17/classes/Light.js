function Light (x, y, z, brightness) {
  brightness = (brightness === undefined) ? 1 : brightness;
  
  return Object.defineProperties({
    x: (x === undefined) ? -100 : x,
    y: (y === undefined) ? -100 : y,
    z: (z === undefined) ? -100 : z
  }, {
    'brightness': {
      get: function () { return brightness; },
      set: function (b) {
        brightness = Math.min(Math.max(b, 0), 1);
      }
    }
  });
}
