"use strict";

/* Intro
 *
 */

//the global object
var doodle = {};
doodle.utils = {};
//packages
doodle.geom = {};
doodle.events = {};

/* ES5 compatibility
 */
  
if (typeof Function.prototype.bind !== 'function') {
  Function.prototype.bind = function (thisArg /*, args...*/) {
    var fn = this;
    return function () {
      return fn.apply(thisArg, arguments);
    };
  };
}
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
   * Tests an object to see if it's an Event type.
   * For DOM events it tests the constuctor name.
   */
  function assert_event_type (obj, type, inheritsp) {
    if (typeof obj === 'object') {
      var type_str = "[object " + type + "]";
      inheritsp = (typeof inheritsp === 'boolean') ? inheritsp : false;
      while (obj) {
        if (obj.toString() === type_str || (obj.constructor && obj.constructor.name === type)) {
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
    switch (type) {
      //any type will match
    case '*':
      return true;
      /* JavaScript types
       */
    case 'undefined':
      assert_error(arg === undefined, TypeError);
      break;
    case 'null':
      assert_error(arg === null, TypeError);
      break;
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
      assert_event_type(arg, type, inheritsp);
      break;
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
/*globals doodle, document*/
(function () {
  /*DEBUG*/
  var type_check = doodle.utils.debug.type_check;
  /*END_DEBUG*/
  
  /**
   * Doodle utilty functions.
   * @name doodle.utils
   * @class
   * @augments Object
   * @static
   */
  Object.defineProperties(doodle.utils, {
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
        type_check(color,'number', {label:'hex_to_rgb', params:'color', message:"Invalid color format [0xffffff|#ffffff]."});
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
        type_check(color,'*', alpha,'number', {label:'hex_to_rgb_str', params:['color','alpha']});
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
        type_check(rgb_str,'string', {label:'rgb_str_to_hex', params:'color', message:"Paramater must be a RGB string."});
        /*END_DEBUG*/   
        var doodle_utils = doodle.utils,
            rgb = doodle_utils.rgb_str_to_rgb(rgb_str);
        /*DEBUG*/
        console.assert(Array.isArray(rgb), "rgb is an array", rgb);
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
          type_check(color,'string', {label:'rgb_str_to_rgb', params:'color', message:"Parameter must be in RGB string format: 'rgba(n, n, n, n)'."});
          /*END_DEBUG*/
          color = color.trim().match(rgb_regexp);
          /*DEBUG*/
          //if it's not an array, it didn't parse correctly
          console.assert(Array.isArray(color), "color is an array", color);
          /*END_DEBUG*/
          var rgb = [parseInt(color[1], 10), parseInt(color[2], 10), parseInt(color[3], 10)], alpha = parseFloat(color[4]);
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
        type_check(r,'number', g,'number', b,'number', {label:'rgb_to_hex', params:['r','g','b']});
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
        type_check(r,'number', g,'number', b,'number', a,'number', {label:'rgb_to_rgb_str', params:['r','g','b','a']});
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
        type_check(element,'*', property,'string', useComputedStyle,'boolean', {label:'get_style_property', params:['element','property','useComputedStyle']});
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
        type_check(element,'*', property,'string', value,'*', type,'string', {label:'set_style_property', params:['element','property','value','type']});
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
      value: function create_scene_path (node, array, clearArray) {
        array = (array === undefined) ? [] : array;
        clearArray = (clearArray === undefined) ? false : clearArray;
        /*DEBUG*/
        type_check(node,'Node', array,'array', clearArray,'boolean', {label:'create_scene_path', params:['node','array','clearArray'], inherits:true});
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
      }
    }
    
  });

}());
/*DEBUG_STATS*/
/*
 * stats.js r5
 * http://github.com/mrdoob/stats.js
 *
 * Released under MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * How to use:
 *
 *  var stats = new Stats();
 *  parentElement.appendChild( stats.domElement );
 *
 *  setInterval(function () {
 *
 *  	stats.update();
 *
 *  }, 1000/60);
 *
 */

var Stats = function () {

	var _mode = 0, _modesCount = 2, _container,
	_frames = 0, _time = new Date().getTime(), _timeLastFrame = _time, _timeLastSecond = _time,
	_fps = 0, _fpsMin = 1000, _fpsMax = 0, _fpsDiv, _fpsText, _fpsCanvas, _fpsContext, _fpsImageData,
	_ms = 0, _msMin = 1000, _msMax = 0, _msDiv, _msText, _msCanvas, _msContext, _msImageData,
	_mem = 0, _memMin = 1000, _memMax = 0, _memDiv, _memText, _memCanvas, _memContext, _memImageData,
	_colors = {
		fps: {
			bg: { r: 16, g: 16, b: 48 },
			fg: { r: 0, g: 255, b: 255 }
		},
		ms: {
			bg: { r: 16, g: 48, b: 16 },
			fg: { r: 0, g: 255, b: 0 }
		},
		mem: {
			bg: { r: 48, g: 16, b: 26 },
			fg: { r: 255, g: 0, b: 128 }
		}
	};

	_container = document.createElement( 'div' );
	_container.style.fontFamily = 'Helvetica, Arial, sans-serif';
	_container.style.textAlign = 'left';
	_container.style.fontSize = '9px';
	_container.style.opacity = '0.9';
	_container.style.width = '80px';
	_container.style.cursor = 'pointer';
	_container.addEventListener( 'click', swapMode, false );

	// fps

	_fpsDiv = document.createElement( 'div' );
	_fpsDiv.style.backgroundColor = 'rgb(' + Math.floor( _colors.fps.bg.r / 2 ) + ',' + Math.floor( _colors.fps.bg.g / 2 ) + ',' + Math.floor( _colors.fps.bg.b / 2 ) + ')';
	_fpsDiv.style.padding = '2px 0px 3px 0px';
	_container.appendChild( _fpsDiv );

	_fpsText = document.createElement( 'div' );
	_fpsText.innerHTML = '<strong>FPS</strong>';
	_fpsText.style.color = 'rgb(' + _colors.fps.fg.r + ',' + _colors.fps.fg.g + ',' + _colors.fps.fg.b + ')';
	_fpsText.style.margin = '0px 0px 1px 3px';
	_fpsDiv.appendChild( _fpsText );

	_fpsCanvas = document.createElement( 'canvas' );
	_fpsCanvas.width = 74;
	_fpsCanvas.height = 30;
	_fpsCanvas.style.display = 'block';
	_fpsCanvas.style.marginLeft = '3px';
	_fpsDiv.appendChild( _fpsCanvas );

	_fpsContext = _fpsCanvas.getContext( '2d' );
	_fpsContext.fillStyle = 'rgb(' + _colors.fps.bg.r + ',' + _colors.fps.bg.g + ',' + _colors.fps.bg.b + ')';
	_fpsContext.fillRect( 0, 0, _fpsCanvas.width, _fpsCanvas.height );

	_fpsImageData = _fpsContext.getImageData( 0, 0, _fpsCanvas.width, _fpsCanvas.height );

	// ms

	_msDiv = document.createElement( 'div' );
	_msDiv.style.backgroundColor = 'rgb(' + Math.floor( _colors.ms.bg.r / 2 ) + ',' + Math.floor( _colors.ms.bg.g / 2 ) + ',' + Math.floor( _colors.ms.bg.b / 2 ) + ')';
	_msDiv.style.padding = '2px 0px 3px 0px';
	_msDiv.style.display = 'none';
	_container.appendChild( _msDiv );

	_msText = document.createElement( 'div' );
	_msText.innerHTML = '<strong>MS</strong>';
	_msText.style.color = 'rgb(' + _colors.ms.fg.r + ',' + _colors.ms.fg.g + ',' + _colors.ms.fg.b + ')';
	_msText.style.margin = '0px 0px 1px 3px';
	_msDiv.appendChild( _msText );

	_msCanvas = document.createElement( 'canvas' );
	_msCanvas.width = 74;
	_msCanvas.height = 30;
	_msCanvas.style.display = 'block';
	_msCanvas.style.marginLeft = '3px';
	_msDiv.appendChild( _msCanvas );

	_msContext = _msCanvas.getContext( '2d' );
	_msContext.fillStyle = 'rgb(' + _colors.ms.bg.r + ',' + _colors.ms.bg.g + ',' + _colors.ms.bg.b + ')';
	_msContext.fillRect( 0, 0, _msCanvas.width, _msCanvas.height );

	_msImageData = _msContext.getImageData( 0, 0, _msCanvas.width, _msCanvas.height );

	// mem

	try { 

		if ( webkitPerformance && webkitPerformance.memory.totalJSHeapSize ) {

			_modesCount = 3;

		}

	} catch ( error ) { };

	_memDiv = document.createElement( 'div' );
	_memDiv.style.backgroundColor = 'rgb(' + Math.floor( _colors.mem.bg.r / 2 ) + ',' + Math.floor( _colors.mem.bg.g / 2 ) + ',' + Math.floor( _colors.mem.bg.b / 2 ) + ')';
	_memDiv.style.padding = '2px 0px 3px 0px';
	_memDiv.style.display = 'none';
	_container.appendChild( _memDiv );

	_memText = document.createElement( 'div' );
	_memText.innerHTML = '<strong>MEM</strong>';
	_memText.style.color = 'rgb(' + _colors.mem.fg.r + ',' + _colors.mem.fg.g + ',' + _colors.mem.fg.b + ')';
	_memText.style.margin = '0px 0px 1px 3px';
	_memDiv.appendChild( _memText );

	_memCanvas = document.createElement( 'canvas' );
	_memCanvas.width = 74;
	_memCanvas.height = 30;
	_memCanvas.style.display = 'block';
	_memCanvas.style.marginLeft = '3px';
	_memDiv.appendChild( _memCanvas );

	_memContext = _memCanvas.getContext( '2d' );
	_memContext.fillStyle = '#301010';
	_memContext.fillRect( 0, 0, _memCanvas.width, _memCanvas.height );

	_memImageData = _memContext.getImageData( 0, 0, _memCanvas.width, _memCanvas.height );

	function updateGraph( data, value, color ) {

		var x, y, index;

		for ( y = 0; y < 30; y++ ) {

			for ( x = 0; x < 73; x++ ) {

				index = (x + y * 74) * 4;

				data[ index ] = data[ index + 4 ];
				data[ index + 1 ] = data[ index + 5 ];
				data[ index + 2 ] = data[ index + 6 ];

			}

		}

		for ( y = 0; y < 30; y++ ) {

			index = (73 + y * 74) * 4;

			if ( y < value ) {

				data[ index ] = _colors[ color ].bg.r;
				data[ index + 1 ] = _colors[ color ].bg.g;
				data[ index + 2 ] = _colors[ color ].bg.b;

			} else {

				data[ index ] = _colors[ color ].fg.r;
				data[ index + 1 ] = _colors[ color ].fg.g;
				data[ index + 2 ] = _colors[ color ].fg.b;

			}

		}

	}

	function swapMode() {

		_mode ++;
		_mode == _modesCount ? _mode = 0 : _mode;

		_fpsDiv.style.display = 'none';
		_msDiv.style.display = 'none';
		_memDiv.style.display = 'none';

		switch( _mode ) {

			case 0:

				_fpsDiv.style.display = 'block';

				break;

			case 1:

				_msDiv.style.display = 'block';

				break;

			case 2:

				_memDiv.style.display = 'block';

				break;
		}

	}

	return {

		domElement: _container,

		update: function () {

			_frames ++;

			_time = new Date().getTime();

			_ms = _time - _timeLastFrame;
			_msMin = Math.min( _msMin, _ms );
			_msMax = Math.max( _msMax, _ms );

			updateGraph( _msImageData.data, Math.min( 30, 30 - ( _ms / 200 ) * 30 ), 'ms' );

			_msText.innerHTML = '<strong>' + _ms + ' MS</strong> (' + _msMin + '-' + _msMax + ')';
			_msContext.putImageData( _msImageData, 0, 0 );

			_timeLastFrame = _time;

			if ( _time > _timeLastSecond + 1000 ) {

				_fps = Math.round( ( _frames * 1000) / ( _time - _timeLastSecond ) );
				_fpsMin = Math.min( _fpsMin, _fps );
				_fpsMax = Math.max( _fpsMax, _fps );

				updateGraph( _fpsImageData.data, Math.min( 30, 30 - ( _fps / 100 ) * 30 ), 'fps' );

				_fpsText.innerHTML = '<strong>' + _fps + ' FPS</strong> (' + _fpsMin + '-' + _fpsMax + ')';
				_fpsContext.putImageData( _fpsImageData, 0, 0 );

				if ( _modesCount == 3 ) {

					_mem = webkitPerformance.memory.usedJSHeapSize * 0.000000954;
					_memMin = Math.min( _memMin, _mem );
					_memMax = Math.max( _memMax, _mem );

					updateGraph( _memImageData.data, Math.min( 30, 30 - ( _mem / 2 ) ), 'mem' );

					_memText.innerHTML = '<strong>' + Math.round( _mem ) + ' MEM</strong> (' + Math.round( _memMin ) + '-' + Math.round( _memMax ) + ')';
					_memContext.putImageData( _memImageData, 0, 0 );

				}

				_timeLastSecond = _time;
				_frames = 0;

			}

		}

	};

};
/*END_DEBUG_STATS*/
/**
 * @name doodle.Keyboard
 * @class
 * @static
 */
Object.defineProperty(doodle, 'Keyboard', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name BACKSPACE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'BACKSPACE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 8
    },

    /**
     * @name TAB
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'TAB': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 9
    },

    /**
     * @name ENTER
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'ENTER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 13
    },

    /**
     * @name COMMAND
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'COMMAND': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 15
    },

    /**
     * @name SHIFT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SHIFT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 16
    },

    /**
     * @name CONTROL
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'CONTROL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 17
    },

    /**
     * @name ALTERNATE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'ALTERNATE': { //Option key
      enumerable: true,
      writable: false,
      configurable: false,
      value: 18
    },

    /**
     * @name PAUSE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'PAUSE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 19
    },

    /**
     * @name CAPS_LOCK
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'CAPS_LOCK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 20
    },

    /**
     * @name NUMPAD
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 21
    },

    /**
     * @name ESCAPE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'ESCAPE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 27
    },

    /**
     * @name SPACE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SPACE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 32
    },

    /**
     * @name PAGE_UP
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'PAGE_UP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 33
    },

    /**
     * @name PAGE_DOWN
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'PAGE_DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 34
    },

    /**
     * @name END
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'END': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 35
    },

    /**
     * @name HOME
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'HOME': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 36
    },

    /* ARROWS
     */

    /**
     * @name LEFT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'LEFT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 37
    },

    /**
     * @name UP
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'UP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 38
    },

    /**
     * @name RIGHT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'RIGHT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 39
    },

    /**
     * @name DOWN
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 40
    },

    /**
     * @name INSERT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'INSERT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 45
    },

    /**
     * @name DELETE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'DELETE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 46
    },

    /* NUMBERS
     */

    /**
     * @name
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_0': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 48
    },

    /**
     * @name NUMBER_1
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_1': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 49
    },

    /**
     * @name NUMBER_2
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_2': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 50
    },

    /**
     * @name NUMBER_3
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_3': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 51
    },

    /**
     * @name NUMBER_4
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_4': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 52
    },

    /**
     * @name NUMBER_5
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_5': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 53
    },

    /**
     * @name NUMBER_6
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_6': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 54
    },

    /**
     * @name NUMBER_7
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_7': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 55
    },

    /**
     * @name NUMBER_8
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_8': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 56
    },

    /**
     * @name NUMBER_9
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_9': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 57
    },

    /* LETTERS
     */

    /**
     * @name A
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'A': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 65
    },

    /**
     * @name B
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'B': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 66
    },

    /**
     * @name C
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'C': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 67
    },

    /**
     * @name D
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'D': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 68
    },

    /**
     * @name E
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'E': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 69
    },

    /**
     * @name F
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 70
    },

    /**
     * @name G
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'G': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 71
    },

    /**
     * @name H
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'H': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 72
    },

    /**
     * @name I
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'I': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 73
    },

    /**
     * @name J
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'J': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 74
    },

    /**
     * @name K
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'K': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 75
    },

    /**
     * @name L
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'L': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 76
    },

    /**
     * @name M
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'M': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 77
    },

    /**
     * @name N
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'N': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 78
    },

    /**
     * @name O
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'O': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 79
    },

    /**
     * @name P
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'P': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 80
    },

    /**
     * @name Q
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'Q': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 81
    },

    /**
     * @name R
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'R': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 82
    },

    /**
     * @name S
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'S': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 83
    },

    /**
     * @name T
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'T': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 84
    },

    /**
     * @name U
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'U': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 85
    },

    /**
     * @name V
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'V': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 86
    },

    /**
     * @name W
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'W': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 87
    },

    /**
     * @name X
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'X': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 88
    },

    /**
     * @name Y
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'Y': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 89
    },

    /**
     * @name Z
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'Z': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 90
    },

    /**
     * @name WINDOWS_KEY
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'WINDOWS_KEY': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 91
    },

    /* NUMBER PAD
     */

    /**
     * @name NUMPAD_0
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_0': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 96
    },

    /**
     * @name NUMPAD_1
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_1': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 97
    },

    /**
     * @name NUMPAD_2
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_2': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 98
    },

    /**
     * @name NUMPAD_3
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_3': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 99
    },

    /**
     * @name NUMPAD_4
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_4': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 100
    },

    /**
     * @name NUMPAD_5
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_5': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 101
    },

    /**
     * @name NUMPAD_6
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_6': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 102
    },

    /**
     * @name NUMPAD_7
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_7': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 103
    },

    /**
     * @name NUMPAD_8
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_8': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 104
    },

    /**
     * @name NUMPAD_9
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_9': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 105
    },

    /**
     * @name NUMPAD_MULTIPLY
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_MULTIPLY': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 106
    },

    /**
     * @name NUMPAD_ADD
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_ADD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 107
    },

    /**
     * @name NUMPAD_ENTER
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_ENTER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 108
    },

    /**
     * @name NUMPAD_SUBTRACT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_SUBTRACT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 109
    },

    /**
     * @name NUMPAD_DECIMAL
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_DECIMAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 110
    },

    /**
     * @name NUMPAD_DIVIDE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_DIVIDE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 111
    },

    /* FUNCTION KEYS
     */

    /**
     * @name F1
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F1': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 112
    },

    /**
     * @name F2
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F2': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 113
    },

    /**
     * @name F3
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F3': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 114
    },

    /**
     * @name F4
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F4': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 115
    },

    /**
     * @name F5
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F5': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 116
    },

    /**
     * @name F6
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F6': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 117
    },

    /**
     * @name F7
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F7': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 118
    },

    /**
     * @name F8
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F8': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 119
    },

    /**
     * @name F9
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F9': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 120
    },

    /**
     * @name F10
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F10': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 121
    },

    /**
     * @name F11
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F11': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 122
    },

    /**
     * @name F12
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F12': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 123
    },

    /**
     * @name F13
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F13': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 124
    },

    /**
     * @name F14
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F14': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 125
    },

    /**
     * @name F15
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F15': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 126
    },

    /**
     * @name SCROLL
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SCROLL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 145
    },

    /* PUNCTUATION
     */

    /**
     * @name SEMICOLON
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SEMICOLON': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 186
    },

    /**
     * @name EQUAL
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'EQUAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 187
    },

    /**
     * @name COMMA
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'COMMA': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 188
    },

    /**
     * @name MINUS
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'MINUS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 189
    },

    /**
     * @name PERIOD
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'PERIOD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 190
    },

    /**
     * @name SLASH
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SLASH': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 191
    },

    /**
     * @name BACKQUOTE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'BACKQUOTE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 192
    },

    /**
     * @name LEFTBRACKET
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'LEFTBRACKET': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 219
    },

    /**
     * @name BACKSLASH
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'BACKSLASH': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 220
    },

    /**
     * @name RIGHTBRACKET
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'RIGHTBRACKET': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 221
    },

    /**
     * @name QUOTE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'QUOTE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 222
    }
    
  })
});
/**
 * The GradientType class provides values for the type parameter in the
 * beginGradientFill() and lineGradientStyle() methods of the Graphics class.
 * @name doodle.GradientType
 * @class
 * @static
 */
Object.defineProperty(doodle, 'GradientType', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name LINEAR
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'LINEAR': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'linearGradient'
    },
    
    /**
     * @name RADIAL
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'RADIAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'radialGradient'
    }
  })
});
/**
 * @name doodle.Pattern
 * @class
 * @static
 */
Object.defineProperty(doodle, 'Pattern', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name REPEAT
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'REPEAT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat'
    },

    /**
     * @name REPEAT_X
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'REPEAT_X': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat-x'
    },

    /**
     * @name REPEAT_Y
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'REPEAT_Y': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'repeat-y'
    },

    /**
     * @name NO_REPEAT
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'NO_REPEAT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'no-repeat'
    }
  })
});
/**
 * @name doodle.LineCap
 * @class
 * @static
 */
Object.defineProperty(doodle, 'LineCap', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name BUTT
     * @return {string} [read-only] Default
     * @property
     * @constant
     * @static
     */
    'BUTT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'butt'
    },

    /**
     * @name ROUND
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'ROUND': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'round'
    },

    /**
     * @name SQUARE
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'SQUARE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'square'
    }
  })
});
/**
 * @name doodle.LineJoin
 * @class
 * @static
 */
Object.defineProperty(doodle, 'LineJoin', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name MITER
     * @return {string} [read-only] Default
     * @property
     * @constant
     * @static
     */
    'MITER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'miter'
    },

    /**
     * @name ROUND
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'ROUND': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'round'
    },

    /**
     * @name BEVEL
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'BEVEL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'bevel'
    }
  })
});
/*globals doodle, console*/

/* Will probably want to implement the dom event interface:
 * http://www.w3.org/TR/DOM-Level-3-Events/
 * But this works for now.
 */
(function () {
  var event_prototype,
      event_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent;
  
  /**
   * @name doodle.events.Event
   * @class
   * @augments Object
   * @param {string=} type
   * @param {boolean=} bubbles = false
   * @param {boolean=} cancelable = false
   * @return {doodle.events.Event}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.Event = function (type, bubbles, cancelable) {
    var event = Object.create(event_prototype),
        arg_len = arguments.length,
        init_obj, //function, event
        copy_event_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 3) {
      throw new SyntaxError("[object Event](type, bubbles, cancelable): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(event, event_static_properties);
    //properties that require privacy
    Object.defineProperties(event, (function () {
      var evt_type,
          evt_bubbles,
          evt_cancelable,
          evt_cancelBubble = false,
          evt_defaultPrevented = false,
          evt_eventPhase = 0,
          evt_currentTarget = null,
          evt_target = null,
          evt_srcElement = null,
          evt_timeStamp = new Date(),
          evt_returnValue = true,
          evt_clipboardData,
          //internal use
          __cancel = false,
          __cancelNow = false;

      /**
       * @name copy_event_properties
       * @param {doodle.events.Event} evt Event to copy properties from.
       * @param {Node|boolean|null=} resetTarget Set new event target or null.
       * @param {string|boolean=} resetType Set new event type.
       * @throws {TypeError}
       * @private
       */
      copy_event_properties = function (evt, resetTarget, resetType) {
        resetTarget = (resetTarget === undefined) ? false : resetTarget;
        resetType = (resetType === undefined) ? false : resetType;
        /*DEBUG*/
        console.assert(doodle.events.Event.isEvent(evt), "evt is Event.", this.id, evt);
        console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is false, null, or Node.", this.id, resetTarget);
        console.assert(resetType === false || typeof resetType === 'string', "resetType is false or string.", this.id, resetType);
        /*END_DEBUG*/
        if (resetTarget !== false) {
          evt_currentTarget = resetTarget;
          evt_target = resetTarget;
        } else {
          evt_currentTarget = evt.currentTarget;
          evt_target = evt.target;
        }
        if (resetType) {
          evt_type = resetType;
        } else {
          evt_type = evt.type;
        }
        evt_bubbles = evt.bubbles;
        evt_cancelable = evt.cancelable;
        evt_cancelBubble = evt.cancelBubble;
        evt_defaultPrevented = evt.defaultPrevented;
        evt_eventPhase = evt.eventPhase;
        evt_srcElement = evt.srcElement;
        evt_timeStamp = evt.timeStamp;
        evt_returnValue = evt.returnValue;
        evt_clipboardData = evt.clipboardData;
        //check for doodle internal event properties
        if (evt.__cancel) { __cancel = true; }
        if (evt.__cancelNow) { __cancelNow = true; }
      };
      
      return {
        /**
         * @name id
         * @return {string}
         */
        'id': (function () {
          var id = null;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return (id === null) ? this.toString()+"[type="+this.type+"]" : id; },
            set: function (idArg) {
              /*DEBUG*/
              idArg === null || type_check(idArg,'string', {label:'Event.id', id:this.id});
              /*END_DEBUG*/
              id = idArg;
            }
          };
        }()),
        
        /**
         * @name type
         * @return {string} [read-only]
         * @property
         */
        'type': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_type; }
        },

        /**
         * @name __setType
         * @param {string} typeArg
         * @throws {TypeError}
         * @private
         */
        '__setType': {
          enumerable: false,
          value: function (typeArg) {
            /*DEBUG*/
            console.assert(typeof typeArg === 'string', "typeArg is a string.");
            /*END_DEBUG*/
            evt_type = typeArg;
          }
        },

        /**
         * @name bubbles
         * @return {boolean} [read-only]
         * @property
         */
        'bubbles': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_bubbles; }
        },

        /**
         * @name cancelable
         * @return {boolean} [read-only]
         * @property
         */
        'cancelable': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_cancelable; }
        },

        /**
         * @name cancelBubble
         * @param {boolean} cancelArg
         * @throws {TypeError}
         */
        'cancelBubble': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_cancelBubble; },
          set: function (cancelArg) {
            /*DEBUG*/
            type_check(cancelArg, 'boolean', {label:'Event.cancelBubble', params:'cancel', id:this.id});
            /*END_DEBUG*/
            evt_cancelBubble = cancelArg;
          }
        },
        
        /**
         * Test if event propagation should stop after this node.
         * @name __cancel
         * @return {boolean} [read-only]
         * @property
         * @private
         */
        '__cancel': {
          enumerable: false,
          configurable: false,
          get: function () { return __cancel; }
        },
        
        /**
         * Test if event propagation should stop immediately,
         * ignore other handlers on this node.
         * @name __cancelNow
         * @return {boolean} [read-only]
         * @property
         * @private
         */
        '__cancelNow': {
          enumerable: false,
          configurable: false,
          get: function () { return __cancelNow; }
        },

        /**
         * @name currentTarget
         * @return {Node} [read-only]
         * @property
         */
        'currentTarget': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_currentTarget; }
        },
        
        /**
         * @name __setCurrentTarget
         * @param {Node} targetArg
         * @private
         */
        '__setCurrentTarget': {
          enumerable: false,
          value: function (targetArg) {
            /*DEBUG*/
            console.assert(targetArg === null || doodle.Node.isNode(targetArg), "targetArg is null or a Node.");
            /*END_DEBUG*/
            evt_currentTarget = targetArg;
            return this;
          }
        },

        /**
         * @name target
         * @return {Node} [read-only]
         * @property
         */
        'target': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_target; }
        },

        /**
         * @name __setTarget
         * @param {Node} targetArg
         * @private
         */
        '__setTarget': {
          enumerable: false,
          value: function (targetArg) {
            /*DEBUG*/
            console.assert(targetArg === null || doodle.Node.isNode(targetArg), "targetArg is null or a Node.");
            /*END_DEBUG*/
            evt_target = targetArg;
            return this;
          }
        },

        /**
         * @name eventPhase
         * @return {number} [read-only]
         * @property
         */
        'eventPhase': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_eventPhase; }
        },

        /**
         * @name __setEventPhase
         * @param {number} phaseArg
         * @throws {TypeError}
         * @private
         */
        '__setEventPhase': {
          enumerable: false,
          value: function (phaseArg) {
            /*DEBUG*/
            console.assert(isFinite(phaseArg), "phaseArg is a finite number", phaseArg);
            console.assert(phaseArg >= 0, "phaseArg is greater than 0", phaseArg);
            /*END_DEBUG*/
            evt_eventPhase = phaseArg;
            return this;
          }
        },

        /**
         * @name srcElement
         * @return {EventDispatcher} [read-only]
         * @property
         */
        'srcElement': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_srcElement; }
        },

        /**
         * @name timeStamp
         * @return {Date} [read-only]
         * @property
         */
        'timeStamp': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_timeStamp; }
        },

        /**
         * @name returnValue
         * @return {*} [read-only]
         * @property
         */
        'returnValue': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_returnValue; }
        },
        
        /**
         * @name initEvent
         * @param {string=} typeArg
         * @param {boolean=} canBubbleArg
         * @param {boolean=} cancelableArg
         * @return {doodle.events.Event}
         * @throws {TypeError}
         */
        'initEvent': {
          enumerable: true,
          configurable: false,
          value: function (typeArg, canBubbleArg, cancelableArg) {
            typeArg = (typeArg === undefined) ? "undefined" : typeArg;
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg, 'boolean', {label:'Event.initEvent', params:['type','canBubble','cancelable'], id:this.id});
            /*END_DEBUG*/
            evt_type = typeArg;
            evt_bubbles = canBubbleArg;
            evt_cancelable = cancelableArg;
            return this;
          }
        },

        /**
         * @name preventDefault
         */
        'preventDefault': {
          enumerable: true,
          configurable: false,
          value: function () { evt_defaultPrevented = true; }
        },

        /**
         * @name stopPropagation
         * @throws {Error} If called on event that can not be canceled.
         */
        'stopPropagation': {
          enumerable: true,
          configurable: false,
          value: function () {
            if (!this.cancelable) {
              throw new Error(this.id + " Event.stopPropagation: Event can not be cancelled.");
            } else {
              __cancel = true;
            }
          }
        },

        /**
         * @name stopImmediatePropagation
         * @throws {Error} If called on event that can not be canceled.
         */
        'stopImmediatePropagation': {
          enumerable: true,
          configurable: false,
          value: function () {
            if (!this.cancelable) {
              throw new Error(this.id + " Event.stopImmediatePropagation: Event can not be cancelled.");
            } else {
              __cancel = true;
              __cancelNow = true;
            }
          }
        },

        /**
         * Copy the properties from another Event.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyEventProperties
         * @param {doodle.events.Event} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @throws {TypeError}
         * @private
         */
        '__copyEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.Event.isEvent(evt), "evt is an Event.", this);
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is false, null, or a Node.", this);
            console.assert(resetType === false || typeof resetType === 'string', "resetType is false or a string.", this);
            /*END_DEBUG*/
            copy_event_properties(evt, resetTarget, resetType);
            return this;
          }
        }
      };
    }()));//end defineProperties

    
    //using a function or another event object to init?
    if (arg_len === 1 && (typeof arguments[0] === 'function' || isEvent(arguments[0]))) {
      init_obj = arguments[0];
      type = undefined;
    }

    //initialize event
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(event);
        /*DEBUG*/
        if (event.type === undefined || event.bubbles === undefined || event.cancelable === undefined) {
          throw new SyntaxError(this.id + "(function): Must call 'this.initEvent(type, bubbles, cancelable)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_event_properties(init_obj, false, false);
      }
    } else {
      //standard instantiation
      event.initEvent(type, bubbles, cancelable);
    }

    return event;
  };
  
  
  event_static_properties = {
    /**
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object Event]"; }
    }
  };//end event_static_properties

  event_prototype = Object.create({}, {
    /**
     * @name CAPTURING_PHASE
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'CAPTURING_PHASE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1
    },

    /**
     * @name AT_TARGET
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'AT_TARGET': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2
    },

    /**
     * @name BUBBLING_PHASE
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'BUBBLING_PHASE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 3
    },

    /**
     * @name MOUSEDOWN
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEDOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1
    },

    /**
     * @name MOUSEUP
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEUP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2
    },

    /**
     * @name MOUSEOVER
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEOVER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 4
    },

    /**
     * @name MOUSEOUT
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEOUT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 8
    },

    /**
     * @name MOUSEMOVE
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEMOVE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 16
    },

    /**
     * @name MOUSEDRAG
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'MOUSEDRAG': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 32
    },

    /**
     * @name CLICK
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 64
    },

    /**
     * @name DBLCLICK
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'DBLCLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 128
    },

    /**
     * @name KEYDOWN
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'KEYDOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 256
    },

    /**
     * @name KEYUP
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'KEYUP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 512
    },

    /**
     * @name KEYPRESS
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'KEYPRESS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 1024
    },

    /**
     * @name DRAGDROP
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'DRAGDROP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 2048
    },

    /**
     * @name FOCUS
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'FOCUS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 4096
    },

    /**
     * @name BLUR
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'BLUR': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 8192
    },

    /**
     * @name SELECT
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'SELECT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 16384
    },

    /**
     * @name CHANGE
     * @return {number} [read-only]
     * @property
     * @constant
     */
    'CHANGE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 32768
    }
  });//end event_prototype

  /*
   * CLASS METHODS
   */

  /**
   * Test if an object is an event of any kind (Event/MouseEvent/etc).
   * Returns true on Doodle events as well as DOM events.
   * @name isEvent
   * @param {doodle.events.Event} event
   * @return {boolean}
   * @static
   */
  isEvent = doodle.events.Event.isEvent = function (evt) {
    if (typeof evt === 'object') {
      while (evt) {
        //for DOM events we need to check it's constructor name
        if (evt.toString() === '[object Event]' || (evt.constructor && evt.constructor.name === 'Event')) {
          return true;
        } else {
          evt = Object.getPrototypeOf(evt);
        }
      }
    }
    return false;
  };
  
}());//end class closure
/*globals doodle*/

