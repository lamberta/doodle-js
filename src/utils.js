/*globals doodle, document*/

doodle.utils = Object.create({}, {

  /*
   * COLOR UTILS
   */
  
  'rgb_to_hex': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (r, g, b) {
      /*DEBUG*/
      var check_number_type = doodle.utils.types.check_number_type;
      check_number_type(r, 'rgb_to_hex', '*r*, g, b');
      check_number_type(g, 'rgb_to_hex', 'r, *g*, b');
      check_number_type(b, 'rgb_to_hex', 'r, g, *b*');
      /*END_DEBUG*/
      var hex_color = (b | (g << 8) | (r << 16)).toString(16);
      return '#'+ String('000000'+hex_color).slice(-6); //pad out
    }
  },

  'rgb_str_to_hex': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (rgb_str) {
      /*DEBUG*/
      doodle.utils.types.check_string_type(rgb_str, 'rgb_str_to_hex', '*rgb_str*');
      /*END_DEBUG*/   
      var doodle_utils = doodle.utils,
          rgb = doodle_utils.rgb_str_to_rgb(rgb_str);
      /*DEBUG*/
      doodle.utils.types.check_array_type(rgb, 'rgb_str_to_hex::rgb');
      /*END_DEBUG*/
      return doodle_utils.rgb_to_hex(parseInt(rgb[0], 10), parseInt(rgb[1], 10), parseInt(rgb[2], 10));
    }
  },

  'rgb_to_rgb_str': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (r, g, b, a) {
      a = (a === undefined) ? 1 : a;
      /*DEBUG*/
      var check_number_type = doodle.utils.types.check_number_type;
      check_number_type(r, 'rgb_to_rgb_str', '*r*, g, b, a');
      check_number_type(g, 'rgb_to_rgb_str', 'r, *g*, b, a');
      check_number_type(b, 'rgb_to_rgb_str', 'r, g, *b*, a');
      check_number_type(a, 'rgb_to_rgb_str', 'r, g, b, *a*');
      /*END_DEBUG*/
      a = (a < 0) ? 0 : ((a > 1) ? 1 : a);
      if (a === 1) {
        return "rgb("+ r +","+ g +","+ b +")";
      } else {
        return "rgba("+ r +","+ g +","+ b +","+ a +")";
      }
    }
  },

  'rgb_str_to_rgb': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: (function () {
      var rgb_regexp = new RegExp("^rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,?(.*)\\)$");
      return function (color) {
        /*DEBUG*/
        doodle.utils.types.check_string_type(color, 'rgb_str_to_rgb', '*color*');
        /*END_DEBUG*/
        color = color.trim().match(rgb_regexp);
        /*DEBUG*/
        //if it's not an array, it didn't parse correctly
        doodle.utils.types.check_array_type(color, 'rgb_str_to_rgb', "*color{'rgba(n, n, n, n)'}*");
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
    }())
  },
  
  'hex_to_rgb': {
    enumerable: true,
    writable: false,
    configurable: false,
    value:function (color) {
      //number in octal format or string prefixed with #
      if (typeof color === 'string') {
        color = (color[0] === '#') ? color.slice(1) : color;
        color = parseInt(color, 16);
      }
      /*DEBUG*/
      doodle.utils.types.check_number_type(color, 'hex_to_rgb', "*color{0xffffff|#ffffff}*");
      /*END_DEBUG*/
      return [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff];
    }
  },

  'hex_to_rgb_str': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (color, alpha) {
      var doodle_utils = doodle.utils;
      alpha = (alpha === undefined) ? 1 : alpha;
      /*DEBUG*/
      doodle.utils.types.check_number_type(alpha, 'hex_to_rgb_str', '*color*');
      /*END_DEBUG*/
      color = doodle_utils.hex_to_rgb(color);
      return doodle_utils.rgb_to_rgb_str(color[0], color[1], color[2], alpha);
    }
  },

  /*
   * DOM ACCESS
   */

  /* Returns HTML element from id name or element itself.
   */
  'get_element': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (element) {
      if (typeof element === 'string') {
        //lop off pound-sign if given
        element = (element[0] === '#') ? element.slice(1) : element;
        return document.getElementById(element);
      } else {
        //if it has an element property, we'll call it an element
        return (element && element.tagName) ? element : null;
      }
    }
  },

  /* Returns css property of element, it's own or inherited.
   */
  'get_style_property': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (element, property, useComputedStyle) {
      useComputedStyle = (useComputedStyle === undefined) ? true : false;
      /*DEBUG*/
      doodle.utils.types.check_boolean_type(useComputedStyle, 'get_style_property');
      /*END_DEBUG*/
      try {
        if (useComputedStyle && document.defaultView && document.defaultView.getComputedStyle) {
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
    }
  },
  
  /* Returns property of an element.
   * CSS properties take precedence over HTML attributes.
   * @param type {String} 'int'|'float' Return type.
   */
  'get_element_property': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (element, property, returnType, useComputedStyle) {
      returnType = returnType || false;
      var val,
          obj;
      try {
        val = doodle.utils.get_style_property(element, property, useComputedStyle);
      } catch (e) {
        val = undefined;
      }
      if (val === undefined || val === null || val === '') {
        /*DEBUG*/
        if (typeof element.getAttribute !== 'function') {
          throw new ReferenceError("get_element_property(*element*, property, returnType, useComputedStyle): Parameter is not a valid element.");
        }
        /*END_DEBUG*/
        val = element.getAttribute(property);
      }
      if (returnType !== false) {
        switch (returnType) {
        case 'int':
          val = parseInt(val, 10);
          val = isNaN(val) ? null : val;
          break;
        case 'number':
        case 'float':
          val = parseFloat(val);
          val = isNaN(val) ? null : val;
          break;
        case 'string':
          val = String(val);
          break;
        case 'object':
          obj = {};
          val = obj[property] = val;
          break;
        default:
          break;
        }
      }
      return val;
    }
  },

  /*
   * @param type {String} 'css'|'html' Set CSS property or HTML attribute.
   */
  'set_element_property': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (element, property, value, type) {
      type = (type === undefined) ? 'css' : type;
      /*DEBUG*/
      var check_string_type = doodle.utils.types.check_string_type;
      check_string_type(property, 'set_element_property', 'element, *property*, value, type');
      check_string_type(type, 'set_element_property', 'element, property, value, *type*');
      /*END_DEBUG*/
      switch (type) {
      case 'css':
        element.style[property] = value;
        break;
      case 'html':
        element.setAttribute(property, value);
        break;
      default:
        throw new SyntaxError("set_element_property: type must be 'css' property or 'html' attribute.");
      }
      return value;
    }
  },

  /*
   * SCENE GRAPH
   */
  
  /* Creates a scene graph path from a given node and all it's descendants.
   * @param {Node} node
   * @param {Array=} array Array to store the path nodes in.
   * @param {Boolean=} clearArray Empty array passed as parameter before storing nodes in it.
   * @return {Array} The array passed to the function (modified in place).
   */
  'create_scene_path': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: (function () {
      return function create_scene_path (node, array, clearArray) {
        array = (array === undefined) ? [] : array;
        clearArray = (clearArray === undefined) ? false : clearArray;
        /*DEBUG*/
        doodle.utils.types.check_array_type(array, 'create_scene_path');
        doodle.utils.types.check_boolean_type(clearArray, 'create_scene_path');
        /*END_DEBUG*/
        var i = node.children.length;
        if (clearArray) {
          array.splice(0, array.length);
        }
        if (i !== 0) {
          while (i--) {
            create_scene_path(node.children[i], array, false);
          }
        }
        array.push(node);
        return array; //return for further operations on array (reverse)
      };
    }())
  }
  
});


