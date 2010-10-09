/*globals doodle, document*/

/**
 * Doodle utilty functions.
 * @name doodle.utils
 * @class
 * @augments Object
 * @static
 */
doodle.utils = Object.create({}, {

  /*
   * COLOR UTILS
   */

  /**
   * @name hex_to_rgb
   * @param {Color} color
   * @return {Array} [r, g, b]
   * @throws {TypeError}
   * @static
   */
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

  /**
   * @name hex_to_rgb_str
   * @param {Color} color
   * @param {number} alpha
   * @return {string}
   * @throws {TypeError}
   * @static
   */
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
  
  /**
   * @name rgb_str_to_hex
   * @param {string} rgb_str
   * @return {string}
   * @throws {TypeError}
   * @static
   */
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

  /**
   * @name rgb_str_to_rgb
   * @param {Color} color
   * @return {Array}
   * @throws {TypeError}
   * @throws {SyntaxError}
   * @static
   */
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
        if (!Array.isArray(color)) {
          throw new SyntaxError("rgb_str_to_rgb(*color*): Invalid rgb color format: 'rgba(n, n, n, n)'.");
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
    }())
  },
  
  /**
   * @name rgb_to_hex
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @return {string}
   * @throws {TypeError}
   * @static
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

  /**
   * @name rgb_to_rgb_str
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   * @return {string}
   * @throws {TypeError}
   * @static
   */
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

  /*
   * DOM ACCESS
   */

  /**
   * Returns HTML element from id name or element itself.
   * @name get_element
   * @param {HTMLElement|string} element
   * @return {HTMLElement}
   * @static
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

  /**
   * Returns css property of element, it's own or inherited.
   * @name get_style_property
   * @param {HTMLElement} element
   * @param {string} property
   * @param {boolean} useComputedStyle
   * @return {*}
   * @throws {TypeError}
   * @throws {ReferenceError}
   * @static
   */
  'get_style_property': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function (element, property, useComputedStyle) {
      useComputedStyle = (useComputedStyle === undefined) ? true : false;
      /*DEBUG*/
      doodle.utils.types.check_string_type(property, 'get_style_property', 'element, *property*, useComputedStyle');
      doodle.utils.types.check_boolean_type(useComputedStyle, 'get_style_property', 'element, property, *useComputedStyle*');
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
  
  /**
   * Returns property of an element. CSS properties take precedence over HTML attributes.
   * @name get_element_property
   * @param {HTMLElement} element
   * @param {string} property
   * @param {string} returnType 'int'|'float' Return type.
   * @param {boolean} useComputedStyle
   * @return {*}
   * @throws {ReferenceError}
   * @static
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

  /**
   * @name set_element_property
   * @param {HTMLElement} element
   * @param {string} property
   * @param {*} value
   * @param {string} type 'css'|'html' Set CSS property or HTML attribute.
   * @return {*}
   * @throws {TypeError}
   * @throws {SyntaxError}
   * @static
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
  
  /**
   * Creates a scene graph path from a given node and all it's descendants.
   * @name create_scene_path
   * @param {Node} node
   * @param {Array} array Array to store the path nodes in.
   * @param {boolean} clearArray Empty array passed as parameter before storing nodes in it.
   * @return {Array} The array passed to the function (modified in place).
   * @throws {TypeError}
   * @static
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