/* DOM 2 Event: UIEvent:Event
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-Events-UIEvent
 */
(function () {
  var uievent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.UIEvent
   * @class
   * @augments doodle.events.Event
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {number=} detail
   * @return {doodle.events.UIEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.UIEvent = function (type, bubbles, cancelable, view, detail) {
    var uievent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_uievent_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 5) {
      throw new SyntaxError("[object UIEvent](type, bubbles, cancelable, view, detail): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object UIEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      uievent = Object.create(doodle.events.Event(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object UIEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      uievent = Object.create(doodle.events.Event(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      /*DEBUG*/
      type_check(type,'string', bubbles,'boolean', cancelable,'boolean', view,'*', detail,'*',
                 {label:'UIEvent', params:['type','bubbles','cancelable','view','detail'], id:this.id});
      /*END_DEBUG*/
      uievent = Object.create(doodle.events.Event(type, bubbles, cancelable));
    }
    
    Object.defineProperties(uievent, uievent_static_properties);
    //properties that require privacy
    Object.defineProperties(uievent, (function () {
      var evt_view = null,
          evt_detail = 0,
          evt_which = 0,
          evt_charCode = 0,
          evt_keyCode = 0,
          evt_layerX = 0,
          evt_layerY = 0,
          evt_pageX = 0,
          evt_pageY = 0;

      /**
       * @name copy_uievent_properties
       * @param {doodle.events.UIEvent} evt UIEvent to copy properties from.
       * @throws {TypeError}
       * @private
       */
      copy_uievent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.UIEvent.isUIEvent(evt), "evt is UIEvent.", this.id, evt);
        /*END_DEBUG*/
        if (evt.view !== undefined) { evt_view = evt.view; }
        if (evt.detail !== undefined) { evt_detail = evt.detail; }
        if (evt.which !== undefined) { evt_which = evt.which; }
        if (evt.charCode !== undefined) { evt_charCode = evt.charCode; }
        if (evt.keyCode !== undefined) { evt_keyCode = evt.keyCode; }
        if (evt.layerX !== undefined) { evt_layerX = evt.layerX; }
        if (evt.layerY !== undefined) { evt_layerY = evt.layerY; }
        if (evt.pageX !== undefined) { evt_pageX = evt.pageX; }
        if (evt.pageY !== undefined) { evt_pageY = evt.pageY; }
      };
      
      return {
        /**
         * @name view
         * @return {HTMLElement} [read-only]
         * @property
         */
        'view': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_view; }
        },

        /**
         * @name detail
         * @return {number} [read-only]
         * @property
         */
        'detail': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_detail; }
        },

        /**
         * @name which
         * @return {number} [read-only]
         * @property
         */
        'which': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_which; }
        },

        /**
         * @name charCode
         * @return {number} [read-only]
         * @property
         */
        'charCode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_charCode; }
        },

        /**
         * @name keyCode
         * @return {number} [read-only]
         * @property
         */
        'keyCode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_keyCode; }
        },

        /**
         * @name layerX
         * @return {number} [read-only]
         * @property
         */
        'layerX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_layerX; }
        },

        /**
         * @name layerY
         * @return {number} [read-only]
         * @property
         */
        'layerY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_layerY; }
        },

        /**
         * @name pageX
         * @return {number} [read-only]
         * @property
         */
        'pageX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_pageX; }
        },

        /**
         * @name pageY
         * @return {number} [read-only]
         * @property
         */
        'pageY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_pageY; }
        },

        /**
         * @name initUIEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} viewArg
         * @param {number} detailArg
         * @return {doodle.events.UIEvent}
         * @throws {TypeError}
         */
        'initUIEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg) {
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            detailArg = (detailArg === undefined) ? 0 : detailArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg,'boolean', viewArg,'*', detailArg,'number', {label:'UIEvent.initUIEvent', params:['type','canBubble','cancelable','view','detail'], id:this.id});
            /*END_DEBUG*/
            evt_view = viewArg;
            evt_detail = detailArg;
            this.initEvent(typeArg, canBubbleArg, cancelableArg);
            return this;
          }
        },

        /**
         * Copy the properties from another UIEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyUIEventProperties
         * @param {doodle.events.UIEvent} evt
         * @param {Node=} resetTarget
         * @param {string=} resetType
         * @return {Event}
         * @throws {TypeError}
         * @private
         */
        '__copyUIEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.UIEvent.isUIEvent(evt), "evt is UIEvent");
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
            /*END_DEBUG*/
            copy_uievent_properties(evt);
            return this.__copyEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));//end defineProperties

    
    //initialize uievent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(uievent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (uievent.type === undefined || uievent.type === '' ||
            uievent.bubbles === undefined ||
            uievent.cancelable === undefined) {
          throw new SyntaxError("[object UIEvent](function): Must call 'this.initUIEvent(type, bubbles, cancelable, view, detail)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_uievent_properties(init_obj);
      }
    } else {
      //standard instantiation
      uievent.initUIEvent(type, bubbles, cancelable, view, detail);
    }
    
    return uievent;
  };

  
  uievent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object UIEvent]"; }
    }
  };

}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is an UIEvent or inherits from it.
 * Returns true on Doodle events as well as DOM events.
 * @name isUIEvent
 * @param {doodle.events.Event} event
 * @return {boolean}
 * @static
 */
doodle.events.UIEvent.isUIEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object UIEvent]' || (evt.constructor && evt.constructor.name === 'UIEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};
/*globals doodle*/

/* DOM 2 Event: MouseEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-mouseevents
 */
(function () {
  var mouseevent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.MouseEvent
   * @class
   * @augments doodle.events.UIEvent
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {number=} detail
   * @param {number=} screenX
   * @param {number=} screenY
   * @param {number=} clientX
   * @param {number=} clientY
   * @param {boolean=} ctrlKey
   * @param {boolean=} altKey
   * @param {boolean=} shiftKey
   * @param {boolean=} metaKey
   * @param {number=} button Mouse button that caused the event (0|1|2)
   * @param {Node=} relatedTarget Secondary target for event (only for some events)
   * @return {doodle.events.MouseEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.MouseEvent = function (type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY,
                                       ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) {
    var mouseevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_mouseevent_properties; //fn declared per event for private vars
    
    /*DEBUG*/
    if (arg_len === 0 || arg_len > 15) {
      throw new SyntaxError("[object MouseEvent](type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object MouseEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      mouseevent = Object.create(doodle.events.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object MouseEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      mouseevent = Object.create(doodle.events.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      detail = (detail === undefined) ? 0 : detail;
      /*DEBUG*/
      type_check(type,'string', bubbles,'boolean', cancelable,'boolean', view,'*', detail,'number', screenX,'*', screenY,'*', clientX,'*', clientY,'*', ctrlKey,'*', altKey,'*', shiftKey,'*', metaKey,'*', button,'*', relatedTarget,'*',
                 {label:'MouseEvent', id:this.id, params:['type','bubbles','cancelable','view','detail','screenX','screenY', 'clientX','clientY','ctrlKey','altKey','shiftKey','metaKey', 'button','relatedTarget']});
      /*END_DEBUG*/
      mouseevent = Object.create(doodle.events.UIEvent(type, bubbles, cancelable, view, detail));
    }
    
    Object.defineProperties(mouseevent, mouseevent_static_properties);
    //properties that require privacy
    Object.defineProperties(mouseevent, (function () {
      var evt_x = 0,
          evt_y = 0,
          evt_offsetX = 0,
          evt_offsetY = 0,
          evt_screenX = 0,
          evt_screenY = 0,
          evt_clientX = 0,
          evt_clientY = 0,
          evt_ctrlKey = false,
          evt_altKey = false,
          evt_shiftKey = false,
          evt_metaKey = false,
          evt_button = 0,
          evt_relatedTarget = null;

      /**
       * @name copy_mouseevent_properties
       * @param {doodle.events.MouseEvent} evt MouseEvent to copy properties from.
       * @throws {TypeError}
       * @private
       */
      copy_mouseevent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.MouseEvent.isMouseEvent(evt), "evt is MouseEvent.", this.id, evt);
        /*END_DEBUG*/
        evt_x = (evt.x !== undefined) ? evt.x : 0;
        evt_y = (evt.y !== undefined) ? evt.y : 0;
        evt_offsetX = (evt.offsetX !== undefined) ? evt.offsetX : 0;
        evt_offsetY = (evt.offsetY !== undefined) ? evt.offsetY : 0;
        if (evt.screenX !== undefined) { evt_screenX = evt.screenX; }
        if (evt.screenY !== undefined) { evt_screenY = evt.screenY; }
        if (evt.clientX !== undefined) { evt_clientX = evt.clientX; }
        if (evt.clientY !== undefined) { evt_clientY = evt.clientY; }
        if (evt.ctrlKey !== undefined) { evt_ctrlKey = evt.ctrlKey; }
        if (evt.altKey !== undefined) { evt_altKey = evt.altKey; }
        if (evt.shiftKey !== undefined) { evt_shiftKey = evt.shiftKey; }
        if (evt.metaKey !== undefined) { evt_metaKey = evt.metaKey; }
        if (evt.button !== undefined) { evt_button = evt.button; }
        if (evt.relatedTarget !== undefined) { evt_relatedTarget = evt.relatedTarget; }
      };
      
      return {
        /**
         * @name x
         * @return {number} [read-only]
         * @property
         */
        'x': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_x; }
        },

        /**
         * @name y
         * @return {number} [read-only]
         * @property
         */
        'y': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_y; }
        },

        /**
         * @name screenX
         * @return {number} [read-only]
         * @property
         */
        'screenX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_screenX; }
        },

        /**
         * @name screenY
         * @return {number} [read-only]
         * @property
         */
        'screenY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_screenY; }
        },

        /**
         * @name clientX
         * @return {number} [read-only]
         * @property
         */
        'clientX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_clientX; }
        },

        /**
         * @name clientY
         * @return {number} [read-only]
         * @property
         */
        'clientY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_clientY; }
        },

        /**
         * @name offsetX
         * @return {number} [read-only]
         * @property
         */
        'offsetX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_offsetX; }
        },

        /**
         * @name offsetY
         * @return {number} [read-only]
         * @property
         */
        'offsetY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_offsetY; }
        },

        /**
         * @name ctrlKey
         * @return {boolean} [read-only]
         * @property
         */
        'ctrlKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_ctrlKey; }
        },

        /**
         * @name altKey
         * @return {boolean} [read-only]
         * @property
         */
        'altKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_altKey; }
        },

        /**
         * @name shiftKey
         * @return {boolean} [read-only]
         * @property
         */
        'shiftKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_shiftKey; }
        },

        /**
         * @name metaKey
         * @return {boolean} [read-only]
         * @property
         */
        'metaKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_metaKey; }
        },

        /**
         * @name button
         * @return {number} [read-only]
         * @property
         */
        'button': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_button; }
        },

        /**
         * @name relatedTarget
         * @return {Node} [read-only]
         * @property
         */
        'relatedTarget': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_relatedTarget; }
        },

        /**
         * @name initMouseEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} viewArg
         * @param {number} detailArg
         * @param {number} screenXArg
         * @param {number} screenYArg
         * @param {number} clientXArg
         * @param {number} clientYArg
         * @param {boolean} ctrlKeyArg
         * @param {boolean} altKeyArg
         * @param {boolean} shiftKeyArg
         * @param {boolean} metaKeyArg
         * @param {number} buttonArg
         * @param {Node} relatedTargetArg
         * @return {doodle.events.MouseEvent}
         * @throws {TypeError}
         */
        'initMouseEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg, screenXArg, screenYArg, clientXArg, clientYArg,
                           ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg, buttonArg, relatedTargetArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            detailArg = (detailArg === undefined) ? 0 : detailArg;
            screenXArg = (screenXArg === undefined) ? 0 : screenXArg;
            screenYArg = (screenYArg === undefined) ? 0 : screenYArg;
            clientXArg = (clientXArg === undefined) ? 0 : clientXArg;
            clientYArg = (clientYArg === undefined) ? 0 : clientYArg;
            ctrlKeyArg = (ctrlKeyArg === undefined) ? false : ctrlKeyArg;
            altKeyArg = (altKeyArg === undefined) ? false : altKeyArg;
            shiftKeyArg = (shiftKeyArg === undefined) ? false : shiftKeyArg;
            metaKeyArg = (metaKeyArg === undefined) ? false : metaKeyArg;
            buttonArg = (buttonArg === undefined) ? 0 : buttonArg;
            relatedTarget = (relatedTargetArg === undefined) ? null : relatedTargetArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', canBubbleArg,'boolean', viewArg,'*', detailArg,'number', screenXArg,'number', screenYArg,'number', clientXArg,'number', clientYArg,'number', ctrlKeyArg,'boolean', altKeyArg,'boolean', shiftKeyArg,'boolean', metaKeyArg,'boolean', buttonArg,'number', relatedTargetArg,'*',
                       {label:'MouseEvent.initMouseEvent', id:this.id, params:['typeArg','canBubbleArg','cancelableArg','viewArg','detailArg','screenXArg','screenYArg','clientXArg','clientYArg','ctrlKeyArg','altKeyArg','shiftKeyArg','metaKeyArg','buttonArg','relatedTargetArg']});
            /*END_DEBUG*/
            evt_screenX = screenXArg;
            evt_screenY = screenYArg;
            evt_clientX = clientXArg;
            evt_clientY = clientYArg;
            evt_ctrlKey = ctrlKeyArg;
            evt_altKey = altKeyArg;
            evt_shiftKey = shiftKeyArg;
            evt_metaKey = metaKeyArg;
            evt_button = buttonArg;
            evt_relatedTarget = relatedTargetArg;
            return this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg, detailArg);
          }
        },

        /**
         * Queries the state of a modifier using a key identifier.
         * @name getModifierState
         * @param {string} key A modifier key identifier
         * @return {boolean} True if it is a modifier key and the modifier is activated, false otherwise.
         * @throws {TypeError}
         */
        'getModifierState': {
          value: function (key) {
            /*DEBUG*/
            type_check(key,'string', {label:'MouseEvent.getModifierState', params:'key', id:this.id});
            /*END_DEBUG*/
            switch (key) {
            case 'Alt':
              return evt_altKey;
            case 'Control':
              return evt_ctrlKey;
            case 'Meta':
              return evt_metaKey;
            case 'Shift':
              return evt_shiftKey;
            default:
              return false;
            }
          }
        },

        /**
         * Copy the properties from another MouseEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyMouseEventProperties
         * @param {doodle.events.MouseEvent} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @return {doodle.events.MouseEvent}
         * @throws {TypeError}
         * @private
         */
        '__copyMouseEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.MouseEvent.isMouseEvent(evt), "evt is MouseEvent", this.id);
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
            /*END_DEBUG*/
            copy_mouseevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));//end defineProperties


    //initialize mouseevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(mouseevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (mouseevent.type === undefined || mouseevent.type === '' ||
            mouseevent.bubbles === undefined || mouseevent.cancelable === undefined) {
          throw new SyntaxError("[object MouseEvent](function): Must call 'this.initMouseEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_mouseevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      mouseevent.initMouseEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
    }
    
    return mouseevent;
  };
    
  mouseevent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object MouseEvent]"; }
    }
  };

}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a MouseEvent.
 * @name isMouseEvent
 * @param {doodle.events.MouseEvent} event
 * @return {boolean}
 * @static
 */
doodle.events.MouseEvent.isMouseEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object MouseEvent]' || (evt.constructor && evt.constructor.name === 'MouseEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};
/*globals doodle*/

/* TouchEvent support is expermental.
 * http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html
 */
(function () {
  var touchevent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.TouchEvent
   * @class
   * @augments doodle.events.UIEvent
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {number=} detail
   * @param {number=} screenX
   * @param {number=} screenY
   * @param {number=} clientX
   * @param {number=} clientY
   * @param {boolean=} ctrlKey
   * @param {boolean=} altKey
   * @param {boolean=} shiftKey
   * @param {boolean=} metaKey
   * @param {Array=} touches ?
   * @param {Array=} targetTouches ?
   * @param {Array=} changedTouches ?
   * @param {number=} scale
   * @param {number=} rotation
   * @return {doodle.events.TouchEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.TouchEvent = function (type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY,
                                       ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation) {
    var touchevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_touchevent_properties; //fn declared per event for private vars
    
    /*DEBUG*/
    if (arg_len === 0 || arg_len > 18) {
      throw new SyntaxError("[object TouchEvent](type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TouchEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      touchevent = Object.create(doodle.events.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TouchEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      touchevent = Object.create(doodle.events.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      detail = (detail === undefined) ? 0 : detail;
      /*DEBUG*/
      type_check(type,'string', bubbles,'boolean', cancelable,'boolean', view,'*', detail,'number', screenX,'*', screenY,'*', clientX,'*', clientY,'*', ctrlKey,'*', altKey,'*', shiftKey,'*', metaKey,'*', touches,'*', targetTouches,'*', changedTouches,'*', scale,'*', rotation,'*',
                 {label:'TouchEvent', id:this.id, params:['type','bubbles','cancelable','view','detail','screenX','screenY','clientX','clientY','ctrlKey','altKey','shiftKey','metaKey','touches','targetTouches','changedTouches','scale','rotation']});
      /*END_DEBUG*/
      touchevent = Object.create(doodle.events.UIEvent(type, bubbles, cancelable, view, detail));
    }
    
    Object.defineProperties(touchevent, touchevent_static_properties);
    //properties that require privacy
    Object.defineProperties(touchevent, (function () {
      var evt_screenX = 0,
          evt_screenY = 0,
          evt_clientX = 0,
          evt_clientY = 0,
          evt_ctrlKey = false,
          evt_altKey = false,
          evt_shiftKey = false,
          evt_metaKey = false,
          evt_touches = null,
          evt_targetTouches = null,
          evt_changedTouches = null,
          evt_scale = 1,
          evt_rotation = 0;

      /**
       * @name copy_touchevent_properties
       * @param {doodle.events.TouchEvent} evt TouchEvent to copy properties from.
       * @private
       */
      copy_touchevent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.TouchEvent.isTouchEvent(evt), "evt is TouchEvent.", this.id, evt);
        /*END_DEBUG*/
        if (evt.screenX !== undefined) { evt_screenX = evt.screenX; }
        if (evt.screenY !== undefined) { evt_screenY = evt.screenY; }
        if (evt.clientX !== undefined) { evt_clientX = evt.clientX; }
        if (evt.clientY !== undefined) { evt_clientY = evt.clientY; }
        if (evt.ctrlKey !== undefined) { evt_ctrlKey = evt.ctrlKey; }
        if (evt.altKey !== undefined) { evt_altKey = evt.altKey; }
        if (evt.shiftKey !== undefined) { evt_shiftKey = evt.shiftKey; }
        if (evt.metaKey !== undefined) { evt_metaKey = evt.metaKey; }
        if (evt.touches !== undefined) { evt_touches = evt.touches; }
        if (evt.targetTouches !== undefined) { evt_targetTouches = evt.targetTouches; }
        if (evt.changedTouches !== undefined) { evt_changedTouches = evt.changedTouches; }
        if (evt.scale !== undefined) { evt_scale = evt.scale; }
        if (evt.rotation !== undefined) { evt_rotation = evt.rotation; }
      };
      
      return {
        /**
         * @name screenX
         * @return {number} [read-only]
         * @property
         */
        'screenX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_screenX; }
        },

        /**
         * @name screenY
         * @return {number} [read-only]
         * @property
         */
        'screenY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_screenY; }
        },

        /**
         * @name clientX
         * @return {number} [read-only]
         * @property
         */
        'clientX': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_clientX; }
        },

        /**
         * @name clientY
         * @return {number} [read-only]
         * @property
         */
        'clientY': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_clientY; }
        },

        /**
         * @name ctrlKey
         * @return {boolean} [read-only]
         * @property
         */
        'ctrlKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_ctrlKey; }
        },

        /**
         * @name altKey
         * @return {boolean} [read-only]
         * @property
         */
        'altKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_altKey; }
        },

        /**
         * @name shiftKey
         * @return {boolean} [read-only]
         * @property
         */
        'shiftKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_shiftKey; }
        },

        /**
         * @name metaKey
         * @return {boolean} [read-only]
         * @property
         */
        'metaKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_metaKey; }
        },

        /**
         * @name touches
         * @return {Array} [read-only]
         * @property
         */
        'touches': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_touches; }
        },

        /**
         * @name targetTouches
         * @return {Array} [read-only]
         * @property
         */
        'targetTouches': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_targetTouches; }
        },

        /**
         * @name changedTouches
         * @return {Array} [read-only]
         * @property
         */
        'changedTouches': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_changedTouches; }
        },

        /**
         * @name scale
         * @return {number} [read-only]
         * @property
         */
        'scale': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_scale; }
        },

        /**
         * @name rotation
         * @return {number} [read-only]
         * @property
         */
        'rotation': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_rotation; }
        },

        /**
         * @name initTouchEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} viewArg
         * @param {number} detailArg
         * @param {number} screenXArg
         * @param {number} screenYArg
         * @param {number} clientXArg
         * @param {number} clientYArg
         * @param {boolean} ctrlKeyArg
         * @param {boolean} altKeyArg
         * @param {boolean} shiftKeyArg
         * @param {boolean} metaKeyArg
         * @param {Array} touchesArg
         * @param {Array} targetTouchesArg
         * @param {Array} changedTouchesArg
         * @param {number} scaleArg
         * @param {number} rotationArg
         * @return {doodle.events.TouchEvent}
         * @throws {TypeError}
         */
        'initTouchEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, detailArg, screenXArg, screenYArg, clientXArg, clientYArg,
                           ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg, touchesArg, targetTouchesArg, changedTouchesArg, scaleArg, rotationArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            detailArg = (detailArg === undefined) ? 0 : detailArg;
            screenXArg = (screenXArg === undefined) ? 0 : screenXArg;
            screenYArg = (screenYArg === undefined) ? 0 : screenYArg;
            clientXArg = (clientXArg === undefined) ? 0 : clientXArg;
            clientYArg = (clientYArg === undefined) ? 0 : clientYArg;
            ctrlKeyArg = (ctrlKeyArg === undefined) ? false : ctrlKeyArg;
            altKeyArg = (altKeyArg === undefined) ? false : altKeyArg;
            shiftKeyArg = (shiftKeyArg === undefined) ? false : shiftKeyArg;
            metaKeyArg = (metaKeyArg === undefined) ? false : metaKeyArg;
            touchesArg = (touchesArg === undefined) ? null : touchesArg;
            targetTouchesArg = (targetTouchesArg === undefined) ? null : targetTouchesArg;
            changedTouchesArg = (changedTouchesArg === undefined) ? null : changedTouchesArg;
            scaleArg = (scaleArg === undefined) ? 1 : scaleArg;
            rotationArg = (rotationArg === undefined) ? 0 : rotationArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg,'boolean', viewArg,'*', detailArg,'number', screenXArg,'number', screenYArg,'number',
                       clientXArg,'number', clientYArg,'number', ctrlKeyArg,'boolean', altKeyArg,'boolean', shiftKeyArg,'boolean', metaKeyArg,'boolean', touchesArg,'*', targetTouchesArg,'*', changedTouchesArg,'*', scaleArg,'number', rotationArg,'number',
                       {label:'TouchEvent', id:this.id, params:['type','bubbles','cancelable','view','detail','screenX','screenY','clientX','clientY','ctrlKey','altKey','shiftKey','metaKey','touches','targetTouches','changedTouches','scale','rotation']});
            /*END_DEBUG*/
            evt_screenX = screenXArg;
            evt_screenY = screenYArg;
            evt_clientX = clientXArg;
            evt_clientY = clientYArg;
            evt_ctrlKey = ctrlKeyArg;
            evt_altKey = altKeyArg;
            evt_shiftKey = shiftKeyArg;
            evt_metaKey = metaKeyArg;
            evt_touches = touchesArg;
            evt_targetTouches = targetTouchesArg;
            evt_changedTouches = changedTouchesArg;
            evt_scale = scaleArg;
            evt_rotation = rotationArg;
            this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg, detailArg);
            return this;
          }
        },

        /**
         * Queries the state of a modifier using a key identifier.
         * @name getModifierState
         * @param {string} key A modifier key identifier
         * @return {boolean} True if it is a modifier key and the modifier is activated, false otherwise.
         * @throws {TypeError}
         */
        'getModifierState': {
          value: function (key) {
            /*DEBUG*/
            type_check(key,'string', {label:'TouchEvent.getModifierState', params:'key', id:this.id});
            /*END_DEBUG*/
            switch (key) {
            case 'Alt':
              return evt_altKey;
            case 'Control':
              return evt_ctrlKey;
            case 'Meta':
              return evt_metaKey;
            case 'Shift':
              return evt_shiftKey;
            default:
              return false;
            }
          }
        },

        /**
         * Copy the properties from another TouchEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyTouchEventProperties
         * @param {doodle.events.TouchEvent} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @return {doodle.events.TouchEvent}
         * @throws {TypeError}
         * @private
         */
        '__copyTouchEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.TouchEvent.isTouchEvent(evt), "evt is TouchEvent");
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
            /*END_DEBUG*/
            copy_touchevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));//end defineProperties


    //initialize touchevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(touchevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (touchevent.type === undefined || touchevent.type === '' ||
            touchevent.bubbles === undefined || touchevent.cancelable === undefined) {
          throw new SyntaxError("[object TouchEvent](function): Must call 'this.initTouchEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_touchevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      touchevent.initTouchEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY,
                                ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation);
    }
    
    return touchevent;
  };
    
  
  touchevent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object TouchEvent]"; }
    }
  };

}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a TouchEvent.
 * @name isTouchEvent
 * @param {doodle.events.TouchEvent} event
 * @return {boolean}
 * @static
 */
doodle.events.TouchEvent.isTouchEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object TouchEvent]' || (evt.constructor && evt.constructor.name === 'TouchEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};
/*globals doodle*/

/* DOM 3 Event: TextEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-textevents
 */
(function () {
  var textevent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.TextEvent
   * @class
   * @augments doodle.events.UIEvent
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {string=} data
   * @param {number=} inputMode
   * @return {doodle.events.TextEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.TextEvent = function (type, bubbles, cancelable, view, data, inputMode) {
    var textevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_textevent_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 6) {
      throw new SyntaxError("[object TextEvent](type, bubbles, cancelable, view, data, inputMode): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TextEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      textevent = Object.create(doodle.events.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object TextEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      textevent = Object.create(doodle.events.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      /*DEBUG*/
      type_check(type,'string', bubbles,'boolean', cancelable,'boolean', view,'*', data,'*', inputMode,'*',
                 {label:'TextEvent', id:this.id, params:['type','bubbles','cancelable','view','data','inputMode']});
      /*END_DEBUG*/
      textevent = Object.create(doodle.events.UIEvent(type, bubbles, cancelable, view));
    }
    
    Object.defineProperties(textevent, textevent_static_properties);
    //properties that require privacy
    Object.defineProperties(textevent, (function () {
      var evt_data = '',
          evt_inputMode = doodle.events.TextEvent.INPUT_METHOD_UNKNOWN;

      /**
       * @name copy_textevent_properties
       * @param {doodle.events.TextEvent} evt TextEvent to copy properties from.
       * @private
       */
      copy_textevent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.TextEvent.isTextEvent(evt), "evt is TextEvent.", this.id, evt);
        /*END_DEBUG*/
        if (evt.data !== undefined) { evt_data = evt.data; }
        if (evt.inputMode !== undefined) { evt_inputMode = evt.inputMode; }
      };
      
      return {
        /**
         * @name data
         * @return {string} [read-only]
         * @property
         */
        'data': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_data; }
        },

        /**
         * @name inputMode
         * @return {number} [read-only]
         * @property
         */
        'inputMode': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_inputMode; }
        },

        /**
         * @name initTextEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} view
         * @param {string} dataArg
         * @param {number} inputModeArg
         * @return {doodle.events.TextEvent}
         */
        'initTextEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, dataArg, inputModeArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            dataArg = (dataArg === undefined) ? '' : dataArg;
            inputModeArg = (inputModeArg === undefined) ? doodle.events.TextEvent.INPUT_METHOD_UNKNOWN : inputModeArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg,'boolean', viewArg,'*', dataArg,'string', inputModeArg,'number',
                       {label:'TextEvent.initTextEvent', id:this.id, params:['typeArg','canBubbleArg','cancelableArg','viewArg','dataArg','inputModeArg']});
            /*END_DEBUG*/
            evt_data = dataArg;
            evt_inputMode = inputModeArg;
            this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg);
            return this;
          }
        },

        /**
         * Copy the properties from another TextEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyTextEventProperties
         * @param {doodle.events.TextEvent} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @return {doodle.events.TextEvent}
         * @private
         */
        '__copyTextEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.TextEvent.isTextEvent(evt), "evt is TextEvent", this.id);
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
            /*END_DEBUG*/
            copy_textevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));

    //initialize textevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(textevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (textevent.type === undefined || textevent.type === '' ||
            textevent.bubbles === undefined || textevent.cancelable === undefined) {
          throw new SyntaxError("[object TextEvent](function): Must call 'this.initTextEvent(type, bubbles, cancelable, view, data, inputMode)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_textevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      textevent.initTextEvent(type, bubbles, cancelable, view, data, inputMode);
    }
    
    return textevent;
  };
  
  
  textevent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object TextEvent]"; }
    }
  };
  
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a TextEvent.
 * @name isTextEvent
 * @param {doodle.events.TextEvent} event
 * @return {boolean}
 * @static
 */
doodle.events.TextEvent.isTextEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object TextEvent]' || (evt.constructor && evt.constructor.name === 'TextEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};
/*globals doodle*/