/*DEBUG*/

/*
 * TYPE CHECKING
 */
doodle.utils.types = Object.create({}, (function () {

  /* @param {String} type Name of type.
   * @param {String=} caller Name of calling function.
   * @param {String=} params Parameter names for function.
   */
  function throw_type_error (type, caller, params) {
    if (typeof type !== 'string') {
      throw new TypeError("throw_type_error: type must be a string.");
    }
    caller = (caller === undefined) ? "throw_type_error" : caller;
    params = (params === undefined) ? "" : '('+params+')';
    throw new TypeError(caller + params +": Parameter must be a "+ type +".");
  }
  
  return {
    /* Type-checking for a number. Throws a TypeError if the test fails.
     * @param {Object} n Object to test.
     * @param {String=} caller Function name to print in error message.
     * @param {String=} param Parameters to print in error message.
     * @return {Boolean}
     */
    'check_number_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (n, caller, params) {
        return (typeof n === 'number') ?
          true : throw_type_error('number', caller || 'check_number_type', params);
      }
    },

    'check_boolean_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (bool, caller, params) {
        return (typeof bool === 'boolean') ?
          true : throw_type_error('boolean', caller || 'check_boolean_type', params);
      }
    },

    'check_string_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (str, caller, params) {
        return (typeof str === 'string') ?
          true : throw_type_error('string', caller || 'check_string_type', params);
      }
    },

    'check_function_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (fn, caller, params) {
        return (typeof fn === 'function') ?
          true : throw_type_error('function', caller || 'check_function_type', params);
      }
    },

    'check_array_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (array, caller, params) {
        return (Array.isArray(array)) ?
          true : throw_type_error('array', caller || 'check_array_type', params);
      }
    },

    'check_canvas_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (canvas, caller, params) {
        return (canvas && typeof canvas.toString === 'function' &&
                canvas.toString() === '[object HTMLCanvasElement]') ?
          true : throw_type_error('canvas element', caller || 'check_canvas_type', params);
      }
    },

    'check_context_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (ctx, caller, params) {
        return (ctx && typeof ctx.toString === 'function' &&
                ctx.toString() === '[object CanvasRenderingContext2D]') ?
          true : throw_type_error('canvas context', caller || 'check_context_type', params);
      }
    },

    'check_block_element': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (element, caller, params) {
        try {
          return (doodle.utils.get_style_property(element, 'display') === 'block') ?
            true : throw_type_error('HTML block element', caller || 'check_block_type', params);
        } catch (e) {
          throw_type_error('HTML block element', caller || 'check_block_type', params);
        }
      }
    }
    
  };
}()));
/*END_DEBUG*/
