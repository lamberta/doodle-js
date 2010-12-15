(function () {
  /*
   * Throws a TypeError if the test fails.
   * @param {boolean} testp
   * @return {boolean} True on success.
   * @throws {TypeError} On test being false.
   * @throws {SyntaxError} On invalid invocation.
   */
  function assert_type (testp) {
    if (typeof testp !== 'boolean') {
      throw new SyntaxError("assert_type(test): Argument must be a boolean value.");
    }
    if (testp === false) {
      throw new TypeError();
    }
    return testp;
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
      if (arguments.length > 3 || typeof type !== 'string') {
        throw new SyntaxError("assert_object_type(arg, type, inheritsp): Invalid arguments.");
      }
      type = "[object " + type + "]";
      inheritsp = (typeof inheritsp === 'boolean') ? inheritsp : false;
      while (obj) {
        if (Object.prototype.toLocaleString.call(obj) === type) {
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
  function check_arg_type (arg, type, inheritsp) {
    if (arguments.length > 3 || typeof type !== 'string') {
      throw new SyntaxError("check_arg_type(arg, type, inheritsp): Invalid parameters.");
    }
    try {
      if (arg === undefined || arg === null) {
        throw new TypeError();
      }
      switch (type) {
      /* JavaScript types
       */
      case 'boolean':
      case 'number':
      case 'string':
      case 'function':
      case 'object':
        assert_type(typeof arg === type);
        break;
      case 'array':
        assert_type(Array.isArray(arg));
        break;
        
      /* HTML types
       */
      case 'block':
        assert_type(doodle.utils.get_style_property(element, 'display') === 'block');
        break;
      case 'canvas':
      case 'HTMLCanvasElement':
        assert_object_type(arg, 'HTMLCanvasElement', inheritsp);
        break;
      case 'context':
      case 'CanvasRenderingContext2D':
        assert_object_type(arg, 'CanvasRenderingContext2D', inheritsp);
        break;

      /* Geom objects are defined by key numeric properties, not by instantiation.
       */
      case 'Point':
        doodle.utils.type_check(arg.x, 'number', arg.y, 'number');
        break;
      case 'Rectangle':
        doodle.utils.type_check(arg.x, 'number', arg.y, 'number', arg.width, 'number', arg.height, 'number', arg.top, 'number', arg.bottom, 'number', arg.left, 'number', arg.right, 'number');
        break;
      case 'Matrix':
        doodle.utils.type_check(arg.a, 'number', arg.b, 'number', arg.c, 'number', arg.d, 'number', arg.tx, 'number', arg.ty, 'number');
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
      default:
        throw new SyntaxError("check_arg_type(arg, *type*): Unknown type '" + type + "'.");
      }
    } catch (err) {
      if (err instanceof TypeError) {
        //we'll be using these when formating the error message
        err.arg = arg;
        err.type = type;
      }
      throw err;
    }
    return true;
  }

  /**
   * @param {number} arg_count Number of arguments we're checking.
   * @param {object} options
   */
  function check_params (arg_count, options) {
    //passed args must come in pairs and have at least 2
    if (arg_count < 2 || arg_count % 2 !== 0) {
      throw new SyntaxError("type_check(arg, type, [arg, type, ... options, callback]): Invalid arguments.");
    }
    //check options
    if (typeof options !== 'object') {
      throw new TypeError("check_options(options): Argument must be an object.");
    }
    if (options.trace === undefined) {
      options.trace = true;
    } else if (typeof options.trace !== 'boolean') {
      throw new TypeError("check_options: options.trace must be a boolean.");
    }
    if (options.params !== undefined) {
      if (!Array.isArray(options.params)) {
        throw new TypeError("type_check: options.params must be an array.");
      } else if (options.params.length !== arg_count/2) {
        throw new SyntaxError("type_check: options.params must correspond to the supplied args.");
      }
    }
    if (options.label !== undefined && typeof options.label !== 'string') {
      throw new TypeError("type_check: options.label must be a string.");
    }
    if (options.message !== undefined && typeof options.message !== 'string') {
      throw new TypeError("type_check: options.message must be a string.");
    }
    if (options.inherits !== undefined && typeof options.inherits !== 'boolean') {
      throw new TypeError("type_check: options.inherits must be a boolean.");
    }
  }

  function format_error_message (err, options) {
    if (options.message) {
      err.message = options.message;
    } else {
      err.message = err.arg + " must be of type '" + err.type + "'.";
    }
    if (options.label) {
      if (options.params) {
        //highlight the parameter invalid parameter
        options.params[err.i] = "*" + options.params[err.i] + "*";
        options.label = options.label + "(" + options.params.toString() + ")";
      }
      err.message = options.label + ": " + err.message;
    }
    //remove our extra properties
    delete err.i;
    delete err.arg;
    delete err.type;
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
  doodle.utils.type_check = function (arg, type, /*[arg, type, ...]*/ options, callback) {
    var args = Array.prototype.slice.call(arguments),
        len = args.length,
        last_arg = args[len-1],
        i = 0;
    //pop off the optional callback and options
    if (typeof last_arg === 'function') {
      callback = args.pop();
      len = args.length;
      last_arg = args[len-1];
    }
    if (typeof last_arg === 'object') {
      options = args.pop();
      len = args.length;
    } else {
      options = {trace: true};
    }
    check_params(len, options);
    
    /* loop over args taking 2 at a time
     * check_arg_type throws a TypeError on failure, pass options.params index with it
     */
    try {
      for (; i < len; i++) {
        if (i % 2 === 0) {
          try {
            check_arg_type(args[i], args[i+1], options.inherits);
          } catch (err) {
            err.i = i/2; //options.params index
            throw err;
          }
        }
      }
    } catch (err) {
      if (err instanceof TypeError) {
        format_error_message(err, options);
        if (options.trace) {
          console.trace();
        }
        //if callback present, run instead of throwing error
        if (typeof callback === 'function') {
          callback(err.arg, err.type, options);
        } else {
          throw err;
        }
      } else {
        //unexpected error
        throw err;
      }
    }
  };//end type_check
}());