/* DOM 3 Event: KeyboardEvent:UIEvent
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 */
(function () {
  var keyboardevent_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      isEvent = doodle.events.Event.isEvent;
  
  /**
   * @name doodle.events.KeyboardEvent
   * @class
   * @augments doodle.events.UIEvent
   * @param {string=} type
   * @param {boolean=} bubbles
   * @param {boolean=} cancelable
   * @param {HTMLElement=} view
   * @param {string=} keyIdentifier
   * @param {number=} keyLocation
   * @param {string=} modifiersList White-space separated list of key modifiers.
   * @param {boolean=} repeat
   * @return {doodle.events.KeyboardEvent}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.events.KeyboardEvent = function (type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat) {
    var keyboardevent,
        arg_len = arguments.length,
        init_obj, //function, event
        copy_keyboardevent_properties; //fn declared per event for private vars

    /*DEBUG*/
    if (arg_len === 0 || arg_len > 8) {
      throw new SyntaxError("[object KeyboardEvent](type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    //initialize uievent prototype with another event, function, or args
    if (isEvent(arguments[0])) {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object KeyboardEvent](event): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      keyboardevent = Object.create(doodle.events.UIEvent(init_obj));
    } else if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arg_len > 1) {
        throw new SyntaxError("[object KeyboardEvent](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      init_obj = arguments[0];
      type = undefined;
      //use empty event type for now, will check after we call the init function.
      keyboardevent = Object.create(doodle.events.UIEvent(''));
    } else {
      //parameter defaults
      bubbles = (bubbles === undefined) ? false : bubbles;
      cancelable = (cancelable === undefined) ? false : cancelable;
      view = (view === undefined) ? null : view;
      /*DEBUG*/
      type_check(type, 'string', bubbles, 'boolean', cancelable, 'boolean', view, '*', keyIdentifier, '*', keyLocation, '*', modifiersList, '*', repeat, '*',
                 {label:'KeyboardEvent', params:['type','bubbles','cancelable','view','keyIdentifier','keyLocation','modifiersList','repeat'], id:this.id});
      /*END_DEBUG*/
      keyboardevent = Object.create(doodle.events.UIEvent(type, bubbles, cancelable, view));
    }
    
    Object.defineProperties(keyboardevent, keyboardevent_static_properties);
    //properties that require privacy
    Object.defineProperties(keyboardevent, (function () {
      var evt_keyIdentifier = "",
          evt_keyLocation = 0,
          evt_repeat = false,
          evt_ctrlKey = false,
          evt_altKey = false,
          evt_shiftKey = false,
          evt_metaKey = false,
          evt_altGraphKey = false;

      /**
       * @name copy_keyboardevent_properties
       * @param {doodle.events.KeyboardEvent} evt KeyboardEvent to copy properties from.
       * @throws {TypeError}
       * @private
       */
      copy_keyboardevent_properties = function (evt) {
        /*DEBUG*/
        console.assert(doodle.events.KeyboardEvent.isKeyboardEvent(evt), "evt is KeyboardEvent");
        /*END_DEBUG*/
        if (evt.keyIdentifier !== undefined) { evt_keyIdentifier = evt.keyIdentifier; }
        if (evt.keyLocation !== undefined) { evt_keyLocation = evt.keyLocation; }
        if (evt.repeat !== undefined) { evt_repeat = evt.repeat; }
        if (evt.ctrlKey !== undefined) { evt_ctrlKey = evt.ctrlKey; }
        if (evt.altKey !== undefined) { evt_altKey = evt.altKey; }
        if (evt.shiftKey !== undefined) { evt_shiftKey = evt.shiftKey; }
        if (evt.metaKey !== undefined) { evt_metaKey = evt.metaKey; }
        if (evt.altGraphKey !== undefined) { evt_altKey = evt.altGraphKey; }
      };
      
      return {
        /**
         * @name keyIdentifier
         * @return {string} [read-only]
         * @property
         */
        'keyIdentifier': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_keyIdentifier; }
        },

        /**
         * @name keyLocation
         * @return {number} [read-only]
         * @property
         */
        'keyLocation': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_keyLocation; }
        },

        /**
         * @name repeat
         * @return {boolean} [read-only]
         * @property
         */
        'repeat': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_repeat; }
        },

        /**
         * @name ctrlKey
         * @return {boolean} [read-only]
         * @property
         */
        'ctrlKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_ctrlKey; }
        },

        /**
         * @name altKey
         * @return {boolean} [read-only]
         * @property
         */
        'altKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_altKey; }
        },

        /**
         * @name shiftKey
         * @return {boolean} [read-only]
         * @property
         */
        'shiftKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_shiftKey; }
        },

        /**
         * @name metaKey
         * @return {boolean} [read-only]
         * @property
         */
        'metaKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_metaKey; }
        },

        /**
         * @name altGraphKey
         * @return {boolean} [read-only]
         * @property
         */
        'altGraphKey': {
          enumerable: true,
          configurable: false,
          get: function () { return evt_altGraphKey; }
        },
        
        /**
         * @name initKeyboardEvent
         * @param {string} typeArg
         * @param {boolean} canBubbleArg
         * @param {boolean} cancelableArg
         * @param {HTMLElement} viewArg
         * @param {string} keyIdentifierArg
         * @param {number} keyLocationArg
         * @param {string} modifiersListArg
         * @param {boolean} repeatArg
         * @return {doodle.events.Event}
         * @throws {TypeError}
         */
        'initKeyboardEvent': {
          value: function (typeArg, canBubbleArg, cancelableArg, viewArg, keyIdentifierArg, keyLocationArg, modifiersListArg, repeatArg) {
            //parameter defaults
            canBubbleArg = (canBubbleArg === undefined) ? false : canBubbleArg;
            cancelableArg = (cancelableArg === undefined) ? false : cancelableArg;
            viewArg = (viewArg === undefined) ? null : viewArg;
            keyIdentifierArg = (keyIdentifierArg === undefined) ? "" : keyIdentifierArg;
            keyLocationArg = (keyLocationArg === undefined) ? 0 : keyLocationArg;
            modifiersListArg = (modifiersListArg === undefined) ? "" : modifiersListArg;
            repeatArg = (repeatArg === undefined) ? false : repeatArg;
            /*DEBUG*/
            type_check(typeArg,'string', canBubbleArg,'boolean', cancelableArg,'boolean', viewArg,'*', keyIdentifierArg,'string', keyLocationArg,'number', modifiersListArg,'string', repeatArg,'boolean',
                       {label:'KeyboardEvent.initKeyboardEvent', id:this.id, params:['typeArg','canBubbleArg','cancelableArg','viewArg','keyIdentifierArg','keyLocationArg','modifiersListArg','repeatArg']});
            /*END_DEBUG*/
            evt_keyIdentifier = keyIdentifierArg;
            evt_keyLocation = keyLocationArg;
            evt_repeat = repeatArg;
            //parse string of white-space separated list of modifier key identifiers
            modifiersListArg.split(" ").forEach(function (modifier) {
              switch (modifier) {
              case 'Alt':
                evt_altKey = true;
                break;
              case 'Control':
                evt_ctrlKey = true;
                break;
              case 'Meta':
                evt_metaKey = true;
                break;
              case 'Shift':
                evt_shiftKey = true;
                break;
              }
            });
            this.initUIEvent(typeArg, canBubbleArg, cancelableArg, viewArg);
            return this;
          }
        },

        /**
         * Queries the state of a modifier using a key identifier.
         * @name getModifierState
         * @param {string} key A modifier key identifier
         * @return {boolean} True if it is a modifier key and the modifier is activated, false otherwise.
         * @throws {TypeError}
         */
        'getModifierState': {
          value: function (key) {
            /*DEBUG*/
            type_check(key,'string', {label:'KeyboardEvent.getModifierState', params:'key', id:this.id});
            /*END_DEBUG*/
            switch (key) {
            case 'Alt':
              return evt_altKey;
            case 'Control':
              return evt_ctrlKey;
            case 'Meta':
              return evt_metaKey;
            case 'Shift':
              return evt_shiftKey;
            default:
              return false;
            }
          }
        },

        /**
         * Copy the properties from another KeyboardEvent.
         * Allows for the reuse of this object for further dispatch.
         * @name __copyKeyboardEventProperties
         * @param {doodle.events.KeyboardEvent} evt
         * @param {Node} resetTarget
         * @param {string} resetType
         * @return {doodle.events.KeyboardEvent}
         * @throws {TypeError}
         * @private
         */
        '__copyKeyboardEventProperties': {
          enumerable: false,
          configurable: false,
          value: function (evt, resetTarget, resetType) {
            resetTarget = (resetTarget === undefined) ? false : resetTarget;
            resetType = (resetType === undefined) ? false : resetType;
            /*DEBUG*/
            console.assert(doodle.events.KeyboardEvent.isKeyboardEvent(evt), "evt is KeyboardEvent");
            console.assert(resetTarget === false || resetTarget === null || doodle.Node.isNode(resetTarget), "resetTarget is a Node, null, or false.");
            console.assert(resetType === false || typeof resetType === 'string', "resetType is a string or false.");
            /*END_DEBUG*/
            copy_keyboardevent_properties(evt);
            return this.__copyUIEventProperties(evt, resetTarget, resetType);
          }
        }
      };
    }()));

    //initialize keyboardevent
    if (init_obj) {
      if (typeof init_obj === 'function') {
        init_obj.call(keyboardevent);
        /*DEBUG*/
        //make sure we've checked our dummy type string
        if (keyboardevent.type === undefined || keyboardevent.type === '' ||
            keyboardevent.bubbles === undefined || keyboardevent.cancelable === undefined) {
          throw new SyntaxError("[object KeyboardEvent](function): Must call 'this.initKeyboardEvent(type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat)' within the function argument.");
        }
        /*END_DEBUG*/
      } else {
        //passed a doodle or dom event object
        copy_keyboardevent_properties(init_obj);
      }
    } else {
      //standard instantiation
      keyboardevent.initKeyboardEvent(type, bubbles, cancelable, view, keyIdentifier, keyLocation, modifiersList, repeat);
    }
    
    return keyboardevent;
  };
    

  keyboardevent_static_properties = {
    /**
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object KeyboardEvent]"; }
    }
  };

}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a keyboard event.
 * @name isKeyboardEvent
 * @param {doodle.events.Event} event
 * @return {boolean}
 * @static
 */
doodle.events.KeyboardEvent.isKeyboardEvent = function (evt) {
  if (typeof evt === 'object') {
    while (evt) {
      //for DOM events we need to check it's constructor name
      if (evt.toString() === '[object KeyboardEvent]' || (evt.constructor && evt.constructor.name === 'KeyboardEvent')) {
        return true;
      } else {
        evt = Object.getPrototypeOf(evt);
      }
    }
  }
  return false;
};

/*
 * EVENT
 */
Object.defineProperties(doodle.events.Event, {
  /**
   * @name CAPTURING_PHASE
   * @return {number} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'CAPTURING_PHASE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 1
  },

  /**
   * @name AT_TARGET
   * @return {number} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'AT_TARGET': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 2
  },

  /**
   * @name BUBBLING_PHASE
   * @return {number} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'BUBBLING_PHASE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 3
  },

  /**
   * Dispatched when object is added to display path.
   * @name ADDED
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'ADDED': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "added"
  },

  /**
   * Dispatched when object is removed from display path.
   * @name REMOVED
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'REMOVED': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "removed"
  },

  /**
   * @name ENTER_FRAME
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'ENTER_FRAME': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "enterFrame"
  },

  /**
   * Dispatched when element is loaded.
   * @name LOAD
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'LOAD': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "load"
  },

  /**
   * @name CHANGE
   * @return {string} [read-only]
   * @memberOf Event
   * @property
   * @constant
   * @static
   */
  'CHANGE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "change"
  }
});


/*
 * UI EVENT
 */
Object.defineProperties(doodle.events.UIEvent, {
  /**
   * @name FOCUS_IN
   * @return {string} [read-only]
   * @memberOf UIEvent
   * @property
   * @constant
   * @static
   */
  'FOCUS_IN': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "focusIn"
  }
});


/*
 * MOUSE EVENT
 * Compatibility tables: http://www.quirksmode.org/dom/events/index.html
 */
Object.defineProperties(doodle.events.MouseEvent, {
  /**
   * To test for left/middle/right button check value for event.which (0,1,2).
   * @name CLICK
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'CLICK': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "click"
  },

  /**
   * @name DOUBLE_CLICK
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'DOUBLE_CLICK': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "dblclick"
  },

  /**
   * @name CONTEXT_MENU
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'CONTEXT_MENU': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "contextmenu"
  },

  /**
   * @name MOUSE_DOWN
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_DOWN': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mousedown"
  },

  /**
   * @name MOUSE_UP
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_UP': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseup"
  },

  /**
   * @name MOUSE_WHEEL
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_WHEEL': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mousewheel"
  },

  /**
   * @name MOUSE_MOVE
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_MOVE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mousemove"
  },

  /**
   * @name MOUSE_OUT
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_OUT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseout"
  },

  /**
   * @name MOUSE_OVER
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_OVER': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseover"
  },

  /**
   * @name MOUSE_ENTER
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_ENTER': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseenter"
  },

  /**
   * @name MOUSE_LEAVE
   * @return {string} [read-only]
   * @memberOf MouseEvent
   * @property
   * @constant
   * @static
   */
  'MOUSE_LEAVE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "mouseleave"
  }
  
});


/*
 * TOUCH EVENT
 * http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html
 */
Object.defineProperties(doodle.events.TouchEvent, {
  /**
   * @name TOUCH_START
   * @return {string} [read-only]
   * @memberOf TouchEvent
   * @property
   * @constant
   * @static
   */
  'TOUCH_START': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "touchstart"
  },

  /**
   * @name TOUCH_MOVE
   * @return {string} [read-only]
   * @memberOf TouchEvent
   * @property
   * @constant
   * @static
   */
  'TOUCH_MOVE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "touchmove"
  },

  /**
   * @name TOUCH_END
   * @return {string} [read-only]
   * @memberOf TouchEvent
   * @property
   * @constant
   * @static
   */
  'TOUCH_END': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "touchend"
  },

  /**
   * @name TOUCH_CANCEL
   * @return {string} [read-only]
   * @memberOf TouchEvent
   * @property
   * @constant
   * @static
   */
  'TOUCH_CANCEL': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "touchcancel"
  }
  
});

/*
 * KEYBOARD EVENT
 */
Object.defineProperties(doodle.events.KeyboardEvent, {
  /**
   * @name KEY_PRESS
   * @return {string} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_PRESS': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "keypress"
  },

  /**
   * @name KEY_UP
   * @return {string} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_UP': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "keyup"
  },

  /**
   * @name KEY_DOWN
   * @return {string} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_DOWN': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "keydown"
  },

  /**
   * @name KEY_LOCATION_STANDARD
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_STANDARD': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x00
  },

  /**
   * @name KEY_LOCATION_LEFT
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_LEFT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x01
  },

  /**
   * @name KEY_LOCATION_RIGHT
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_RIGHT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x02
  },

  /**
   * @name KEY_LOCATION_NUMPAD
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_NUMPAD': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x03
  },

  /**
   * @name KEY_LOCATION_MOBILE
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_MOBILE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x04
  },

  /**
   * @name KEY_LOCATION_JOYSTICK
   * @return {number} [read-only]
   * @memberOf KeyboardEvent
   * @property
   * @constant
   * @static
   */
  'KEY_LOCATION_JOYSTICK': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x05
  }  
});


/* TEXT EVENT
 */
Object.defineProperties(doodle.events.TextEvent, {
  /**
   * @name TEXT_INPUT
   * @return {string} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'TEXT_INPUT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: "textInput"
  },

  /**
   * @name INPUT_METHOD_UNKNOWN
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_UNKNOWN': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x00
  },

  /**
   * @name INPUT_METHOD_KEYBOARD
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_KEYBOARD': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x01
  },

  /**
   * @name INPUT_METHOD_PASTE
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_PASTE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x02
  },

  /**
   * @name INPUT_METHOD_DROP
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_DROP': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x03
  },

  /**
   * @name INPUT_METHOD_IME
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_IME': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x04
  },

  /**
   * @name INPUT_METHOD_OPTION
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_OPTION': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x05
  },

  /**
   * @name INPUT_METHOD_HANDWRITING
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_HANDWRITING': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x06
  },

  /**
   * @name INPUT_METHOD_VOICE
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_VOICE': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x07
  },

  /**
   * @name INPUT_METHOD_MULTIMODAL
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_MULTIMODAL': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x08
  },
  
  /**
   * @name INPUT_METHOD_SCRIPT
   * @return {number} [read-only]
   * @memberOf TextEvent
   * @property
   * @constant
   * @static
   */
  'INPUT_METHOD_SCRIPT': {
    enumerable: true,
    writable: false,
    configurable: false,
    value: 0x09
  }  
});
/*globals doodle*/
(function () {
  var point_static_properties,
      distance,
      temp_array = new Array(2),
      temp_point = {x:0, y:0},
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      /*END_DEBUG*/
      //lookup help
      cos = Math.cos,
      sin = Math.sin,
      sqrt = Math.sqrt;
  
  /**
   * @name doodle.geom.Point
   * @class
   * @augments Object
   * @param {number=} x
   * @param {number=} y
   * @return {doodle.geom.Point}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.geom.Point = function Point (x, y) {
    var point = {},
        arg_len = arguments.length,
        init_obj;

    Object.defineProperties(point, point_static_properties);
    //properties that require privacy
    Object.defineProperties(point, (function () {
      var x = 0,
          y = 0,
          $temp_array = temp_array;
      
      return {
        /**
         * The horizontal coordinate of the point.
         * @name x
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'x': {
          enumerable: true,
          configurable: false,
          get: function () { return x; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Point.x', id:this.id});
            range_check(isFinite(n), {label:'Point.x', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            x = n;
          }
        },

        /**
         * The vertical coordinate of the point.
         * @name y
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'y': {
          enumerable: true,
          configurable: false,
          get: function () { return y; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Point.y', id:this.id});
            range_check(isFinite(n), {label:'Point.y', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            y = n;
          }
        },

        /**
         * Same as toArray, but reuses array object.
         * @name __toArray
         * @return {Point}
         * @private
         */
        '__toArray': {
          enumerable: false,
          writable: false,
          configurable: false,
          value: function () {
            $temp_array[0] = x;
            $temp_array[1] = y;
            return $temp_array;
          }
        },

        /**
         * @name id
         * @return {string}
         */
        'id': (function () {
          var id = null;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return (id === null) ? this.toString() : id; },
            set: function (idArg) {
              /*DEBUG*/
              idArg === null || type_check(idArg,'string', {label:'Point.id', id:this.id});
              /*END_DEBUG*/
              id = idArg;
            }
          };
        }())
      };
    }()));//end defineProperties

    //initialize point
    switch (arg_len) {
    case 0:
      //defaults to 0,0
      break;
    case 2:
      //standard instantiation
      point.compose(x, y);
      break;
    case 1:
      //passed an initialization obj: point, array, function
      init_obj = arguments[0];
      x = undefined;
      
      if (typeof init_obj === 'function') {
        init_obj.call(point);
      } else if (Array.isArray(init_obj)) {
        /*DEBUG*/
        if (init_obj.length !== 2) {
          throw new SyntaxError("[object Point]([x, y]): Invalid array parameter.");
        }
        /*END_DEBUG*/
        point.compose.apply(point, init_obj);
      } else {
        /*DEBUG*/
        type_check(init_obj,'Point', {label: 'doodle.geom.Point', id:this.id, message:"Unable to initialize from point object."});
        /*END_DEBUG*/
        point.compose(init_obj.x, init_obj.y);
      }
      break;
    default:
      /*DEBUG*/
      throw new SyntaxError("[object Point](x, y): Invalid number of parameters.");
      /*END_DEBUG*/
    }

    return point;
  };

  
  point_static_properties = {
    /**
     * Returns a string that contains the values of the x and y coordinates.
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "(x=" + this.x + ",y=" + this.y + ")"; }
    },

    /**
     * Returns an array that contains the values of the x and y coordinates.
     * @name toArray
     * @return {Array}
     */
    'toArray': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return this.__toArray().concat(); }
    },

    /**
     * The length of the line segment from (0,0) to this point.
     * @name length
     * @return {number}
     * @property
     */
    'length': {
      enumerable: true,
      configurable: false,
      get: function () { return distance(temp_point, this); }
    },

    /**
     * Set point coordinates.
     * @name compose
     * @param {number} x
     * @param {number} y
     * @return {Point}
     * @throws {TypeError}
     */
    'compose': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (x, y) {
        /*DEBUG*/
        type_check(x,'number', y,'number', {label:'Point.compose', params:['x','y'], id:this.id});
        range_check(isFinite(x), isFinite(y), {label:'Point.compose', params:['x','y'], id:this.id, message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.x = x;
        this.y = y;
        return this;
      }
    },

    /**
     * Creates a copy of this Point object.
     * @name clone
     * @return {Point}
     */
    'clone': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return Point(this.x, this.y); }
    },

    /**
     * Determines whether two points are equal.
     * @name equals
     * @param {Point} pt The point to be compared.
     * @return {boolean}
     * @throws {TypeError}
     */
    'equals': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Point.equals', params:'point', id:this.id});
        /*END_DEBUG*/
        return (this.x === pt.x && this.y === pt.y);
      }
    },

    /**
     * Adds the coordinates of another point to the coordinates of
     * this point to create a new point.
     * @name add
     * @param {Point} pt The point to be added.
     * @return {Point} The new point.
     * @throws {TypeError}
     */
    'add': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt,'Point', {label:'Point.add', params:'point', id:this.id});
        /*END_DEBUG*/
        return Point(this.x + pt.x, this.y + pt.y);
      }
    },

    /**
     * Subtracts the coordinates of another point from the
     * coordinates of this point to create a new point.
     * @name subtract
     * @param {Point} pt The point to be subtracted.
     * @return {Point} The new point.
     * @throws {TypeError}
     */
    'subtract': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt,'Point', {label:'Point.subtract', params:'point', id:this.id});
        /*END_DEBUG*/
        return Point(this.x - pt.x, this.y - pt.y);
      }
    },

    /**
     * @name offset
     * @param {number} dx
     * @param {number} dy
     * @throws {TypeError}
     */
    'offset': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (dx, dy) {
        /*DEBUG*/
        type_check(dx,'number', dy,'number', {label:'Point.offset', id:this.id, params:['dx','dy']});
        range_check(isFinite(dx), isFinite(dy), {label:'Point.offset', id:this.id, params:['dx','dy'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.x += dx;
        this.y += dy;
        return this;
      }
    },

    /**
     * Scales the line segment between (0,0) and the
     * current point to a set length.
     * @name normalize
     * @param {number} thickness The scaling value.
     * @return {Point}
     * @throws {TypeError}
     */
    'normalize': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (thickness) {
        /*DEBUG*/
        type_check(thickness,'number', {label:'Point.normalize', id:this.id, params:'thickness'});
        range_check(isFinite(thickness), {label:'Point.normalize', params:'thickness', id:this.id});
        /*END_DEBUG*/
        this.x = (this.x / this.length) * thickness;
        this.y = (this.y / this.length) * thickness;
        return this;
        /*correct version?
          var angle:number = Math.atan2(this.y, this.x);
          this.x = Math.cos(angle) * thickness;
          this.y = Math.sin(angle) * thickness;
        */
      }
    },

    /**
     * Determines a point between two specified points.
     * @name interpolate
     * @param {Point} pt1 The first point.
     * @param {Point} pt2 The second point.
     * @param {number} t The level of interpolation between the two points, between 0 and 1.
     * @return {Point}
     * @throws {TypeError}
     */
    'interpolate': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt1, pt2, t) {
        /*DEBUG*/
        type_check(pt1,'Point', pt2,'Point', t,'number', {label:'Point.interpolate', id:this.id, params:['point','point','time']});
        range_check(isFinite(t), {label:'Point.interpolate', params:['point','point','*time*'], id:this.id});
        /*END_DEBUG*/
        return Point(pt1.x + (pt2.x - pt1.x) * t, pt1.y + (pt2.y - pt1.y) * t);
        /* correct version?
           var nx = pt2.x - pt1.x;
           var ny = pt2.y - pt1.y;
           var angle = Math.atan2(ny , nx);
           var dis = Math.sqrt(x * nx + ny * ny) * t;
           var sx = pt2.x - Math.cos(angle) * dis;
           var sy = pt2.y - Math.sin(angle) * dis;
           return Object.create(point).compose(sx, sy);
        */
      }
    },

    /**
     * Converts a pair of polar coordinates to a Cartesian point coordinate.
     * @name polar
     * @param {number} len The length coordinate of the polar pair.
     * @param {number} angle The angle, in radians, of the polar pair.
     * @return {Point}
     * @throws {TypeError}
     */
    'polar': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (len, angle) {
        /*DEBUG*/
        type_check(len,'number', angle,'number', {label:'Point.polar', id:this.id, params:['len','angle']});
        range_check(isFinite(len), isFinite(angle), {label:'Point.polar', params:['len','angle'], id:this.id, message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        return Point(len*cos(angle), len*sin(angle));
      }
    }
    
  };//end point_static_properties definition

  /*
   * CLASS FUNCTIONS
   */

  /**
   * Returns the distance between pt1 and pt2.
   * @name distance
   * @param {Point} pt1
   * @param {Point} pt2
   * @return {number}
   * @throws {TypeError}
   * @static
   */
  distance = doodle.geom.Point.distance = function (pt1, pt2) {
    /*DEBUG*/
    type_check(pt1,'Point', pt2,'Point', {label:'Point.distance', params:['point','point']});
    /*END_DEBUG*/
    var dx = pt2.x - pt1.x,
        dy = pt2.y - pt1.y;
    return sqrt(dx*dx + dy*dy);
  };
  
}());//end class closure

/**
 * Check if a given object contains a numeric x and y property.
 * Does not check if a point is actually a doodle.geom.point.
 * @name isPoint
 * @param {Point} pt
 * @return {boolean}
 * @static
 */
