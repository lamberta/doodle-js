
(function () {
  var get_style_property;
  
  doodle.utils = {
    rgb_to_hex: function (r, g, b) {
      var hex_color;
      if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
        throw new TypeError("rgb_to_hex: Color values must be numbers.");
      }
      hex_color = (b | (g << 8) | (r << 16)).toString(16);
      return '#'+ String('000000'+hex_color).slice(-6); //pad out
    },

    rgb_str_to_hex: function (rgb_str) {
      var rgb_match;
      if (typeof rgb_str !== 'string') {
        throw new TypeError('rgb_str_to_hex(rgb_str): Parameter must be a string.');
      }
      rgb_match = rgb_str.trim().match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?.*\)$/);

      if (Array.isArray(rgb_match)) {
        return doodle.utils.rgb_to_hex(parseInt(rgb_match[1]),
                                       parseInt(rgb_match[2]),
                                       parseInt(rgb_match[3]));
      } else {
        throw new SyntaxError('rgb_str_to_hex(rgb_str): Parameter must be in the format: "rgb(n, n, n)".');
      }
    },
    
    hex_to_rgb: function (color) {
      //number in octal format or string prefixed with #
      if (typeof color === 'string') {
        color = (color[0] === '#') ? color.slice(1) : color;
        color = parseInt(color, 16);
      }
      if (typeof color !== 'number') {
        throw new TypeError("hex_to_rgb: Color in invalid hex format.");
      }
      //return array: [r,g,b]
      return [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff];
    },

    hex_to_rgb_str: function (color, alpha) {
      alpha = (alpha === undefined) ? 1 : alpha;
      if (typeof alpha !== 'number') {
         throw new TypeError("hex_to_rgb_str(color,*alpha*): Parameter must be a number.");
      }
      alpha = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
      color = doodle.utils.hex_to_rgb(color);
      if (alpha === 1) {
        return "rgb("+ color[0] +","+ color[1] +","+ color[2] +")";
      } else {
        return "rgba("+ color[0] +","+ color[1] +","+ color[2] +","+ alpha +")";
      }
    }
  };

  /* also contains:
   * check_point_type
   * check_matrix_type
   * check_rect_type
   * These can't be added to utils.types until they're created.
   */
  doodle.utils.types = {
    //checks n, or all elements if n is an array
    check_number_type: function (n, caller, param) {
      var i;
      caller = (caller === undefined) ? "check_number_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      if (typeof n === 'number') {
        return true;
      } else if (n && n.length) {
        //given array, or semi-array
        i = n.length;
        while ((i -= 1) >= 0) {
          if (typeof n[i] !== 'number') {
            throw new TypeError(caller + param +": Parameter must be a number.");
          }
        }
        return true;
      } else {
        throw new TypeError(caller + param +": Parameter must be a number, or array of numbers.");
      }
    },

    check_boolean_type: function (bool, caller, param) {
      if (typeof bool === "boolean") {
        return true;
      } else {
        caller = (caller === undefined) ? "check_boolean_type" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": Parameter must be a boolean.");
      }
    },

    check_string_type: function (str, caller, param) {
      if (typeof str === "string") {
        return true;
      } else {
        caller = (caller === undefined) ? "check_string_type" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": Parameter must be a string.");
      }
    },

    check_function_type: function (fn, caller, param) {
      if (typeof fn === "function") {
        return true;
      } else {
        caller = (caller === undefined) ? "check_function_type" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": Parameter must be a function.");
      }
    },

    check_array_type: function (array, caller, param) {
      if (Array.isArray(array)) {
        return true;
      } else {
        caller = (caller === undefined) ? "check_array_type" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": Parameter must be an array.");
      }
    },

    check_event_type: function (evt, caller, param) {
      //list all event types
      if (evt && (evt.toString() === "[object Event]" ||
                  evt.toString() === "[object UIEvent]" ||
                  evt.toString() === "[object MouseEvent]" ||
                  evt.toString() === "[object KeyboardEvent]" ||
                  evt.toString() === "[object TextEvent]")) {
        return true;
      } else {
        caller = (caller === undefined) ? "check_event_type" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": Parameter must be an event.");
      }
    },

    check_canvas_type: function (canvas, caller, param) {
      if (canvas && canvas.toString() === "[object HTMLCanvasElement]") {
        return true;
      } else {
        caller = (caller === undefined) ? "check_canvas_type" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": Parameter must be an canvas element.");
      }
    },

    check_context_type: function (ctx, caller, param) {
      if (ctx && ctx.toString() === "[object CanvasRenderingContext2D]") {
        return true;
      } else {
        caller = (caller === undefined) ? "check_context_type" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": Parameter must be an canvas context.");
      }
    },

    check_block_element: function (element, caller, param) {
      if (get_style_property(element, 'display') === "block") {
        return true;
      } else {
        caller = (caller === undefined) ? "check_block_element" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": HTML element must have display: block.");
      }
    }
    
  };


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
  get_style_property = doodle.utils.get_style_property = function (element, property) {
    if (document.defaultView && document.defaultView.getComputedStyle) {
      return document.defaultView.getComputedStyle(element, null)[property];
    } else if (element.currentStyle) {
      return element.currentStyle[property];
    } else if (element.style) {
      return element.style[property];
    } else {
      throw new Error("get_style_property: Could not determine style.");
    }
  };

}());
