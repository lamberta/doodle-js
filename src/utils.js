doodle.utils = {
  rgb_to_hex: function (r, g, b) {
    /*DEBUG*/
    if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
      throw new TypeError("rgb_to_hex: Color values must be numbers.");
    }
    /*END_DEBUG*/
    var hex_color = (b | (g << 8) | (r << 16)).toString(16);
    return '#'+ String('000000'+hex_color).slice(-6); //pad out
  },

  rgb_str_to_hex: function (rgb_str) {
    /*DEBUG*/
    if (typeof rgb_str !== 'string') {
      throw new TypeError('rgb_str_to_hex(rgb_str): Parameter must be a string.');
    }
    /*END_DEBUG*/
    
    var rgb = this.rgb_str_to_rgb(rgb_str);
    
    /*DEBUG*/
    if (!Array.isArray(rgb)) {
      throw new SyntaxError('rgb_str_to_hex(rgb_str): Parameter must be in the format: "rgb(n, n, n)".');
    }
    /*END_DEBUG*/
    return this.rgb_to_hex(parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10));
  },
  
  rgb_to_rgb_str: function (r, g, b, a) {
    a = (a === undefined) ? 1 : a;
    /*DEBUG*/
    doodle.utils.types.check_number_type(r, 'rgb_to_rgb_str', '*r*, g, b, a');
    doodle.utils.types.check_number_type(g, 'rgb_to_rgb_str', 'r, *g*, b, a');
    doodle.utils.types.check_number_type(b, 'rgb_to_rgb_str', 'r, g, *b*, a');
    doodle.utils.types.check_number_type(a, 'rgb_to_rgb_str', 'r, g, b, *a*');
    /*END_DEBUG*/
		a = (a < 0) ? 0 : ((a > 1) ? 1 : a);
    if (a === 1) {
      return "rgb("+ r +","+ g +","+ b +")";
    } else {
      return "rgba("+ r +","+ g +","+ b +","+ a +")";
    }
  },

  rgb_str_to_rgb: (function () {
    var rgb_regexp = new RegExp("^rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,?(.*)\\)$");
    return function (color) {
      /*DEBUG*/
      doodle.utils.types.check_string_type(color, 'rgb_str_to_rgb', '*color*');
      /*END_DEBUG*/
      color = color.trim().match(rgb_regexp);
      /*DEBUG*/
      if (!Array.isArray(color)) {
        throw new SyntaxError('rgb_str_to_rgb(color): Parameter must be in the format: "rgba(n, n, n, n)".');
      }
      /*END_DEBUG*/
      var rgb = [parseInt(color[1], 10),
                 parseInt(color[2], 10),
                 parseInt(color[3], 10)],
          alpha = parseFloat(color[4]);
      if (typeof alpha === 'number' && !isNaN(alpha)) {
        rgb.push(alpha);
      }
      return rgb;
    };
  }()),
  
  hex_to_rgb: function (color) {
    //number in octal format or string prefixed with #
    if (typeof color === 'string') {
      color = (color[0] === '#') ? color.slice(1) : color;
      color = parseInt(color, 16);
    }
    /*DEBUG*/
    if (typeof color !== 'number') {
      throw new TypeError("hex_to_rgb: Color in invalid hex format.");
    }
    /*END_DEBUG*/
    return [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff];
  },

  hex_to_rgb_str: function (color, alpha) {
    alpha = (alpha === undefined) ? 1 : alpha;
    /*DEBUG*/
    if (typeof alpha !== 'number') {
      throw new TypeError("hex_to_rgb_str(color, *alpha*): Parameter must be a number.");
    }
    /*END_DEBUG*/
    color = doodle.utils.hex_to_rgb(color);
		return doodle.utils.rgb_to_rgb_str(color[0], color[1], color[2], alpha);
  }
};

/* also contains:
 * check_point_type
 * check_matrix_type
 * check_rect_type
 * These can't be added to utils.types until they're created.
 */
doodle.utils.types = (function () {
  function throw_type_error (type, caller, param) {
    if (typeof type !== 'string') {
      throw new TypeError("throw_type_error: type must be a string.");
    }
    caller = (caller === undefined) ? "throw_type_error" : caller;
    param = (param === undefined) ? "" : '('+param+')';
    throw new TypeError(caller + param +": Parameter must be a "+ type +".");
  }
  
  return {
    check_number_type: function (n, caller, param) {
      return (typeof n === 'number') ?
        true : throw_type_error('number', caller || 'check_number_type', param);
    },

    check_boolean_type: function (bool, caller, param) {
      return (typeof bool === 'boolean') ?
        true : throw_type_error('boolean', caller || 'check_boolean_type', param);
    },

    check_string_type: function (str, caller, param) {
      return (typeof str === 'string') ?
        true : throw_type_error('string', caller || 'check_string_type', param);
    },

    check_function_type: function (fn, caller, param) {
      return (typeof fn === 'function') ?
        true : throw_type_error('function', caller || 'check_function_type', param);
    },

    check_array_type: function (array, caller, param) {
      return (Array.isArray(array)) ?
        true : throw_type_error('array', caller || 'check_array_type', param);
    },

    check_event_type: function (evt, caller, param) {
      //list all event types
      if (evt && (evt.toString() === '[object Event]' ||
                  evt.toString() === '[object UIEvent]' ||
                  evt.toString() === '[object MouseEvent]' ||
                  evt.toString() === '[object KeyboardEvent]' ||
                  evt.toString() === '[object TextEvent]')) {
        return true;
      } else {
        throw_type_error('event', caller || 'check_event_type', param);
      }
    },

    check_canvas_type: function (canvas, caller, param) {
      return (canvas && canvas.toString() === '[object HTMLCanvasElement]') ?
        true : throw_type_error('canvas element', caller || 'check_canvas_type', param);
    },

    check_context_type: function (ctx, caller, param) {
      return (ctx && ctx.toString() === '[object CanvasRenderingContext2D]') ?
        true : throw_type_error('canvas context', caller || 'check_context_type', param);
    },

    check_block_element: function (element, caller, param) {
      try {
        return (doodle.utils.get_style_property(element, 'display') === "block") ?
          true : throw_type_error('HTML block element', caller || 'check_block_type', param);
      } catch (e) {
        throw_type_error('HTML block element', caller || 'check_block_type', param);
      }
    }
    
  };
}());


/* Returns HTML element from id name or element itself.
 */
doodle.utils.get_element = function (id, caller) {
  var element;
  if (typeof id === 'string') {
    //lop off pound-sign if given
    id = (id[0] === '#') ? id.slice(1) : id;
    element = document.getElementById(id);
  } else {
    //there's gotta be some checking I could do, right?
    element = id;
  }
  if (!element) {
    caller = (caller === undefined) ? "get_element" : caller;
    throw new ReferenceError(caller + ": Unable to get HTML element: " + id);
  }
  return element;
};

/* Returns css property of element, it's own or inherited.
 */
doodle.utils.get_style_property = function (element, property) {
  try {
    if (document.defaultView && document.defaultView.getComputedStyle) {
      return document.defaultView.getComputedStyle(element, null)[property];
    } else if (element.currentStyle) {
      return element.currentStyle[property];
    } else if (element.style) {
      return element.style[property];
    } else {
      throw new ReferenceError("get_style_property: Cannot read property '"+property+"' of "+element+".");
    }
  } catch (e) {
    throw new ReferenceError("get_style_property: Cannot read property '"+property+"' of "+element+".");
  }
};