doodle.geom.Point.isPoint = function (pt) {
  return (typeof pt === 'object' && typeof pt.x === 'number' && typeof pt.y === 'number');
};
/*globals doodle*/
(function () {
  var matrix_static_properties,
      //recycle object for internal calculations
      temp_array = new Array(6),
      temp_point = {x: null, y: null},
      temp_matrix = {a:null, b:null, c:null, d:null, tx:null, ty:null},
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      /*END_DEBUG*/
      //lookup help
      doodle_Point = doodle.geom.Point,
      sin = Math.sin,
      cos = Math.cos,
      atan2 = Math.atan2,
      tan = Math.tan;
  
  /**
   * @name doodle.geom.Matrix
   * @class
   * @augments Object
   * @param {number=} a
   * @param {number=} b
   * @param {number=} c
   * @param {number=} d
   * @param {number=} tx
   * @param {number=} ty
   * @return {doodle.geom.Matrix}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.geom.Matrix = function Matrix (a, b, c, d, tx, ty) {
    var matrix = {},
        arg_len = arguments.length,
        init_obj;
    
    Object.defineProperties(matrix, matrix_static_properties);
    //properties that require privacy
    Object.defineProperties(matrix, (function () {
      var a = 1,
          b = 0,
          c = 0,
          d = 1,
          tx = 0,
          ty = 0,
          $temp_array = temp_array;
      
      return {
        /**
         * The value that affects the positioning of pixels along the x axis
         * when scaling or rotating an image.
         * @name a
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'a': {
          enumerable: true,
          configurable: false,
          get: function () { return a; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Matrix.a', id:this.id});
            range_check(isFinite(n), {label:'Matrix.a', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            a = n;
          }
        },

        /**
         * The value that affects the positioning of pixels along the y axis
         * when rotating or skewing an image.
         * @name b
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'b': {
          enumerable: true,
          configurable: false,
          get: function () { return b; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Matrix.b', id:this.id});
            range_check(isFinite(n), {label:'Matrix.b', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            b = n;
          }
        },

        /**
         * The value that affects the positioning of pixels along the x axis
         * when rotating or skewing an image.
         * @name c
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'c': {
          enumerable: true,
          configurable: false,
          get: function () { return c; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Matrix.c', id:this.id});
            range_check(isFinite(n), {label:'Matrix.c', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            c = n;
          }
        },

        /**
         * The value that affects the positioning of pixels along the y axis
         * when scaling or rotating an image.
         * @name d
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'd': {
          enumerable: true,
          configurable: false,
          get: function () { return d; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Matrix.d', id:this.id});
            range_check(isFinite(n), {label:'Matrix.d', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            d = n;
          }
        },

        /**
         * The distance by which to translate each point along the x axis.
         * @name tx
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'tx': {
          enumerable: true,
          configurable: false,
          get: function () { return tx; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Matrix.tx', id:this.id});
            range_check(isFinite(n), {label:'Matrix.tx', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            tx = n;
          }
        },

        /**
         * The distance by which to translate each point along the y axis.
         * @name ty
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'ty': {
          enumerable: true,
          configurable: false,
          get: function () { return ty; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Matrix.ty', id:this.id});
            range_check(isFinite(n), {label:'Matrix.ty', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            ty = n;
          }
        },

        /**
         * Same as toArray, but reuses array object.
         * @return {Array}
         * @private
         */
        '__toArray': {
          enumerable: false,
          writable: false,
          configurable: false,
          value: function () {
            $temp_array[0] = a;
            $temp_array[1] = b;
            $temp_array[2] = c;
            $temp_array[3] = d;
            $temp_array[4] = tx;
            $temp_array[5] = ty;
            return $temp_array;
          }
        },

        /**
         * @name id
         * @return {string}
         */
        'id': (function () {
          var id = null;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return (id === null) ? this.toString() : id; },
            set: function (idArg) {
              /*DEBUG*/
              idArg === null || type_check(idArg,'string', {label:'Point.id', id:this.id});
              /*END_DEBUG*/
              id = idArg;
            }
          };
        }())
        
      };
    }()));//end defineProperties
    

    /* initialize matrix
     */
    switch (arg_len) {
    case 0:
      //defaults to 1,0,0,1,0,0
      break;
    case 6:
      //standard instantiation
      matrix.compose(a, b, c, d, tx, ty);
      break;
    case 1:
      //passed an initialization obj: matrix, array, function
      init_obj = arguments[0];
      a = undefined;

      if (typeof init_obj === 'function') {
        init_obj.call(matrix);
      } else if (Array.isArray(init_obj)) {
        /*DEBUG*/
        if (init_obj.length !== 6) {
          throw new SyntaxError("[object Matrix]([a, b, c, d, tx, ty]): Invalid array parameter.");
        }
        /*END_DEBUG*/
        matrix.compose.apply(matrix, init_obj);
      } else {
        /*DEBUG*/
        type_check(init_obj, 'Matrix', {label:'doodle.geom.Matrix', id:this.id, params:'matrix', message:"Invalid initialization object."});
        /*END_DEBUG*/
        matrix.compose(init_obj.a, init_obj.b, init_obj.c, init_obj.d, init_obj.tx, init_obj.ty);
      }
      break;
    default:
      /*DEBUG*/
      throw new SyntaxError("[object Matrix](a, b, c, d, tx, ty): Invalid number of parameters.");
      /*END_DEBUG*/
    }
    
    return matrix;
  };

  
  matrix_static_properties = {
    /**
     * Set values of this matrix with the specified parameters.
     * @name compose
     * @param {number} a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
     * @param {number} b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
     * @param {number} c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
     * @param {number} d The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
     * @param {number} tx The distance by which to translate each point along the x axis.
     * @param {number} ty The distance by which to translate each point along the y axis.
     * @return {Matrix}
     * @throws {TypeError}
     */
    'compose': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (a, b, c, d, tx, ty) {
        /*DEBUG*/
        type_check(a,'number', b,'number', c,'number', d,'number', tx,'number', ty,'number', {label:'Matrix.compose', id:this.id, params:['a','b','c','d','tx','ty']});
        range_check(isFinite(a), isFinite(b), isFinite(c), isFinite(d), isFinite(tx), isFinite(ty), {label:'Matrix.compose', id:this.id, params:['a','b','c','d','tx','ty'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.a  = a;
        this.b  = b;
        this.c  = c;
        this.d  = d;
        this.tx = tx;
        this.ty = ty;
        return this;
      }
    },
    
    /**
     * Returns an array value containing the properties of the Matrix object.
     * @name toArray
     * @return {Array}
     */
    'toArray': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return this.__toArray().concat(); }
    },
    
    /**
     * Returns a text value listing the properties of the Matrix object.
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return ("(a="+ this.a +",b="+ this.b +",c="+ this.c +",d="+ this.d +",tx="+ this.tx +",ty="+ this.ty +")");
      }
    },

    /**
     * Test if matrix is equal to this one.
     * @name equals
     * @param {Matrix} m
     * @return {boolean}
     * @throws {TypeError}
     */
    'equals': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (m) {
        /*DEBUG*/
        type_check(m,'Matrix', {label:'Matrix.equals', id:this.id, params:'matrix'});
        /*END_DEBUG*/
        return (this.a  === m.a && this.b  === m.b && this.c  === m.c && this.d  === m.d && this.tx === m.tx && this.ty === m.ty);
      }
    },

    /**
     * Sets each matrix property to a value that causes a null transformation.
     * @name identity
     * @return {Matrix}
     */
    'identity': {
      enumerable: true,
      writable: false,
      configurable: false,
      value:  function () {
        this.a  = 1;
        this.b  = 0;
        this.c  = 0;
        this.d  = 1;
        this.tx = 0;
        this.ty = 0;
        return this;
      }
    },

    /**
     * Returns a new Matrix object that is a clone of this matrix,
     * with an exact copy of the contained object.
     * @name clone
     * @return {Matrix}
     */
    'clone': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty); }
    },

    /**
     * Multiplies a matrix with the current matrix,
     * effectively combining the geometric effects of the two.
     * @name multiply
     * @param {Matrix} m The matrix to be concatenated to the source matrix.
     * @return {Matrix}
     * @throws {TypeError}
     */
    'multiply': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (m) {
        /*DEBUG*/
        type_check(m,'Matrix', {label:'Matrix.multiply', id:this.id, params:'matrix'});
        /*END_DEBUG*/
        var a  = this.a * m.a  + this.c * m.b,
            b  = this.b * m.a  + this.d * m.b,
            c  = this.a * m.c  + this.c * m.d,
            d  = this.b * m.c  + this.d * m.d,
            tx = this.a * m.tx + this.c * m.ty + this.tx,
            ty = this.b * m.tx + this.d * m.ty + this.ty;
        return this.compose(a, b, c, d, tx, ty);
      }
    },

    /**
     * Applies a rotation transformation to the Matrix object.
     * @name rotate
     * @param {number} angle The rotation angle in radians.
     * @return {Matrix}
     * @throws {TypeError}
     */
    'rotate': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (r) {
        /*DEBUG*/
        type_check(r,'number', {label:'Matrix.rotate', id:this.id, params:'radians'});
        range_check(isFinite(r), {label:'Matrix.rotate', id:this.id, params:'radians', message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        var c = cos(r),
            s = sin(r),
            m = temp_matrix;
        m.a = c;
        m.b = s;
        m.c = -s;
        m.d = c;
        m.tx = 0;
        m.ty = 0;
        return this.multiply(m);
      }
    },

    /**
     * Applies a rotation transformation to the Matrix object, ignore translation.
     * @name deltaRotate
     * @param {number} angle The rotation angle in radians.
     * @return {Matrix}
     * @throws {TypeError}
     */
    'deltaRotate': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (r) {
        /*DEBUG*/
        type_check(r,'number', {label:'Matrix.deltaRotate', id:this.id, params:'radians'});
        range_check(isFinite(r), {label:'Matrix.deltaRotate', id:this.id, params:'radians', message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        var x = this.tx,
            y = this.ty;
        this.rotate(r);
        this.tx = x;
        this.ty = y;
        return this;
      }
    },

    /**
     * Return the angle of rotation in radians.
     * @name rotation
     * @return {number} radians
     * @throws {TypeError}
     * @property
     */
    'rotation': {
      enumerable: true,
      configurable: false,
      get: function () { return atan2(this.b, this.a); },
      set: function (r) {
        /*DEBUG*/
        type_check(r,'number', {label:'Matrix.rotation', id:this.id, message:"Parameter must be a number in radians."});
        range_check(isFinite(r), {label:'Matrix.rotation', id:this.id, params:'radians', message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        var c = cos(r),
            s = sin(r);
        this.compose(c, s, -s, c, this.tx, this.ty);
      }
    },

    /**
     * Applies a scaling transformation to the matrix.
     * @name scale
     * @param {number} sx A multiplier used to scale the object along the x axis.
     * @param {number} sy A multiplier used to scale the object along the y axis.
     * @return {Matrix}
     * @throws {TypeError}
     */
    'scale': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (sx, sy) {
        /*DEBUG*/
        type_check(sx,'number', sy,'number', {label:'Matrix.scale', id:this.id, params:['sx','sy']});
        range_check(isFinite(sx), isFinite(sy), {label:'Matrix.scale', id:this.id, params:['sx','sy'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        temp_matrix.a = sx;
        temp_matrix.b = 0;
        temp_matrix.c = 0;
        temp_matrix.d = sy;
        temp_matrix.tx = 0;
        temp_matrix.ty = 0;
        return this.multiply(temp_matrix);
      }
    },

    /**
     * Applies a scaling transformation to the matrix, ignores translation.
     * @name deltaScale
     * @param {number} sx A multiplier used to scale the object along the x axis.
     * @param {number} sy A multiplier used to scale the object along the y axis.
     * @return {Matrix}
     * @throws {TypeError}
     */
    'deltaScale': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (sx, sy) {
        /*DEBUG*/
        type_check(sx,'number', sy,'number', {label:'Matrix.deltaScale', id:this.id, params:['sx','sy']});
        range_check(isFinite(sx), isFinite(sy), {label:'Matrix.deltaScale', id:this.id, params:['sx','sy'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        var x = this.tx,
            y = this.ty;
        this.scale(sx, sy);
        this.tx = x;
        this.ty = y;
        return this;
      }
    },

    /**
     * Translates the matrix along the x and y axes.
     * @name translate
     * @param {number} dx The amount of movement along the x axis to the right, in pixels.
     * @param {number} dy The amount of movement down along the y axis, in pixels.
     * @return {Matrix}
     * @throws {TypeError}
     */
    'translate': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (dx, dy) {
        /*DEBUG*/
        type_check(dx,'number', dy,'number', {label:'Matrix.translate', id:this.id, params:['dx','dy']});
        range_check(isFinite(dx), isFinite(dy), {label:'Matrix.translate', id:this.id, params:['dx','dy'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.tx += dx;
        this.ty += dy;
        return this;
      }
    },

    /**
     * @name skew
     * @param {number} skewX
     * @param {number} skewY
     * @return {Matrix}
     * @throws {TypeError}
     */
    'skew': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (skewX, skewY) {
        /*DEBUG*/
        type_check(skewX, 'number', skewY, 'number', {label:'Matrix.skew', id:this.id, params:['skewX','skewY']});
        range_check(isFinite(skewX), isFinite(skewY), {label:'Matrix.skew', id:this.id, params:['skewX','skewY'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        var sx = tan(skewX),
            sy = tan(skewY),
            m = temp_matrix;
        m.a = 1;
        m.b = sy;
        m.c = sx;
        m.d = 1;
        m.tx = 0;
        m.ty = 0;
        return this.multiply(m);
      }
    },

    /**
     * Skew matrix and ignore translation.
     * @name deltaSkew
     * @param {number} skewX
     * @param {number} skewY
     * @return {Matrix}
     * @throws {TypeError}
     */
    'deltaSkew': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (skewX, skewY) {
        /*DEBUG*/
        type_check(skewX,'number', skewY,'number', {label:'Matrix.deltaSkew', id:this.id, params:['skewX','skewY']});
        range_check(isFinite(skewX), isFinite(skewY), {label:'Matrix.deltaSkew', id:this.id, params:['skewX','skewY'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        var x = this.tx,
            y = this.ty;
        this.skew(skewX, skewY);
        this.tx = x;
        this.ty = y;
        return this;
      }
    },

    /**
     * Add a matrix with the current matrix.
     * @name add
     * @param {Matrix} m
     * @return {Matrix}
     * @throws {TypeError}
     */
    'add': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (m) {
        /*DEBUG*/
        type_check(m,'Matrix', {label:'Matrix.add', id:this.id, params:'matrix'});
        /*END_DEBUG*/
        this.a  += m.a;
        this.b  += m.b;
        this.c  += m.c;
        this.d  += m.d;
        this.tx += m.tx;
        this.ty += m.ty;
        return this;
      }
    },

    /**
     * Performs the opposite transformation of the original matrix.
     * @name invert
     * @return {Matrix}
     */
    'invert': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        var det = this.a * this.d - this.b * this.c,
            a  =  this.d / det,
            b  = -this.b / det,
            c  = -this.c / det,
            d  =  this.a / det,
            tx =  (this.ty * this.c - this.d * this.tx) / det,
            ty = -(this.ty * this.a - this.b * this.tx) / det;
        return this.compose(a, b, c, d, tx, ty);
      }
    },

    /**
     * Returns the result of applying the geometric transformation
     * represented by the Matrix object to the specified point.
     * @name transformPoint
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     */
    'transformPoint': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Matrix.transformPoint', id:this.id, params:'point'});
        /*END_DEBUG*/
        return doodle_Point(this.a * pt.x + this.c * pt.y + this.tx, this.b * pt.x + this.d * pt.y + this.ty);
      }
    },

    /**
     * Same as transformPoint, but modifies the point object argument.
     * @name __transformPoint
     * @throws {TypeError}
     * @private
     */
    '__transformPoint': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Matrix.__transformPoint', id:this.id, params:'point'});
        /*END_DEBUG*/
        var x = pt.x,
            y = pt.y;
        pt.x = this.a * x + this.c * y + this.tx;
        pt.y = this.b * x + this.d * y + this.ty;
        return pt;
      }
    },

    /**
     * Given a point in the pretransform coordinate space, returns
     * the coordinates of that point after the transformation occurs.
     * Unlike 'transformPoint', does not consider translation.
     * @name deltaTransformPoint
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     */
    'deltaTransformPoint': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Matrix.deltaTransformPoint', id:this.id, params:'point'});
        /*END_DEBUG*/
        return doodle_Point(this.a * pt.x + this.c * pt.y, this.b * pt.x + this.d * pt.y);
      }
    },

    /**
     * Same as deltaTransformPoint, but modifies the point object argument.
     * @name __deltaTransformPoint
     * @throws {TypeError}
     * @private
     */
    '__deltaTransformPoint': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Matrix.__deltaTransformPoint', id:this.id, params:'point'});
        /*END_DEBUG*/
        var x = pt.x,
            y = pt.y;
        pt.x = this.a * x + this.c * y;
        pt.y = this.b * x + this.d * y;
        return pt;
      }
    },

    /**
     * @name rotateAroundExternalPoint
     * @throws {TypeError}
     */
    'rotateAroundExternalPoint': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt, r) {
        /*DEBUG*/
        type_check(pt,'Point', r,'number', {label:'Matrix.rotateAroundExternalPoint', id:this.id, params:['point','radians']});
        range_check(isFinite(r), {label:'Matrix.rotateAroundExternalPoint', id:this.id, params:['point','radians'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        var c = cos(r),
            s = sin(r),
            m = temp_matrix,
            reg_pt = temp_point; //new registration point
        //parent rotation matrix, global space
        m.a = c;
        m.b = s;
        m.c = -s;
        m.d = c;
        m.tx = 0;
        m.ty = 0;
        //move this matrix
        this.translate(-pt.x, -pt.y);
        //parent transform this position
        reg_pt.x = m.a * this.tx + m.c * this.ty + m.tx;
        reg_pt.y = m.b * this.tx + m.d * this.ty + m.ty;
        //assign new position
        this.tx = reg_pt.x;
        this.ty = reg_pt.y;
        //apply parents rotation, and put back
        return this.multiply(m).translate(pt.x, pt.y);
      }
    },

    /**
     * @name rotateAroundInternalPoint
     * @throws {TypeError}
     */
    'rotateAroundInternalPoint': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (point, r) {
        /*DEBUG*/
        type_check(point,'Point', r,'number', {label:'Matrix.rotateAroundInternalPoint', id:this.id, params:['point','radians']});
        range_check(isFinite(r), {label:'Matrix.rotateAroundInternalPoint', id:this.id, params:['point','radians'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        var pt = temp_point;
        pt.x = this.a * point.x + this.c * point.y + this.tx;
        pt.y = this.b * point.x + this.d * point.y + this.ty;
        return this.rotateAroundExternalPoint(pt, r);
      }
    },

    /**
     * @name matchInternalPointWithExternal
     * @throws {TypeError}
     */
    'matchInternalPointWithExternal': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt_int, pt_ext) {
        /*DEBUG*/
        type_check(pt_int,'Point', pt_ext,'Point', {label:'Matrix.matchInternalPointWithExternal', id:this.id, params:['point','point']});
        /*END_DEBUG*/
        var pt = temp_point;
        //transform point
        pt.x = this.a * pt_int.x + this.c * pt_int.y + this.tx;
        pt.y = this.b * pt_int.x + this.d * pt_int.y + this.ty;
        return this.translate(pt_ext.x - pt.x, pt_ext.y - pt.y);
      }
    },

    /**
     * Update matrix 'in-between' this and another matrix
     * given a value of t bewteen 0 and 1.
     * @name interpolate
     * @return {Matrix}
     * @throws {TypeError}
     */
    'interpolate': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (m, t) {
        /*DEBUG*/
        type_check(m,'Matrix', t,'number', {label:'Matrix.interpolate', id:this.id, params:['matrix','time']});
        range_check(isFinite(t), {label:'Matrix.interpolate', id:this.id, params:['matrix','*time*'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.a  = this.a  + (m.a  - this.a)  * t;
        this.b  = this.b  + (m.b  - this.b)  * t;
        this.c  = this.c  + (m.c  - this.c)  * t;
        this.d  = this.d  + (m.d  - this.d)  * t;
        this.tx = this.tx + (m.tx - this.tx) * t;
        this.ty = this.ty + (m.ty - this.ty) * t;
        return this;
      }
    }
  };//end matrix_static_properties defintion
}());//end class closure

/*
 * CLASS FUNCTIONS
 */

/**
 * Check if a given object contains a numeric matrix properties.
 * Does not check if a matrix is actually a doodle.geom.matrix.
 * @name isMatrix
 * @param {Object} m
 * @return {boolean}
 * @static
 */
doodle.geom.Matrix.isMatrix = function (m) {
  return (typeof m === 'object' &&
          typeof m.a  === 'number' && typeof m.b  === 'number' &&
          typeof m.c  === 'number' && typeof m.d  === 'number' &&
          typeof m.tx === 'number' && typeof m.ty === 'number');
};
/*globals doodle*/
(function () {
  var rect_static_properties,
      temp_array = new Array(4),
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      /*END_DEBUG*/
      //lookup help
      max = Math.max,
      min = Math.min;
  
  /**
   * @name doodle.geom.Rectangle
   * @class
   * @augments Object
   * @param {number=} x
   * @param {number=} y
   * @param {number=} width
   * @param {number=} height
   * @return {doodle.geom.Rectangle}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle.geom.Rectangle = function Rectangle (x, y, width, height) {
    var rect = {},
        arg_len = arguments.length,
        init_obj;

    Object.defineProperties(rect, rect_static_properties);
    //properties that require privacy
    Object.defineProperties(rect, (function () {
      var x = 0,
          y = 0,
          width = 0,
          height = 0,
          $temp_array = temp_array;
      
      return {
        /**
         * @name x
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'x': {
          enumerable: true,
          configurable: false,
          get: function () { return x; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Rectangle.x', id:this.id});
            range_check(isFinite(n), {label:'Rectangle.x', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            x = n;
          }
        },

        /**
         * @name y
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'y': {
          enumerable: true,
          configurable: false,
          get: function () { return y; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label: 'Rectangle.y', id:this.id});
            range_check(isFinite(n), {label:'Rectangle.y', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            y = n;
          }
        },

        /**
         * @name width
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'width': {
          enumerable: true,
          configurable: false,
          get: function () { return width; },
          set: function (n) {
            /*DEBUG*/
            type_check(n, 'number', {label: 'Rectangle.width', id:this.id});
            range_check(isFinite(n), {label:'Rectangle.width', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            width = n;
          }
        },

        /**
         * @name height
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'height': {
          enumerable: true,
          configurable: false,
          get: function () { return height; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Rectangle.height', id:this.id});
            range_check(isFinite(n), {label:'Rectangle.height', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            height = n;
          }
        },

        /**
         * Same as toArray, but reuses array object.
         * @name __toArray
         * @return {Array}
         * @private
         */
        '__toArray': {
          enumerable: false,
          writable: false,
          configurable: false,
          value: function () {
            $temp_array[0] = x;
            $temp_array[1] = y;
            $temp_array[2] = width;
            $temp_array[3] = height;
            return $temp_array;
          }
        },

        /**
         * @name id
         * @return {string}
         */
        'id': (function () {
          var id = null;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return (id === null) ? this.toString() : id; },
            set: function (idArg) {
              /*DEBUG*/
              idArg === null || type_check(idArg,'string', {label:'Point.id', id:this.id});
              /*END_DEBUG*/
              id = idArg;
            }
          };
        }())
        
      };
    }()));//end defineProperties

    //initialize rectangle
    switch (arg_len) {
    case 0:
      //defaults to {x:0, y:0, width:0, height:0}
      break;
    case 4:
      //standard instantiation
      rect.compose(x, y, width, height);
      break;
    case 1:
      //passed an initialization obj: point, array, function
      init_obj = arguments[0];
      x = undefined;
      
      if (typeof init_obj === 'function') {
        init_obj.call(rect);
      } else if (Array.isArray(init_obj)) {
        /*DEBUG*/
        if (init_obj.length !== 4) {
          throw new SyntaxError("[object Rectangle]([x, y, width, height]): Invalid array parameter.");
        }
        /*END_DEBUG*/
        rect.compose.apply(rect, init_obj);
      } else {
        /*DEBUG*/
        type_check(init_obj,'Rectangle', {label:'Rectangle', id:this.id, params:'rectangle', message:"Unable to initialize with Rectangle object."});
        /*END_DEBUG*/
        rect.compose(init_obj.x, init_obj.y, init_obj.width, init_obj.height);
      }
      break;
    default:
      /*DEBUG*/
      throw new SyntaxError("[object Rectangle](x, y, width, height): Invalid number of parameters.");
      /*END_DEBUG*/
    }

    return rect;
  };


  rect_static_properties = {
    /**
     * @name top
     * @return {number}
     * @throws {TypeError}
     * @property
     */
    'top': {
      enumerable: true,
      configurable: false,
      get: function () { return this.y; },
      set: function (n) {
        /*DEBUG*/
        type_check(n,'number', {label:'Rectangle.top', id:this.id});
        range_check(isFinite(n), {label:'Rectangle.top', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.y = n;
        this.height -= n;
      }
    },

    /**
     * @name right
     * @return {number}
     * @throws {TypeError}
     * @property
     */
    'right': {
      enumerable: true,
      configurable: false,
      get: function () { return this.x + this.width; },
      set: function (n) {
        /*DEBUG*/
        type_check(n,'number', {label:'Rectangle.right', id:this.id});
        range_check(isFinite(n), {label:'Rectangle.right', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.width = n - this.x;
      }
    },

    /**
     * @name bottom
     * @return {number}
     * @throws {TypeError}
     * @property
     */
    'bottom': {
      enumerable: true,
      configurable: false,
      get: function () { return this.y + this.height; },
      set: function (n) {
        /*DEBUG*/
        type_check(n,'number', {label:'Rectangle.bottom', id:this.id});
        range_check(isFinite(n), {label:'Rectangle.bottom', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.height = n - this.y;
      }
    },

    /**
     * @name left
     * @return {number}
     * @throws {TypeError}
     * @property
     */
    'left': {
      enumerable: true,
      configurable: false,
      get: function () { return this.x; },
      set: function (n) {
        /*DEBUG*/
        type_check(n,'number', {label:'Rectangle.left', id:this.id});
        range_check(isFinite(n), {label:'Rectangle.left', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.x = n;
        this.width -= n;
      }
    },

    /**
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "(x="+ this.x +",y="+ this.y +",w="+ this.width +",h="+ this.height +")";
      }
    },

    /**
     * @name toArray
     * @return {Array}
     */
    'toArray': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return this.__toArray().concat(); }
    },
    
    /**
     * Sets this rectangle's parameters.
     * @name compose
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @return {Rectangle}
     * @throws {TypeError}
     */
    'compose': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (x, y, w, h) {
        /*DEBUG*/
        type_check(x,'number', y,'number', w,'number', h,'number', {label: 'Rectangle.compose', params:['x','y','width','height'], id:this.id});
        range_check(isFinite(x), isFinite(y), isFinite(w), isFinite(h), {label:'Rectangle.compose', id:this.id, params:['x','y','width','height'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        return this;
      }
    },

    /**
     * Same as compose, but takes a rectangle parameter.
     * @name __compose
     * @param {Rectangle} rect
     * @return {Rectangle}
     * @throws {TypeError}
     * @private
     */
    '__compose': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        type_check(rect,'Rectangle', {label:'Rectangle.__compose', params:'rectangle', id:this.id});
        /*END_DEBUG*/
        this.compose.apply(this, rect.__toArray());
        return this;
      }
    },

    /**
     * @name clone
     * @return {Rectangle}
     */
    'clone': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return Rectangle(this.x, this.y, this.width, this.height); }
    },

    /**
     * Adjusts the location of the rectangle, as determined by
     * its top-left corner, by the specified amounts.
     * @name offset
     * @param {number} dx
     * @param {number} dy
     * @return {Rectangle}
     * @throws {TypeError}
     */
    'offset': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (dx, dy) {
        /*DEBUG*/
        type_check(dx,'number', dy,'number', {label:'Rectangle.offset', params:['dx','dy'], id:this.id});
        range_check(isFinite(dx), isFinite(dy), {label:'Rectangle.offset', id:this.id, message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.x += dx;
        this.y += dy;
        return this;
      }
    },

    /**
     * Increases the size of the rectangle by the specified amounts, in pixels.
     * The center point of the Rectangle object stays the same, and its size
     * increases to the left and right by the dx value, and to the top and the
     * bottom by the dy value.
     * @name inflate
     * @param {number} dx
     * @param {number} dy
     * @return {Rectangle}
     * @throws {TypeError}
     */
    'inflate': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (dx, dy) {
        /*DEBUG*/
        type_check(dx,'number', dy,'number', {label:'Rectangle.inflate', params:['dx','dy'], id:this.id});
        range_check(isFinite(dx), isFinite(dy), {label:'Rectangle.inflate', id:this.id, params:['dx','dy'], message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.x -= dx;
        this.width += 2 * dx;
        this.y -= dy;
        this.height += 2 * dy;
        return this;
      }
    },

    /**
     * Determines whether the rectangle argument is equal to this rectangle.
     * @name equals
     * @param {Rectangle} rect
     * @return {boolean}
     * @throws {TypeError}
     */
    'equals': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        type_check(rect,'Rectangle', {label:'Rectangle.equals', params:'rectangle', id:this.id});
        /*END_DEBUG*/
        return (this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height);
      }
    },

    /**
     * Determines whether or not this Rectangle object is empty.
     * @name isEmpty
     * @return {boolean}
     */
    'isEmpty': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return (this.width >= 0 || this.height >= 0); }
    },

    /**
     * Determines whether the specified point is contained within the
     * rectangular region defined by this Rectangle object.
     * @name contains
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     * @throws {TypeError}
     */
    'contains': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (x, y) {
        /*DEBUG*/
        type_check(x,'number', y,'number', {label:'Rectangle.contains', params:['x','y'], id:this.id});
        range_check(isFinite(x), isFinite(y), {label:'Rectangle.contains', params:['x','y'], id:this.id, message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        return (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
      }
    },

    /**
     * Determines whether the specified point is contained within
     * this rectangle object.
     * @name containsPoint
     * @param {Point} pt
     * @return {boolean}
     * @throws {TypeError}
     */
    'containsPoint': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt,'Point', {label:'Rectangle.containsPoint', params:'point', id:this.id});
        /*END_DEBUG*/
        return this.contains(pt.x, pt.y);
      }
    },

    /**
     * Determines whether the rectangle argument is contained within this rectangle.
     * @name containsRect
     * @param {Rectangle} rect
     * @return {boolean}
     * @throws {TypeError}
     */
    'containsRect': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        type_check(rect,'Rectangle', {label:'Rectangle.containsRect', params:'rectangle', id:this.id});
        /*END_DEBUG*/
        var right = rect.x + rect.width,
            bot = rect.y + rect.height;
        //check corners: tl, tr, br, bl
        return (this.contains(rect.x, rect.y) && this.contains(right, rect.y) && this.contains(right, bot) && this.contains(rect.x, bot));
      }
    },

    /**
     * Determines whether the rectangle argument intersects with this rectangle.
     * @name intersects
     * @param {Rectangle} rect
     * @return {boolean}
     * @throws {TypeError}
     */
    'intersects': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        type_check(rect,'Rectangle', {label:'Rectangle.intersects', params:'rectangle', id:this.id});
        /*END_DEBUG*/
        var right = rect.x + rect.width,
            bot = rect.y + rect.height;
        //check corners: tl, tr, br, bl
        return (this.contains(rect.x, rect.y) || this.contains(right, rect.y) || this.contains(right, bot) || this.contains(rect.x, rect.bot));
      }
    },

    /**
     * If the rectangle argument intersects with this rectangle, returns
     * the area of intersection as a Rectangle object.
     * If the rectangles do not intersect, this method returns an empty
     * Rectangle object with its properties set to 0.
     * @name intersection
     * @param {Rectangle} rect
     * @return {Rectangle}
     * @throws {TypeError}
     */
    'intersection': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        type_check(rect,'Rectangle', {label:'Rectangle.intersection', params:'rectangle', id:this.id});
        /*END_DEBUG*/
        var r = Rectangle(0, 0, 0, 0);
        if (this.intersects(rect)) {
          r.left = max(this.left, rect.x);
          r.top = max(this.top, rect.y);
          r.right = min(this.right, rect.x + rect.width);
          r.bottom = min(this.bottom, rect.y + rect.height);
        }
        return r;
      }
    },

    /**
     * Same as intersection, but modifies this rectangle in place.
     * @name __intersection
     * @param {Rectangle} rect
     * @return {Rectangle}
     * @throws {TypeError}
     * @private
     */
    '__intersection': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        type_check(rect,'Rectangle', {label:'Rectangle.__intersection', params:'rectangle', id:this.id});
        /*END_DEBUG*/
        if (this.intersects(rect)) {
          this.left = max(this.left, rect.x);
          this.top = max(this.top, rect.y);
          this.right = min(this.right, rect.x + rect.width);
          this.bottom = min(this.bottom, rect.y + rect.height);
        }
        return this;
      }
    },

    /**
     * Adds two rectangles together to create a new Rectangle object,
     * by filling in the horizontal and vertical space between the two.
     * @name union
     * @param {Rectangle} rect
     * @return {Rectangle}
     * @throws {TypeError}
     */
    'union': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        type_check(rect,'Rectangle', {label:'Rectangle.union', params:'rectangle', id:this.id});
        /*END_DEBUG*/
        var r = Rectangle(0, 0, 0, 0);
        r.left = min(this.left, rect.x);
        r.top = min(this.top, rect.y);
        r.right = max(this.right, rect.x + rect.width);
        r.bottom = max(this.bottom, rect.y + rect.height);
        return r;
      }
    },

    /**
     * Same as union, but modifies this rectangle in place.
     * @name __union
     * @param {Rectangle} rect
     * @return {Rectangle}
     * @throws {TypeError}
     * @private
     */
    '__union': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        type_check(rect,'Rectangle', {label:'Rectangle.__union', params:'rectangle', id:this.id});
        /*END_DEBUG*/
        //a bit tricky, if applied directly it doesn't work
        var l = min(this.left, rect.x),
            t = min(this.top, rect.y),
            r = max(this.right, rect.x + rect.width),
            b = max(this.bottom, rect.y + rect.height);
        this.left = l;
        this.top = t;
        this.right = r;
        this.bottom = b;
        return this;
      }
    }
    
  };//end rect_static_properties definition
  
}());//end class closure

/*
 * CLASS FUNCTIONS
 */

/**
 * Check if a given object contains a numeric rectangle properties including
 * x, y, width, height, top, bottom, right, left.
 * Does not check if a rectangle is actually a doodle.geom.rectangle.
 * @name isRect
 * @param {Rectangle} rect Object with numeric rectangle parameters.
 * @return {boolean}
 * @static
 */
