
(function () {
  var get_style_property;
  
  doodle.utils = {
    rgb_to_hex: function (r, g, b) {
      if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
        throw new TypeError("rgb_to_hec: Color values must be numbers.");
      }
      return "#" + (b | (g << 8) | (r << 16)).toString(16);
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
      if (typeof n === "number") {
        return true;
      } else if (i = n.length) {
        //given array, or semi-array
        while ((i -= 1) >= 0) {
          if (typeof n[i] !== "number") {
            throw new TypeError(caller + param +": Parameter must be a number.");
          }
        }
        return true;
      } else {
        throw new TypeError(caller + param +": Parameter must be a number.");
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

    check_event_type: function (evt, caller, param) {
      if (evt && (evt.toString() === "[object Event]" ||
                  evt.toString() === "[object MouseEvent]")) {
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
