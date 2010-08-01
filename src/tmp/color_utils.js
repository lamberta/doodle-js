var color_utils = {};
Object.defineProperties(color_utils, {

	'adjustBrightnessLinear': {
    /* Performs a linear brightness adjustment of an RGB color.
		 * @static
     * @param {uint} rgb
		 * @param {Number} brite
     * @return {uint}
     */
    value: function (rgb, brite) {
      var r = Math.max(Math.min(((rgb >> 16) & 0xFF) + brite, 255), 0),
					g = Math.max(Math.min(((rgb >> 8) & 0xFF) + brite, 255), 0),
					b = Math.max(Math.min((rgb & 0xFF) + brite, 255), 0);
			
			return (r << 16) | (g << 8) | b;
    },
    enumerable: false,
    writable: false,
    configurable: false
  },

	'adjustBrightnessScale': {
    /* Performs a scaled brightness adjustment of an RGB color.
		 * @static
     * @param {uint} rgb1
		 * @param {uint} rgb2
     * @return {uint}
     */
    value: function (rgb, brite) {
      var r, g, b;
			
			if (brite == 0) {
				return rgb;
			}
		
			if (brite < 0) {
				brite = (100 + brite) / 100;
				r = ((rgb >> 16) & 0xFF) * brite;
				g = ((rgb >> 8) & 0xFF) * brite;
				b = (rgb & 0xFF) * brite;
			} else {
				// bright > 0
				brite /= 100;
				r = ((rgb >> 16) & 0xFF);
				g = ((rgb >> 8) & 0xFF);
				b = (rgb & 0xFF);
				
				r += ((0xFF - r) * brite);
				g += ((0xFF - g) * brite);
				b += ((0xFF - b) * brite);
				
				r = Math.min(r, 255);
				g = Math.min(g, 255);
				b = Math.min(b, 255);
			}
			
			return (r << 16) | (g << 8) | b;
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
	
	'rgbMultiply': {
    /* Performs an RGB multiplication of two RGB colors.
		 * @static
     * @param {uint} rgb1
		 * @param {uint} rgb2
     * @return {uint}
     */
    value: function (rgb1, rgb2) {
      var r1 = (rgb1 >> 16) & 0xFF,
					g1 = (rgb1 >> 8) & 0xFF,
					b1 = rgb1 & 0xFF,
					r2 = (rgb2 >> 16) & 0xFF,
					g2 = (rgb2 >> 8) & 0xFF,
					b2 = rgb2 & 0xFF;
		
			return ((r1 * r2 / 255) << 16) |
						 ((g1 * g2 / 255) << 8) |
							(b1 * b2 / 255);
    },
    enumerable: false,
    writable: false,
    configurable: false
  },

	'convertHSBtoRGB': {
    /* Converts an HSB color specified by the parameters to a uint RGB color.
		 * @static
     * @param {uint} hue
		 * @param {uint} saturation
		 * @param {uint} brightness
     * @return {uint}
     */
    value: function (hue, saturation, brightness) {
      var r, g, b;
      if (saturation == 0) {
        r = g = b = brightness;
			} else {
        var h = (hue % 360) / 60,
						i = parseInt(h),
						f = h - i,
						p = brightness * (1 - saturation),
						q = brightness * (1 - (saturation * f)),
						t = brightness * (1 - (saturation * (1 - f)));
        switch (i) {
        case 0:
          r = brightness;
          g = t;
          b = p;
          break; 
        case 1:
          r = q;                    
          g = brightness;
          b = p;
          break; 
        case 2:
          r = p;
          g = brightness;
          b = t; 
          break;
        case 3:
          r = p;
          g = q;
          b = brightness;
          break; 
        case 4:
          r = t;
          g = p;
          b = brightness; 
          break;
        case 5: 
          r = brightness;
          g = p;
          b = q;
          break;
        }
      }
      r *= 255;
      g *= 255;
      b *= 255;
      return (r << 16 | g << 8 | b);
    },
    enumerable: false,
    writable: false,
    configurable: false
  },

	'convertRGBtoHSB': {
    /* Converts a color from RGB format into an HSB color.
		 * @static
     * @param {uint} rgb
     * @return {uint}
     */
    value: function (rgb) {
      var hue,
					saturation,
					brightness,
					r = ((rgb >> 16) & 0xff) / 255,
					g = ((rgb >> 8) & 0xff) / 255,
					b = (rgb & 0xff) / 255,
					max = Math.max(r, Math.max(g, b)),
					min = Math.min(r, Math.min(g, b)),
					delta = max - min;
			
      brightness = max;
      if (max != 0) {
        saturation = delta / max;
      } else {
        saturation = 0;
        if (saturation == 0) {
          hue = NaN;
        } else {
          if (r == max) {
            hue = (g - b) / delta;
          } else if (g == max) {
            hue = 2 + (b - r) / delta
          } else if (b == max) {
            hue = 4 + (r - g) / delta;
          }
					hue = hue * 60;
          if (hue < 0) {
            hue += 360;
					}
        }
			}
      return Object.create(color).HSB(hue, saturation, brightness);
    },
    enumerable: false,
    writable: false,
    configurable: false
  },
	
});