doodle.geom.Rectangle.isRectangle = function (rect) {
  return (typeof rect === 'object' && typeof rect.x === "number" && typeof rect.y === "number" && typeof rect.width === "number" && typeof rect.height === "number");
};
/*globals doodle*/
(function () {
  var evtDisp_static_properties,
      dispatcher_queue,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      //lookup help
      CAPTURING_PHASE = doodle.events.Event.CAPTURING_PHASE,
      AT_TARGET = doodle.events.Event.AT_TARGET,
      BUBBLING_PHASE = doodle.events.Event.BUBBLING_PHASE,
      //lookup help
      Array_indexOf = Array.prototype.indexOf,
      Array_splice = Array.prototype.splice;
  
  /**
   * @name doodle.EventDispatcher
   * @class
   * @augments Object
   * @return {doodle.EventDispatcher}  
   */
  doodle.EventDispatcher = function () {
    /** @type {doodle.EventDispatcher} */
    var evt_disp = {};

    /*DEBUG*/
    if (typeof arguments[0] !== 'function') {
      if (arguments.length > 0) {
        throw new SyntaxError("[object EventDispatcher]: Invalid number of parameters.");
      }
    }
    /*END_DEBUG*/

    Object.defineProperties(evt_disp, evtDisp_static_properties);
    //properties that require privacy
    Object.defineProperties(evt_disp, {
      'id': (function () {
        var id = null;
        return {
          enumerable: true,
          configurable: false,
          get: function () { return (id === null) ? this.toString() : id; },
          set: function (idVar) {
            /*DEBUG*/
            idVar === null || type_check(idVar,'string', {label:'EventDispatcher.id', message:"Property must be a string or null.", id:this.id});
            /*END_DEBUG*/
            id = idVar;
          }
        };
      }()),
      
      'eventListeners': (function () {
        var event_listeners = {};
        return {
          enumerable: true,
          configurable: false,
          get: function () { return event_listeners; }
        };
      }())
    });//end defineProperties

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      arguments[0].call(evt_disp);
    }
    
    return evt_disp;
  };

  
  evtDisp_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object EventDispatcher]"; }
    },

    /**
     * Registers an event listener object with an EventDispatcher object
     * so that the listener receives notification of an event.
     * @name addEventListener
     * @param {string} type
     * @param {Function} listener
     * @param {boolean} useCapture
     * @throws {TypeError}
     */
    'addEventListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, listener, useCapture) {
        useCapture = (useCapture === undefined) ? false : useCapture;
        /*DEBUG*/
        type_check(type,'string', listener,'function', useCapture,'boolean', {label:'EventDispatcher.addEventListener', params:['type','listener','useCapture'], id:this.id});
        /*END_DEBUG*/
        var eventListeners = this.eventListeners;
        
        //if new event type, create it's array to store callbacks
        if (!eventListeners.hasOwnProperty(type)) {
          eventListeners[type] = {capture:[], bubble:[]};
        }
        eventListeners[type][useCapture ? 'capture' : 'bubble'].push(listener);
        
        //object ready for events, add to receivers if not already there
        if (dispatcher_queue.indexOf(this) === -1) {
          dispatcher_queue.push(this);
        }
      }
    },

    /**
     * Removes a listener from the EventDispatcher object.
     * @name removeEventListener
     * @param {string} type
     * @param {Function} listener
     * @param {boolean} useCapture
     * @throws {TypeError}
     */
    'removeEventListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type, listener, useCapture) {
        useCapture = (useCapture === undefined) ? false : useCapture;
        /*DEBUG*/
        type_check(type,'string', listener,'function', useCapture,'boolean', {label:'EventDispatcher.removeEventListener', params:['type','listener','useCapture'], id:this.id});
        /*END_DEBUG*/
        var eventListeners = this.eventListeners,
            handler = eventListeners.hasOwnProperty(type) ? eventListeners[type] : false,
            listeners,
            //lookup help
            disp_queue,
            indexOf = Array_indexOf,
            splice = Array_splice;
        
        //make sure event type exists
        if (handler) {
          listeners = handler[useCapture ? 'capture' : 'bubble'];
          //remove handler function
          splice.call(listeners, indexOf.call(listeners, listener), 1);
          //if none left, remove handler type
          if (handler.capture.length === 0 && handler.bubble.length === 0) {
            delete eventListeners[type];
          }
          //if no more listeners, remove from object queue
          if (Object.keys(eventListeners).length === 0) {
            disp_queue = dispatcher_queue;
            splice.call(disp_queue, indexOf.call(disp_queue, this), 1);
          }
        }
      }
    },

    /**
     * Lookup and call listener if registered for specific event type.
     * @name handleEvent
     * @param {doodle.events.Event} event
     * @return {boolean} true if node has listeners of event type.
     * @throws {TypeError}
     */
    'handleEvent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        /*DEBUG*/
        type_check(event, 'Event', {label:'EventDispatcher.handleEvent', params:'event', inherits:true, id:this.id});
        /*END_DEBUG*/
        
        //check for listeners that match event type
        //if capture not set, using bubble listeners - like for AT_TARGET phase
        var phase = (event.eventPhase === CAPTURING_PHASE) ? 'capture' : 'bubble',
            listeners = this.eventListeners[event.type], //obj
            count = 0, //listener count
            rv,  //return value of handler
            i; //counter

        listeners = listeners && listeners[phase];
        if (listeners && listeners.length > 0) {
          //currentTarget is the object with addEventListener
          event.__setCurrentTarget(this);
          
          //if we have any, call each handler with event object
          count = listeners.length;
          for (i = 0; i < count; i += 1) {
            /*DEBUG*/
            console.assert(typeof listeners[i] === 'function', "listener is a function", listeners[i]);
            /*END_DEBUG*/
            //pass event to handler
            rv = listeners[i].call(this, event);
            
            //when event.stopPropagation is called
            //cancel event for other nodes, but check other handlers on this one
            //returning false from handler does the same thing
            if (rv === false || event.returnValue === false) {
              //set event stopped if not already
              if (!event.__cancel) {
                event.stopPropagation();
              }
            }
            //when event.stopImmediatePropagation is called
            //ignore other handlers on this target
            if (event.__cancelNow) {
              break;
            }
          }
        }
        
        //any handlers found on this node?
        return (count > 0) ? true : false;
      }
    },
    
    /**
     * Dispatches an event into the event flow. The event target is the
     * EventDispatcher object upon which the dispatchEvent() method is called.
     * @name dispatchEvent
     * @param {doodle.events.Event} event
     * @return {boolean} true if the event was successfully dispatched.
     * @throws {TypeError}
     */
    'dispatchEvent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        //events are dispatched from the child,
        //capturing goes down to the child, bubbling then goes back up
        var target,
            evt_type = event.type,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            //check this node for event handler
            evt_handler_p = hasOwnProperty.call(this.eventListeners, evt_type),
            node,
            node_path = [],
            len, //count of nodes up to root
            i; //counter

        /*DEBUG*/
        type_check(event, 'Event', {label:'EventDispatcher.dispatchEvent', params:'event', inherits:true, id:this.id});
        /*END_DEBUG*/

        //can't dispatch an event that's already stopped
        if (event.__cancel) {
          return false;
        }
        
        //set target to the object that dispatched it
        //if already set, then we're re-dispatching an event for another target
        if (!event.target) {
          event.__setTarget(this);
        }

        target = event.target;
        //path starts at node parent
        node = target.parent || null;
        
        //create path from node's parent to top of tree
        while (node) {
          //only want to dispatch if there's a reason to
          if (!evt_handler_p) {
            evt_handler_p = hasOwnProperty.call(node.eventListeners, evt_type);
          }
          node_path.push(node);
          node = node.parent;
        }

        //if no handlers for event type, no need to dispatch
        if (!evt_handler_p) {
          return true;
        }

        //enter capture phase: down the tree
        event.__setEventPhase(CAPTURING_PHASE);
        i = len = node_path.length;
        while (i--) {
          node_path[i].handleEvent(event);
          //was the event stopped inside the handler?
          if (event.__cancel) {
            return true;
          }
        }

        //enter target phase
        event.__setEventPhase(AT_TARGET);
        target.handleEvent(event);
        //was the event stopped inside the handler?
        if (event.__cancel) {
          return true;
        }

        //does event bubble, or bubbling cancelled in capture/target phase?
        if (!event.bubbles || event.cancelBubble) {
          return true;
        }

        //enter bubble phase: back up the tree
        event.__setEventPhase(BUBBLING_PHASE);
        for (i = 0; i < len; i = i+1) {
          node_path[i].handleEvent(event);
          //was the event stopped inside the handler?
          if (event.__cancel || event.cancelBubble) {
            return true;
          }
        }

        return true; //dispatched successfully
      }
    },

    /**
     * Dispatches an event to every object with an active listener.
     * Ignores propagation path, objects come from
     * @name broadcastEvent
     * @param {doodle.events.Event} event
     * @return {boolean} True if the event was successfully dispatched.
     * @throws {TypeError}
     * @throws {Error}
     */
    'broadcastEvent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (event) {
        var evt_type = event.type,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            disp_queue = dispatcher_queue,
            dq_count = disp_queue.length;
        
        /*DEBUG*/
        type_check(event, 'Event', {label:'EventDispatcher.broadcastEvent', params:'event', inherits:true, id:this.id});
        /*END_DEBUG*/

        if (event.__cancel) {
          throw new Error(this+'.broadcastEvent: Can not dispatch a cancelled event.');
        }
        
        //set target to the object that dispatched it
        //if already set, then we're re-dispatching an event for another target
        if (!event.target) {
          event.__setTarget(this);
        }

        while (dq_count--) {
          //hasEventListener
          if (hasOwnProperty.call(disp_queue[dq_count].eventListeners, evt_type)) {
            disp_queue[dq_count].handleEvent(event);
          }
          //event cancelled in listener?
          if (event.__cancel) {
            break;
          }
        }
        
        return true;
      }
    },

    /**
     * Checks whether the EventDispatcher object has any listeners
     * registered for a specific type of event.
     * @name hasEventListener
     * @param {string} type
     * @return {boolean}
     * @throws {TypeError}
     */
    'hasEventListener': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type) {
        /*DEBUG*/
        type_check(type,'string', {label:'EventDispatcher.hasEventListener', params:'type', id:this.id});
        /*END_DEBUG*/
        return this.eventListeners.hasOwnProperty(type);
      }
    },

    /**
     * Checks whether an event listener is registered with this EventDispatcher object
     * or any of its ancestors for the specified event type.
     * The difference between the hasEventListener() and the willTrigger() methods is
     * that hasEventListener() examines only the object to which it belongs,
     * whereas the willTrigger() method examines the entire event flow for the
     * event specified by the type parameter.
     * @name willTrigger
     * @param {string} type The type of event.
     * @return {boolean}
     * @throws {TypeError}
     */
    'willTrigger': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (type) {
        /*DEBUG*/
        type_check(type,'string', {label:'EventDispatcher.willTrigger', params:'type', id:this.id});
        /*END_DEBUG*/
        if (this.eventListeners.hasOwnProperty(type)) {
          //hasEventListener
          return true;
        }
        var children = this.children,
            child_count = children ? children.length : 0;

        while (child_count--) {
          if (children[child_count].willTrigger(type)) {
            return true;
          }
        }
        return false;
      }
    }
    
  };//end evtDisp_static_properties definition

  
  /*
   * CLASS PROPERTIES
   */
  
  //holds all objects with event listeners
  dispatcher_queue = doodle.EventDispatcher.dispatcher_queue = [];
  
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is an event dispatcher.
 * @name isEventDispatcher
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.EventDispatcher.isEventDispatcher = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toString() === '[object EventDispatcher]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
/*jslint nomen: false, plusplus: false*/
/*globals doodle*/

