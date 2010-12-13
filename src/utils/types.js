/**
 * Doodle type-checking functions.
 * @name doodle.utils.types
 * @class
 * @augments Object
 * @static
 */
doodle.utils.types = Object.create({}, (function () {

  function assert_type (test, arg, type) {
    if (test === false) {
      var err = new TypeError(arg + " must be of type '" + type + "'");
      err.arg = arg;
      err.type = type;
      throw err;
    } else {
      return true;
    }
  }
  
  function check_arg_type (arg, type) {
    if (typeof type !== 'string') {
      throw new SyntaxError("check_arg_type(arg, type): Invalid type.");
    }
    switch (type) {
    case 'boolean':
      assert_type(typeof arg === 'boolean', arg, type);
      break;
    case 'number':
      assert_type(typeof arg === 'number', arg, type);
      break;
    case 'string':
      assert_type(typeof arg === 'string', arg, type);
      break;
    case 'function':
      assert_type(typeof arg === 'function', arg, type);
      break;
    case 'object':
      assert_type(typeof arg === 'object', arg, type);
      break;
    case 'array':
      assert_type(Array.isArray(arg), arg, type);
      break;
    case 'canvas':
      assert_type(Object.prototype.toLocaleString.call(arg) === '[object HTMLCanvasElement]', arg, type);
      break;
    case 'context':
      assert_type(Object.prototype.toLocaleString.call(arg) === '[object CanvasRenderingContext2D]', arg, type);
      break;
    case 'block':
      assert_type(doodle.utils.get_style_property(element, 'display') === 'block', arg, type);
      break;
    case 'Display':
      assert_type(Object.prototype.toLocaleString.call(arg) === '[object Display]', arg, type);
      break;
    case 'Event':
      assert_type(Object.prototype.toLocaleString.call(arg) === '[object Event]', arg, type);
      break;
    case 'MouseEvent':
      assert_type(Object.prototype.toLocaleString.call(arg) === '[object MouseEvent]', arg, type);
      break;
    default:
      throw new SyntaxError("check_arg_type(arg, type): Unknown type.");
    }
  }

  /**
   * @name check_type
   * @param {*} Argument to type check.
   * @param {type} arg type Name of type.
   * @param {function=} callback Function to run if a TypeError is thrown.
   * @throws {SyntaxError}
   * @throws {TypeError}
   */
  doodle.utils.type_check = function (arg, type, /*[arg, type, ...]*/ callback) {
    var args = Array.prototype.slice.call(arguments),
        len = args.length,
        i = 0;
    if (typeof args[len-1] === 'function') {
      callback = args.pop();
      len = args.length;
    }
    if (len % 2 !== 0) {
      throw new SyntaxError("type_check: Each argument must have an associated type.");
    }
    try {
      for (; i < len; i++) {
        if (i % 2 === 0) {
          check_arg_type(args[i], args[i+1]);
        }
      }
    } catch (err) {
      if (err instanceof TypeError) {
        if (typeof callback === 'function') {
          callback(err.arg, err.type);
        } else {
          console.trace();
          throw err;
        }
      } else {
        throw err;
      }
    }
  }

  /**
   * @name throw_type_error
   * @param {string} type Name of type.
   * @param {string=} caller Name of calling function.
   * @param {string=} params Parameter names for function.
   * @throws {TypeError}
   * @static
   * @private
   */
  function throw_type_error (type, caller, params) {
    if (typeof type !== 'string') {
      throw new TypeError("throw_type_error: type must be a string.");
    }
    caller = (caller === undefined) ? "throw_type_error" : caller;
    params = (params === undefined || params === null) ? "" : '('+params+')';
    throw new TypeError(caller + params +": Parameter must be a "+ type +".");
  }
  
  return {
    /**
     * Type-checking for a number. Throws a TypeError if the test fails.
     * @name check_number_type
     * @param {Object} obj Object to test.
     * @param {string} caller Function name to print in error message.
     * @param {string} param Parameters to print in error message.
     * @return {boolean}
     * @throws {TypeError}
     * @static
     */
    'check_number_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (obj, caller, params) {
        return (typeof obj === 'number') ?
          true : throw_type_error('number', caller || 'check_number_type', params);
      }
    },

    /**
     * @name check_boolean_type
     * @param {boolean} bool
     * @param {string} caller Function name to print in error message.
     * @param {string} param Parameters to print in error message.
     * @return {boolean}
     * @throws {TypeError}
     * @static
     */
    'check_boolean_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (bool, caller, params) {
        return (typeof bool === 'boolean') ?
          true : throw_type_error('boolean', caller || 'check_boolean_type', params);
      }
    },

    /**
     * @name check_string_type
     * @param {string}
     * @param {string} caller
     * @param {string} params
     * @return {boolean}
     * @throws {TypeError}
     * @static
     */
    'check_string_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (str, caller, params) {
        return (typeof str === 'string') ?
          true : throw_type_error('string', caller || 'check_string_type', params);
      }
    },

    /**
     * @name check_function_type
     * @param {Function} fn
     * @param {string} caller
     * @param {string} params
     * @return {boolean}
     * @throws {TypeError}
     * @static
     */
    'check_function_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (fn, caller, params) {
        return (typeof fn === 'function') ?
          true : throw_type_error('function', caller || 'check_function_type', params);
      }
    },

    /**
     * @name check_array_type
     * @param {Array} array
     * @param {string} caller
     * @param {string} params
     * @return {boolean}
     * @throws {TypeError}
     * @static
     */
    'check_array_type': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (array, caller, params) {
        return (Array.isArray(array)) ?
          true : throw_type_error('array', caller || 'check_array_type', params);
      }
    },

    /**
     * @name check_canvas_type
     * @param {HTMLCanvasElement} canvas
     * @param {string} caller
     * @param {string} params
     * @return {boolean}
     * @throws {TypeError}
     * @static
     */
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

    /**
     * @name check_context_type
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} caller
     * @param {string} params
     * @return {boolean}
     * @throws {TypeError}
     * @static
     */
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

    /**
     * @name check_block_element
     * @param {HTMLElement} element
     * @param {string} caller
     * @param {string} params
     * @return {boolean}
     * @throws {TypeError}
     * @static
     */
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
