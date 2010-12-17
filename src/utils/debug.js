/*DEBUG*/
/*jslint nomen: false, plusplus: false*/
/*globals doodle, console*/

doodle.utils.debug = {};

(function () {
  /*
   * Throws a given error type if the test fails.
   * @param {boolean} testp
   * @param {function} Err Error constructor.
   * @return {boolean} True on success.
   * @throws {Error} On test being false.
   */
  function assert_error (testp, Err) {
    if (testp === true) {
      return true;
    }
    throw new Err();
  }

  /*
   * Throws a TypeError if object doesn't match type.
   * @param {object} obj
   * @param {string} type
   * @param {boolean} inheritsp Check object prototypes if it matches type.
   * @throws {TypeError} On test being false.
   * @throws {SyntaxError} On invalid invocation.
   */
  function assert_object_type (obj, type, inheritsp) {
    if (typeof obj === 'object') {
      type = "[object " + type + "]";
      inheritsp = (typeof inheritsp === 'boolean') ? inheritsp : false;
      while (obj) {
        if (obj.toString() === type) {
          return true;
        } else {
          obj = inheritsp ? Object.getPrototypeOf(obj) : null;
        }
      }
    }
    throw new TypeError();
  }

  /*
   * @param {*} arg Object to check type of.
   * @param {string} type Supported type.
   * @return {boolean}
   * @throws {TypeError} On type failure.
   * @throws {SyntaxError} On invalid invocation.
   */
  function test_type (arg, type, inheritsp) {
    //automatically throw error
    if (arg === undefined || arg === null) {
      throw new TypeError();
    }
    
    switch (type) {
      /* JavaScript types
       */
    case 'number':
    case 'string':
    case 'boolean':
    case 'function':
    case 'object':
      assert_error(typeof arg === type, TypeError);
      break;
    case 'array':
      assert_error(Array.isArray(arg), TypeError);
      break;
      
      /* Geom objects are defined by key numeric properties, not by instantiation.
       */
    case 'Point':
      assert_error(typeof arg.x === 'number', TypeError);
      assert_error(typeof arg.y === 'number', TypeError);
      break;
    case 'Rectangle':
      assert_error(typeof arg.x === 'number', TypeError);
      assert_error(typeof arg.y === 'number', TypeError);
      assert_error(typeof arg.width === 'number', TypeError);
      assert_error(typeof arg.height === 'number', TypeError);
      break;
    case 'Matrix':
      assert_error(typeof arg.a === 'number', TypeError);
      assert_error(typeof arg.b === 'number', TypeError);
      assert_error(typeof arg.c === 'number', TypeError);
      assert_error(typeof arg.d === 'number', TypeError);
      assert_error(typeof arg.tx === 'number', TypeError);
      assert_error(typeof arg.ty === 'number', TypeError);
      break;

      //Events
    case 'Event':
    case 'UIEvent':
    case 'MouseEvent':
    case 'TouchEvent':
    case 'TextEvent':
    case 'KeyboardEvent':
      //Doodle objects
    case 'EventDispatcher':
    case 'Node':
    case 'Sprite':
    case 'Graphics':
    case 'ElementNode':
    case 'Layer':
    case 'Display':
      //Doodle primitives
    case 'Image':
    case 'Text':
      assert_object_type(arg, type, inheritsp);
      break;

      /* HTML types
       */
    case 'block':
      assert_error(doodle.utils.get_style_property(arg, 'display') === 'block', TypeError);
      break;
    case 'canvas':
    case 'HTMLCanvasElement':
      assert_object_type(arg, 'HTMLCanvasElement', inheritsp);
      break;
    case 'context':
    case 'CanvasRenderingContext2D':
      assert_object_type(arg, 'CanvasRenderingContext2D', inheritsp);
      break;
      
    default:
      throw new SyntaxError("check_arg_type(arg, *type*, inheritsp): Unknown type '" + type + "'.");
    }
    return true;
  }
  
  /**
   * Options object checks run for all types.
   * @param {object} options
   * @param {number} arg_count Number of arguments we're checking, indicates TypeError.
   */
  function check_options (options, arg_count) {
    //check options
    if (typeof options !== 'object') {
      throw new TypeError("check_options(options): Argument must be an object.");
    }
    if (options.trace === undefined) {
      options.trace = true;
    } else if (typeof options.trace !== 'boolean') {
      throw new TypeError("check_options: options.trace must be a boolean.");
    }
    if (options.label !== undefined && typeof options.label !== 'string') {
      throw new TypeError("check_options: options.label must be a string.");
    }
    if (options.id !== undefined && typeof options.id !== 'string') {
      throw new TypeError("check_options: options.id must be a string.");
    }
    if (options.message !== undefined && typeof options.message !== 'string') {
      throw new TypeError("check_options: options.message must be a string.");
    }
    if (options.params !== undefined) {
      if (typeof options.params === 'string') { options.params = [options.params]; }
      if (!Array.isArray(options.params)) {
        throw new TypeError("check_options: options.params must be a string or an array of strings.");
      }
    }
    if (typeof arg_count === 'number') {
      //passed args must come in pairs and have at least 2
      if (arg_count < 2 || arg_count % 2 !== 0) {
        throw new SyntaxError("type_check(arg, type, [arg, type, ... options, callback]): Invalid arguments.");
      }
      if (options.inherits !== undefined && typeof options.inherits !== 'boolean') {
        throw new TypeError("type_check: options.inherits must be a boolean.");
      }
      if (options.params !== undefined) {
        if (!Array.isArray(options.params) || options.params.length !== arg_count/2) {
          throw new SyntaxError("check_options: options.params must correspond to the supplied args.");
        }
      }
    }
  }

  function format_type_error_message (err, options, arg, type, index, arg_count) {
    check_options(options, arg_count);
    if (options.message) {
      err.message = options.message;
    } else {
      err.message = arg + " must be of type '" + type + "'.";
    }
    if (options.label) {
      if (options.id) {
        options.label = "[id=" + options.id + "] " + options.label;
      }
      if (options.params) {
        //highlight the parameter invalid parameter
        options.params[index/2] = "*" + options.params[index/2] + "*";
        options.label = options.label + "(" + options.params.toString() + ")";
      }
      err.message = options.label + ": " + err.message;
    }
  }
  
  function format_error_message (err, options) {
    check_options(options);
    if (options.message) {
      err.message = options.message;
    } else {
      err.message = "Invalid arguments.";
    }
    if (options.label) {
      if (options.id) {
        options.label = "[id=" + options.id + "] " + options.label;
      }
      if (options.params) {
        options.label = options.label + "(" + options.params.toString() + ")";
      }
      err.message = options.label + ": " + err.message;
    }
  }

  /**
   * @name type_check
   * @param {*} Argument to type check.
   * @param {type} arg type Name of type.
   * @param {object=} options Error message printing options
   *    options: {
   *      //logging
   *      trace: {boolean}, Print stack trace to console, default true
   *      label: {string}, Function name to print in error message.
   *      params: {array}, Function parameter names to print in error message.
   *      message: {string}, Custom error message to print.
   *      //type test
   *      inherits: {boolean} Does the arg inherit from the prototype, default false.
   *    }
   * @param {function(*, string, object)=} callback Function to run if a TypeError is thrown.
   * @throws {SyntaxError}
   * @throws {TypeError}
   */
  doodle.utils.debug.type_check = function (arg, type, /*[arg, type, ...]*/ options, callback) {
    arg = Array.prototype.slice.call(arguments);
    callback = (typeof arg[arg.length-1] === 'function') ? arg.pop() : null;
    options = (typeof arg[arg.length-1] === 'object') ? arg.pop() : {trace: true};
    //iterate args taking 2 at a time
    for (var i=0, len=arg.length; i < len; i++) {
      if (i % 2 === 0) {
        try {
          test_type(arg[i], arg[i+1], options.inherits);
        } catch (error) {
          if (error instanceof TypeError) {
            format_type_error_message(error, options, arg[i], arg[i+1], i, len);
            if (options.trace) { console.trace(); }
            if (callback) {
              callback(error, arg[i], arg[i+1]);
              return false;
            }
          }
          throw error;
        }
      }
    }
    return true;
  };

  /**
   * @name range_check
   */
  doodle.utils.debug.range_check = function (test, /*[test, ...]*/ options, callback) {
    test = Array.prototype.slice.call(arguments);
    callback = (typeof test[test.length-1] === 'function') ? test.pop() : null;
    options = (typeof test[test.length-1] === 'object') ? test.pop() : {trace: true};
    //iterate args taking 2 at a time
    for (var i=0, len=test.length; i < len; i++) {
      try {
        assert_error(test[i], RangeError);
      } catch (error) {
        if (error instanceof RangeError) {
          format_error_message(error, options);
          if (options.trace) { console.trace(); }
          if (callback) {
            callback(error);
            return false;
          }
        }
        throw error;
      }
    }
    return true;
  };

  /**
   * @name reference_check
   */
  doodle.utils.debug.reference_check = function (test, /*[test, ...]*/ options, callback) {
    test = Array.prototype.slice.call(arguments);
    callback = (typeof test[test.length-1] === 'function') ? test.pop() : null;
    options = (typeof test[test.length-1] === 'object') ? test.pop() : {trace: true};
    //iterate args taking 2 at a time
    for (var i=0, len=test.length; i < len; i++) {
      try {
        assert_error(test[i], ReferenceError);
      } catch (error) {
        if (error instanceof ReferenceError) {
          format_error_message(error, options);
          if (options.trace) { console.trace(); }
          if (callback) {
            callback(error);
            return false;
          }
        }
        throw error;
      }
    }
    return true;
  };

}());
/*END_DEBUG*/