(function () {
  var node_count = 0,
      node_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      reference_check = doodle.utils.debug.reference_check,
      /*END_DEBUG*/
      //recycled events
      evt_addedEvent = doodle.events.Event(doodle.events.Event.ADDED, true),
      evt_removedEvent = doodle.events.Event(doodle.events.Event.REMOVED, true),
      //lookup help
      doodle_Point = doodle.geom.Point,
      doodle_Matrix = doodle.geom.Matrix,
      doodle_Rectangle = doodle.geom.Rectangle,
      create_scene_path = doodle.utils.create_scene_path,
      PI = Math.PI;
  
  /**
   * @name doodle.Node
   * @class
   * @augments doodle.EventDispatcher
   * @param {string=} id|initializer
   * @return {doodle.Node}
   */
  doodle.Node = function (id) {
    var node = Object.create(doodle.EventDispatcher());
    
    /*DEBUG*/
    if (arguments.length > 1) {
      throw new SyntaxError("[object Node](id): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(node, node_static_properties);
    //properties that require privacy
    Object.defineProperties(node, {
      
      /*DEBUG*/
      'debug': {
        //Debugging oprions
        enumerable: true,
        configurable: false,
        value: Object.create(null, {
          /**
           * @name debug.boundingBox
           * @return {boolean}
           * @property
           */
          'boundingBox': (function () {
            var show_bounds = false;
            return {
              enumerable: true,
              configurable: false,
              get: function () {
                return show_bounds;
              },
              set: function (showBoundingBox) {
                show_bounds = showBoundingBox === true;
              }
            };
          }())
        })
      },
      /*END_DEBUG*/

      /**
       * @name id
       * @return {string}
       * @property
       */
      'id': (function () {
        var node_id = (typeof id === 'string') ? id : "node"+ String('000'+node_count).slice(-3);
        node_count += 1;
        return {
          enumerable: true,
          configurable: true,
          get: function () { return node_id; },
          set: function (idArg) {
            /*DEBUG*/
            type_check(idArg, 'string', {label:'Node.id', id:this.id});
            /*END_DEBUG*/
            node_id = idArg;
          }
        };
      }()),

      /**
       * @name root
       * @return {Display}
       * @property
       */
      'root': (function () {
        var root = null;
        return {
          enumerable: true,
          configurable: true,
          get: function () { return root; },
          set: function (node) {
            /*DEBUG*/
            node === null || type_check(node, 'Display', {label:'Node.root', id:this.id, inherits:true});
            /*END_DEBUG*/
            root = node;
          }
        };
      }()),

      /**
       * @name parent
       * @return {Node}
       * @property
       */
      'parent': (function () {
        var parent = null;
        return {
          enumerable: true,
          configurable: true,
          get: function () { return parent; },
          set: function (node) {
            /*DEBUG*/
            node === null || type_check(node, 'Node', {label:'Node.parent', id:this.id, inherits:true});
            /*END_DEBUG*/
            parent = node;
          }
        };
      }()),

      /**
       * @name children
       * @return {Array}
       * @property
       */
      'children': (function () {
        var children = [];
        return {
          enumerable: true,
          configurable: false,
          get: function () { return children; }
        };
      }()),

      /**
       * @name transform
       * @return {Matrix}
       * @property
       */
      'transform': (function () {
        var transform = doodle_Matrix(1, 0, 0, 1, 0, 0);
        return {
          enumerable: true,
          configurable: false,
          get: function () { return transform; },
          set: function (matrix) {
            /*DEBUG*/
            type_check(matrix, 'Matrix', {label:'Node.transform', id:this.id});
            /*END_DEBUG*/
            transform = matrix;
          }
        };
      }()),

      /**
       * @name visible
       * @return {boolean}
       * @property
       */
      'visible': (function () {
        var visible = true;
        return {
          enumerable: true,
          configurable: true,
          get: function () { return visible; },
          set: function (isVisible) {
            /*DEBUG*/
            type_check(isVisible, 'boolean', {label:'Node.visible', id:this.id});
            /*END_DEBUG*/
            visible = isVisible;
          }
        };
      }()),

      /**
       * @name alpha
       * @return {number}
       * @property
       */
      'alpha': (function () {
        var alpha = 1; //alpha is between 0 and 1
        return {
          enumerable: true,
          configurable: true,
          get: function () { return alpha; },
          set: function (alphaArg) {
            /*DEBUG*/
            type_check(alphaArg, 'number', {label:'Node.alpha', id:this.id});
            range_check(isFinite(alphaArg), {label:'Node.alpha', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            alpha = (alphaArg > 1) ? 1 : ((alphaArg < 0) ? 0 : alphaArg);
          }
        };
      }()),

      /**
       * The bounding box of a Node is a union of all it's child Sprite's bounds.
       * @name getBounds
       * @param {Node} targetCoordSpace
       * @return {Rectangle|null}
       */
      'getBounds': {
        enumerable: true,
        writable: true,
        configurable: false,
        value: function (targetCoordSpace) {
          /*DEBUG*/
          type_check(targetCoordSpace, 'Node', {label:'Node.getBounds', params:'targetCoordSpace', id:this.id, inherits:true});
          /*END_DEBUG*/
          return this.__getBounds(targetCoordSpace).clone();
        }
      },

      /* Same as getBounds, but reuses an internal rectangle.
       * Since it's passed by reference, you don't want to modify it, but
       * it's more efficient for checking bounds.
       * @name __getBounds
       * @private
       */
      '__getBounds': {
        enumerable: false,
        writable: true,
        configurable: false,
        value: (function () {
          var rect = doodle_Rectangle(0, 0, 0, 0); //recycle
          return function (targetCoordSpace) {
            /*DEBUG*/
            type_check(targetCoordSpace, 'Node', {label:'Node.__getBounds', params:'targetCoordSpace', id:this.id, inherits:true});
            /*END_DEBUG*/
            var bounding_box = null,
                child_bounds,
                children = this.children,
                len = children.length;
          
            while (len--) {
              child_bounds = children[len].__getBounds(targetCoordSpace);
              
              if (child_bounds === null) {
                continue;
              }
              if (bounding_box === null) {
                bounding_box = rect.__compose(child_bounds);
              } else {
                bounding_box.__union(child_bounds);
              }
            }
            return bounding_box;
          };
        }())
      }
    });//end defineProperties

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      arguments[0].call(node);
      id = undefined;
    }

    return node;
  };


  node_static_properties = {

    /**
     * @name x
     * @return {number}
     * @property
     */
    'x': {
      enumerable: true,
      configurable: false,
      get: function () { return this.transform.tx; },
      set: function (n) {
        /*DEBUG*/
        type_check(n, 'number', {label:'Node.x', id:this.id});
        range_check(isFinite(n), {label:'Node.x', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.transform.tx = n;
      }
    },

    /**
     * @name y
     * @return {number}
     * @property
     */
    'y': {
      enumerable: true,
      configurable: false,
      get: function () { return this.transform.ty; },
      set: function (n) {
        /*DEBUG*/
        type_check(n, 'number', {label:'Node.y', id:this.id});
        range_check(isFinite(n), {label:'Node.y', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.transform.ty = n;
      }
    },

    /*
    //registration point
    'axis': {
      value: {x: this.x, y: this.y}
    },

    'rotate': { //around external point?
      value: function (deg) {
      
        check_number_type(deg, this+'.rotate', '*degrees*');

        if (this.axis.x !== undefined && this.axis.y !== undefined) {
          this.transform.rotateAroundInternalPoint(this.axis, deg*to_radians);
        } else {
          this.transform.rotate(deg * to_radians);
        }
      }
    },
    */

    /**
     * @name rotate
     * @param {number} deg
     * @return {number}
     */
    'rotate': {
      enumerable: true,
      configurable: false,
      value: function (deg) {
        /*DEBUG*/
        type_check(deg, 'number', {label:'Node.rotate', id:this.id, params:'degrees', message:"Parameter must be a number in degrees."});
        range_check(isFinite(deg), {label:'Node.rotate', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.transform.rotate(deg * PI / 180);
      }
    },

    /**
     * @name rotation
     * @return {number}
     * @property
     */
    'rotation': {
      enumerable: true,
      configurable: true,
      get: function () { return this.transform.rotation * 180 / PI; },
      set: function (deg) {
        /*DEBUG*/
        type_check(deg, 'number', {label:'Node.rotation', id:this.id, message:"Parameter must be a number in degrees."});
        range_check(isFinite(deg), {label:'Node.rotation', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.transform.rotation = deg * PI / 180;
      }
    },

    /**
     * @name scaleX
     * @param {number} sx
     * @return {number}
     */
    'scaleX': {
      enumerable: true,
      configurable: false,
      get: function () { return this.transform.a; },
      set: function (sx) {
        /*DEBUG*/
        type_check(sx, 'number', {label:'Node.scaleX', id:this.id});
        range_check(isFinite(sx), {label:'Node.scaleX', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.transform.a = sx;
      }
    },

    /**
     * @name scaleY
     * @param {number} sy
     * @return {number}
     */
    'scaleY': {
      enumerable: true,
      configurable: false,
      get: function () { return this.transform.d; },
      set: function (sy) {
        /*DEBUG*/
        type_check(sy, 'number', {label:'Node.scaleY', id:this.id});
        range_check(isFinite(sy), {label:'Node.scaleY', id:this.id, message:"Parameter must be a finite number."});
        /*END_DEBUG*/
        this.transform.d = sy;
      }
    },

    /**
     * drawing context to use
     * @name context
     * @return {CanvasRenderingContext2D}
     * @property
     */
    'context': {
      enumerable: true,
      configurable: true,
      get: function () {
        //will keep checking parent for context till found or null
        var node = this.parent;
        while (node) {
          if (node.context) {
            /*DEBUG*/
            type_check(node.context, 'context', {label:'Node.context', id:this.id});
            /*END_DEBUG*/
            return node.context;
          }
          node = node.parent;
        }
        return null;
      }
    },

    /*
     * @name __allTransforms
     * @private
     */
    '__allTransforms': {
      enumerable: false,
      configurable: false,
      get: (function () {
        var transform = doodle_Matrix(1, 0, 0, 1, 0, 0);
        return function () {
          var $transform = transform,
              node = this.parent;
          $transform.compose.apply($transform, this.transform.__toArray());
          
          while (node) {
            $transform.multiply(node.transform);
            node = node.parent;
          }
          return $transform;
        };
      }())
    },

    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object Node]"; }
    },

    /**
     * @name addChildAt
     * @param {Node} node
     * @param {number} index
     * @return {Node}
     * @throws {TypeError}
     */
    'addChildAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node, index) {
        var children = this.children,
            display = this.root,
            node_parent = node.parent,
            i;
        /*DEBUG*/
        type_check(node, 'Node', index, 'number', {label:'Node.addChildAt', params:['node', 'index'], inherits:true, id:this.id});
        range_check(index >= -children.length, index <= children.length, {label:'Node.addChildAt', params:['node', '*index*'], id:this.id, message:"Index out of range."});
        /*END_DEBUG*/
        
        //if already a child then ignore
        if (children.indexOf(node) !== -1) {
          return false;
        }
        //if it had another parent, remove from their children
        if (node_parent !== null && node_parent !== this) {
          node.parent.removeChild(node);
        }
        node.parent = this;
        //add child
        children.splice(index, 0, node);

        //are we on the display path and node not previously on path
        if (display && node.root !== display) {
          //resort scene graph
          display.__sortAllChildren();
          children = create_scene_path(node, []);
          i = children.length;
          while (i--) {
            node = children[i];
            //set new root for all descendants
            node.root = display;
            //fire Event.ADDED if now on display list
            node.dispatchEvent(evt_addedEvent.__setTarget(null));
          }
        }
        return node;
      }
    },

    /**
     * @name addChild
     * @param {Node} node
     * @return {Node}
     * @throws {TypeError}
     */
    'addChild': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        type_check(node,'Node', {label:'Node.addChild', id:this.id, params:'node', inherits:true});
        /*END_DEBUG*/
        //add to end of children array
        return this.addChildAt(node, this.children.length);
      }
    },

    /**
     * @name removeChildAt
     * @param {number} index
     * @return {Node} Removed child node.
     * @throws {TypeError}
     * @throws {RangeError}
     */
    'removeChildAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index) {
        /*DEBUG*/
        type_check(index,'number', {label:'Node.removeChildAt', id:this.id, params:'index'});
        range_check(index >= -this.children.length, index < this.children.length, {label:'Node.removeChildAt', params:'*index*', id:this.id, message:"Index out of range."});
        /*END_DEBUG*/
        var child = this.children.splice(index, 1)[0],    //unadopt
            child_descendants = create_scene_path(child), //includes child
            i = child_descendants.length,
            j = i;
        //event dispatching depends on an intact scene graph
        if (this.root) {
          while (i--) {
            child_descendants[i].dispatchEvent(evt_removedEvent.__setTarget(null));
          }
          while (j--) {
            child_descendants[j].root = null;
          }
        }
        //reset child and descendants
        child.parent = null;
        //reorder this display's scene path
        if (this.root) {
          this.root.__sortAllChildren();
        }
        return child;
      }
    },

    /**
     * @name removeChild
     * @param {Node} node
     * @return {Node} Removed child node.
     * @throws {TypeError}
     * @throws {ReferenceError}
     */
    'removeChild': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        type_check(node,'Node', {label:'Node.removeChild', id:this.id, params:'node', inherits:true});
        reference_check(node.parent === this, {label:'Node.removeChild', params:'*node*', id:this.id, message:"Can not remove a Node that is not a child."});
				console.assert(this.children.indexOf(node) !== -1, "Node found in children", node);
        /*END_DEBUG*/
        return this.removeChildAt(this.children.indexOf(node));
      }
    },

    /**
     * @name removeChildById
     * @param {string} id
     * @return {Node} Removed child node.
     * @throws {TypeError}
     */
    'removeChildById': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (id) {
        /*DEBUG*/
        type_check(id, 'string', {label:'Node.removeChildById', id:this.id, params:'id'});
        /*END_DEBUG*/
        return this.removeChild(this.getChildById(id));
      }
    },

    /**
     * @name removeAllChildren
     * @throws {TypeError}
     */
    'removeAllChildren': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        var children = this.children,
            display = this.root,
            child_descendants = create_scene_path(this, []),
            n = children.length,
            i, j;
        /*DEBUG*/
        console.assert(child_descendants[child_descendants.length-1] === this, "Last item in array is this Node.");
        /*END_DEBUG*/
        child_descendants.pop(); //remove this node
        i = j = child_descendants.length;
        
        //event dispatching depends on an intact scene graph
        if (display) {
          while (i--) {
            child_descendants[i].dispatchEvent(evt_removedEvent.__setTarget(null));
          }
        }
        //reset root of all descendants
        while (j--) {
          child_descendants[j].root = null;
        }
        //reset parent of children
        while (n--) {
          children[n].parent = null;
        }
        //un-adopt children
        children.length = 0;
        //reorder this display's scene path
        if (display) {
          display.__sortAllChildren();
        }
      }
    },

    /**
     * @name getChildById
     * @param {string} id
     * @return {Node|undefined}
     * @throws {TypeError}
     */
    'getChildById': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (id) {
        /*DEBUG*/
        type_check(id, 'string', {label:'Node.getChildById', params:'id', id:this.id});
        /*END_DEBUG*/
        var children = this.children,
            len = children.length,
            i = 0;
        for (; i < len; i++) {
          if (children[i].id === id) {
            return children[i];
          }
        }
        return undefined;
      }
    },

    /**
     * Changes the position of an existing child in the node's children array.
     * This affects the layering of child objects.
     * @name setChildIndex
     * @param {Node} child
     * @param {number} index
     * @throws {TypeError}
     */
    'setChildIndex': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (child, index) {
        var children = this.children,
            len = children.length,
            pos = children.indexOf(child);
        /*DEBUG*/
        type_check(child,'Node', index,'number', {label:'Node.setChildIndex', params:['child', 'index'], id:this.id, inherits:true});
        range_check(index >= -children.length, index < children.length, {label:'Node.setChildIndex', params:['child', '*index*'], id:this.id, message:"Index out of range."});
        reference_check(child.parent === this, {label:'Node.setChildIndex', params:['*child*','index'], id:this.id, message:"Can not set the index of a Node that is not a child."});
        console.assert(pos !== -1, "Found child node, should be able to detect range with index.", this);
        /*END_DEBUG*/
        children.splice(pos, 1);          //remove child
        children.splice(index, 0, child); //place child at new position
        if (this.root) {
          //reorder this display's scene path
          this.root.__sortAllChildren();
        }
        /*DEBUG*/
        console.assert(len === children.length, "Children array length is still the same.");
        /*END_DEBUG*/
      }
    },

    /**
     * Swaps the child nodes at the two specified index positions in the child list.
     * @name swapChildrenAt
     * @param {number} index1
     * @param {number} index2
     * @throws {TypeError}
     * @throws {RangeError}
     */
    'swapChildrenAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index1, index2) {
        var children = this.children,
            temp_node;
        /*DEBUG*/
        var test_len = children.length;
        type_check(index1,'number', index2,'number', {label:'Node.swapChildrenAt', params:['index1', 'index2'], id:this.id});
        range_check(index1 >= -test_len, index1 < test_len, {label:'Node.setChildIndex', params:['*index1*', 'index2'], id:this.id, message:"Index out of range."});
        range_check(index2 >= -test_len, index2 < test_len, {label:'Node.setChildIndex', params:['index1', '*index2*'], id:this.id, message:"Index out of range."});
        //asserts
        console.assert(doodle.Node.isNode(children[index1]), "Child is a Node.", children[index1]);
        console.assert(doodle.Node.isNode(children[index2]), "Child is a Node.", children[index2]);
        console.assert(children[index1].parent === this, "Child's parent is this Node.", children[index1]);
        console.assert(children[index2].parent === this, "Child's parent is this Node.", children[index2]);
        /*END_DEBUG*/
        
        //need to get a little fancy so we can refer to negative indexes
        temp_node = children.splice(index1, 1, undefined)[0];
        children.splice(index1, 1, children.splice(index2, 1, undefined)[0]);
        children[children.indexOf(undefined)] = temp_node;
        
        if (this.root) {
          //reorder this display's scene path
          this.root.__sortAllChildren();
        }
        /*DEBUG*/
        console.assert(test_len === children.length, "Children array length is still the same.");
        /*END_DEBUG*/
      }
    },

    /**
     * @name swapChildren
     * @param {Node} node1
     * @param {Node} node2
     * @throws {TypeError}
     */
    'swapChildren': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node1, node2) {
        var children = this.children;
        /*DEBUG*/
        var test_len = children.length;
        type_check(node1, 'Node', node2, 'Node', {label:'Node.swapChildren', id:this.id, params:['node1', 'node2'], inherits:true});
        reference_check(node1.parent === this, node2.parent === this, {label:'Node.swapChildren', params:['child1','child2'], id:this.id, message:"Can not swap a Node that is not a child."});
        /*END_DEBUG*/

        this.swapChildrenAt(children.indexOf(node1), children.indexOf(node2));
        
        /*DEBUG*/
        console.assert(test_len === children.length, "Children array length is still the same.");
        /*END_DEBUG*/
      }
    },

    /**
     * Swap positions with another node in the parents child list.
     * @name swapDepths
     * @param {Node} node
     * @throws {TypeError}
     * @throws {ReferenceError}
     */
    'swapDepths': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function I(node) {
        var parent = this.parent,
            children;
        
        /*DEBUG*/
        type_check(node, 'Node', {label:'Node.swapDepths', params:'node', id:this.id, inherits:true});
        reference_check(parent !== null, node.parent === parent, {label:'Node.swapDepths', params:'*node*', id:this.id, message:"Can not swap positions with a Node that has a different parent."});
        //asserts
        console.assert(doodle.Node.isNode(parent), "parent is a Node", parent);
        var test_len = parent.children.length;
        /*END_DEBUG*/
        
        children = parent.children;
        parent.swapChildrenAt(children.indexOf(this), children.indexOf(node));
        
        /*DEBUG*/
        console.assert(test_len === children.length, "Children array length is still the same.");
        /*END_DEBUG*/
      }
    },

    /**
     * Swap positions with another node at a given index in the parents child list.
     * @name swapDepthAt
     * @param {number} index
     * @throws {TypeError}
     * @throws {RangeError}
     */
    'swapDepthAt': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (index) {
        var parent = this.parent;
        /*DEBUG*/
        type_check(index, 'number', {label:'Node.swapDepthAt', params:'index', id:this.id});
        reference_check(parent !== null, {label:'Node.swapDepthAt', params:'*index*', id:this.id, message:"Node does not have a parent."});
        
        console.assert(doodle.Node.isNode(parent), "Node has parent Node.");
        var test_len = parent.children.length;
        range_check(index >= -test_len, index1 < test_len, {label:'Node.swapDepthAt', params:'*index1*', id:this.id, message:"Index out of range."});
        /*END_DEBUG*/

        parent.swapChildrenAt(parent.children.indexOf(this), index);

        /*DEBUG*/
        console.assert(test_len-1 === children.length, "Children array length is one less than before.");
        /*END_DEBUG*/
      }
    },
    
    /**
     * Determine if node is among it's children, grandchildren, etc.
     * @name contains
     * @param {Node} node
     * @return {boolean}
     * @throws {TypeError}
     */
    'contains': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (node) {
        /*DEBUG*/
        type_check(node, 'Node', {label:'Node.contains', params:'node', id:this.id, inherits:true});
        /*END_DEBUG*/
        return (create_scene_path(this, []).indexOf(node) !== -1) ? true : false;
      }
    },

    /**
     * @name localToGlobal
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     */
    'localToGlobal': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Node.localToGlobal', params:'point', id:this.id});
        /*END_DEBUG*/
        var node = this.parent;
        //apply each transformation from this node up to root
        pt = this.transform.transformPoint(pt); //new point
        while (node) {
          /*DEBUG*/
          console.assert(doodle.Node.isNode(node), "node is a Node", node);
          /*END_DEBUG*/
          node.transform.__transformPoint(pt); //modify point
          node = node.parent;
        }
        return pt;
      }
    },

    /**
     * Same as localToGlobal, but modifies a point in place.
     * @name __localToGlobal
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     * @private
     */
    '__localToGlobal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Node.__localToGlobal', params:'point', id:this.id});
        /*END_DEBUG*/
        var node = this;
        //apply each transformation from this node up to root
        while (node) {
          /*DEBUG*/
          console.assert(doodle.Node.isNode(node), "node is a Node", node);
          /*END_DEBUG*/
          node.transform.__transformPoint(pt); //modify point
          node = node.parent;
        }
        return pt;
      }
    },

    /**
     * @name globalToLocal
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     */
    'globalToLocal': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Node.globalToLocal', id:this.id, params:'point'});
        /*END_DEBUG*/
        var global_pt = {x:0, y:0};
        this.__localToGlobal(global_pt);
        return doodle_Point(pt.x - global_pt.x, pt.y - global_pt.y);
      }
    },

    /**
     * Same as globalToLocal, but modifies a point in place.
     * @name __globalToLocal
     * @param {Point} pt
     * @return {Point}
     * @throws {TypeError}
     * @private
     */
    '__globalToLocal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        type_check(pt, 'Point', {label:'Node.__globalToLocal', id:this.id, params:'point'});
        /*END_DEBUG*/
        var global_pt = {x:0, y:0}; //use temp point instead?
        this.__localToGlobal(global_pt);
        pt.x = pt.x - global_pt.x;
        pt.y = pt.y - global_pt.y;
        return pt;
      }
    }
  };//end node_static_properties
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object inherits from Node.
 * @name isNode
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.Node.isNode = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toString() === '[object Node]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
/*globals doodle*/
(function () {
  var sprite_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      /*END_DEBUG*/
      doodle_Rectangle = doodle.geom.Rectangle;

  /**
   * An node to display.
   * @name doodle.Sprite
   * @class
   * @augments doodle.Node
   * @param {string=} id Name or initialization function.
   * @return {doodle.Sprite} A sprite object.
   * @throws {SyntaxError} Invalid parameters.
   */
  doodle.Sprite = function (id) {
    //only pass id if string, an init function will be called later
    var sprite = Object.create(doodle.Node((typeof id === 'string') ? id : undefined));

    /*DEBUG*/
    if (arguments.length > 1) {
      throw new SyntaxError("[object Sprite](id): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(sprite, sprite_static_properties);
    //properties that require privacy
    Object.defineProperties(sprite, (function () {
      var draw_commands = [];
      
      return {
        /**
         * The graphics object contains drawing operations to be stored in draw_commands.
         * Objects and Arrays are passed by reference, so these will be modified
         * @name graphics
         * @return {Graphics}
         * @property
         */
        'graphics': {
          enumerable: false,
          configurable: false,
          value:  Object.create(doodle.Graphics.call(sprite, draw_commands))
        },

        /**
         * Indicates the width of the sprite, in pixels.
         * @name width
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'width': (function () {
          var width = 0;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return width; },
            set: function (n) {
              /*DEBUG*/
              type_check(n, 'number', {label:'Sprite.width', id:this.id});
              range_check(isFinite(n), {label:'Sprite.width', id:this.id, message:"Parameter must be a finite number."});
              /*END_DEBUG*/
              width = n;
            }
          };
        }()),

        /**
         * Indicates the height of the sprite, in pixels.
         * @name height
         * @return {number}
         * @throws {TypeError}
         * @property
         */
        'height': (function () {
          var height = 0;
          return {
            enumerable: true,
            configurable: false,
            get: function () { return height; },
            set: function (n) {
              /*DEBUG*/
              type_check(n, 'number', {label:'Sprite.height', id:this.id});
              range_check(isFinite(n), {label:'Sprite.height', id:this.id, message:"Parameter must be a finite number."});
              /*END_DEBUG*/
              height = n;
            }
          };
        }()),

        /**
         * @name getBounds
         * @param {Node} targetCoordSpace
         * @return {Rectangle}
         * @throws {TypeError}
         * @override
         */
        'getBounds': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (targetCoordSpace) {
            /*DEBUG*/
            type_check(targetCoordSpace, 'Node', {label:'Sprite.getBounds', id:this.id, params:'targetCoordSpace', inherits:true});
            /*END_DEBUG*/
            return this.__getBounds(targetCoordSpace).clone();
          }
        },

        /* Same as getBounds, but reuses an internal rectangle.
         * Since it's passed by reference, you don't want to modify it, but
         * it's more efficient for checking bounds.
         * @name __getBounds
         * @private
         */
        '__getBounds': {
          enumerable: false,
          writable: true,
          configurable: false,
          value: (function () {
            var rect = doodle_Rectangle(0, 0, 0, 0); //recycle
            return function (targetCoordSpace) {
              /*DEBUG*/
              type_check(targetCoordSpace, 'Node', {label:'Sprite.__getBounds', id:this.id, params:'targetCoordSpace', inherits:true});
              /*END_DEBUG*/
              var children = this.children,
                  len = children.length,
                  bounding_box = rect,
                  child_bounds,
                  w = this.width,
                  h = this.height,
                  //extrema points
                  graphics = this.graphics,
                  tl = {x: graphics.__minX, y: graphics.__minY},
                  tr = {x: graphics.__minX+w, y: graphics.__minY},
                  br = {x: graphics.__minX+w, y: graphics.__minY+h},
                  bl = {x: graphics.__minX, y: graphics.__minY+h},
                  min = Math.min,
                  max = Math.max;
              
              //transform corners to global
              this.__localToGlobal(tl); //top left
              this.__localToGlobal(tr); //top right
              this.__localToGlobal(br); //bot right
              this.__localToGlobal(bl); //bot left
              //transform global to target space
              targetCoordSpace.__globalToLocal(tl);
              targetCoordSpace.__globalToLocal(tr);
              targetCoordSpace.__globalToLocal(br);
              targetCoordSpace.__globalToLocal(bl);

              //set rect with extremas
              bounding_box.left = min(tl.x, tr.x, br.x, bl.x);
              bounding_box.right = max(tl.x, tr.x, br.x, bl.x);
              bounding_box.top = min(tl.y, tr.y, br.y, bl.y);
              bounding_box.bottom = max(tl.y, tr.y, br.y, bl.y);

              //add child bounds to this
              while (len--) {
                child_bounds = children[len].__getBounds(targetCoordSpace);
                
                if (child_bounds !== null) {
                  bounding_box.__union(child_bounds);
                }
              }
              return bounding_box;
            };
          }())
        },

        /** not ready
        'hitArea': (function () {
          var hit_area = null;
          return {
            enumerable: true,
            configurable: false,
            get: function () {
              if (hit_area === null) {
                return this.getBounds(this);
              } else {
                return hit_area;
              }
            },
            set: function (rect) {
              //accepts null/false or rectangle area for now
              rect = (rect === false) ? null : rect;
              if (rect !== null) {
                check_rect_type(rect, this+'.hitArea');
              }
              hit_area = rect;
            }
          };
        }()),
        **/

        /**
         * @name hitTestObject
         * @param {Node} node
         * @return {boolean}
         * @throws {TypeError}
         */
        'hitTestObject': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (node) {
            /*DEBUG*/
            type_check(node, 'Node', {label:'Sprite.hitTestObject', id:this.id, params:'node', inherits:true});
            /*END_DEBUG*/
            return this.getBounds(this).intersects(node.getBounds(this));
          }
        },

        /**
         * @name hitTestPoint
         * @param {Point} pt
         * @return {boolean}
         * @throws {TypeError}
         */
        'hitTestPoint': {
          enumerable: true,
          writable: true,
          configurable: false,
          value: function (pt) {
            /*DEBUG*/
            type_check(pt, 'Point', {label:'Sprite.hitTestPoint', id:this.id, params:'point'});
            /*END_DEBUG*/
            return this.getBounds(this).containsPoint(this.globalToLocal(pt));
          }
        },

        /* When called execute all the draw commands in the stack.
         * This draws from screen 0,0 - transforms are applied when the
         * entire scene graph is drawn.
         * @name __draw
         * @param {Context} ctx 2d canvas context to draw on.
         * @private
         */
        '__draw': {
          enumerable: false,
          writable: false,
          configurable: false,
          value: function (ctx) {
            /*DEBUG*/
            type_check(ctx, 'context', {label:'Sprite.__draw', id:this.id, params:'context'});
            /*END_DEBUG*/
            for (var i=0, len=draw_commands.length; i < len; i++) {
              /*DEBUG*/
              console.assert(typeof draw_commands[i] === 'function', "draw command is a function", draw_commands[i]);
              /*END_DEBUG*/
              draw_commands[i].call(sprite, ctx);
            }
          }
        }
      };
    }()));//end defineProperties

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      arguments[0].call(sprite);
    }
    
    return sprite;
  };

  
  sprite_static_properties = {
    /**
     * @name rotation
     * @return {number}
     * @throws {TypeError}
     * @property
     */
    'rotation': (function () {
      var to_degrees = 180 / Math.PI,
          to_radians = Math.PI / 180;
      return {
        enumerable: true,
        configurable: false,
        get: function () { return this.transform.rotation * to_degrees; },
        set: function (deg) {
          /*DEBUG*/
          type_check(deg, 'number', {label:'Sprite.rotation', id:this.id, message:"Property must be a number specified in degrees."});
          range_check(isFinite(deg), {label:'Sprite.rotation', id:this.id, message:"Parameter must be a finite number."});
          /*END_DEBUG*/
          this.transform.rotation = deg * to_radians;
        }
      };
    }()),

    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () { return "[object Sprite]"; }
    },

    /**
     * Updates the position and size of this sprite.
     * @name compose
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @return {Sprite}
     * @throws {TypeError}
     */
    'compose': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (x, y, w, h) {
        /*DEBUG*/
        type_check(x, 'number', y, 'number', w, 'number', h, 'number', {label:'Sprite.compose', id:this.id, params:['x', 'y', 'width', 'height']});
        range_check(isFinite(x), isFinite(y), isFinite(w), isFinite(h), {label:'Sprite.compose', id:this.id, message:"Parameters must all be finite numbers."});
        /*END_DEBUG*/
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        return this;
      }
    }
  };//end sprite_static_properties
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a Sprite or inherits from one.
 * @name isSprite
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.Sprite.isSprite = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toLocaleString() === '[object Sprite]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
/*globals doodle, Image*/
(function () {
  var graphics_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      reference_check = doodle.utils.debug.reference_check,
      /*END_DEBUG*/
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      get_element = doodle.utils.get_element,
      doodle_Event = doodle.events.Event,
      LINEAR = doodle.GradientType.LINEAR,
      RADIAL = doodle.GradientType.RADIAL;
  
  /**
   * @name doodle.Graphics
   * @class
   * @augments Object
   * @param {Array} draw_commands Reference to draw commands array.
   * @return {Object}
   * @this {doodle.Sprite}
   */
  doodle.Graphics = function (draw_commands) {
    var graphics = {},
        gfx_node = this,
        cursor_x = 0,
        cursor_y = 0,
        //line defaults
        line_width = 1,
        line_cap = doodle.LineCap.BUTT,
        line_join = doodle.LineJoin.MITER,
        line_miter = 10;
    
    Object.defineProperties(graphics, graphics_static_properties);
    //properties that require privacy
    Object.defineProperties(graphics, {
      /**
       * @property
       * @private
       */
      '__minX': {
        enumerable: false,
        configurable: false,
        value: 0
      },

      /**
       * @property
       * @private
       */
      '__minY': {
        enumerable: false,
        configurable: false,
        value: 0
      },

      /**
       * @property
       * @private
       */
      '__maxX': {
        enumerable: false,
        configurable: false,
        value: 0
      },

      /**
       * @property
       * @private
       */
      '__maxY': {
        enumerable: false,
        configurable: false,
        value: 0
      },
      
      /**
       * @name lineWidth
       * @return {number} [read-only]
       * @property
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linewidth">context.lineWidth</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineWidth_example">A lineWidth Example</a> [Canvas Tutorial]
       */
      'lineWidth': {
        enumerable: true,
        configurable: false,
        get: function () { return line_width; }
      },

      /**
       * @name lineCap
       * @return {string} [read-only]
       * @property
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linecap">context.lineCap</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineCap_example">A lineCap Example</a> [Canvas Tutorial]
       */
      'lineCap': {
        enumerable: true,
        configurable: false,
        get: function () { return line_cap; }
      },

      /**
       * @name lineJoin
       * @return {string} [read-only]
       * @property
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linejoin">context.lineJoin</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_lineJoin_example">A lineJoin Example</a> [Canvas Tutorial]
       */
      'lineJoin': {
        enumerable: true,
        configurable: false,
        get: function () { return line_join; }
      },

      /**
       * The miter value means that a second filled triangle must (if possible, given
       * the miter length) be rendered at the join, with one line being the line between
       * the two aforementioned corners, abutting the first triangle, and the other two
       * being continuations of the outside edges of the two joining lines, as long as
       * required to intersect without going over the miter length.
       * @name lineMiter
       * @return {number} [read-only]
       * @property
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.miterLimit</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#A_demo_of_the_miterLimit_property">A miterLimit Demo</a> [Canvas Tutorial]
       */
      'lineMiter': {
        enumerable: true,
        configurable: false,
        get: function () { return line_miter; }
      },

      /**
       * Provide direct access to the canvas drawing api.
       * Canvas context is called as the first argument to function.
       * Unable to set bounds from a user supplied function unless explictly set.
       * @name draw
       * @param {Function} fn
       * @example
       *   x = Object.create(doodle.sprite);<br/>
       *   x.graphics.draw(function (ctx) {<br/>
       *   &nbsp; ctx.fillStyle = "#ff0000";<br/>
       *   &nbsp; ctx.fillRect(this.x, this.y, 100, 100);<br/>
       *   });<br/>
       *   x.draw();
       */
      'draw': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (fn) {
          /*DEBUG*/
          type_check(fn,'function', {label:'Graphics.draw', id:gfx_node.id});
          /*END_DEBUG*/
          draw_commands.push(fn);
        }
      },

      /**
       * Remove all drawing commands for sprite.
       * @name clear
       */
      'clear': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.length = 0;
          //reset dimensions
          gfx_node.width = 0;
          gfx_node.height = 0;

          this.__minX = this.__minY = this.__maxX = this.__maxY = 0;
          cursor_x = cursor_y = 0;
        }
      },

      /**
       * @name rect
       * @param {number} x
       * @param {number} y
       * @param {number} width
       * @param {number} height
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-rect">context.rect</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Rectangles">Rectangles</a> [Canvas Tutorial]
       */
      'rect': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height) {
          /*DEBUG*/
          type_check(x,'number', y,'number', width,'number', height,'number', {label:'Graphics.rect', params:['x','y','width','height'], id:gfx_node.id});
          /*END_DEBUG*/

          //update extremas
          this.__minX = Math.min(0, x, this.__minX);
          this.__minY = Math.min(0, y, this.__minY);
          this.__maxX = Math.max(0, x, x+width, this.__maxX);
          this.__maxY = Math.max(0, y, y+height, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;
          
          draw_commands.push(function (ctx) {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.closePath();
            ctx.stroke();
          });
        }
      },

      /**
       * @name circle
       * @param {number} x The x location of the center of the circle relative to the registration point of the parent display object (in pixels).
       * @param {number} y The y location of the center of the circle relative to the registration point of the parent display object (in pixels).
       * @param {number} radius
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Arcs">Arcs</a> [Canvas Tutorial]
       */
      'circle': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, radius) {
          /*DEBUG*/
          type_check(x,'number', y,'number', radius,'number', {label:'Graphics.circle', params:['x','y','radius'], id:gfx_node.id});
          /*END_DEBUG*/

          //update extremas
          this.__minX = Math.min(0, -radius+x, this.__minX);
          this.__minY = Math.min(0, -radius+y, this.__minY);
          this.__maxX = Math.max(0, x, x+radius, this.__maxX);
          this.__maxY = Math.max(0, y, y+radius, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

          draw_commands.push(function (ctx) {
            ctx.beginPath();
            //x, y, radius, start_angle, end_angle (Math.PI*2), anti-clockwise
            ctx.arc(x, y, radius, 0, 6.283185307179586, true);
            ctx.closePath();
            ctx.stroke();
          });
        }
      },

      /**
       * @name ellipse
       * @param {number} x
       * @param {number} y
       * @param {number} width
       * @param {number} height
       */
      'ellipse': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height) {
          height = (height === undefined) ? width : height; //default to circle
          /*DEBUG*/
          type_check(x,'number', y,'number', width,'number', height,'number', {label:'Graphics.ellipse', params:['x','y','width','height'], id:gfx_node.id});
          /*END_DEBUG*/
          var rx = width / 2,
              ry = height / 2,
              krx = 0.5522847498 * rx, //kappa * radius_x
              kry = 0.5522847498 * ry;

          //update extremas
          this.__minX = Math.min(0, -rx+x, this.__minX);
          this.__minY = Math.min(0, -ry+y, this.__minY);
          this.__maxX = Math.max(0, x, x+rx, this.__maxX);
          this.__maxY = Math.max(0, y, y+ry, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

          draw_commands.push(function (ctx) {
            ctx.beginPath();
            ctx.moveTo(x+rx, y);
            //(cp1), (cp2), (pt)
            ctx.bezierCurveTo(x+rx, y-kry, x+krx, y-ry, x, y-ry);
            ctx.bezierCurveTo(x-krx, y-ry, x-rx, y-kry, x-rx, y);
            ctx.bezierCurveTo(x-rx, y+kry, x-krx, y+ry, x, y+ry);
            ctx.bezierCurveTo(x+krx, y+ry, x+rx, y+kry, x+rx, y);
            ctx.closePath();
            ctx.stroke();
          });
        }
      },

      /**
       * @name roundRect
       * @param {number} x
       * @param {number} y
       * @param {number} width
       * @param {number} height
       * @param {number} rx
       * @param {number} ry
       */
      'roundRect': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height, rx, ry) {
          rx = (rx === undefined) ? 0 : rx; //default to rectangle
          ry = (ry === undefined) ? 0 : ry;
          /*DEBUG*/
          type_check(x,'number', y,'number', width,'number', height,'number', rx,'number', ry,'number', {label:'Graphics.roundRect', params:['x','y','width','height','rx','ry'], id:gfx_node.id});
          /*END_DEBUG*/
          var x3 = x + width,
              x2 = x3 - rx,
              x1 = x + rx,
              y3 = y + height,
              y2 = y3 - ry,
              y1 = y + ry;

          //update extremas
          this.__minX = Math.min(0, x, this.__minX);
          this.__minY = Math.min(0, y, this.__minY);
          this.__maxX = Math.max(0, x, x+width, this.__maxX);
          this.__maxY = Math.max(0, y, y+height, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

          draw_commands.push(function (ctx) {
            ctx.beginPath();
            //clockwise
            ctx.moveTo(x1, y);
            ctx.beginPath();
            ctx.lineTo(x2, y);
            ctx.quadraticCurveTo(x3, y, x3, y1);
            ctx.lineTo(x3, y2);
            ctx.quadraticCurveTo(x3, y3, x2, y3);
            ctx.lineTo(x1, y3);
            ctx.quadraticCurveTo(x, y3, x, y2);
            ctx.lineTo(x, y1);
            ctx.quadraticCurveTo(x, y, x1, y);
            ctx.closePath();
            ctx.stroke();
          });
        }
      },

      /**
       * @name moveTo
       * @param {number} x
       * @param {number} y
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-moveto">context.moveTo</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#moveTo">moveTo</a> [Canvas Tutorial]
       */
      'moveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          /*DEBUG*/
          type_check(x,'number', y,'number', {label:'Graphics.moveTo', params:['x','y'], id:gfx_node.id});
          /*END_DEBUG*/
          draw_commands.push(function (ctx) { ctx.moveTo(x, y); });
          //update cursor
          cursor_x = x;
          cursor_y = y;
        }
      },

      /**
       * @name lineTo
       * @param {number} x
       * @param {number} y
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-lineto">context.lineTo</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Lines">Lines</a> [Canvas Tutorial]
       */
      'lineTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          /*DEBUG*/
          type_check(x,'number', y,'number', {label:'Graphics.lineTo', params:['x','y'], id:gfx_node.id});
          /*END_DEBUG*/

          //update extremas
          this.__minX = Math.min(0, x, cursor_x, this.__minX);
          this.__minY = Math.min(0, y, cursor_y, this.__minY);
          this.__maxX = Math.max(0, x, cursor_x, this.__maxX);
          this.__maxY = Math.max(0, y, cursor_y, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = this.__maxX - this.__minX;
          gfx_node.height = this.__maxY - this.__minY;
          
          draw_commands.push(function (ctx) {
            ctx.lineTo(x, y);
          });

          //update cursor
          cursor_x = x;
          cursor_y = y;
        }
      },

      /**
       * Quadratic curve to point.
       * @name curveTo
       * @param {Point} pt1 Control point
       * @param {Point} pt2 End point
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-quadraticCurveTo">context.quadraticCurveTo</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Bezier_and_quadratic_curves">Bezier and Quadratic Curves</a> [Canvas Tutorial]
       */
      'curveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt1, pt2) {
          /*DEBUG*/
          type_check(pt1,'Point', pt2,'Point', {label:'Graphics.curveTo', params:['ctrl_point','point'], id:gfx_node.id});
          /*END_DEBUG*/
          var x0 = cursor_x,
              y0 = cursor_y,
              x1 = pt1.x,
              y1 = pt1.y,
              x2 = pt2.x,
              y2 = pt2.y,
              t,
              cx = 0,
              cy = 0;
          
          //curve ratio of extrema
          t = (x0 - x1) / (x0 - 2 * x1 + x2);
          //if true, store extrema position
          if (0 <= t && t <= 1) {
            cx = (1-t) * (1-t) * x0 + 2 * (1-t) * t * x1 + t * t * x2;
          }
          t = (y0 - y1) / (y0 - 2 * y1 + y2);
          if (0 <= t && t <= 1) {
            cy = (1-t) * (1-t) * y0 + 2 * (1-t) * t * y1 + t * t * y2;
          }
          //update extremas
          this.__minX = Math.min(0, x0, cx, x2, this.__minX);
          this.__minY = Math.min(0, y0, cy, y2, this.__minY);
          this.__maxX = Math.max(0, x0, cx, x2, this.__maxX);
          this.__maxY = Math.max(0, y0, cy, y2, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

          draw_commands.push(function (ctx) {
            ctx.quadraticCurveTo(x1, y1, x2, y2);
          });

          //update cursor
          cursor_x = x2;
          cursor_y = y2;
        }
      },

      /**
       * Bezier curve to point.
       * @name bezierCurveTo
       * @param {Point} pt1 Control point 1
       * @param {Point} pt2 Control point 2
       * @param {Point} pt3 End point
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-bezierCurveTo">context.bezierCurveTo</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Bezier_and_quadratic_curves">Bezier and Quadratic Curves</a> [Canvas Tutorial]
       */
      'bezierCurveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt1, pt2, pt3) {
          /*DEBUG*/
          type_check(pt1,'Point', pt2,'Point', pt3,'Point', {label:'Graphics.bezierCurveTo', params:['ctrl_point1','ctrl_point2','point'], id:gfx_node.id});
          /*END_DEBUG*/
          var pow = Math.pow,
              max = Math.max,
              min = Math.min,
              x0 = cursor_x,
              y0 = cursor_y,
              x1 = pt1.x,
              y1 = pt1.y,
              x2 = pt2.x,
              y2 = pt2.y,
              x3 = pt3.x,
              y3 = pt3.y,
              t,
              xt,
              yt,
              cx_max = 0,
              cx_min = 0,
              cy_max = 0,
              cy_min = 0;

          /* Solve for t on curve at various intervals and keep extremas.
           * Kinda hacky until I can find a real equation.
           * 0 <= t && t <= 1
           */
          for (t = 0.1; t < 1; t += 0.1) {
            xt = pow(1-t,3) * x0 + 3 * pow(1-t,2) * t * x1 +
              3 * pow(1-t,1) * pow(t,2) * x2 + pow(t,3) * x3;
            //extremas
            if (xt > cx_max) { cx_max = xt; }
            if (xt < cx_min) { cx_min = xt; }
            
            yt = pow(1-t,3) * y0 + 3 * pow(1-t,2) * t * y1 +
              3 * pow(1-t,1) * pow(t,2) * y2 + pow(t,3) * y3;
            //extremas
            if (yt > cy_max) { cy_max = yt; }
            if (yt < cy_min) { cy_min = yt; }
          }
          //update extremas
          this.__minX = min(0, x0, cx_min, x3, this.__minX);
          this.__minY = min(0, y0, cy_min, y3, this.__minY);
          this.__maxX = max(0, x0, cx_max, x3, this.__maxX);
          this.__maxY = max(0, y0, cy_max, y3, this.__maxY);
          
          //update size for bounding box
          gfx_node.width = -this.__minX + this.__maxX;
          gfx_node.height = -this.__minY + this.__maxY;

          draw_commands.push(function (ctx) {
            ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
          });
          //update cursor
          cursor_x = x3;
          cursor_y = y3;
        }
      },

      /**
       * Specifies a simple one-color fill that subsequent calls to other
       * graphics methods use when drawing.
       * @name beginFill
       * @param {Color} color In hex format.
       * @param {number} alpha
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Colors">Colors</a> [Canvas Tutorial]
       */
      'beginFill': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (color, alpha) {
          alpha = (alpha === undefined) ? 1 : alpha;
          /*DEBUG*/
          type_check(color,'*', alpha,'number', {label:'Graphics.beginFill', params:['color','alpha'], id:gfx_node.id});
          /*END_DEBUG*/
          draw_commands.push(function (ctx) {
            ctx.fillStyle = hex_to_rgb_str(color, alpha);
          });
        }
      },

      /**
       * @name beginGradientFill
       * @param {GradientType} type
       * @param {Point} pt1
       * @param {Point} pt2
       * @param {Array} ratios Array of numbers.
       * @param {Array} colors
       * @param {Array} alphas
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createlineargradient">context.createLinearGradient</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createradialgradient">context.createRadialGradient</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-canvasgradient-addcolorstop">context.addColorStop</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Gradients">Gradients</a> [Canvas Tutorial]
       */
      'beginGradientFill': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (type, pt1, pt2, ratios, colors, alphas) {
          /*DEBUG*/
          type_check(type,'string', pt1,'Point', pt2,'Point', ratios,'array', colors,'array', alphas,'array',
                     {label:'Graphics.beginGradientFill', params:['gradient_type','point','point','ratios','colors','alphas'], id:gfx_node.id});
          /*END_DEBUG*/
          
          draw_commands.push(function (ctx) {
            var hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
                gradient,
                len = ratios.length,
                i = 0;
            
            if (type === LINEAR) {
              //not really too keen on creating gfx_node here, but I need access to the context
              gradient = ctx.createLinearGradient(pt1.x, pt1.y, pt2.x, pt2.y);
              
            } else if (type === RADIAL) {
              /*DEBUG*/
              type_check(pt1.radius,'number', pt2.radius,'number', {label:'Graphics.beginGradientFill', id:gfx_node.id, message:"No radius for radial type."});
              /*END_DEBUG*/
              gradient = ctx.createRadialGradient(pt1.x, pt1.y, pt1.radius, pt2.x, pt2.y, pt2.radius);
            } else {
              throw new TypeError(gfx_node.id + " Graphics.beginGradientFill(*type*, point1, point2, ratios, colors, alphas): Unknown gradient type.");
            }
            //add color ratios to our gradient
            for (; i < len; i+=1) {
              gradient.addColorStop(ratios[i], hex_to_rgb_str(colors[i], alphas[i]));
            }
            ctx.fillStyle = gradient;
          });
        }
      },

      /**
       * @name beginPatternFill
       * @param {HTMLImageElement} image
       * @param {Pattern} repeat
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-createpattern">context.createPattern</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fillstyle">context.fillStyle</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/En/Canvas_tutorial/Applying_styles_and_colors#Patterns">Patterns</a> [Canvas Tutorial]
       */
      'beginPatternFill': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (image, repeat) {
          var img_loaded = null, //image after loaded
              on_image_error,
              Pattern = doodle.Pattern;
          
          repeat = (repeat === undefined) ? Pattern.REPEAT : repeat;
          /*DEBUG*/
          type_check(image,'*', repeat,'string', {label:'Graphics.beginPatternFill', params:['image','repeat'], id:gfx_node.id});
          reference_check(repeat === Pattern.REPEAT || repeat === Pattern.NO_REPEAT || repeat === Pattern.REPEAT_X || repeat !== Pattern.REPEAT_Y, {label:'Graphics.beginPatternFill', id:gfx_node.id, message:"Invalid Pattern type."});
          /*END_DEBUG*/
          
          if (typeof image === 'string') {
            //element id
            if (image[0] === '#') {
              image = get_element(image);
            } else {
              //url
              (function () {
                var img_url = encodeURI(image);
                image = new Image();
                image.src = img_url;
              }());
            }
          }
          
          /*DEBUG*/
          reference_check(image && image.tagName === 'IMG', {label:'Graphics.beginPatternFill', id:gfx_node.id, message:"Parameter must be an src url, image object, or element id."});
          /*END_DEBUG*/

          //check if image has already been loaded
          if (image.complete) {
            img_loaded = image;
          } else {
            //if not, assign load handlers
            image.onload = function () {
              img_loaded = image;
              gfx_node.dispatchEvent(doodle_Event(doodle_Event.LOAD));
            };
            on_image_error = function () {
              throw new URIError(gfx_node.id + "Graphics.beginPatternFill(*image*,repeat): Unable to load " + image.src);
            };
            image.onerror = on_image_error;
            image.onabort = on_image_error;
          }
          
          draw_commands.push(function (ctx) {
            if (img_loaded) {
              ctx.fillStyle = ctx.createPattern(img_loaded, repeat);
            } else {
              //use transparent fill until image is loaded
              ctx.fillStyle = 'rgba(0,0,0,0)';
            }
          });
        }
      },

      /**
       * @name lineStyle
       * @param {number} thickness
       * @param {Color} color
       * @param {number} alpha
       * @param {LineCap} caps
       * @param {LineJoin} joints
       * @param {number} miterLimit
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.lineWidth</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-strokestyle">context.strokeStyle</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linecap">context.lineCap</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-linejoin">context.lineJoin</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-miterlimit">context.miterLimit</a> [Canvas API]
       */
      'lineStyle': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (thickness, color, alpha, caps, joints, miterLimit) {
          //defaults
          thickness = (thickness === undefined) ? 1 : thickness;
          color = (color === undefined) ? "#000000" : color;
          alpha = (alpha === undefined) ? 1 : alpha;
          caps = (caps === undefined) ? doodle.LineCap.BUTT : caps;
          joints = (joints === undefined) ? doodle.LineJoin.MITER : joints;
          miterLimit = (miterLimit === undefined) ? 10 : miterLimit;
          /*DEBUG*/
          type_check(thickness,'number', color,'*', alpha,'number', caps,'string', joints,'string', miterLimit,'number',
                     {label:'Graphics.lineStyle', params:['thickness','color','alpha','caps','joints','miterLimit'], id:gfx_node.id});
          //check values
          range_check(isFinite(thickness), thickness >= 0, {label:'Graphics.lineStyle', id:gfx_node.id, message:"thickness must have a positive number."});
          reference_check(caps === doodle.LineCap.BUTT || caps === doodle.LineCap.ROUND || caps === doodle.LineCap.SQUARE,
                          {label:'Graphics.lineStyle', id:gfx_node.id, message:"Invalid LineCap: " + caps});
          reference_check(joints === doodle.LineJoin.BEVEL || joints === doodle.LineJoin.MITER || joints === doodle.LineJoin.ROUND,
                          {label:'Graphics.lineStyle', id:gfx_node.id, message:"Invalid LineJoin: " + joints});
          range_check(isFinite(miterLimit), miterLimit >= 0, {label:'Graphics.lineStyle', id:gfx_node.id, message:"miterLimit must have a positive number."});
          /*END_DEBUG*/
          line_width = thickness;
          line_join = joints;
          line_cap = caps;
          line_miter = miterLimit;
          
          //convert color to canvas rgb() format
          if (typeof color === 'string' || typeof color === 'number') {
            color = hex_to_rgb_str(color, alpha);
          } else {
            throw new TypeError(gfx_node + " Graphics.lineStyle(thickness,*color*,alpha,caps,joints,miterLimit): Color must be a hex value.");
          }
          draw_commands.push(function (ctx) {
            ctx.lineWidth = line_width;
            ctx.strokeStyle = color;
            ctx.lineCap = line_cap;
            ctx.lineJoin = line_join;
            ctx.miterLimit = line_miter;
          });
        }
      },

      /**
       * @name beginPath
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-beginpath">context.beginPath</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
       */
      'beginPath': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.push(function (ctx) {
            ctx.beginPath();
            ctx.moveTo(cursor_x, cursor_y);
          });
        }
      },

      /**
       * @name closePath
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-closepath">context.closePath</a> [Canvas API]
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-stroke">context.stroke</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
       */
      'closePath': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.push(function (ctx) {
            ctx.closePath();
            ctx.stroke();
          });
          cursor_x = 0;
          cursor_y = 0;
        }
      },

      /**
       * @name endFill
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-fill">context.fill</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
       */
      'endFill': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.push(function (ctx) { ctx.fill(); });
        }
      },
      
      /**
       * @name stroke
       * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-stroke">context.stroke</a> [Canvas API]
       * @see <a href="https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#Drawing_paths">Drawing Paths</a> [Canvas Tutorial]
       */
      'stroke': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          draw_commands.push(function (ctx) {
            ctx.stroke();
          });
          cursor_x = 0;
          cursor_y = 0;
        }
      }

    });//end defineProperties

    return graphics;
  };
  

  graphics_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/toString">Object.toString</a> [JS Ref]
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () { return "[object Graphics]"; }
    }
  };

}());//end class closure
/*globals doodle*/

(function () {
  var node_static_properties,
      url_regexp = new RegExp("^url\\((.*)\\)"),
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      reference_check = doodle.utils.debug.reference_check,
      /*END_DEBUG*/
      //lookup help
      doodle_Rectangle = doodle.geom.Rectangle,
      rgb_str_to_hex = doodle.utils.rgb_str_to_hex,
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      get_element = doodle.utils.get_element,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property;
  
  /**
   * @name doodle.ElementNode
   * @class
   * @augments doodle.Node
   * @param {HTMLElement=} element
   * @param {string=} id
   * @return {doodle.ElementNode}
   * @throws {SyntaxError}
   */
  doodle.ElementNode = function (element, id) {
    var element_node = Object.create(doodle.Node((typeof id === 'string') ? id : undefined));

    Object.defineProperties(element_node, node_static_properties);
    //properties that require privacy
    Object.defineProperties(element_node, (function () {
      //defaults
      var dom_element = null,
          node_id = element_node.id, //inherit from node
          alpha = element_node.alpha,
          visible = element_node.visible,
          width = 0,
          height = 0,
          bg_color = null,
          bg_image = null,
          bg_repeat = 'repeat';
      
      return {
        /**
         * @name element
         * @return {HTMLElement}
         * @property
         */
        'element': {
          enumerable: true,
          configurable: true,
          get: function () { return dom_element; },
          set: function (elementArg) {
            var color,
                image,
                id,
                w, h;
            
            if (elementArg === null) {
              //check if removing an element
              if (dom_element !== null) {
                //class specific tasks when removing an element
                if (typeof this.__removeDomElement === 'function') {
                  this.__removeDomElement(dom_element);
                }
                //reset some values on the doodle object
                bg_color = null;
                bg_image = null;
                bg_repeat = 'repeat';
                //keep values of parent
                if (!this.parent) {
                  width = 0;
                  height = 0;
                }
              }
              //element be'gone!
              dom_element = null;
              
            } else {
              //assign a dom element
              elementArg = get_element(elementArg);
              /*DEBUG*/
              if (!elementArg) {
                throw new ReferenceError(this+".element: Invalid element.");
              }
              /*END_DEBUG*/
              dom_element = elementArg;
              
              /* Some classes require special handling of their element.
               */
              this.__addDomElement(dom_element); //may be overridden

              /* These go for every dom element passed.
               */
              id = get_element_property(dom_element, 'id');
              //if element has an id, rename node. Else, set element to this id.
              if (id) {
                node_id = id;
              } else {
                this.id = node_id;
              }
              //background color and image
              bg_repeat = get_element_property(dom_element, 'backgroundRepeat') || bg_repeat;
              color = get_element_property(dom_element, 'backgroundColor', false, false);
              bg_color = color ? rgb_str_to_hex(color) : bg_color;
              //parse image path from url format
              image = get_element_property(dom_element, 'backgroundImage');
              image = (!image || image === "none") ? null : bg_image.match(url_regexp);
              bg_image = image ? image[1] : bg_image;
            }
          }
        },
        
        /* Evidently it's not very efficent to query the dom for property values,
         * as it might initiate a re-flow. Cache values instead.
         */

        /**
         * @name id
         * @return {string}
         * @throws {TypeError}
         * @override
         * @property
         */
        'id': {
          enumerable: true,
          configurable: true,
          get: function () { return node_id; },
          set: function (idVar) {
            /*DEBUG*/
            type_check(idVar,'string', {label:'ElementNode.id', id:this.id});
            /*END_DEBUG*/
            node_id = set_element_property(this.element, 'id', idVar, 'html');
          }
        },

        /**
         * @name width
         * @return {number}
         * @throws {TypeError}
         * @override
         * @property
         */
        'width': {
          enumerable: true,
          configurable: true,
          get: function () { return width; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ElementNode.width', id:this.id});
            /*END_DEBUG*/
            set_element_property(this.element, 'width', n+"px");
            width = n;
          }
        },

        /**
         * @name height
         * @return {number}
         * @throws {TypeError}
         * @override
         * @property
         */
        'height': {
          enumerable: true,
          configurable: true,
          get: function () { return height; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ElementNode.height', id:this.id});
            /*END_DEBUG*/
            set_element_property(this.element, 'height', n+"px");
            height = n;
          }
        },

        /**
         * @name backgroundColor
         * @return {Color}
         * @property
         */
        'backgroundColor': {
          enumerable: true,
          configurable: true,
          get: function () { return bg_color; },
          set: function (color) {
            if (typeof color === 'number') {
              color = hex_to_rgb_str(color);
            }
            set_element_property(this.element, 'backgroundColor', color);
            //the dom will convert the color to 'rgb(n,n,n)' format
            bg_color = rgb_str_to_hex(get_element_property(this.element, 'backgroundColor'));
          }
        },

        /**
         * @name backgroundImage
         * @return {HTMLImageElement}
         * @throws {TypeError}
         * @property
         */
        'backgroundImage': {
          enumerable: true,
          configurable: true,
          get: function () { return bg_image; },
          set: function (image) {
            if (!image) {
              bg_image = set_element_property(this.element, 'backgroundImage', null);
              return;
            }
            //a string can be a page element or url
            if (typeof image === 'string') {
              if (image[0] === '#') {
                image = get_element(image).src;
              }
            } else if (image && image.tagName === 'IMG') {
              //passed an image element
              image = image.src;
            }
            /*DEBUG*/
            type_check(image,'string', {label:'ElementNode.backgroundImage', id:this.id});
            /*END_DEBUG*/
            //url path at this point, make sure it's in the proper format
            if (!url_regexp.test(image)) {
              image = "url("+ encodeURI(image) +")";
            }
            bg_image = set_element_property(this.element, 'backgroundImage', image);
          }
        },

        /**
         * @name backgroundRepeat
         * @return {string}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'backgroundRepeat': {
          enumerable: true,
          configurable: true,
          get: function () { return bg_repeat; },
          set: function (repeat) {
            /*DEBUG*/
            type_check(repeat,'string', {label:'ElementNode.backgroundRepeat', id:this.id});
            reference_check(repeat === 'repeat' || repeat === 'repeat-x' || repeat === 'repeat-y' || repeat === 'no-repeat' || repeat === 'inherit',
                            {label:'ElementNode.backgroundRepeat', id:this.id, message:"Invalid CSS value."});
            /*END_DEBUG*/
            bg_repeat = set_element_property(this.element, 'backgroundRepeat', repeat);
          }
        },

        /**
         * @name alpha
         * @return {number}
         * @throws {TypeError}
         * @override
         * @property
         */
        'alpha': {
          enumerable: true,
          configurable: true,
          get: function () { return alpha; },
          set: function (alpha) {
            /*DEBUG*/
            type_check(alpha,'number', {label:'ElementNode.alpha', id:this.id});
            alpha = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
            /*END_DEBUG*/
            alpha = set_element_property(this.element, 'opacity', alpha);
          }
        },

        /**
         * @name visible
         * @return {boolean}
         * @throws {TypeError}
         * @override
         * @property
         */
        'visible': {
          enumerable: true,
          configurable: true,
          get: function () { return visible; },
          set: function (isVisible) {
            /*DEBUG*/
            type_check(isVisible,'boolean', {label:'ElementNode.visible', id:this.id});
            /*END_DEBUG*/
            if (isVisible) {
              set_element_property(this.element, 'visibility', 'visible');
            } else {
              set_element_property(this.element, 'visibility', 'hidden');
            }
            visible =  isVisible;
          }
        },

        /**
         * Called when a dom element is added. This function will be overridden
         * for sub-class specific behavior.
         * @name __addDomElement
         * @param {HTMLElement} elementArg
         * @private
         */
        '__addDomElement': {
          enumerable: false,
          configurable: true,
          value: function (elementArg) {
            //default method obtaining element dimensions  
            var w = get_element_property(elementArg, 'width', 'int') || elementArg.width,
                h = get_element_property(elementArg, 'height', 'int') || elementArg.height;
            if (typeof w === 'number') { width = w; }
            if (typeof h === 'number') { height = h; }
          }
        },

        /**
         * @name __addDomElement
         * @param {HTMLElement} elementArg
         * @return {Rectangle} Rectangle object is reused for each call.
         * @throws {TypeError} targetCoordSpace must inherit from Node.
         * @override
         * @private
         */
        '__getBounds': {
          enumerable: true,
          configurable: true,
          value: (function () {
            var rect = doodle_Rectangle(0, 0, 0, 0); //recycle
            return function (targetCoordSpace) {
              /*DEBUG*/
              console.assert(doodle.Node.isNode(targetCoordSpace), "targetCoordSpace is a Node", targetCoordSpace);
              /*END_DEBUG*/
              var children = this.children,
                  len = children.length,
                  bounding_box = rect,
                  child_bounds,
                  w = this.width,
                  h = this.height,
                  tl = {x: 0, y: 0},
                  tr = {x: w, y: 0},
                  br = {x: w, y: h},
                  bl = {x: 0, y: h},
                  min = Math.min,
                  max = Math.max;
              
              //transform corners to global
              this.__localToGlobal(tl); //top left
              this.__localToGlobal(tr); //top right
              this.__localToGlobal(br); //bot right
              this.__localToGlobal(bl); //bot left
              //transform global to target space
              targetCoordSpace.__globalToLocal(tl);
              targetCoordSpace.__globalToLocal(tr);
              targetCoordSpace.__globalToLocal(br);
              targetCoordSpace.__globalToLocal(bl);

              //set rect with extremas
              bounding_box.left = min(tl.x, tr.x, br.x, bl.x);
              bounding_box.right = max(tl.x, tr.x, br.x, bl.x);
              bounding_box.top = min(tl.y, tr.y, br.y, bl.y);
              bounding_box.bottom = max(tl.y, tr.y, br.y, bl.y);

              //add child bounds to this
              while (len--) {
                child_bounds = children[len].__getBounds(targetCoordSpace);
                if (child_bounds !== null) {
                  bounding_box.__union(child_bounds);
                }
              }
              return bounding_box;
            };
          }())
        }
        
      };
    }()));//end defineProperties

    //check args
    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function
      if (typeof arguments[0] === 'function') {
        arguments[0].call(element_node);
        element = undefined;
      } else {
        //passed element
        element_node.element = element;
      }
      break;
    case 2:
      //standard instantiation (element, id)
      if (element) {
        //can be undefined
        element_node.element = element;
      }
      break;
    default:
      throw new SyntaxError("[object ElementNode](element, id): Invalid number of parameters.");
    }

    return element_node;
  };

  
  node_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object ElementNode]"; }
    }
  };//end node_static_properties
  
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is an ElementNode.
 * @name isElementNode
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.ElementNode.isElementNode = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toString() === '[object ElementNode]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
/*globals doodle, document*/

(function () {
  var layer_static_properties,
      layer_count = 0,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      /*END_DEBUG*/
      set_element_property = doodle.utils.set_element_property;
  
  /**
   * @name doodle.Layer
   * @class
   * @augments doodle.ElementNode
   * @param {string=} id
   * @param {HTMLCanvasElement=} element
   * @return {doodle.Layer}
   * @throws {SyntaxError}
   */
  doodle.Layer = function (id, element) {
    var layer_name = (typeof id === 'string') ? id : "layer"+ String('00'+layer_count).slice(-2),
        layer = Object.create(doodle.ElementNode(undefined, layer_name));

    Object.defineProperties(layer, layer_static_properties);
    //properties that require privacy
    Object.defineProperties(layer, (function () {
      //defaults
      var width = 0,
          height = 0,
          context = null;
      
      return {
        /**
         * Canvas dimensions need to apply to HTML attributes.
         * @name width
         * @return {number}
         * @throws {TypeError}
         * @property
         * @override
         */
        'width': {
          enumerable: true,
          configurable: true,
          get: function () { return width; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Layer.width', id:this.id});
            range_check(isFinite(n), {label:'Layer.width', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            width = set_element_property(this.element, 'width', n, 'html');
          }
        },

        /**
         * 
         * @name height
         * @return {number}
         * @throws {TypeError}
         * @property
         * @override
         */
        'height': {
          enumerable: true,
          configurable: true,
          get: function () { return height; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'Layer.height', id:this.id});
            range_check(isFinite(n), {label:'Layer.height', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            height = set_element_property(this.element, 'height', n, 'html');
          }
        },

        /**
         * 
         * @name context
         * @return {CanvasRenderingContext2D}
         * @property
         * @override
         */
        'context': {
          enumerable: true,
          configurable: true,
          get: function () { return context; }
        },

        /**
         * Layer specific things to setup when adding a dom element.
         * Called in ElementNode.element
         * @name __addDomElement
         * @param {HTMLElement} elementArg
         * @throws {TypeError}
         * @override
         * @private
         */
        '__addDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) {
            /*DEBUG*/
            console.assert(typeof elementArg === 'object' && elementArg.toString() === '[object HTMLCanvasElement]', "elementArg is a canvas", elementArg);
            /*END_DEBUG*/
            //need to stack canvas elements inside div
            set_element_property(elementArg, 'position', 'absolute');
            //set to display dimensions if there
            if (this.parent) {
              this.width = this.parent.width;
              this.height = this.parent.height;
            }
            //set rendering context
            context = elementArg.getContext('2d');
          }
        },

        /**
         * Layer specific things to setup when removing a dom element.
         * Called in ElementNode.element
         * @name __removeDomElement
         * @param {HTMLElement} elementArg
         * @override
         * @private
         */
        '__removeDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) { context = null; }
        }
        
      };
    }()));//end defineProperties

    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function or id string
      if (typeof arguments[0] === 'function') {
        arguments[0].call(layer);
        id = undefined;
      }
      break;
    case 2:
      /*DEBUG*/
      type_check(element,'canvas', {label:'Layer', id:this.id, message:"Invalid initialization."});
      /*END_DEBUG*/
      layer.element = element;
      break;
    default:
      throw new SyntaxError("[object Layer](id, element): Invalid number of parameters.");
    }

    if (layer.element === null) {
      layer.element = document.createElement('canvas');
    }
    
    layer_count += 1;

    return layer;
  };

  
  layer_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object Layer]"; }
    },

    /**
     * This is always the same size, so we'll save some computation.
     * @name __getBounds
     * @return {Rectangle}
     * @override
     * @private
     */
    '__getBounds': {
      enumerable: true,
      configurable: true,
      value: (function () {
        var rect = doodle.geom.Rectangle(0, 0, 0, 0); //recycle
        return function () {
          return rect.compose(0, 0, this.width, this.height);
        };
      }())
    }
  };//end layer_static_properties
  
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a Layer.
 * @name isLayer
 * @param {Object} obj
 * @return {boolean}
 * @static
 */
doodle.Layer.isLayer = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toString() === '[object Layer]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
/*jslint nomen: false, plusplus: false*/
/*globals doodle, document, setInterval, clearInterval, Stats*/

(function () {
  var display_static_properties,
      display_count = 0,
      create_frame,
      clear_scene_graph,
      draw_scene_graph,
      draw_bounding_box,
      dispatch_mouse_event,
      dispatch_mousemove_event,
      dispatch_mouseleave_event,
      dispatch_keyboard_event,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      /*END_DEBUG*/
      create_scene_path = doodle.utils.create_scene_path,
      isLayer = doodle.Layer.isLayer,
      get_element = doodle.utils.get_element,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property,
      doodle_Layer = doodle.Layer,
      //doodle_TouchEvent = doodle.events.TouchEvent,
      //recycle these event objects
      evt_enterFrame = doodle.events.Event(doodle.events.Event.ENTER_FRAME),
      evt_mouseEvent = doodle.events.MouseEvent(''),
      //evt_touchEvent = doodle.events.TouchEvent(''),
      evt_keyboardEvent = doodle.events.KeyboardEvent('');
  
  /**
   * Doodle Display object.
   * @name doodle.Display
   * @class
   * @augments doodle.ElementNode
   * @param {HTMLElement=} element
   * @return {doodle.Display}
   * @throws {TypeError} Must be a block style element.
   * @throws {SyntaxError}
   * @example
   *   var display = doodle.Display;<br/>
   *   display.width = 400;
   * @example
   *   var display = doodle.Display(function () {<br/>
   *   &nbsp; this.width = 400;<br/>
   *   });
   */
  doodle.Display = function (element) {
    var display,
        id;

    //extract id from element
    if (element && typeof element !== 'function') {
      element = get_element(element);
      /*DEBUG*/
      type_check(element,'block', {label:'Display', id:this.id, message:"Invalid element."});
      /*END_DEBUG*/
      id = get_element_property(element, 'id');
    }

    id = (typeof id === 'string') ? id : "display"+ String('00'+display_count++).slice(-2);
    //won't assign element until after display properties are set up
    display = Object.create(doodle.ElementNode(undefined, id));

    
    Object.defineProperties(display, display_static_properties);
    //properties that require privacy
    Object.defineProperties(display, (function () {
      var width = 0,
          height = 0,
          dom_element = null, //just a reference
          layers = display.children,
          dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
          display_scene_path = [], //all descendants
          mouseX = 0,
          mouseY = 0,
          //chrome mouseevent has offset info, otherwise need to calculate
          evt_offset_p = document.createEvent('MouseEvent').offsetX !== undefined,
          //move to closer scope since they're called frequently
          $display = display,
          $dispatch_mouse_event = dispatch_mouse_event,
          $dispatch_mousemove_event = dispatch_mousemove_event,
          $dispatch_mouseleave_event = dispatch_mouseleave_event,
          $dispatch_keyboard_event = dispatch_keyboard_event,
          $create_frame = create_frame,
          //recycled event objects
          $evt_enterFrame = evt_enterFrame,
          $evt_mouseEvent = evt_mouseEvent,
          $evt_keyboardEvent = evt_keyboardEvent;

      /* @param {doodle.events.MouseEvent} evt
       */
      function on_mouse_event (evt) {
        $dispatch_mouse_event(evt, $evt_mouseEvent, display_scene_path, display_scene_path.length, mouseX, mouseY, $display);
      }

      /* @param {doodle.events.MouseEvent} evt
       */
      function on_mouse_move (evt) {
        var x, y;
        mouseX = x = evt_offset_p ? evt.offsetX : evt.clientX - dom_element.offsetLeft;
        mouseY = y = evt_offset_p ? evt.offsetY : evt.clientY - dom_element.offsetTop;
        
        $dispatch_mousemove_event(evt, $evt_mouseEvent, display_scene_path, display_scene_path.length, x, y, $display);
      }

      /* @param {doodle.events.MouseEvent} evt
       */
      function on_mouse_leave (evt) {
        $dispatch_mouseleave_event(evt, $evt_mouseEvent, display_scene_path, layers, layers.length, $display);
      }

      /* @param {doodle.events.KeyboardEvent} evt
       */
      function on_keyboard_event (evt) {
        $dispatch_keyboard_event(evt, $evt_keyboardEvent, $display);
      }

      /*
       */
      function on_create_frame () {
        $create_frame(layers, layers.length,
                      dispatcher_queue, dispatcher_queue.length, $evt_enterFrame,
                      display_scene_path, display_scene_path.length,
                      $display);
      }
      
      //Add display handlers
      //Redraw scene graph when children are added and removed.
			//**when objects removed in event loop, causing it to re-run before its finished
      //$display.addEventListener(doodle.events.Event.ADDED, on_create_frame);
      //$display.addEventListener(doodle.events.Event.REMOVED, on_create_frame);
			
      //Add keyboard listeners to document.
      document.addEventListener(doodle.events.KeyboardEvent.KEY_PRESS, on_keyboard_event, false);
      document.addEventListener(doodle.events.KeyboardEvent.KEY_DOWN, on_keyboard_event, false);
      document.addEventListener(doodle.events.KeyboardEvent.KEY_UP, on_keyboard_event, false);
      
      return {
        /**
         * Display always returns itself as root.
         * @name root
         * @return {Display}
         * @property
         * @override
         */
        'root': {
          enumerable: true,
          writable: false,
          configurable: false,
          value: $display
        },
        
        /**
         * Mouse x position on display.
         * @name mouseX
         * @return {number} [read-only]
         * @property
         */
        'mouseX': {
          enumerable: true,
          configurable: false,
          get: function () { return mouseX; }
        },

        /**
         * Mouse y position on display.
         * @name mouseY
         * @return {number} [read-only]
         * @property
         */
        'mouseY': {
          enumerable: true,
          configurable: false,
          get: function () { return mouseY; }
        },
        
        /**
         * Display width. Setting this affects all it's children layers.
         * @name width
         * @return {number}
         * @throws {TypeError}
         * @property
         * @override
         */
        'width': {
          get: function () { return width; },
          set: function (n) {
            var i = layers.length;
            /*DEBUG*/
            type_check(n,'number', {label:'Display.width', id:this.id});
            range_check(isFinite(n), {label:'Display.width', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            set_element_property(this.element, 'width', n+"px");
            width = n;
            //cascade down to our canvas layers
            while(i--) {
              layers[i].width = n;
            }
            return n;
          }
        },

        /**
         * Display height. Setting this affects all it's children layers.
         * @name height
         * @return {number}
         * @throws {TypeError}
         * @property
         * @override
         */
        'height': {
          get: function () { return height; },
          set: function (n) {
            var i = layers.length;
            /*DEBUG*/
            type_check(n,'number', {label:'Display.height', id:this.id});
            range_check(isFinite(n), {label:'Display.height', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            set_element_property(this.element, 'height', n+"px");
            height = n;
            //cascade down to our canvas layers
            while(i--) {
              layers[i].height = n;
            }
            return n;
          }
        },
        
        /**
         * Gets size of display element and adds event handlers.
         * Called in ElementNode.element
         * @name __addDomElement
         * @param {HTMLElement} elementArg
         * @throws {TypeError}
         * @override
         * @private
         */
        '__addDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) {
            /*DEBUG*/
            type_check(elementArg,'block', {label:'Display.__addDomElement', params:'elementArg', id:this.id});
            /*END_DEBUG*/
            //need to stack the canvas elements on top of each other
            set_element_property(elementArg, 'position', 'relative');
            
            //computed style will return the entire window size
            var w = get_element_property(elementArg, 'width', 'int', false) || elementArg.width,
                h = get_element_property(elementArg, 'height', 'int', false) || elementArg.height;
            //setting this also sets child layers
            if (typeof w === 'number') { this.width = w; }
            if (typeof h === 'number') { this.height = h; }

            //add event handlers
            //MouseEvents
            elementArg.addEventListener(doodle.events.MouseEvent.MOUSE_MOVE, on_mouse_move, false);
            //this dispatches mouseleave and mouseout for display and layers
            elementArg.addEventListener(doodle.events.MouseEvent.MOUSE_OUT, on_mouse_leave, false);
            //
            elementArg.addEventListener(doodle.events.MouseEvent.CLICK, on_mouse_event, false);
            elementArg.addEventListener(doodle.events.MouseEvent.DOUBLE_CLICK, on_mouse_event, false);
            elementArg.addEventListener(doodle.events.MouseEvent.MOUSE_DOWN, on_mouse_event, false);
            elementArg.addEventListener(doodle.events.MouseEvent.MOUSE_UP, on_mouse_event, false);
            elementArg.addEventListener(doodle.events.MouseEvent.CONTEXT_MENU, on_mouse_event, false);
            elementArg.addEventListener(doodle.events.MouseEvent.MOUSE_WHEEL, on_mouse_event, false);
            /*//TouchEvents
            elementArg.addEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
            elementArg.addEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
            elementArg.addEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
            elementArg.addEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
            */
            dom_element = elementArg;
          }
        },

        /**
         * Removes event handlers from display element.
         * @name __removeDomElement
         * @param {HTMLElement} elementArg
         * @override
         * @private
         */
        '__removeDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) {
            /*DEBUG*/
            //make sure it exists here
            /*END_DEBUG*/
            //remove event handlers
            //MouseEvents
            elementArg.removeEventListener(doodle.events.MouseEvent.MOUSE_MOVE, on_mouse_move, false);
            //
            elementArg.removeEventListener(doodle.events.MouseEvent.MOUSE_OUT, on_mouse_leave, false);
            //
            elementArg.removeEventListener(doodle.events.MouseEvent.CLICK, on_mouse_event, false);
            elementArg.removeEventListener(doodle.events.MouseEvent.DOUBLE_CLICK, on_mouse_event, false);
            elementArg.removeEventListener(doodle.events.MouseEvent.MOUSE_DOWN, on_mouse_event, false);
            elementArg.removeEventListener(doodle.events.MouseEvent.MOUSE_UP, on_mouse_event, false);
            elementArg.removeEventListener(doodle.events.MouseEvent.CONTEXT_MENU, on_mouse_event, false);
            elementArg.removeEventListener(doodle.events.MouseEvent.MOUSE_WHEEL, on_mouse_event, false);
            /*//TouchEvents
            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
            */
            dom_element = null;
          }
        },

        /**
         * All descendants of the display, in scene graph order.
         * @name allChildren
         * @return {Array} [read-only]
         * @property
         */
        'allChildren': {
          enumerable: true,
          configurable: false,
          get: function () { return display_scene_path; }
        },

        /**
         * Re-creates the display's scene path. Called when adding child nodes.
         * @name __sortAllChildren
         * @throws {RangeError}
         * @throws {ReferenceError}
         * @private
         */
        '__sortAllChildren': {
          enumerable: false,
          configurable: false,
          value: function () {
            create_scene_path(this, display_scene_path, true).reverse();
            /*DEBUG*/
            type_check(display_scene_path[0],'Display', {label:'Display.__sortAllChildren', id:this.id});
            /*END_DEBUG*/
          }
        },

        /**
         * Returns a list of nodes under a given display position.
         * @name getNodesUnderPoint
         * @param {Point} point
         * @throws {TypeError}
         * @return {Array}
         */
        'getNodesUnderPoint': {
          enumerable: true,
          configurable: false,
          value: function (point) {
            /*DEBUG*/
            type_check(point,'Point', {label:'Display.getNodesUnderPoint', params:'point', id:this.id});
            /*END_DEBUG*/
            var nodes = [],
                scene_path = display_scene_path,
                i = scene_path.length,
                x = point.x,
                y = point.y,
                node;
            while (i--) {
              node = scene_path[i];
              if(node.__getBounds(this).contains(x, y)) {
                nodes.push(node);
              }
            }
            return nodes;
          }
        },

        /**
         * Add a layer to the display's children at the given array position.
         * Layer inherits the dimensions of the display.
         * @name addChildAt
         * @param {Layer} layer
         * @param {number} index
         * @return {Layer}
         * @throws {TypeError}
         * @override
         */
        'addChildAt': {
          enumerable: true,
          configurable: false,
          value: (function () {
            var super_addChildAt = $display.addChildAt;
            return function (layer, index) {
              /*DEBUG*/
              type_check(layer,'Layer', index,'number', {label:'Display.addChildAt', params:['layer','index'], id:this.id});
              /*END_DEBUG*/
              //inherit display dimensions
              layer.width = this.width;
              layer.height = this.height;
              //add dom element
              this.element.appendChild(layer.element);
              return super_addChildAt.call(this, layer, index);
            };
          }())
        },

        /**
         * Remove a layer from the display's children at the given array position.
         * @name removeChildAt
         * @param {number} index
         * @throws {TypeError}
         * @override
         */
        'removeChildAt': {
          enumerable: true,
          writable: false,
          configurable: false,
          value: (function () {
            var super_removeChildAt = $display.removeChildAt;
            return function (index) {
              /*DEBUG*/
              type_check(index,'number', {label:'Display.removeChildAt', params:'index', id:this.id});
              /*END_DEBUG*/
              //remove from dom
              this.element.removeChild(layers[index].element);
              return super_removeChildAt.call(this, index);
            };
          }())
        },

        /**
         * Change the display order of two child layers at the given index.
         * @name swapChildrenAt
         * @param {number} idx1
         * @param {number} idx2
         * @throws {TypeError}
         * @override
         */
        'swapChildrenAt': {
          enumerable: true,
          writable: false,
          configurable: false,
          value: (function () {
            var super_swapChildrenAt = $display.swapChildrenAt;
            return function (idx1, idx2) {
              /*DEBUG*/
              type_check(idx1,'number', idx2,'number', {label:'Display.swapChildrenAt', params:['index1','index2'], id:this.id});
              /*END_DEBUG*/
              //swap dom elements
              if (idx1 > idx2) {
                this.element.insertBefore(layers[idx2].element, layers[idx1].element);
              } else {
                this.element.insertBefore(layers[idx1].element, layers[idx2].element);
              }
              return super_swapChildrenAt.call(this, idx1, idx2);
            };
          }())
        },

        /*DEBUG_STATS*/
        'debug': {
          enumerable: true,
          configurable: false,
          value: Object.create(null, {
            /*DEBUG*/
            /**
             * Color of the bounding box outline for nodes on the display.
             * Display a particular node's bounds with node.debug.boundingBox = true
             * @name debug.boundingBox
             * @param {string} color
             * @return {string}
             * @override
             * @property
             */
            'boundingBox': (function () {
              var bounds_color = "#0000cc";
              return {
                enumerable: true,
                configurable: false,
                get: function () { return  bounds_color; },
                set: function (boundingBoxColor) {
                  bounds_color = boundingBoxColor;
                }
              };
            }()),
            /*END_DEBUG*/

            /**
             * Overlay a stats meter on the display.
             * See http://github.com/mrdoob/stats.js for more info.
             * To include in a compiled build, use ./build/make-doodle -S
             * @name debug.stats
             * @param {boolean}
             * @return {Stats|boolean}
             * @throws {TypeError}
             * @property
             */
            'stats': (function () {
              var debug_stats = false; //stats object
              return {
                enumerable: true,
                configurable: false,
                get: function () { return debug_stats; },
                set: function (useStats) {
                  /*DEBUG*/
                  type_check(useStats,'boolean', {label:'Display.debug.stats', params:'useStats', id:this.id});
                  /*END_DEBUG*/
                  if (useStats && !debug_stats) {
                    debug_stats = new Stats();
                    $display.element.appendChild(debug_stats.domElement);
                  } else if (!useStats && debug_stats) {
                    $display.element.removeChild(debug_stats.domElement);
                    debug_stats = false;
                  }
                }
              };
            }())
          })
        },
        /*END_DEBUG_STATS*/

        /**
         * Determines the interval to dispatch the event type Event.ENTER_FRAME.
         * This event is dispatched simultaneously to all display objects listenting
         * for this event. It does not go through a "capture phase" and is dispatched
         * directly to the target, whether the target is on the display list or not.
         * @name frameRate
         * @return {number|false}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'frameRate': (function () {
          var frame_rate = false, //fps
              framerate_interval_id;
          return {
            get: function () { return frame_rate; },
            set: function (fps) {
              /*DEBUG*/
              if (fps !== false && fps !== 0) {
                type_check(fps,'number', {label:'Display.frameRate', params:'fps', id:this.id});
                range_check(fps >= 0, isFinite(1000/fps), {label:'Display.frameRate', params:'fps', id:this.id, message:"Invalid frame rate."});
              }
              /*END_DEBUG*/
              if (fps === 0 || fps === false) {
                //turn off interval
                frame_rate = false;
                if (framerate_interval_id !== undefined) {
                  clearInterval(framerate_interval_id);
                }
              } else {
                //non-zero number, ignore if given same value
                if (fps !== frame_rate) {
                  if (framerate_interval_id !== undefined) {
                    clearInterval(framerate_interval_id);
                  }
                  framerate_interval_id = setInterval(on_create_frame, 1000/fps);
                  frame_rate = fps;
                }
              }
            }
          };
        }())
        
      };//end return object
    }()));//end defineProperties

    //check args
    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function
      if (typeof arguments[0] === 'function') {
        arguments[0].call(element);
        element = undefined;
      } else {
        //passed element
        /*DEBUG*/
        type_check(element,'block', {label:'Display', id:this.id, message:"Invalid initialization."});
        /*END_DEBUG*/
        display.element = element;
      }
      break;
    default:
      throw new SyntaxError("[object Display](element): Invalid number of parameters.");
    }

    /*DEBUG*/
    //can't proceed with initialization without an element to work with
    type_check(display.element,'block', {label:'Display.element', id:this.id, message:"Invalid initialization."});
    /*END_DEBUG*/
    
    //draw at least 1 frame
    create_frame(display.children, display.children.length,
                 doodle.EventDispatcher.dispatcher_queue,
                 doodle.EventDispatcher.dispatcher_queue.length,
                 evt_enterFrame,
                 display.allChildren, display.allChildren.length,
                 display);
    
    return display;
  };//end doodle.Display

  
  display_static_properties = {
    /**
     * A Display has no parent.
     * @name parent
     * @return {null}
     * @override
     * @property
     */
    'parent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: null
    },
    
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     * @property
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () { return "[object Display]"; }
    },

    /**
     * Add a new layer to the display's children.
     * @name addLayer
     * @param {string} id
     * @return {Layer}
     * @throws {TypeError}
     */
    'addLayer': {
      value: function (id) {
        /*DEBUG*/
        id === undefined || type_check(id,'string', {label:'Display.addLayer', params:'id', id:this.id});
        /*END_DEBUG*/
        return this.addChild(doodle_Layer(id));
      }
    },

    /**
     * Remove a layer with a given name from the display's children.
     * @name removeLayer
     * @param {string} id
     * @throws {TypeError}
     */
    'removeLayer': {
      value: function (id) {
        /*DEBUG*/
        type_check(id,'string', {label:'Display.removeLayer', params:'id', id:this.id});
        /*END_DEBUG*/
        return this.removeChildById(id);
      }
    },

    /**
     * The bounds of a display is always it's dimensions.
     * @name __getBounds
     * @return {Rectangle} This object is reused with each call.
     * @override
     * @private
     */
    '__getBounds': {
      enumerable: false,
      configurable: true,
      value: (function () {
        var rect = doodle.geom.Rectangle(0, 0, 0, 0); //recycle
        return function () {
          return rect.compose(0, 0, this.width, this.height);
        };
      }())
    }
  };//end display_static_properties

  
  /* Clear, move, draw.
   * Dispatches Event.ENTER_FRAME to all objects listening to it,
   * reguardless if it's on the scene graph or not.
   * @this {Display}
   */
  create_frame = (function () {
    var frame_count = 0;
    return function make_frame (layers, layer_count,
                                receivers, recv_count, enterFrame,
                                scene_path, path_count,
                                display, clearRect) {
      /*** new way
      var node,
          i,
          bounds,
          ctx;
      //clear scene - only need top level nodes
      while (layer_count--) {
        ctx = layers[layer_count].context;

        node = layers[layer_count].children; //array - top level nodes
        i = node.length;

        while (i--) {
          ctx.clearRect.apply(ctx, node[i].__getBounds(display).inflate(2, 2).__toArray());
        }
      }

      //update position
      while (recv_count--) {
        if (receivers[recv_count].eventListeners.hasOwnProperty('enterFrame')) {
          receivers[recv_count].handleEvent(enterFrame.__setTarget(receivers[recv_count]));
        }
      }

      //draw
      while (path_count--) {
        node = scene_path[path_count];
        ctx = node.context;
        
        if (ctx && node.visible) {
          ctx.save();
          ctx.transform.apply(ctx, node.__allTransforms.__toArray());
        
          //apply alpha to node and it's children
          if (!isLayer(node)) {
            if (node.alpha !== 1) {
              ctx.globalAlpha = node.alpha;
            }
          }
          if (typeof node.__draw === 'function') {
            node.__draw(ctx);
          }

          //DEBUG//
          if (node.debug.boundingBox) {
            bounds = node.__getBounds(display);
            if (bounds) {
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0); //reset
              //bounding box
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = display.debug.boundingBox;
              ctx.strokeRect.apply(ctx, bounds.__toArray());
              ctx.restore();
            }
            
          }
          //END_DEBUG//
          ctx.restore();
        }
      }
      ****/

      /*** old way ***/
      clear_scene_graph(layers, layer_count);
      
      while (recv_count--) {
        if (receivers[recv_count].eventListeners.hasOwnProperty('enterFrame')) {
          receivers[recv_count].handleEvent(enterFrame.__setTarget(receivers[recv_count]));
        }
      }

			/*DEBUG*/
			//console.assert(scene_path.length === path_count, "scene_path.length === path_count", scene_path.length, path_count);
			/*END_DEBUG*/
      draw_scene_graph(scene_path, path_count);
      
      /*DEBUG_STATS*/
      if (display.debug.stats !== false) {
        //update stats monitor if needed
        display.debug.stats.update();
      }
      /*END_DEBUG_STATS*/
      frame_count++;
      /**end old way**/
      
    };
  }());

  
  /*
   * @param {Node} node
   */
  clear_scene_graph = function (layers, count) {
    /* Brute way, clear entire layer in big rect.
     */
    var ctx;
    while (count--) {
      ctx = layers[count].context;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0); //reset
      ctx.clearRect(0, 0, layers[count].width, layers[count].height);
      ctx.restore();
    }
  };

  /*
   *
   */
  draw_scene_graph = function (scene_path) {
    var node,
				count = scene_path.length,
        display = scene_path[0],
        ctx,
        bounds,
        i = 1; //ignore display

    for (; i < count; i++) {
    //while (count--) {
      node = scene_path[i];
			/*DEBUG*/
			console.assert(Array.isArray(scene_path), "scene_path is an array", scene_path);
			console.assert(scene_path.length === count, "scene_path.length === count", count, scene_path.length);
			console.assert(doodle.Node.isNode(node), "node is a Node", node, i, scene_path);
			console.assert(doodle.Display.isDisplay(display), "display is a Display", display);
			console.assert(node.context && node.context.toString() === '[object CanvasRenderingContext2D]', "node.context is a context", node.context, node.id);
			/*END_DEBUG*/
      //display = node.root;
      ctx = node.context;
      
      if (ctx && node.visible) {
        ctx.save();
        ctx.transform.apply(ctx, node.__allTransforms.__toArray());
        
        //apply alpha to node and it's children
        if (!isLayer(node)) {
          if (node.alpha !== 1) {
            ctx.globalAlpha = node.alpha;
          }
        }
        if (typeof node.__draw === 'function') {
          node.__draw(ctx);
        }
        
        ctx.restore();
        
        /*DEBUG*/
        if (node.debug.boundingBox) {
          bounds = node.__getBounds(display);
          if (bounds) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0); //reset
            //bounding box
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = display.debug.boundingBox;
            ctx.strokeRect.apply(ctx, bounds.__toArray());
            ctx.restore();
          }
          
        }
        /*END_DEBUG*/
      }
    }
  };
  

  /*
   * EVENT DISPATCHING
   */

  /* Dispatches the following dom mouse events to doodle nodes on the display path:
   * 'click', 'doubleclick', 'mousedown', 'mouseup', 'contextmenu', 'mousewheel'.
   * An event is dispatched to the first node on the display path which
   * mouse position is within their bounds. The event then follows the event path.
   * The doodle mouse event is recycled by copying properties from the dom event.
   *
   * @param {doodle.events.MouseEvent} evt DOM mouse event to copy properties from.
   * @param {doodle.events.MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
   * @param {Array} path Reference to the display's scene path.
   * @param {number} count number of nodes in the scene path array.
   * @param {number} x Position of the mouse x coordiante.
   * @param {number} y Position of the mouse y coorindate.
   * @param {Display} display Reference to the display object.
   * @return {boolean} True if event gets dispatched.
   * @private
   */
  dispatch_mouse_event = function (evt, mouseEvent, path, count, x, y, display) {
    /*DEBUG*/
    console.assert(doodle.events.MouseEvent.isMouseEvent(evt), "evt is a MouseEvent", evt);
    console.assert(doodle.events.MouseEvent.isMouseEvent(mouseEvent), "mouseEvent is a MouseEvent", mouseEvent);
    console.assert(Array.isArray(path), "path is an array", path);
    console.assert(typeof count === 'number', "count is a number", count);
    console.assert(typeof x === 'number', "x is a number", x);
    console.assert(typeof y === 'number', "y is a number", y);
    console.assert(doodle.Display.isDisplay(display), "display is a Display object", display);
    /*END_DEBUG*/
    while (count--) {
      if (path[count].__getBounds(display).contains(x, y)) {
        path[count].dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      }
    }
    return false;
  };

  
  (function () {
  /* ignores layers until later - not implemented - not sure I want to
   */
  var dispatch_mouse_event_IGNORELAYER = function (evt, mouseEvent, evt_type, path, count, x, y,
                                                   display, layers, layer_count) {
    //check nodes, dispatch if in boundry
    while (count--) {
      if (count <= layer_count) {
        break;
      }
      if (path[count].__getBounds(display).contains(x, y)) {
        path[count].dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      }
    }
    //if no layers, dispatch from display
    if (layer_count === 0) {
      display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
      return true;
    }
    //check layers, must have handler to dispatch
    while (layer_count--) {
      if (layers[layer_count].eventListeners.hasOwnProperty(evt_type)) {
        layers[layer_count].dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      }
    }
    //if nothing else, top layer dispatch to display
    layers[--count].dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
    return true;
  };
  }());

  /* Called on every mousemove event from the dom.
   * Dispatches the following events to doodle nodes on the display path:
   * 'mousemove', 'mouseover', 'mouseenter', 'mouseout', 'mouseleave'
   * Maintains mouse over/out information by assigning a boolean value to
   * the node.__pointInBounds property. This is only accessed in this function,
   * and is reset in 'dispatch_mouseleave_event'.
   *
   * @param {doodle.events.MouseEvent} evt DOM mouse event to copy properties from.
   * @param {doodle.events.MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
   * @param {Array} path Reference to the display's scene path.
   * @param {number} count number of nodes in the scene path array.
   * @param {number} x Position of the mouse x coordiante.
   * @param {number} y Position of the mouse y coorindate.
   * @param {Display} display Reference to the display object.
   * @return {boolean} True on dispatch. (Always true because display will trigger it.)
   * @private
   */
  dispatch_mousemove_event = function (evt, mouseEvent, path, count, x, y, display) {
    var node;
    while (count--) {
      node = path[count];
      if(node.__getBounds(display).contains(x, y)) {
        //point in bounds
        if (!node.__pointInBounds) {
          /* @type {boolean} */
          node.__pointInBounds = true;
          //dispatch events to node and up parent chain
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseover'));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseenter'));
          return true;
        }
        //while in-bounds, dispatch mousemove
        node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      } else {
        //point not on sprite
        if (node.__pointInBounds) {
          /* @type {boolean} */
          node.__pointInBounds = false;
          //dispatch events to node and up parent chain
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
          return true;
        }
      }
    }
  };

  (function () {
  /* not implemented
   */
  var dispatch_mousemove_event_IGNORELAYER = function (evt, mouseEvent, path, count, x, y,
                                                       display, layers, layer_count) {
    var node,
        evt_disp_p = false;
    
    while (count--) {
      if (count <= layer_count) {
        break;
      }
      node = path[count];

      if (node.__getBounds(display).contains(x, y)) {
        //point in bounds
        if (!node.__pointInBounds) {
          /* @type {boolean} */
          node.__pointInBounds = true;
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseover'));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseenter'));
          return true;
        }
        //while in-bounds, dispatch mousemove
        node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      } else {
        //point not on sprite
        if (node.__pointInBounds) {
          /* @type {boolean} */
          node.__pointInBounds = false;
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
          return true;
        }
      }
    }
    
    //no layers
    if (layer_count === 0) {
      if (!display.__pointInBounds) {
        display.__pointInBounds = true;
        display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
        display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
        return true;
      }
      //while in-bounds, dispatch mousemove
      display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
      return true;
    }
    
    //check layers, always in bounds
    while (layer_count--) {
      node = layers[layer_count];
      
      if (!node.__pointInBounds) {
        /* @type {boolean} */
        node.__pointInBounds = true;
        if (node.eventListeners.hasOwnProperty('mouseover')) {
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseover'));
          evt_disp_p = true;
        }
        if (node.eventListeners.hasOwnProperty('mouseenter')) {
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseenter'));
          evt_disp_p = true;
        }
        if (evt_disp_p) {
          return true;
        }
      }
      if (node.eventListeners.hasOwnProperty('mousemove')) {
        node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      }
    }

    //nuthin doin, dispatch from top layer to display
    node = layers[--count];
    if (!display.__pointInBounds) {
      display.__pointInBounds = true;
      if (display.eventListeners.hasOwnProperty('mouseover')) {
        node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseover'));
        evt_disp_p = true;
      }
      if (display.eventListeners.hasOwnProperty('mouseenter')) {
        node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseenter'));
        evt_disp_p = true;
      }
      if (evt_disp_p) {
        return true;
      }
    }
    //finally check mousemove
    if (display.eventListeners.hasOwnProperty('mousemove')) {
      node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
      return true;
    }

    return false;
  };
  }());

  /* Called when the mouse leaves the display element.
   * Dispatches 'mouseout' and 'mouseleave' to the display and resets
   * the __pointInBounds property for all nodes.
   *
   * @param {doodle.events.MouseEvent} evt DOM mouse event to copy properties from.
   * @param {doodle.events.MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
   * @param {Array} path Reference to the display's scene path.
   * @param {Array} layers Reference to display's children array.
   * @param {number} layer_count number of nodes in the layers array. Later reused to be node scene path count.
   * @param {Node} top_node Reference to the display object. Later reused to be the top layer.
   * @return {boolean} True on dispatch. (Always true because display will trigger it.)
   * @private
   */
  dispatch_mouseleave_event = function (evt, mouseEvent, path, layers, layer_count, top_node) {
    if (layer_count === 0) {
      //no layers so no scene path, display will dispatch
      /* @type {boolean} */
      top_node.__pointInBounds = false;
      top_node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
      top_node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
      return true;
    } else {
      //reusing var - this is the top layer
      top_node = layers[layer_count-1];
      //reusing var - scene path count
      layer_count = path.length;
      while (layer_count--) {
        //all nodes out-of-bounds
        /* @type {boolean} */
        path[layer_count].__pointInBounds = false;
      }
      //top layer dispatch
      top_node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
      top_node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
      return true;
    }
  };

  /* Called when the dom detects a keypress.
   * Doodle KeyboardEvent is reused by copying the dom event properties.
   * @param {doodle.events.Event} evt DOM keyboard event to copy properties from.
   * @return {boolean}
   * @private
   */
  dispatch_keyboard_event = function (evt, keyboardEvent, display) {
    display.broadcastEvent(keyboardEvent.__copyKeyboardEventProperties(evt, null));
    return true;
  };
  
}());//end class closure

/*
 * CLASS METHODS
 */

/**
 * Test if an object is a Display.
 * @name isDisplay
 * @param {Object} obj
 * @return {boolean} True if object is a Doodle Display.
 * @static
 */
doodle.Display.isDisplay = function (obj) {
  if (typeof obj === 'object') {
    while (obj) {
      if (obj.toString() === '[object Display]') {
        return true;
      } else {
        obj = Object.getPrototypeOf(obj);
      }
    }
  }
  return false;
};
/**
 * @name doodle.FontStyle
 * @class
 * @static
 */
Object.defineProperty(doodle, 'FontStyle', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name NORMAL
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'NORMAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'normal'
    },

    /**
     * @name ITALIC
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'ITALIC': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'italic'
    },

    /**
     * @name OBLIQUE
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'OBLIQUE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'oblique'
    }
  })
});
/**
 * @name doodle.FontVariant
 * @class
 * @static
 */
Object.defineProperty(doodle, 'FontVariant', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name NORMAL
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'NORMAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'normal'
    },

    /**
     * @name SMALL_CAPS
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'SMALL_CAPS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'small-caps'
    }
  })
});
/**
 * @name doodle.FontWeight
 * @class
 * @static
 */
Object.defineProperty(doodle, 'FontWeight', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name NORMAL
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'NORMAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'normal'
    },

    /**
     * @name BOLD
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'BOLD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'bold'
    },

    /**
     * @name BOLDER
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'BOLDER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'bolder'
    },

    /**
     * @name LIGHTER
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'LIGHTER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'lighter'
    }
  })
});
/**
 * @name doodle.TextAlign
 * @class
 * @static
 */
Object.defineProperty(doodle, 'TextAlign', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name START
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'START': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'start'
    },

    /**
     * @name END
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'END': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'end'
    },

    /**
     * @name LEFT
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'LEFT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'left'
    },

    /**
     * @name RIGHT
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'RIGHT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'right'
    },

    /**
     * @name CENTER
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'CENTER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'center'
    }
  })
});
/**
 * @name doodle.TextBaseline
 * @class
 * @static
 * @see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-textbaseline">context.textBaseline</a> [Canvas API]
 */
Object.defineProperty(doodle, 'TextBaseline', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * Let the anchor point's vertical position be the top of the em box of the first available font of the inline box.
     * @name TOP
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'TOP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'top'
    },

    /**
     * Let the anchor point's vertical position be half way between the bottom and the top of the em box of the first available font of the inline box.
     * @name MIDDLE
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'MIDDLE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'middle'
    },

    /**
     * Let the anchor point's vertical position be the bottom of the em box of the first available font of the inline box.
     * @name BOTTOM
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'BOTTOM': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'bottom'
    },

    /**
     * Let the anchor point's vertical position be the hanging baseline of the first available font of the inline box.
     * @name HANGING
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'HANGING': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'hanging'
    },

    /**
     * Let the anchor point's vertical position be the alphabetic baseline of the first available font of the inline box.
     * @name ALPHABETIC
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'ALPHABETIC': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'alphabetic'
    },

    /**
     * Let the anchor point's vertical position be the ideographic baseline of the first available font of the inline box.
     * @name IDEOGRAPHIC
     * @return {string} [read-only]
     * @property
     * @constant
     * @static
     */
    'IDEOGRAPHIC': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 'ideographic'
    }
  })
});
/*globals doodle*/

(function () {
  var text_sprite_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      reference_check = doodle.utils.debug.reference_check,
      /*END_DEBUG*/
      rgb_str_to_hex = doodle.utils.rgb_str_to_hex,
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      FontStyle = doodle.FontStyle,
      FontVariant = doodle.FontVariant,
      FontWeight = doodle.FontWeight,
      TextAlign = doodle.TextAlign,
      TextBaseline = doodle.TextBaseline;

  /**
   * A text sprite to display.
   * @name doodle.Text
   * @class
   * @augments doodle.Sprite
   * @param {string=} text Text to display.
   * @return {doodle.Text} A text object.
   * @throws {SyntaxError} Invalid parameters.
   * @throws {TypeError} Text argument not a string.
   */
  doodle.Text = function (text) {
    var text_sprite = Object.create(doodle.Sprite());

    Object.defineProperties(text_sprite, text_sprite_static_properties);
    //properties that require privacy
    Object.defineProperties(text_sprite, (function () {
      var $text = '',
          font_family = "sans-serif",
          font_size = 10,//px
          font_height = font_size,
          font_style = FontStyle.NORMAL,
          font_variant = FontVariant.NORMAL,
          font_weight = FontWeight.NORMAL,
          text_align = TextAlign.START,
          text_baseline = TextBaseline.ALPHABETIC,
          text_color = "#000000",
          text_strokecolor = "#000000",
          text_strokewidth = 1,
          text_bgcolor;

      /**
       * @name redraw
       * @private
       */
      function redraw () {
        //if not part of the scene graph we'll have to whip up a context
        var $ctx = text_sprite.context || document.createElement('canvas').getContext('2d'),
            sprite_width,
            sprite_height,
            graphics = text_sprite.graphics,
            extrema_minX = 0,
            extrema_maxX = 0,
            extrema_minY = 0,
            extrema_maxY = 0;
        
        //need to apply font style to measure width, but don't save it
        $ctx.save();
        $ctx.font = (font_style +' '+ font_variant +' '+ font_weight +' '+
                     font_size+"px" +' '+ font_family);
        sprite_width = $ctx.measureText($text).width;
        sprite_height = font_size;
        //estimate font height since there's no built-in functionality
        font_height = $ctx.measureText("m").width;
        $ctx.restore();

        //clears sprite dimensions and drawing commands
        text_sprite.graphics.clear();
        text_sprite.graphics.draw(function (ctx) {
          if (text_bgcolor) {
            ctx.fillStyle = text_bgcolor;
            ctx.fillRect(0, 0, sprite_width, sprite_height);
          }
          ctx.lineWidth = text_strokewidth; //why do i need to set this?
          ctx.textAlign = text_align;
          ctx.textBaseline = text_baseline;
          ctx.font = (font_style +' '+ font_variant +' '+ font_weight +' '+
                      font_size+"px" +' '+ font_family);
          if (text_color) {
            ctx.fillStyle = text_color;
            ctx.fillText($text, 0, 0);
          }
          if (text_strokecolor) {
            ctx.strokeStyle = text_strokecolor;
            ctx.strokeText($text, 0, 0);
          }
        });
        
        //assign sprite dimensions after graphics.clear()
        text_sprite.width = sprite_width;
        text_sprite.height = sprite_height;

        //calculate bounding box extrema
        switch (text_baseline) {
        case TextBaseline.TOP:
          extrema_minY = font_size - font_height;
          extrema_maxY = font_size;
          break;
        case TextBaseline.MIDDLE:
          extrema_minY = -font_height/2;
          extrema_maxY = font_height/2;
          break;
        case TextBaseline.BOTTOM:
          extrema_minY = -font_size;
          break;
        case TextBaseline.HANGING:
          extrema_minY = font_size - font_height;
          extrema_maxY = font_size;
          break;
        case TextBaseline.ALPHABETIC:
          extrema_minY = -font_height;
          break;
        case TextBaseline.IDEOGRAPHIC:
          extrema_minY = -font_size;
          break;
        }

        switch (text_align) {
        case TextAlign.START:
          break;
        case TextAlign.END:
          extrema_minX = -sprite_width;
          break;
        case TextAlign.LEFT:
          break;
        case TextAlign.RIGHT:
          extrema_minX = -sprite_width;
          break;
        case TextAlign.CENTER:
          extrema_minX = -sprite_width/2;
          break;
        }
        
        //set extrema for bounds
        graphics.__minX = extrema_minX;
        graphics.__maxX = extrema_maxX;
        graphics.__minY = extrema_minY;
        graphics.__maxY = extrema_maxY;
      }
      
      return {
        /**
         * @name text
         * @return {String}
         * @throws {TypeError}
         * @property
         */
        'text': {
          enumerable: true,
          configurable: false,
          get: function () { return $text; },
          set: function (textVar) {
            /*DEBUG*/
            type_check(textVar, 'string', {label:'Text.text', id:this.id});
            /*END_DEBUG*/
            $text = textVar;
            redraw();
          }
        },

        /**
         * @name font
         * @return {String}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @throws {ReferenceError}
         * @property
         */
        'font': {
          enumerable: true,
          configurable: false,
          get: function () {
            return (font_style +' '+ font_variant +' '+ font_weight +' '+ font_size+"px" +' '+ font_family);
          },
          set: function (fontVars) {
            var len;
            /*DEBUG*/
            type_check(fontVars, 'string', {label:'Text.font', id:this.id});
            /*END_DEBUG*/
            //parse elements from string
            fontVars = fontVars.split(' ');
            len = fontVars.length;
            /*DEBUG*/
            if (len < 2 || len > 5) {
              throw new SyntaxError(this+".font: Invalid font string.");
            }
            /*END_DEBUG*/
            //fill in unspecified values with defaults
            if (len === 2) {
              fontVars.unshift(FontStyle.NORMAL, FontVariant.NORMAL, FontWeight.NORMAL);
            } else if (len === 3) {
              fontVars.splice(1, 0, FontVariant.NORMAL, FontWeight.NORMAL);
            } else if (len === 4) {
              fontVars.splice(1, 0, FontVariant.NORMAL);
            }
            /*DEBUG*/
            if (fontVars.length !== 5) {
              throw new ReferenceError(this+".font::fontArgs: Unable to parse font string.");
            }
            /*END_DEBUG*/
            text_sprite.fontStyle = fontVars[0];
            text_sprite.fontVariant = fontVars[1];
            text_sprite.fontWeight = fontVars[2];
            text_sprite.fontSize = fontVars[3];
            text_sprite.fontFamily = fontVars[4];
          }
        },

        /**
         * @name fontFamily
         * @return {String}
         * @throws {TypeError}
         * @property
         */
        'fontFamily': {
          enumerable: true,
          configurable: false,
          get: function () { return font_family; },
          set: function (fontFamilyVar) {
            /*DEBUG*/
            type_check(fontFamilyVar, 'string', {label:'Text.fontFamily', id:this.id});
            /*END_DEBUG*/
            font_family = fontFamilyVar;
            redraw();
          }
        },

        /**
         * @name fontSize
         * @return {Number} In pixels.
         * @throws {TypeError}
         * @property
         */
        'fontSize': {
          enumerable: true,
          configurable: false,
          get: function () { return font_size; },
          set: function (fontSizeVar) {
            if (typeof fontSizeVar === 'string') {
              fontSizeVar = parseInt(fontSizeVar, 10);
            }
            /*DEBUG*/
            type_check(fontSizeVar,'number', {label:'Text.fontSize', id:this.id});
            /*END_DEBUG*/
            font_size = fontSizeVar;
            redraw();
          }
        },

        /**
         * @name fontStyle
         * @return {FontStyle}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'fontStyle': {
          enumerable: true,
          configurable: false,
          get: function () { return font_style; },
          set: function (fontStyleVar) {
            /*DEBUG*/
            type_check(fontStyleVar,'string', {label:'Text.fontStyle', id:this.id});
            reference_check(fontStyleVar === FontStyle.NORMAL || fontStyleVar === FontStyle.ITALIC || fontStyleVar === FontStyle.OBLIQUE,
                            {label:'Text.fontStyle', id:this.id, message:"Invalid FontStyle property"});
            /*END_DEBUG*/
            font_style = fontStyleVar;
            redraw();
          }
        },

        /**
         * @name fontVariant
         * @return {FontVariant}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'fontVariant': {
          enumerable: true,
          configurable: false,
          get: function () { return font_variant; },
          set: function (fontVariantVar) {
            /*DEBUG*/
            type_check(fontVariantVar,'string', {label:'Text.fontVariant', id:this.id});
            reference_check(fontVariantVar === FontVariant.NORMAL || fontVariantVar === FontVariant.SMALL_CAPS,
                            {label:'Text.fontVariant', id:this.id, message:"Invalid FontVariant property"});
            /*END_DEBUG*/
            font_variant = fontVariantVar;
            redraw();
          }
        },

        /**
         * @name fontWeight
         * @return {FontWeight}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'fontWeight': {
          enumerable: true,
          configurable: false,
          get: function () { return font_weight; },
          set: function (fontWeightVar) {
            /*DEBUG*/
            if (typeof fontWeightVar === 'string') {
              reference_check(fontWeightVar === FontWeight.NORMAL || fontWeightVar === FontVariant.BOLD || fontWeightVar === FontVariant.BOLDER || fontWeightVar === FontVariant.LIGHTER,
                              {label:'Text.fontWeight', id:this.id, message:"Invalid FontWeight property"});
            } else if (typeof fontWeightVar === 'number') {
              range_check(fontWeightVar === 100 || fontWeightVar === 200 ||
                          fontWeightVar === 300 || fontWeightVar === 400 ||
                          fontWeightVar === 500 || fontWeightVar === 600 ||
                          fontWeightVar === 700 || fontWeightVar === 800 ||
                          fontWeightVar === 900, {label:'Text.fontWeight', id:this.id, message:"Invalid font weight."});
            } else {
              throw new RangeError(this.id + " Text.fontWeight(weight): Invalid font weight.");
            }
            /*END_DEBUG*/
            font_weight = fontWeightVar;
            redraw();
          }
        },

        /**
         * @name align
         * @return {TextAlign}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'align': {
          enumerable: true,
          configurable: false,
          get: function () { return text_align; },
          set: function (alignVar) {
            /*DEBUG*/
            type_check(alignVar,'string', {label:'Text.align', id:this.id});
            reference_check(alignVar === TextAlign.START || alignVar === TextAlign.END || alignVar === TextAlign.LEFT || alignVar === TextAlign.RIGHT || alignVar === TextAlign.CENTER,
                            {label:'Text.align', id:this.id, message:"Invalid TextAlign property."});
            /*END_DEBUG*/
            text_align = alignVar;
            redraw();
          }
        },

        /**
         * @name baseline
         * @return {TextBaseline}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'baseline': {
          enumerable: true,
          configurable: false,
          get: function () { return text_baseline; },
          set: function (baselineVar) {
            /*DEBUG*/
            type_check(baselineVar,'string', {label:'Text.baseline', id:this.id});
            reference_check(baselineVar === TextBaseline.TOP || baselineVar === TextBaseline.MIDDLE || baselineVar === TextBaseline.BOTTOM || baselineVar === TextBaseline.HANGING || baselineVar === TextBaseline.ALPHABETIC || baselineVar === TextBaseline.IDEOGRAPHIC,
                            {label:'Text.baseline', id:this.id, message:"Invalid TextBaseline property."});
            /*END_DEBUG*/
            text_baseline = baselineVar;
            redraw();
          }
        },

        /**
         * @name strokeWidth
         * @return {Number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'strokeWidth': {
          enumerable: true,
          configurable: false,
          get: function () { return text_strokewidth; },
          set: function (widthVar) {
            /*DEBUG*/
            type_check(widthVar,'number', {label:'Text.strokeWidth', id:this.id});
            range_check(widthVar > 0, {label:'Text.strokeWidth', id:this.id, message:"Stroke width must be greater than zero."});
            /*END_DEBUG*/
            text_strokewidth = widthVar;
          }
        },

        /**
         * @name color
         * @return {Color}
         * @throws {TypeError}
         * @property
         */
        'color': {
          enumerable: true,
          configurable: false,
          get: function () { return text_color; },
          set: function (color) {
            if (typeof color === 'number') {
              color = hex_to_rgb_str(color);
            }
            /*DEBUG*/
            if (color !== null && color !== false) {
              type_check(color,'string', {label:'Text.color', id:this.id});
            }
            /*END_DEBUG*/
            text_color = color;
          }
        },

        /**
         * @name strokeColor
         * @return {Color}
         * @throws {TypeError}
         * @property
         */
        'strokeColor': {
          enumerable: true,
          configurable: false,
          get: function () { return text_strokecolor; },
          set: function (color) {
            if (typeof color === 'number') {
              color = hex_to_rgb_str(color);
            }
            /*DEBUG*/
            if (color !== null && color !== false) {
              type_check(color,'string', {label:'Text.strokeColor', id:this.id});
            }
            /*END_DEBUG*/
            text_strokecolor = color;
          }
        },

        /**
         * @name backgroundColor
         * @return {Color}
         * @throws {TypeError}
         * @property
         */
        'backgroundColor': {
          enumerable: true,
          configurable: false,
          get: function () { return text_bgcolor; },
          set: function (color) {
            if (typeof color === 'number') {
              color = hex_to_rgb_str(color);
            }
            /*DEBUG*/
            if (color !== null && color !== false) {
              type_check(color,'string', {label:'Text.backgroundColor', id:this.id});
            }
            /*END_DEBUG*/
            text_bgcolor = color;
          }
        }
        
      };
    }()));
    
    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function or text string
      if (typeof arguments[0] === 'function') {
        arguments[0].call(text_sprite);
        text = undefined;
      } else {
        /*DEBUG*/
        type_check(text,'string', {label:'Text', id:this.id, message:"Invalid initialization."});
        /*END_DEBUG*/
        text_sprite.text = text;
      }
      break;
    default:
      /*DEBUG*/
      throw new SyntaxError("[object Text](text): Invalid number of parameters.");
      /*END_DEBUG*/
    }
    
    return text_sprite;
  };

  
  text_sprite_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () { return "[object Text]"; }
    }
  };

}());//end class closure
/*globals doodle, Image*/

(function () {
  var image_sprite_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      get_element = doodle.utils.get_element,
      doodle_Event = doodle.events.Event,
      Event_LOAD = doodle.events.Event.LOAD,
      Event_CHANGE = doodle.events.Event.CHANGE;

  /**
   * A image sprite to display.
   * @name doodle.Image
   * @class
   * @augments doodle.Sprite
   * @param {string=} imageSrc Image element or url.
   * @return {doodle.Image} A text object.
   * @throws {SyntaxError} Invalid parameters.
   * @throws {TypeError} Text argument not a string.
   */
  doodle.Image = function (imageSrc) {
    var image_sprite = Object.create(doodle.Sprite());

    Object.defineProperties(image_sprite, image_sprite_static_properties);
    //properties that require privacy
    Object.defineProperties(image_sprite, (function () {
      var img_element = null;

      function add_image_element (img) {
        img_element = img;
        if (img_element.id !== '') {
          /*DEBUG*/
          console.assert(typeof img_element.id === 'string', "img_element.id is a string", img_element.id);
          /*END_DEBUG*/
          image_sprite.id = img_element.id;
        }
        image_sprite.width = img_element.width;
        image_sprite.height = img_element.height;
        image_sprite.graphics.draw(function (ctx) {
          ctx.drawImage(img_element, 0, 0);
        });
        image_sprite.dispatchEvent(doodle_Event(Event_LOAD));
      }

      function remove_image_element () {
        if (img_element !== null) {
          img_element = null;
          image_sprite.graphics.clear();
          image_sprite.dispatchEvent(doodle_Event(Event_CHANGE));
        }
      }
      
      function load_image (img_elem) {
        var image = get_element(img_elem);
        //element id
        if (typeof img_elem === 'string') {
          image_sprite.id = img_elem;
        }
        /*DEBUG*/
        if (!image || (image && image.tagName !== 'IMG')) {
          throw new TypeError(this+"::load_image(*img_elem*): Parameter must be an image object, or element id.");
        }
        /*END_DEBUG*/

        //check if image has already been loaded
        if (image.complete) {
          add_image_element(image);
        } else {
          //if not, assign load handlers
          image.onload = function () {
            add_image_element(image);
          };
          image.onerror = function () {
            throw new URIError('[object Image](imageSrc): Unable to load ' + image.src);
          };
          image.onabort = function () {
            throw new URIError('[object Image](imageSrc): Unable to load ' + image.src);
          };
        }
      }
      
      return {
        /**
         * @name element
         * @return {HTMLImageElement}
         * @throws {TypeError}
         * @throws {URIError}
         * @property
         */
        'element': {
          enumerable: true,
          configurable: false,
          get: function () { return img_element; },
          set: function (imageVar) {
            if (imageVar === null || imageVar === false) {
              remove_image_element();
            } else {
              load_image(imageVar);
            }
          }
        },
        
        /**
         * @name src
         * @return {string}
         * @throws {TypeError}
         * @throws {URIError}
         * @property
         */
        'src': {
          enumerable: true,
          configurable: false,
          get: function () { return (img_element === null) ? null : img_element.src; },
          set: function (srcVar) {
            if (srcVar === null || srcVar === false) {
              remove_image_element();
            } else {
              /*DEBUG*/
              type_check(srcVar, 'string', {label:'Image.id', id:this.id});
              /*END_DEBUG*/
              var image = new Image();
              image.src = encodeURI(srcVar);
              load_image(image);
            }
          }
        }
        
      };
    }()));//end defineProperties

    
    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function or text string
      if (typeof arguments[0] === 'function') {
        arguments[0].call(image_sprite);
        imageSrc = undefined;
      } else {
        //constructor param can be an image element or url
        if (typeof imageSrc !== 'string') {
          image_sprite.element = imageSrc;
        } else if (typeof imageSrc === 'string' && imageSrc[0] === '#') {
          image_sprite.element = imageSrc;
        } else {
          image_sprite.src = imageSrc;
        }
      }
      break;
    default:
      /*DEBUG*/
      throw new SyntaxError("[object Image](imageSrc): Invalid number of parameters.");
      /*END_DEBUG*/
    }
    
    return image_sprite;
  };

  
  image_sprite_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Image]";
      }
    }
  };

}());//end class closure
