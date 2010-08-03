/* Intro
 *
 */

//just in case this gets implemented
"use strict";
//the global object
var doodle = {};
//packages
doodle.geom = {};

//for testing purposes
//var canvas = document.getElementById("my_display");
//var context = canvas.getContext('2d');

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

  

  /* also contains:
   * check_point_type
   * check_matrix_type
   * check_rect_type
   * These can't be added to utils.types until they're created.
   */
  doodle.utils.types = {
    //checks n, or all elements if n is an array
    check_number_type: function (n, caller_name) {
      var i;
      if (typeof n === "number") {
        return true;
      } else if (i = n.length) {
        //given array, or semi-array
        while ((i -= 1) >= 0) {
          if (typeof n[i] !== "number") {
            caller_name = (caller_name === undefined) ? "check_number_type" : caller_name;
            throw new TypeError(caller_name + ": Parameter must be a number.");
          }
        }
        return true;
      } else {
        caller_name = (caller_name === undefined) ? "check_number_type" : caller_name;
        throw new TypeError(caller_name + ": Parameter must be a number.");
      }
    },

    check_boolean_type: function (bool, caller_name) {
      if (typeof bool === "boolean") {
        return true;
      } else {
        caller_name = (caller_name === undefined) ? "check_boolean_type" : caller_name;
        throw new TypeError(caller_name + ": Parameter must be a boolean.");
      }
    },

    check_string_type: function (str, caller_name) {
      if (typeof str === "string") {
        return true;
      } else {
        caller_name = (caller_name === undefined) ? "check_string_type" : caller_name;
        throw new TypeError(caller_name + ": Parameter must be a string.");
      }
    },

    check_function_type: function (fn, caller_name) {
      if (typeof fn === "function") {
        return true;
      } else {
        caller_name = (caller_name === undefined) ? "check_function_type" : caller_name;
        throw new TypeError(caller_name + ": Parameter must be a function.");
      }
    },

    check_event_type: function (evt, caller_name) {
      if (evt && (evt.toString() === "[object Event]" ||
									evt.toString() === "[object MouseEvent]")) {
        return true;
      } else {
        caller_name = (caller_name === undefined) ? "check_event_type" : caller_name;
        throw new TypeError(caller_name + ": Parameter must be an event.");
      }
    },

    check_canvas_type: function (canvas, caller_name) {
      if (canvas && canvas.toString() === "[object HTMLCanvasElement]") {
        return true;
      } else {
        caller_name = (caller_name === undefined) ? "check_canvas_type" : caller_name;
        throw new TypeError(caller_name + ": Parameter must be an canvas element.");
      }
    },

    check_context_type: function (ctx, caller_name) {
      if (ctx && ctx.toString() === "[object CanvasRenderingContext2D]") {
        return true;
      } else {
        caller_name = (caller_name === undefined) ? "check_context_type" : caller_name;
        throw new TypeError(caller_name + ": Parameter must be an canvas context.");
      }
    },

    check_block_element: function (element, caller_name) {
      if (get_style_property(element, 'display') === "block") {
        return true;
      } else {
        caller_name = (caller_name === undefined) ? "check_block_element" : caller_name;
        throw new TypeError(caller_name + ": HTML element must have display: block.");
      }
    }
    
  };


  /* Returns HTML element from id name or element itself.
   */
  doodle.utils.get_element = function (id, caller_name) {
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
      caller_name = (caller_name === undefined) ? "get_element" : caller_name;
      throw new ReferenceError(caller_name + ": Unable to get HTML element: " + id);
    }
    return element;
  };

}());

/* Will propbably want to implement the dom event interface:
 * http://www.w3.org/TR/DOM-Level-3-Events/
 * But this works for now.
 */

(function () {
  var event_prototype = {},
      event_properties,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type;
  
  /* Super constructor
   * @param {Function} initializer
   * @return {Object}
   */
  doodle.Event = function (type, bubbles, cancelable) {
    var arg_len = arguments.length,
        initializer,
        event = Object.create(event_prototype), //doodle event
        //generate dom event that we'll copy values from - mouseevent
        //event_temp = document.createEvent('Event'),
        //read-only event properties
        e_type,
        e_bubbles,
        e_cancelable,
        e_cancel = false, //internal use
        e_cancelNow = false, //internal use
        e_cancelBubble = false,
        e_defaultPrevented = false,
        e_eventPhase = 0,
        e_target = null,
        e_currentTarget = null,
        e_timeStamp = new Date(),
        e_clipboardData,
        e_srcElement = null;
    
    
    
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
    } else if (arg_len > 3) {
      throw new SyntaxError("[object Event]: Invalid number of parameters.");
    } else {
      //parameter defaults
      bubbles = bubbles === true; //false
      cancelable = cancelable === true; //false
    }


    Object.defineProperties(event, event_properties);
    //properties that require privacy
    Object.defineProperties(event, {
      /*
       * PROPERTIES
       */

      'bubbles': {
        enumerable: true,
        configurable: false,
        get: function () { return e_bubbles; }
      },

      'cancelBubble': {
        enumerable: true,
        configurable: false,
        get: function () { return e_cancelBubble; },
        set: function (cancelp) {
          check_boolean_type(cancelp, this+'.cancelBubble');
          e_cancelBubble = cancelp;
        }
      },

      'cancelable': {
        enumerable: true,
        configurable: false,
        get: function () { return e_cancelable; }
      },

      //test if event propagation should stop after this node
      //@internal
      '__cancel': {
        enumerable: false,
        configurable: false,
        get: function () { return e_cancel; }
      },

      //test if event propagation should stop immediately,
      //ignore other handlers on this node
      //@internal
      '__cancelNow': {
        enumerable: false,
        configurable: false,
        get: function () { return e_cancelNow; }
      },

      'currentTarget': {
        enumerable: true,
        configurable: false,
        get: function () { return e_currentTarget; }
      },

      //currentTarget is read-only, but damnit I need to set it sometimes
      '__setCurrentTarget': {
        enumerable: false,
        value: function (target) {
          e_currentTarget = target;
        }
      },

      'target': {
        enumerable: true,
        configurable: false,
        get: function () { return e_target; }
      },

      '__setTarget': {
        enumerable: false,
        value: function (target) {
          e_target = target;
        }
      },

      'eventPhase': {
        enumerable: true,
        configurable: false,
        get: function () { return e_eventPhase; }
      },
      
      '__setEventPhase': {
        enumerable: false,
        value: function (phase) {
          check_number_type(phase);
          e_eventPhase = phase;
        }
      },

      'srcElement': {
        enumerable: true,
        configurable: false,
        get: function () { return e_srcElement; }
      },

      'timeStamp': {
        enumerable: true,
        configurable: false,
        get: function () { return e_timeStamp; }
      },

      'type': {
        enumerable: true,
        configurable: false,
        get: function () { return e_type; }
      },
      
      /*
       * METHODS
       */

      'initEvent': {
        enumerable: true,
        configurable: false,
        value: function (type, bubbles, cancelable) {
          bubbles = bubbles || false;
          cancelable = cancelable || false;
          check_string_type(type, this+'.initEvent');
          check_boolean_type(bubbles, this+'.initEvent');
          check_boolean_type(cancelable, this+'.initEvent');
          e_type = type;
          e_bubbles = bubbles;
          e_cancelable = cancelable;
        }
      },

      'preventDefault': {
        enumerable: true,
        configurable: false,
        value: function () {
          e_defaultPrevented = true;
        },
      },

      'stopPropagation': {
        enumerable: true,
        configurable: false,
        value: function () {
          if (!this.cancelable) {
            throw new Error(this+'.stopPropagation: Event can not be cancelled.');
          } else {
            e_cancel = true;
          }
        }
      },

      'stopImmediatePropagation': {
        enumerable: true,
        configurable: false,
        value: function () {
          if (!this.cancelable) {
            throw new Error(this+'.stopImmediatePropagation: Event can not be cancelled.');
          } else {
            e_cancel = true;
            e_cancelNow = true;
          }
        }
      }
    });


    //init event

    //needed for mouseevent
    /*for (var attr in event_temp) {
      if (event_temp.hasOwnProperty(attr)) {
        event[attr] = event_temp[attr];
      }
    }*/
    
    event.initEvent(type, bubbles, cancelable);
    
    return event;
  };


  (function () {

    var dom_event_proto = Object.getPrototypeOf(document.createEvent('Event'));

    //copy event property constants, will add my own methods later
    for (var prop in dom_event_proto) {
      if (typeof dom_event_proto[prop] !== 'function') {
        event_prototype[prop] = dom_event_proto[prop];
      }
    }


    
    event_properties = {

      'returnValue': {
        enumerable: true,
        writable: true,
        configurable: false,
        value: true
      },

      'toString': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function () {
          return "[object Event]";
        }
      }
      
    };//end event_properties
  }());

  

  //constants
  Object.defineProperties(doodle.Event, {

    'ENTER_FRAME': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "enterFrame"
    }
    
  });

  


  


  doodle.MouseEvent = function (type, bubbles, cancelable) {
    var arg_len = arguments.length,
        initializer,
        event;
    
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
    } else if (arg_len > 3) {
      throw new SyntaxError("[object MouseEvent]: Invalid number of parameters.");
    } else {
      //parameter defaults
      check_string_type(type); //required
      bubbles = bubbles === true; //false
      cancelable = cancelable === true; //false
    }
    
    event = document.createEvent("MouseEvent");
    event.initEvent(type, bubbles, cancelable);
    
    return event;
  };


  //constants
  //more need to be added
  Object.defineProperties(doodle.MouseEvent, {

    'CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "click"
    },

    'DOUBLE_CLICK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "doubleClick"
    },

    'MOUSE_DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseDown"
    },

    'MOUSE_MOVE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: "mouseMove"
    }
    
  });

  
}());//end class closure

(function () {
  var point_properties,
      check_number_type = doodle.utils.types.check_number_type,
      isPoint;
  
  /* Super constructor
   * @param {Number|Array|Point|Function} (x,y)|initializer
   * @return {Object}
   */
  doodle.geom.Point = function (x, y) {
    var arg_len = arguments.length,
        initializer,
        point = {};
		
		//check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
			x = undefined;
    } else if (arg_len > 2) {
			throw new SyntaxError("[object Point]: Invalid number of parameters.");
		}

    Object.defineProperties(point, point_properties);
    //properties that require privacy
    Object.defineProperties(point, {
      /* The horizontal coordinate of the point.
       * @param {Number} x
       */
      'x': {
        enumerable: true,
        configurable: false,
        get: function () { return x; },
        set: function (n) {
          if (check_number_type(n, this+'.x')) {
            x = n;
          }
        }
      },

      /* The vertical coordinate of the point.
       * @param {Number} y
       */
      'y': {
        enumerable: true,
        configurable: false,
        get: function () { return y; },
        set: function (n) {
          if (check_number_type(n, this+'.y')) {
            y = n;
          }
        }
      }
    });

    //passed an initialization object: array/point/function
    if (initializer) {
      if (typeof initializer === 'function') {
        point.compose(0, 0);
        initializer.call(point);
      } else if (Array.isArray(initializer) && initializer.length === 2) {
        point.compose.apply(point, initializer);
      } else if (isPoint(initializer)) {
        point.compose(initializer.x, initializer.y);
      } else {
        throw new SyntaxError(this+": Passed an invalid initializer object.");
      }
    } else {
      //initialize based on parameter count
      switch (arg_len) {
      case 0:
        point.compose(0, 0);
        break;
      case 2:
        point.compose(x, y);
        break;
      default:
        throw new SyntaxError(this+": Invalid number of parameters.");
      }
    }

    return point;
  };


  /* Check if a given object contains a numeric x and y property.
   * Does not check if a point is actually a doodle.geom.point.
   * @param {Point} point Object with x and y numeric parameters.
   * @param {String} fn_name Function name to show in TypeError message.
   * @return {Boolean}
   */
  isPoint = doodle.geom.Point.isPoint = function (pt) {
    return (typeof pt.x === "number" && typeof pt.y === "number");
  }

  doodle.utils.types.check_point_type = function (pt, caller_name) {
    if (!isPoint(pt)) {
			caller_name = (caller_name === undefined) ? "check_point_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a point.");
    } else {
      return true;
    }
  };
    
  
  (function () {
    //avoid lookups
    var Point = doodle.geom.Point,
        check_point_type = doodle.utils.types.check_point_type;

    point_properties = {
      /* The length of the line segment from (0,0) to this point.
       * @return {Number}
       */
      'length': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.distance({x:0,y:0}, this);
        }
      },

      /*
       * METHODS
       */
      
      /* Set point coordinates.
       * @param {Number} x
       * @param {Number} y
       * @return {Point}
       */
      'compose': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          if (check_number_type(arguments, this+'.compose')) {
            this.x = x;
            this.y = y;
            return this;
          }
        }
      },

      /* Creates a copy of this Point object.
       * @return {Point}
       */
      'clone': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return Point(this.x, this.y);
        }
      },

      /* Returns an array that contains the values of the x and y coordinates.
       * @return {Array}
       */
      'toArray': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          var a = new Array(2);
          a[0] = this.x;
          a[1] = this.y;
          return a;
        }
      },
      
      /* Returns a string that contains the values of the x and y coordinates.
       * @return {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "(x=" + this.x + ", y=" + this.y + ")";
        }
      },

      /* Returns the distance between pt1 and pt2.
       * @return {Number}
       */
      'distance': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt1, pt2) {
          if (check_point_type(pt1, this+'.distance') &&
              check_point_type(pt2, this+'.distance')) {
            var dx = pt2.x - pt1.x,
                dy = pt2.y - pt1.x;
            return Math.sqrt(dx*dx+dy*dy);
          }
        }
      },

      /* Scales the line segment between (0,0) and the
       * current point to a set length.
       * @param {Number} thickness The scaling value.
       * @return {Point}
       */
      'normalize': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (thickness) {
          if (check_number_type(thickness, this+'.normalize')) {
            var len = this.length;
            this.x = (this.x / len) * thickness;
            this.y = (this.y / len) * thickness;
            return this;
            /*correct version?
              var angle:Number = Math.atan2(this.y, this.x);
              this.x = Math.cos(angle) * thickness;
              this.y = Math.sin(angle) * thickness;
            */
          }
        }
      },

      /* Determines whether two points are equal.
       * @param {Point} pt The point to be compared.
       * @return {Boolean}
       */
      'equals': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          if (check_point_type(pt, this+'.equals')) {
            return ((this && point &&
                     this.x === pt.x &&
                     this.y === pt.y) ||
                    (!this && !pt));
          }
        }
      },

      /* Determines a point between two specified points.
       * @static
       * @param {Point} pt1 The first point.
       * @param {Point} pt2 The second point.
       * @param {Number} t The level of interpolation between the two points, between 0 and 1.
       * @return {Point}
       */
      'interpolate': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt1, pt2, t) {
          if (check_point_type(pt1, this+'.interpolate') &&
              check_point_type(pt2, this+'.interpolate') &&
              check_number_type(t, this+'.interpolate')) {
            var x = pt1.x + (pt2.x - pt1.x) * t,
                y = pt1.y + (pt2.y - pt1.y) * t;
            return Point(x, y);

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
        }
      },

      /* Converts a pair of polar coordinates to a Cartesian point coordinate.
       * @static
       * @param {Number} len The length coordinate of the polar pair.
       * @param {Number} angle The angle, in radians, of the polar pair.
       * @return {Point}
       */
      'polar': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (len, angle) {
          if (check_number_type(arguments, this+'.polar')) {
            var x = len * Math.cos(angle),
                y = len * Math.sin(angle);
            return Point(x, y);
          }
        }
      },

      /* Adds the coordinates of another point to the coordinates of
       * this point to create a new point.
       * @param {Point} pt The point to be added.
       * @return {Point} The new point.
       */
      'add': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          if (check_point_type(pt, this+'.add')) {
            var x = this.x + pt.x,
                y = this.y + pt.y;
            return Point(x, y);
          }
        }
      },

      /* Subtracts the coordinates of another point from the
       * coordinates of this point to create a new point.
       * @param {Point} pt The point to be subtracted.
       * @return {Point} The new point.
       */
      'subtract': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          if (check_point_type(pt, this+'.subtract')) {
            var x = this.x - pt.x,
                y = this.y - pt.y;
            return Point(x, y);
          }
        }
      },

      'offset': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (dx, dy) {
          if (check_number_type(arguments, this+'.offset')) {
            this.x += dx;
            this.y += dy;
          }
          return this;
        }
      }
    };//end point properties definition
  }());

}());//end class closure

(function () {
  var matrix_properties,
      check_number_type = doodle.utils.types.check_number_type,
      isMatrix;
  
  /* Super constructor
   * @param {Number|Array|Matrix|Function} (a, b, c, d, tx, ty)|initializer
   * @return {Object}
   */
  doodle.geom.Matrix = function (a, b, c, d, tx, ty) {
    var arg_len = arguments.length,
        initializer,
        matrix = {};

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
      a = undefined;
    } else if (arg_len > 6) {
      throw new SyntaxError("[object Matrix]: Invalid number of parameters.");
    }

    
    Object.defineProperties(matrix, matrix_properties);
    //properties that require privacy
    Object.defineProperties(matrix, {

      /* The value that affects the positioning of pixels along the x axis
       * when scaling or rotating an image.
       * @param {Number} a
       */
      'a': {
        enumerable: true,
        configurable: false,
        get: function () { return a; },
        set: function (n) {
          check_number_type(n, this+'.a');
          a = n;
        }
      },

      /* The value that affects the positioning of pixels along the y axis
       * when rotating or skewing an image.
       * @param {Number} b
       */
      'b': {
        enumerable: true,
        configurable: false,
        get: function () { return b; },
        set: function (n) {
          check_number_type(n, this+'.b');
          b = n;
        }
      },

      /* The value that affects the positioning of pixels along the x axis
       * when rotating or skewing an image.
       * @param {Number} c
       */
      'c': {
        enumerable: true,
        configurable: false,
        get: function () { return c; },
        set: function (n) {
          check_number_type(n, this+'.c');
          c = n;
        }
      },

      /* The value that affects the positioning of pixels along the y axis
       * when scaling or rotating an image.
       * @param {Number} d
       */
      'd': {
        enumerable: true,
        configurable: false,
        get: function () { return d; },
        set: function (n) {
          check_number_type(n, this+'.d');
          d = n;
        }
      },

      /* The distance by which to translate each point along the x axis.
       * @param {Number} tx
       */
      'tx': {
        enumerable: true,
        configurable: false,
        get: function () { return tx; },
        set: function (n) {
          check_number_type(n, this+'.tx');
          tx = n;
        }
      },

      /* The distance by which to translate each point along the y axis.
       * @param {Number} ty
       */
      'ty': {
        enumerable: true,
        configurable: false,
        get: function () { return ty; },
        set: function (n) {
          check_number_type(n, this+'.ty');
          ty = n;
        }
      }
    });
    
    //passed an initialization object: array/matrix/function
    if (initializer) {
      if (typeof initializer === 'function') {
        matrix.identity();
        initializer.call(matrix);
      } else if (Array.isArray(initializer) && initializer.length === 6) {
        matrix.compose.apply(matrix, initializer);
      } else if (isMatrix(initializer)) {
        matrix.compose(initializer.a, initializer.b, initializer.c,
                       initializer.d, initializer.tx, initializer.ty);
      } else {
        throw new SyntaxError("[object Matrix]: Passed an invalid initializer object.");
      }
    } else {
      //initialize based on parameter count
      switch (arg_len) {
      case 0:
        matrix.identity();
        break;
      case 6:
        matrix.compose(a, b, c, d, tx, ty);
        break;
      default:
        throw new SyntaxError("[object Matrix]: Invalid number of parameters.");
      }
    }
    
    return matrix;
  };

  /* Check if a given object contains a numeric matrix properties.
   * Does not check if a matrix is actually a doodle.geom.matrix.
   * @param {Matrix} m Object with numeric matrix parameters.
   * @return {Boolean}
   */
  isMatrix = doodle.geom.Matrix.isMatrix = function (m) {
    return (typeof m.a  === "number" && typeof m.b  === "number" &&
            typeof m.c  === "number" && typeof m.d  === "number" &&
            typeof m.tx === "number" && typeof m.ty === "number");
  };

  doodle.utils.types.check_matrix_type = function (m, caller_name) {
    if (!isMatrix(m)) {
      caller_name = (caller_name === undefined) ? "check_matrix_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a matrix.");
    } else {
      return true;
    }
  };

  
  (function () {
    //avoid lookups
    var Matrix = doodle.geom.Matrix,
        Point = doodle.geom.Point,
        check_matrix_type = doodle.utils.types.check_matrix_type,
        check_point_type = doodle.utils.types.check_point_type,
        sin = Math.sin,
        cos = Math.cos,
        atan2 = Math.atan2,
        tan = Math.tan;
      
    matrix_properties = {
      /*
       * METHODS
       */

      /* Set values of this matrix with the specified parameters.
       * @param {Number} a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
       * @param {Number} b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
       * @param {Number} c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
       * @param {Number} d The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
       * @param {Number} tx The distance by which to translate each point along the x axis.
       * @param {Number} ty The distance by which to translate each point along the y axis.
       * @return {Matrix}
       */
      'compose': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (a, b, c, d, tx, ty) {
          check_number_type(arguments, this+'.compose');
          this.a  = a;
          this.b  = b;
          this.c  = c;
          this.d  = d;
          this.tx = tx;
          this.ty = ty;
          return this;
        }
      },
      
      /* Returns an array value containing the properties of the Matrix object.
       * @return {Array}
       */
      'toArray': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          var a = new Array(6);
              a[0] = this.a;
              a[1] = this.b;
              a[2] = this.c;
              a[3] = this.d;
              a[4] = this.tx;
              a[5] = this.ty;
          return a;
        }
      },
      
      /* Returns a text value listing the properties of the Matrix object.
       * @return {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return ("(a="+ this.a +", b="+ this.b +", c="+ this.c +
                  ", d="+ this.d +", tx="+ this.tx +", ty="+ this.ty +")");
        }
      },

      /* Test if matrix is equal to this one.
       * @param {Matrix} m
       * @return {Boolean}
       */
      'equals': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (m) {
          check_matrix_type(m, this+'.equals');
          return ((this && m && 
                   this.a  === m.a &&
                   this.b  === m.b &&
                   this.c  === m.c &&
                   this.d  === m.d &&
                   this.tx === m.tx &&
                   this.ty === m.ty) || 
                  (!this && !m));
        }
      },

      /* Sets each matrix property to a value that causes a null transformation.
       * @return {Matrix}
       */
      'identity': {
        enumerable: false,
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

      /* Returns a new Matrix object that is a clone of this matrix,
       * with an exact copy of the contained object.
       * @return {Matrix}
       */
      'clone': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        }
      },

      /* Multiplies a matrix with the current matrix,
       * effectively combining the geometric effects of the two.
       * @param {Matrix} m The matrix to be concatenated to the source matrix.
       * @return {Matrix}
       */
      'multiply': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (m) {
          check_matrix_type(m, this+'.multiply');
          
          var a  = this.a * m.a  + this.c * m.b,
              b  = this.b * m.a  + this.d * m.b,
              c  = this.a * m.c  + this.c * m.d,
              d  = this.b * m.c  + this.d * m.d,
              tx = this.a * m.tx + this.c * m.ty + this.tx,
              ty = this.b * m.tx + this.d * m.ty + this.ty;
            
          return this.compose(a, b, c, d, tx, ty);
        }
      },

      /* Applies a rotation transformation to the Matrix object.
       * @param {Number} angle The rotation angle in radians.
       * @return {Matrix}
       */
      'rotate': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (radians) {
          check_number_type(radians, this+'.rotate');
          var c = cos(radians),
              s = sin(radians),
              m = Matrix(c, s, -s, c, 0, 0);
          return this.multiply(m);
        }
      },

      /* Applies a rotation transformation to the Matrix object, ignore translation.
       * @param {Number} angle The rotation angle in radians.
       * @return {Matrix}
       */
      'deltaRotate': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (radians) {
          check_number_type(radians, this+'.deltaRotate');
          var x = this.tx,
              y = this.ty;
          this.rotate(radians);
          this.tx = x;
          this.ty = y;
          return this;
        }
      },

      /* Return the angle of rotation in radians.
       * @return {Number} radians
       */
      'rotation': {
        enumerable: true,
        configurable: false,
        get: function () {
          return atan2(this.b, this.a);
        },
        /* Set a new rotation for matrix.
         * @param {Number} angle, in radians
         * @return {Matrix}
         */
        set: function (radians) {
          check_number_type(radians, this+'.rotation');
          var c = cos(radians),
              s = sin(radians);
          return this.compose(c, s, -s, c, this.tx, this.ty);
        }
      },

      /* Applies a scaling transformation to the matrix.
       * @param {Number} sx A multiplier used to scale the object along the x axis.
       * @param {Number} sy A multiplier used to scale the object along the y axis.
       * @return {Matrix}
       */
      'scale': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (sx, sy) {
          check_number_type(arguments, this+'.scale');
          var m = Matrix(sx, 0, 0, sy, 0, 0);
          return this.multiply(m);
        }
      },

      /* Applies a scaling transformation to the matrix, ignores translation.
       * @param {Number} sx A multiplier used to scale the object along the x axis.
       * @param {Number} sy A multiplier used to scale the object along the y axis.
       * @return {Matrix}
       */
      'deltaScale': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (sx, sy) {
          check_number_type(arguments, this+'.deltaScale');
          var x = this.tx,
              y = this.ty;
          this.scale(sx, sy);
          this.tx = x;
          this.ty = y;
          return this;
        }
      },

      /* Translates the matrix along the x and y axes.
       * @param {Number} dx The amount of movement along the x axis to the right, in pixels.
       * @param {Number} dy The amount of movement down along the y axis, in pixels.
       * @return {Matrix}
       */
      'translate': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (dx, dy) {
          check_number_type(arguments, this+'.translate');
          this.tx += dx;
          this.ty += dy;
          return this;
        }
      },

      /*
       * @param {Number} skewX
       * @param {Number} skewY
       * @return {Matrix}
       */
      'skew': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (skewX, skewY) {
          check_number_type(arguments, this+'.skew');
          var sx = tan(skewX),
              sy = tan(skewY),
              m = Matrix(1, sy, sx, 1, 0, 0);
          return this.multiply(m);
        }
      },

      /* Skew matrix and ignore translation.
       * @param {Number} skewX
       * @param {Number} skewY
       * @return {Matrix}
       */
      'deltaSkew': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (skewX, skewY) {
          check_number_type(arguments, this+'.deltaSkew');
          var x = this.tx,
              y = this.ty;
          this.skew(skewX, skewY);
          this.tx = x;
          this.ty = y;
          return this;
        }
      },

      /* Add a matrix with the current matrix.
       * @param {Matrix} m
       * @return {Matrix}
       */
      'add': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (m) {
          check_matrix_type(m, this+'.add');
          this.a  += m.a;
          this.b  += m.b;
          this.c  += m.c;
          this.d  += m.d;
          this.tx += m.tx;
          this.ty += m.ty;
          return this;
        }
      },

      /* Performs the opposite transformation of the original matrix.
       * @return {Matrix}
       */
      'invert': {
        enumerable: false,
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

      /* Returns the result of applying the geometric transformation
       * represented by the Matrix object to the specified point.
       * @param {Point} pt
       * @return {Point}
       */
      'transformPoint': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          check_point_type(pt, this+'.transformPoint');
          return Point(this.a * pt.x + this.c * pt.y + this.tx,
                       this.b * pt.x + this.d * pt.y + this.ty);
        }
      },

      /* Given a point in the pretransform coordinate space, returns
       * the coordinates of that point after the transformation occurs.
       * Unlike 'transformPoint', does not consider translation.
       * @param {Point} pt
       * @return {Point}
       */
      'deltaTransformPoint': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          check_point_type(pt, this+'.deltaTransformPoint');
          return Point(this.a * pt.x + this.c * pt.y,
                       this.b * pt.x + this.d * pt.y);
          }
      },
      
      'rotateAroundExternalPoint': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt, radians) {
          /*DEBUG_START*/
          check_point_type(pt, this+'.rotateAroundExternalPoint');
          check_number_type(radians, this+'.rotateAroundExternalPoint');
          /*DEBUG_END*/
          var parent_matrix = Matrix().rotate(radians), //global space
              reg_pt, //new registration point
              dx = pt.x,
              dy = pt.y;
          
          this.translate(-dx, -dy);
          
          reg_pt = parent_matrix.transformPoint({x:this.tx, y:this.ty});
          this.tx = reg_pt.x;
          this.ty = reg_pt.y;
          //apply parents rotation, and put back
          return this.multiply(parent_matrix).translate(dx, dy);
        }
      },
      
      'rotateAroundInternalPoint': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt, radians) {
          check_point_type(pt, this+'.rotateAroundInternalPoint');
          check_number_type(radians, this+'.rotateAroundInternalPoint');
          var p = this.transformPoint(pt);
          return this.rotateAroundExternalPoint(p, radians);
        }
      },
      
      'matchInternalPointWithExternal': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt_int, pt_ext) {
          check_point_type(pt_int, this+'.matchInternalPointWithExternal');
          check_point_type(pt_ext, this+'.matchInternalPointWithExternal');
          var pt = this.transformPoint(pt_int),
              dx = pt_ext.x - pt.x,
              dy = pt_ext.y - pt.y;
          return this.translate(dx, dy);
        }
      },

      /* Update matrix 'in-between' this and another matrix
       * given a value of t bewteen 0 and 1.
       * @return {Matrix}
       */
      'interpolate': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (m, t) {
          check_matrix_type(m, this+'.interpolate');
          check_number_type(t, this+'.interpolate');
          this.a  = this.a  + (m.a  - this.a)  * t;
          this.b  = this.b  + (m.b  - this.b)  * t;
          this.c  = this.c  + (m.c  - this.c)  * t;
          this.d  = this.d  + (m.d  - this.d)  * t;
          this.tx = this.tx + (m.tx - this.tx) * t;
          this.ty = this.ty + (m.ty - this.ty) * t;
          return this;
        }
      }
      
    };//end matrix_properties defintion
  }());
  
}());//end class closure

(function () {
  var rect_properties,
      check_number_type = doodle.utils.types.check_number_type,
      isRect;
  
  /* Super constructor
   * @param {Number|Array|Rectangle|Function} (x,y,w,h)|initializer
   * @return {Object}
   */
  doodle.geom.Rectangle = function (x, y, width, height) {
    var arg_len = arguments.length,
        initializer,
        rect = {};

		//check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
			x = undefined;
    } else if (arg_len > 4) {
			throw new SyntaxError("[object Rectangle]: Invalid number of parameters.");
		}

    Object.defineProperties(rect, rect_properties);
    //properties that require privacy
    Object.defineProperties(rect, {
      'x': {
        enumerable: true,
        configurable: false,
        get: function () { return x; },
        set: function (n) {
          if (check_number_type(n, this+'.x')) {
            x = n;
          }
        }
      },
      
      'y': {
        enumerable: true,
        configurable: false,
        get: function () { return y; },
        set: function (n) {
          if (check_number_type(n, this+'.y')) {
            y = n;
          }
        }
      },
      
      'width': {
        enumerable: true,
        configurable: false,
        get: function () { return width; },
        set: function (n) {
          if (check_number_type(n, this+'.width')) {
            width = n;
          }
        }
      },
      
      'height': {
        enumerable: true,
        configurable: false,
        get: function () { return height; },
        set: function (n) {
          if (check_number_type(n, this+'.height')) {
            height = n;
          }
        }
      }
    });

    //passed an initialization object: rectangle/function
    if (initializer) {
      if (typeof initializer === 'function') {
        rect.identity();
        initializer.call(rect);
      } else if (isRectangle(initializer)) {
        rect.compose(initializer.x, initializer.y,
                     initializer.width, initializer.height);
      } else {
        throw new SyntaxError("[object Rectangle]: Passed an invalid initializer object.");
      }
    } else {
      //initialize based on parameter count
      switch (arg_len) {
      case 0:
        rect.compose(0, 0, 0, 0);
        break;
      case 4:
        rect.compose(x, y, width, height);
        break;
      default:
        throw new SyntaxError("[object Rectangle]: Invalid number of parameters.");
      }
    }

    return rect;
  };


  /* Check if a given object contains a numeric rectangle properties including
   * x, y, width, height, top, bottom, right, left.
   * Does not check if a rectangle is actually a doodle.geom.rectangle.
   * @param {Rectangle} rect Object with numeric rectangle parameters.
   * @return {Boolean}
   */
  isRect = doodle.geom.Rectangle.isRect = function (rect) {
    return (typeof rect.x     === "number" && typeof rect.y      === "number" &&
            typeof rect.width === "number" && typeof rect.height === "number" &&
            typeof rect.top   === "number" && typeof rect.bottom === "number" &&
            typeof rect.left  === "number" && typeof rect.right  === "number");
  };

  doodle.utils.types.check_rect_type = function (rect, caller_name) {
    if (!isRect(rect)) {
			caller_name = (caller_name === undefined) ? "check_rect_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a rectangle.");
    } else {
      return true;
    }
  };

  
  (function () {
    //avoid lookups
    var Rectangle = doodle.geom.Rectangle,
        check_point_type = doodle.utils.types.check_point_type,
        check_rect_type = doodle.utils.types.check_rect_type;
    
    rect_properties = {
      'top': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.y;
        },
        set: function (n) {
          if (check_number_type(n, this+'.top')) {
            this.y = n;
            this.height -= n;
          }
        }
      },
      
      'right': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.x + this.width;
        },
        set: function (n) {
          if (check_number_type(n, this+'.right')) {
            this.width = n - this.x;
          }
        }
      },
      
      'bottom': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.y + this.height;
        },
        set: function (n) {
          if (check_number_type(n, this+'.bottom')) {
            this.height = n - this.y;
          }
        }
      },
      
      'left': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.x;
        },
        set: function (n) {
          if (check_number_type(n, this+'.left')) {
            this.x = n;
            this.width -= n;
          }
        }
      },
      
      /*
       * METHODS
       */
      
      'clone': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return Rectangle(this.x, this.y, this.width, this.height);
        }
      },
      
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "(x="+ this.x +", y="+ this.y +", w="+ this.width +", h="+ this.height +")";
        }
      },
      
      'toArray': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return [this.top, this.right, this.bottom, this.left];
        }
      },
      
      /* Sets this rectangle's parameters.
       * @param {Number} x
       * @param {Number} y
       * @param {Number} width
       * @param {Number} height
       * @return {Rectangle}
       */
      'compose': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height) {
          if (check_number_type(arguments, this+'.compose')) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
          }
        }
      },

      /* Adjusts the location of the rectangle, as determined by
       * its top-left corner, by the specified amounts.
       * @param {Number} dx
       * @param {Number} dy
       */
      'offset': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (dx, dy) {
          if (check_number_type(arguments, this+'.offset')) {
            this.x += dx;
            this.y += dy;
            return this;
          }
        }
      },

      /* Increases the size of the rectangle by the specified amounts, in pixels.
       * The center point of the Rectangle object stays the same, and its size
       * increases to the left and right by the dx value, and to the top and the
       * bottom by the dy value.
       * @param {Number} dx
       * @param {Number} dy
       */
      'inflate': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (dx, dy) {
          if (check_number_type(arguments, this+'.inflate')) {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
            return this;
          }
        }
      },

      /* Determines whether the rectangle argument is equal to this rectangle.
       * @param {Rectangle} rect
       * @return {Boolean}
       */
      'equals': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (rect) {
          if (check_rect_type(rect, this+'.equals')) {
            return (this.x === rect.x && this.y === rect.y &&
                    this.width === rect.width && this.height === rect.height);
          }
        }
      },

      /* Determines whether or not this Rectangle object is empty.
       */
      'isEmpty': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return (this.width >= 0 || this.height >= 0);
        }
      },

      /* Determines whether the specified point is contained within this rectangle object.
       * @param {Point} pt
       * @return {Boolean}
       */
      'containsPoint': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          if (check_point_type(pt, this+'.containsPoint')) {
            var x = pt.x,
            y = pt.y;
            return (x >= this.left && x <= this.right &&
                    y >= this.top && y <= this.bottom);
          }
        }
      },

      /* Determines whether the rectangle argument is contained within this rectangle.
       * @param {Rectangle} rect
       * @return {Boolean}
       */
      'containsRect': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (rect) {
          if (check_rect_type(rect, this+'.containsRect')) {
            //check each corner
            return (this.containsPoint({x: rect.x, y: rect.y}) &&           //top-left
                    this.containsPoint({x: rect.right, y: rect.y}) &&       //top-right
                    this.containsPoint({x: rect.right, y: rect.bottom}) &&  //bot-right
                    this.containsPoint({x: rect.x, y: rect.bottom}));       //bot-left
          }
        }
      },

      /* Determines whether the rectangle argument intersects with this rectangle.
       * @param {Rectangle} rect
       * @return {Boolean}
       */
      'intersects': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (rect) {
          if (check_rect_type(rect, this+'.intersects')) {
            //check each corner
            return (this.containsPoint({x: rect.x, y: rect.y}) ||           //top-left
                    this.containsPoint({x: rect.right, y: rect.y}) ||       //top-right
                    this.containsPoint({x: rect.right, y: rect.bottom}) ||  //bot-right
                    this.containsPoint({x: rect.x, y: rect.bottom}));       //bot-left
          }
        }
      },

      /* If the rectangle argument intersects with this rectangle, returns
       * the area of intersection as a Rectangle object.
       * If the rectangles do not intersect, this method returns an empty
       * Rectangle object with its properties set to 0.
       * @param {Rectangle} rect
       * @return {Rectangle}
       */
      'intersection': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (rect) {
          if (check_rect_type(rect, this+'.intersection')) {
            var r = Rectangle();
            if (this.intersects(rect)) {
              r.left = Math.max(this.left, rect.left);
              r.top = Math.max(this.top, rect.top);
              r.right = Math.min(this.right, rect.right);
              r.bottom = Math.min(this.bottom, rect.bottom);
            }
            return r;
          }
        }
      },

      /* Adds two rectangles together to create a new Rectangle object,
       * by filling in the horizontal and vertical space between the two.
       * @param {Rectangle} rect
       * @return {Rectangle}
       */
      'union': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (rect) {
          if (check_rect_type(rect, this+'.union')) {
            var r = Rectangle();
            r.left = Math.min(this.left, rect.left);
            r.top = Math.min(this.top, rect.top);
            r.right = Math.max(this.right, rect.right);
            r.bottom = Math.max(this.bottom, rect.bottom);
            return r;
          }
        }
      }
      
    };//end rect_properties definition
  }());
}());//end class closure

(function () {
  var evtdisp_properties,
      isEventDispatcher;
  
  /* Super constructor
   * @param {Function} initializer
   * @return {Object}
   */
  doodle.EventDispatcher = function () {
    var arg_len = arguments.length,
        initializer,
        evt_disp = {},
        eventListeners = {};
    
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
    } else if (arg_len > 0) {
      throw new SyntaxError("[object EventDispatcher]: Invalid number of parameters.");
    }

    Object.defineProperties(evt_disp, evtdisp_properties);
    //properties that require privacy
    Object.defineProperties(evt_disp, {
      'eventListeners': {
        enumerable: true,
        configurable: false,
        get: function () { return eventListeners; }
      }
    });

    //passed an initialization object: function
    if (initializer) {
      initializer.call(evt_disp);
    }

    return evt_disp;
  };

  //holds all objects with event listeners
  doodle.EventDispatcher.dispatcher_queue = [];

  /* Test if an object is an event dispatcher.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isEventDispatcher = doodle.EventDispatcher.isEventDispatcher = function (obj) {
    return (obj.toString() === '[object EventDispatcher]');
  };

  /* Check if object inherits from event dispatcher.
   * @param {Object} obj
   * @return {Boolean}
   */
  doodle.EventDispatcher.inheritsEventDispatcher = function (obj) {
    while (obj) {
      if (isEventDispatcher(obj)) {
        return true;
      } else {
        if (typeof obj !== 'object') {
          return false;
        }
        obj = Object.getPrototypeOf(obj);
      }
    }
    return false;
  };

  doodle.utils.types.check_eventdispatcher_type = function (obj, caller_name) {
    if (!inheritsEventDispatcher(obj)) {
      caller_name = (caller_name === undefined) ? "check_eventdispatcher_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be an eventdispatcher.");
    } else {
      return true;
    }
  };

  
  (function () {
    var dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
        check_string_type = doodle.utils.types.check_string_type,
        check_function_type = doodle.utils.types.check_function_type,
        check_event_type = doodle.utils.types.check_event_type;

    evtdisp_properties = {
      /*
       * METHODS
       */

      /* Returns the string representation of the specified object.
       * @return {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object EventDispatcher]";
        }
      },

      /* Call function passing object as 'this'.
       * @param {Function} fn
       * @return {Object}
       */
      'modify': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (fn) {
          if (check_function_type(fn, this+'.modify')) {
            fn.call(this);
            return this;
          }
        }
      },

      /* Registers an event listener object with an EventDispatcher object
       * so that the listener receives notification of an event.
       * @param {String} type
       * @param {Function} listener
       * @param {Boolean} useCapture
       */
      'addEventListener': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (type, listener, useCapture) {
          if (check_string_type(type, this+'.addEventListener') &&
              check_function_type(listener, this+'.addEventListener')) {
            
            useCapture = useCapture === true; //default to false, bubble event

            //if new event type, create it's array to store callbacks
            if (!this.eventListeners[type]) {
              this.eventListeners[type] = {capture:[], bubble:[]};
            }
            this.eventListeners[type][useCapture ? 'capture':'bubble'].push(listener);
            
            //now that we're receiving events, add to object queue
            if(!dispatcher_queue.some(function(x) { return x === this; })) {
              dispatcher_queue.push(this);
            }
          }
        }
      },

      /* Removes a listener from the EventDispatcher object.
       * @param {String} type
       * @param {Function} listener
       * @param {Boolean} useCapture
       */
      'removeEventListener': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (type, listener, useCapture) {
          if (check_string_type(type, this+'.removeEventListener') &&
              check_function_type(listener, this+'.removeEventListener')) {
          
            useCapture = useCapture === true; //default to false, bubble event
          
            //make sure event type exists
            if (this.eventListeners[type]) {
              //grab our event type array and remove the callback function
              var evt_type = this.eventListeners[type],
              listeners = evt_type[useCapture ? 'capture':'bubble'];
              listeners.splice(listeners.indexOf(listener), 1);
              
              //if none left, remove event type
              if (evt_type.capture.length === 0 && evt_type.bubble.length === 0) {
                delete this.eventListeners[type];
              }
              //if no more listeners, remove from object queue
              if (Object.keys(this.eventListeners).length === 0) {
                dispatcher_queue.splice(dispatcher_queue.indexOf(this), 1);
              }
            }
          }
        }
      },

      /* Lookup and call listener if registered for specific event type.
       * @param {Event} event
       * @return {Boolean} true if node has listeners of event type.
       */
      'handleEvent': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (event) {
          if (check_event_type(event, this+'.handleEvent')) {
            //check for listeners that match event type
            var phase = event.bubbles ? 'bubble':'capture',
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
        }
      },
      
      /* Dispatches an event into the event flow. The event target is the
       * EventDispatcher object upon which the dispatchEvent() method is called.
       * @param {Event} event
       * @return {Boolean} true if the event was successfully dispatched.
       */
      'dispatchEvent': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (event) {
          //events are dispatched from the child,
          //capturing goes down to the child, bubbling then goes back up
          var target,
              node,
              node_path = [],
              len, //count of nodes up to root
              i, //counter
              rv; //return value of event listener
          
          check_event_type(event, this+'.dispatchEvent');

          //can't dispatch an event that's already stopped
          if (event.__cancel) {
            return false;
          }
          
          //set target to the object that dispatched it
          //if already set, then we're re-dispatching an event for another target
          if (!event.target) {
            event.__setTarget(this);
          } else {
            //this is a bit confusing, show warning for now
            console.log(this+'.dispatchEvent: event.target already set to ' + event.target);
          }

          target = event.target;
          //path starts at node parent
          node = target.parent || null;

          //create path from node's parent to top of tree
          while (node) {
            node_path.push(node);
            node = node.parent;
          }

          //enter capture phase: down the tree
          event.__setEventPhase(event.CAPTURING_PHASE);
          i = len = node_path.length;
          while ((i=i-1) >= 0) {
            node_path[i].handleEvent(event);
            //was the event stopped inside the handler?
            if (event.__cancel) {
              return true;
            }
          }

          //enter target phase
          event.__setEventPhase(event.AT_TARGET);
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
          event.__setEventPhase(event.BUBBLING_PHASE);
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

      /* Dispatches an event to every object with an active listener.
       * Ignores propagation path, objects come from 
       * @param {Event} event
       * @return {Boolean} true if the event was successfully dispatched.
       */
      'broadcastEvent': {
        enumerable: true,
        writable: false,
        configurable: false,
        value: function (event) {
          var receivers, //event listeners of correct type
              len, //count of event listeners
              i; //counter
          
          check_event_type(event, this+'.broadcastEvent');

          if (event.__cancel) {
            throw new Error(this+'.broadcastEvent: Can not dispatch a cancelled event.');
          }
          
          //set target to the object that dispatched it
          //if already set, then we're re-dispatching an event for another target
          if (!event.target) {
            event.__setTarget(this);
          }
      
          //pare down to eligible receivers with event type listener
          receivers = dispatcher_queue.filter(function (obj) {
            return obj.hasEventListener(event.type);
          });
          
          //and call each
          for (i = 0, len = receivers.length; i < len; i=i+1) {
            receivers[i].handleEvent(event);
            //event cancelled in listener?
            if (event.__cancel) {
              break;
            }
          }
          
          return true;
        }
      },

      /* Checks whether the EventDispatcher object has any listeners
       * registered for a specific type of event.
       * @param {String} type
       * @return {Boolean}
       */
      'hasEventListener': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (type) {
          if (check_string_type(type, this+'.hasEventListener')) {
            return this.eventListeners !== null && this.eventListeners.hasOwnProperty(type);
          }
        }
      },

      /* Checks whether an event listener is registered with this EventDispatcher object
       * or any of its ancestors for the specified event type.
       * The difference between the hasEventListener() and the willTrigger() methods is
       * that hasEventListener() examines only the object to which it belongs,
       * whereas the willTrigger() method examines the entire event flow for the
       * event specified by the type parameter.
       * @param {String} type The type of event.
       * @return {Boolean}
       */
      'willTrigger': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (type) {
          if (check_string_type(type, this+'.willTrigger')) {
            if (this.hasEventListener(type)) {
              return true;
            } else if (!this.children || this.children.length === 0) {
              //requires scene graph be in place to proceed down the tree
              return false;
            } else {
              for (var i in this.children) {
                if (this.children[i].willTrigger(type)) {
                  return true;
                }
              }
            }
            return false;
          }
        }
      }
      
    };//end evtdisp_properties definition
  }());
}());//end class closure

(function () {
  var node_properties,
      node_count = 0,
      isNode,
      inheritsNode,
      check_matrix_type = doodle.utils.types.check_matrix_type,
      check_string_type = doodle.utils.types.check_string_type;
  
  /* Super constructor
   * @param {Function} initializer
   * @return {Object}
   */
  doodle.Node = function (id) {
    var arg_len = arguments.length,
        initializer,
        node = Object.create(doodle.EventDispatcher()),
        children = [],
        transform = doodle.geom.Matrix(),
        root = null,
        parent = null;
    
    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
			id = undefined;
    } else if (arg_len > 1) {
			throw new SyntaxError("[object Node]: Invalid number of parameters.");
		}

    Object.defineProperties(node, node_properties);
    //properties that require privacy
    Object.defineProperties(node, {
			
      'id': {
        enumerable: true,
        configurable: false,
        get: function () { return id; },
        set: function (s) {
          if (check_string_type(s, this+'.id')) {
            id = s;
          }
        }
      },
			
      'root': {
        enumerable: true,
        configurable: false,
        get: function () { return root; },
        set: function (node) {
          if (node === null || inheritsNode(node)) {
            root = node;
          } else {
            throw new TypeError(this+".root: Parameter must be a node.");
          }
        }
      },
			
      'parent': {
        enumerable: true,
        configurable: false,
        get: function () { return parent; },
        set: function (node) {
          if (node === null || inheritsNode(node)) {
            parent = node;
          } else {
            throw new TypeError(this+".parent: Parameter must be a node.");
          }
        }
      },
			
      'children': {
        enumerable: false,
        configurable: false,
        get: function () {
          return children;
        }
      },
			
      'transform': {
        enumerable: false,
        configurable: false,
        get: function () {
          return transform;
        },
        set: function (matrix) {
          if (check_matrix_type(matrix, this+'.transform')) {
            transform = matrix;
          }
        }
      }
    });

    //passed an initialization object: function
    if (initializer) {
      node.id = "node" + String('000'+node_count).slice(-3);
      initializer.call(node);
    } else {
      node.id = id || "node" + String('000'+node_count).slice(-3);
    }
    node_count += 1;

    return node;
  };


	/*
	 * CLASS METHODS
	 */

  /* Test if an object is an node.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isNode = doodle.Node.isNode = function (obj) {
    return (obj.toString() === '[object Node]');
  };

  /* Check if object inherits from node.
   * @param {Object} obj
   * @return {Boolean}
   */
  inheritsNode = doodle.Node.inheritsNode = function (obj) {
    while (obj) {
      if (isNode(obj)) {
        return true;
      } else {
        if (typeof obj !== 'object') {
          return false;
        }
        obj = Object.getPrototypeOf(obj);
      }
    }
    return false;
  };

  doodle.utils.types.check_node_type = function (node, caller_name) {
    if (!inheritsNode(node)) {
			caller_name = (caller_name === undefined) ? "check_node_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a node.");
    } else {
      return true;
    }
  };


  (function () {

    var Point = doodle.geom.Point,
        isPoint = Point.isPoint,
        check_number_type = doodle.utils.types.check_number_type,
        check_point_type = doodle.utils.types.check_point_type,
				check_node_type = doodle.utils.types.check_node_type,a
				to_degrees = 180/Math.PI,
				to_radians = Math.PI/180;

    node_properties = {
      /*
       * PROPERTIES
       */

			'x': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.transform.tx;
        },
        set: function (d) {
          check_number_type(d, this+'.x');
          this.transform.tx = d;
        }
      },
      
      'y': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.transform.ty;
        },
        set: function (d) {
          check_number_type(d, this+'.y');
          this.transform.ty = d;
        }
      },

			//registration point
			'axis': {
				//temp value
				value: {x: this.x, y: this.y}
			},

			'rotate': { //around external point?
				value: function (deg) {
					check_number_type(deg, this+'.rotate');
					this.transform.rotate(deg * to_radians);
				}
			},
			
      'rotation': {
        enumerable: true,
        configurable: false,
        get: function () {
          return this.transform.rotation * to_degrees; //return degress
        },
        set: function (deg) {
          check_number_type(deg, this+'.rotation');
          this.transform.rotation = deg * to_radians; //deg-to-rad
        }
      },
      
      'scale': {
        enumerable: true,
        configurable: false,
        get: function () {
          return Point(this.transform.a, this.transform.d);
        },
        /* Scale uniformly if given a single number, otherwise scale x and y.
         * @param {Number|Array|Point} s
         */
        set: function (s) {
          if (typeof s === "number") {
            this.transform.a = s;
            this.transform.d = s;
          } else if (Array.isArray(s)) {
            this.transform.a = s[0];
            this.transform.d = s[1];
          } else if (isPoint(s)) {
            this.transform.a = s.x;
            this.transform.d = s.y;
          } else {
            throw new TypeError(this+".scale: Wrong parameter type.");
          }
        }
      },

      /*
       * METHODS
       */

      /* Returns the string representation of the specified object.
       * @return {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object Node]";
        }
      },

      'addChildAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (node, index) {
					//if already a child then ignore
					if (this.children.indexOf(node) !== -1) {
						return false;
					}
					//type check
					check_node_type(node, this+'.addChildAt');
					check_number_type(index, this+'.addChildAt');
					
					//make sure parent/child share same root
					if (node.root !== this.root) {
						node.root = this.root;
					}
					//if has previous parent, remove from it's children
					if (node.parent !== null && node.parent !== this) {
						node.parent.removeChild(node);
					}
					node.parent = this;
					this.children.splice(index, 0, node);

					return node;
				}
      },
      
      'addChild': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (node) {
          return this.addChildAt(node, this.children.length);
        }
      },
      
      'removeChildAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (index) {
          check_number_type(index, this+'.removeChildAt');
          var node = this.children[index];
          node.root = null;
          node.parent = null;
          this.children.splice(index, 1);
        }
      },
      
      'removeChild': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (node) {
          this.removeChildAt(this.children.indexOf(node));
        }
      },
      
      'removeChildById': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (id) {
          this.removeChild(this.getChildById(id));
        }
      },
      
      'removeAllChildren': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          //just assign an empty array to this.children?
          var i = this.children.length;
          while ((i -= 1) >= 0) {
            this.removeChildAt(i);
          }
        }
      },
      
      'getChildById': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (id) {
          return this.children.filter(function (child) {
            return child.id === id;
          })[0];
        }
      },
      
      'swapChildrenAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (index1, index2) {
          if (check_number_type(arguments, this+'.swapChildrenAt')) {
            var a = this.children;
            a[index1] = a.splice(index2, 1, a[index1])[0];
          }
        }
      },
      
      'swapChildren': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (node1, node2) {
          this.swapChildrenAt(this.children.indexOf(node1), this.children.indexOf(node2));
        }
      },

      //change this nodes depth in parent
      'swapDepths': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function I(node) {
          var parent = this.parent;
          if (!parent || !Array.isArray(parent.children)) {
            throw new Error(this+".swapDepths: no parent found.");
          } else {
            parent.swapChildren(this, node);
          }
        }
      },

      'swapDepthAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (index) {
          if (check_number_type(index, this+'.swapDepthAt')) {
            var parent = this.parent;
            if (!parent || !Array.isArray(parent.children)) {
              throw new Error(this+".swapDepthAt: no parent found.");
            } else {
              parent.swapChildrenAt(index, parent.children.indexOf(this));
            }
          }
        }
      },
      
      /* Determine if node is among it's children, grandchildren, etc.
       * @return {Boolean}
       */
      'contains': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (node) {
          while (node) {
            if (node === this) {
              return true;
            }
            node = node.parent;
          }
          return false;
        }
      },
      
      'globalToLocal': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          if (check_point_type(pt, this+'.globalToLocal')) {
            return Point(pt.x - this.x, pt.y - this.y);
          }
        }
      },

      'localToGlobal': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (pt) {
          if (check_point_type(pt, this+'.localToGlobal')) {
            return Point(pt.x + this.x, pt.y + this.y);
          }
        }
      }
      
    };//end node_properties
  }());
}());//end class closure
/*not implemented
  id: null,
  //node has matrix - x,y
  showBoundingBox: null,

  clickable: false,
  useHandCursor: false, //on mouse over
  hitArea: null, //if null use this, otherwise use another sprite
  hitTestPoint: null, //point intersects with obj bounds
  hitTestObject: null, //another object intersects with obj bounds
*/

(function () {

  var sprite_properties,
			bounds_properties,
      isSprite,
      inheritsSprite,
      hex_to_rgb = doodle.utils.hex_to_rgb,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_function_type = doodle.utils.types.check_function_type,
      check_rect_type = doodle.utils.types.check_rect_type,
			check_context_type = doodle.utils.types.check_context_type,
			Rectangle = doodle.geom.Rectangle;


  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Sprite = function (id) {
    var arg_len = arguments.length,
        initializer,
        sprite,
				width = 0,
				height = 0,
        hit_area = null,
				draw_commands = [];

    //inherits from doodle.Node, if string pass along id
    sprite = (typeof id === 'string') ?
      Object.create(doodle.Node(id)) : Object.create(doodle.Node());

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
      id = undefined;
    } else if (arg_len > 1) {
      throw new SyntaxError("[object Sprite]: Invalid number of parameters.");
    }

    Object.defineProperties(sprite, sprite_properties);
    //properties that require privacy
    Object.defineProperties(sprite, {
      /*
       * PROPERTIES
       */

			/* Indicates the width of the sprite, in pixels.
       * @param {Number}
       */
      'width': {
        enumerable: true,
        configurable: false,
        get: function () {
          return width;
        },
        set: function (n) {
          check_number_type(n, this+'.width');
          width = n;
        }
      },

      /* Indicates the height of the sprite, in pixels.
       * @param {Number}
       */
      'height': {
        enumerable: true,
        configurable: false,
        get: function () {
          return height;
        },
        set: function (n) {
          check_number_type(n, this+'.height');
          height = n;
        }
      },
      
      'bounds': {
        enumerable: false,
        configurable: false,
        get: (function () {
					//we'll be reusing these vars
					var bounding_box = Rectangle(),
							min = Math.min,
							max = Math.max,
							x, y, w, h,
							//transform_point,
							tr0, tr1, tr2, tr3;
					
					return function () {
						//var transform_point = this.transform.transformPoint;
						//x = this.x;
						//y = this.y;
						w = this.width;
						h = this.height;
						
						//re-calculate bounding box

						//transform corners: tl, tr, br, bl
						//relative to x/y of sprite!
						//this matrix has dx/dy to apply
						tr0 = this.transform.transformPoint({x: 0, y: 0});
						tr1 = this.transform.transformPoint({x: w, y: 0});
						tr2 = this.transform.transformPoint({x: w, y: h});
						tr3 = this.transform.transformPoint({x: 0, y: h});
						
						//set rect with extremas
						bounding_box.left = min(tr0.x, tr1.x, tr2.x, tr3.x);
						bounding_box.right = max(tr0.x, tr1.x, tr2.x, tr3.x);
						bounding_box.top = min(tr0.y, tr1.y, tr2.y, tr3.y);
						bounding_box.bottom = max(tr0.y, tr1.y, tr2.y, tr3.y);
						
						return bounding_box;
					}
				}())
      },
      
      'hitArea': {
        enumerable: false,
        configurable: false,
        get: function () {
          if (hit_area === null) {
            return this.bounds;
          } else {
            return hit_area;
          }
        },
        set: function (rect) {
          rect = (rect === false) ? null : rect;
          //accepts null or rectangle area for now
          if (rect === null || check_rect_type(rect, this+'.hitArea')) {
            hit_area = rect;
          }
        }
      },

			//drawing context to use
			'context': {
				get: function () {
					//will keep checking parent for context till found or null
					var node = this.parent,
							ctx;
					while (node) {
						if (node.context) {
							ctx = node.context;
							check_context_type(ctx, this+'.context (traversal)')
							return ctx;
						}
						node = node.parent;
					}
					return null;
				}
			},

      /*
       * METHODS
       */

      /* When called execute all the draw commands in the stack.
       * @param {Context} context 2d canvas context to draw on.
       */
      'draw': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          var self = this,
							ctx = this.context,
							mat = this.transform.toArray();

					if (!ctx) {
						throw new ReferenceError(this+".draw: Unable to find 2d Render Context.");
					}

					//need to move context around
					ctx.save();
					ctx.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5]);
					
          draw_commands.forEach(function (cmd) {
            //draw function, provide self for this and context as arg
            if (typeof cmd === "function") {
              cmd.call(self, ctx);
              return;
            }
            //draw object, given canvas.context command and param
            var prop = Object.keys(cmd)[0];
            switch (typeof ctx[prop]) {
            case "function":
              //context method
              ctx[prop].apply(ctx, cmd[prop]);
              break;
            case "string":
              //context property
              ctx[prop] = cmd[prop];
              break;
            }
          });
					ctx.restore();
        }
      },

			'clear': {
				value: function () {
					var b_box = this.bounds;

					this.context.clearRect(b_box.x, b_box.y, b_box.width, b_box.height);
				}
			},

      /*
       * GRAPHICS
       */
      'graphics': {
        value: Object.create(null, {
          /*
           * METHODS
           */

          /* Provide direct access to the canvas drawing api.
           * Canvas context is called as the first argument to function.
           * Unable to set bounds from a user supplied function unless explictly set.
           * @param {Function} fn
           * Ex:
           * x = Object.create(doodle.sprite);
           * x.graphics.draw(function (ctx) {
           *   ctx.fillStyle = "#ff0000";
           *   ctx.fillRect(this.x, this.y, 100, 100);
           * });
           * x.draw();
           */
          'draw': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (fn) {
              if (check_function_type(fn, sprite+'.graphics.draw')) {
                draw_commands.push(fn);
              }
            }
          },

          /* Remove all drawing commands for sprite.
           */
          'clear': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function () {
              //should probably test, better to assign new empty array?
              var i = draw_commands.length;
              while ((i=i-1) >= 0) {
                draw_commands.splice(i, 1);
              }
							//reset dimensions
							sprite.width = 0;
							sprite.height = 0;
            }
          },

          /* Specifies a simple one-color fill that subsequent calls to other
           * graphics methods use when drawing.
           * @param {Color} color In hex format.
           * @param {Number} alpha
           */
          'beginFill': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (color, alpha) {
              alpha = alpha ? alpha : 1.0;
              check_number_type(alpha, sprite+'.graphics.beginFill');

              var rgb = hex_to_rgb(color),
                  rgb_str = 'rgba('+ rgb[0] +','+ rgb[1] +','+ rgb[2] +','+ alpha +')';
              
              draw_commands.push({'fillStyle': rgb_str});
            }
          },

          /*
           * @param {Number} x
           * @param {Number} y
           * @param {Number} w
           * @param {Number} h
           */
          'rect': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (x, y, w, h) {
              check_number_type(arguments, sprite+'.graphics.rect');
              //relative to registration point of sprite

							var new_w = x + w,
									new_h = y + h;
              //check for new bounds extrema
							if (new_w > sprite.width) {
								sprite.width = new_w;
							}
							if (new_h > sprite.height) {
								sprite.height = new_h;
							}
              
              draw_commands.push({'fillRect': [x,y,w,h]});
            }
          },

          /*
           * @param {Number} x
           * @param {Number} y
           * @param {Number} radius
           */
          'circle': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (x, y, radius) {
              check_number_type(arguments, sprite+'.graphics.circle');
              var startAngle = 0,
              endAngle = Math.PI * 2,
              anticlockwise = true;
              draw_commands.push({'beginPath': null});
              draw_commands.push({'arc': [x, y, radius, startAngle, endAngle, anticlockwise]});
              draw_commands.push({'closePath': null});
              draw_commands.push({'fill': null});
            }
          },

          /*
           * @param {Number} x
           * @param {Number} y
           * @param {Number} width
           * @param {Number} height
           */
          'ellipse': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (x, y, width, height) {
              check_number_type(arguments, sprite+'.graphics.ellipse');
              var kappa = 0.5522847498,
              rx = width / 2,
              ry = height / 2,
              krx = kappa * rx,
              kry = kappa * ry;
              
              draw_commands.push({'beginPath': null});
              draw_commands.push({'moveTo': [x+rx, y]});
              //(cp1), (cp2), (pt)
              draw_commands.push({'bezierCurveTo': [x+rx, y-kry, x+krx, y-ry, x, y-ry]});
              draw_commands.push({'bezierCurveTo': [x-krx, y-ry, x-rx, y-kry, x-rx, y]});
              draw_commands.push({'bezierCurveTo': [x-rx, y+kry, x-krx, y+ry, x, y+ry]});
              draw_commands.push({'bezierCurveTo': [x+krx, y+ry, x+rx, y+kry, x+rx, y]});
              draw_commands.push({'closePath': null});
              draw_commands.push({'fill': null});
            }
          },

          /*
           * @param {Number} x
           * @param {Number} y
           * @param {Number} width
           * @param {Number} height
           * @param {Number} rx
           * @param {Number} ry
           */
          'roundRect': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (x, y, width, height, rx, ry) {
              check_number_type(arguments, sprite+'.graphics.roundRect');
              var x3 = x + width,
              x2 = x3 - rx,
              x1 = x + rx,
              y3 = y + height,
              y2 = y3 - ry,
              y1 = y + ry;
              
              //clockwise
              draw_commands.push({'moveTo': [x1, y]});
              draw_commands.push({'beginPath': null});
              draw_commands.push({'lineTo': [x2, y]});
              draw_commands.push({'quadraticCurveTo': [x3, y, x3, y1]});
              draw_commands.push({'lineTo': [x3, y2]});
              draw_commands.push({'quadraticCurveTo': [x3, y3, x2, y3]});
              draw_commands.push({'lineTo': [x1, y3]});
              draw_commands.push({'quadraticCurveTo': [x, y3, x, y2]});
              draw_commands.push({'lineTo': [x, y1]});
              draw_commands.push({'quadraticCurveTo': [x, y, x1, y]});
              draw_commands.push({'closePath': null});
              draw_commands.push({'fill': null});
            }
          },

          /*
           * @param {Number} x
           * @param {Number} y
           */
          'lineTo': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (x, y) {
              check_number_type(arguments, sprite+'.graphics.lineTo');
              draw_commands.push({'lineTo': [x, y]});
            }
          },

          /*
           * @param {Number} x
           * @param {Number} y
           */
          'moveTo': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (x, y) {
              check_number_type(arguments, sprite+'.graphics.moveTo');
              draw_commands.push({'moveTo': [x, y]});
            }
          }
        })
      }//end graphics object
    });//end sprite property definitions w/ privact


    //passed an initialization object: function
    if (initializer) {
      initializer.call(sprite);
    }
		
    return sprite;
  };

  
  /*
   * CLASS METHODS
   */
  
  isSprite = doodle.Sprite.isSprite = function (obj) {
    return obj.toString() === '[object Sprite]';
  };

  /* Check if object inherits from Sprite.
   * @param {Object} obj
   * @return {Boolean}
   */
  inheritsSprite = doodle.Sprite.inheritsSprite = function (obj) {
    while (obj) {
      if (isSprite(obj)) {
        return true;
      } else {
        if (typeof obj !== 'object') {
          return false;
        }
        obj = Object.getPrototypeOf(obj);
      }
    }
    return false;
  };

  doodle.utils.types.check_sprite_type = function (sprite, caller_name) {
    if (!inheritsSprite(sprite)) {
      caller_name = (caller_name === undefined) ? "check_sprite_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a sprite.");
    } else {
      return true;
    }
  };
  

  (function () {
    
    sprite_properties = {
      /*
       * PROPERTIES
       */

			'rotation': {
				enumerable: true,
        configurable: false,
        get: function () {
          return this.transform.rotation * 180/Math.PI; //return degress
        },
        set: function (deg) {
          if (check_number_type(deg, this+'.rotation')) {
            this.transform.rotation = deg * Math.PI/180; //deg-to-rad
          }

					//re-calc bounding box
					new_xy = this.transform.transformPoint({x: this.x, y: this.y});
					
        }
			},

      /*
       * METHODS
       */

      /* Returns the string representation of the specified object.
       * @param {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object Sprite]";
        }
      },

      /* Updates the position and size of this sprite.
       * @param {Number} x
       * @param {Number} y
       * @param {Number} width
       * @param {Number} height
       * @return {Sprite}
       */
      'compose': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height) {
          check_number_type(arguments, this+'.compose')
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          return this;
        }
      }
    };//end sprite_properties
		
  }());
}());//end class closure

(function () {

  var elementnode_properties;

  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.ElementNode = function (element) {
    var arg_len = arguments.length,
        initializer,
        element_node = Object.create(doodle.Node());

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
      element = undefined;
    } else if (arg_len > 1) {
      throw new SyntaxError("[object ElementNode]: Invalid number of parameters.");
    }

    Object.defineProperties(element_node, elementnode_properties);
    //properties that require privacy
    Object.defineProperties(element_node, {
      'element': {
        get: function () {
          return element;
        },
        set: function (elem) {
          //check_canvas_type(canvas, this+'.element');
          element = elem;
        }
      }
    });

    //passed an initialization object: function
    if (initializer) {
      initializer.call(element_node);
    }

    return element_node;
  };


  (function () {
    var check_number_type = doodle.utils.types.check_number_type,
        check_string_type = doodle.utils.types.check_string_type,
				check_boolean_type = doodle.utils.types.check_boolean_type,
        get_style_property = doodle.utils.get_style_property;
    
    elementnode_properties = {
      /*
       * PROPERTIES
       */

      'id': {
        get: function () {
          return this.element.id;
        },
        set: function (name) {
          check_string_type(name, this+'.id');
          this.element.id = name;
        }
      },

      'width': {
        get: function () {
          return this.element.width;
        },
        set: function (n) {
          check_number_type(n, this+'.width');
          this.element.width = n;
        }
      },
      
      'height': {
        get: function () {
          return this.element.height;
        },
        set: function (n) {
          check_number_type(n, this+'.height');
          this.element.height = n;
        }
      },

      'alpha': {
        get: function () {
          var color = this.element.style.backgroundColor,
              alpha = 1.0;
          if (/rgba\(.*\)/.test(color)) {
            //i really hate javascript numbers
            alpha = parseFloat(parseFloat(color.split(/,/g)[3]).toFixed(2));
          }
          return alpha;
        },
        set: function (alpha) {
          check_number_type(alpha, this+'.alpha');
          //is color ever stored as hex?
          var rgb = this.element.style.backgroundColor.match(/(\d{1,3})/g);
          
          this.element.style.backgroundColor = "rgba("+ rgb[0] +","+ rgb[1] +","+ rgb[2] +"," + alpha +")";
        }
      },

      /*
       * @param {Boolean}
       * @return {Boolean}
       */
      'visible': {
        get: function () {
          switch (get_style_property(this.element, 'visibility')) {
          case 'visible':
            return true;
          case 'hidden':
            return false;
          default:
            throw new Error(this+".visible: Unable to determine visibility.");
          }
        },
        set: function (isVisible) {
          check_boolean_type(isVisible, this+'.visible');
          if (isVisible) {
            this.element.style.visibility = 'visible';
          } else {
            this.element.style.visibility = 'hidden';
          }
        }
      },

      /*
       * METHODS
       */

      /* Returns the string representation of the specified object.
       * @return {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object ElementNode]";
        }
      }
      
    };//end layer_properties
  }());
}());//end class closure

(function () {

  var layer_properties,
      isLayer,
      inheritsLayer,
      layer_count = 0,
      check_canvas_type = doodle.utils.types.check_canvas_type;

  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Layer = function (id, element) {
    var arg_len = arguments.length,
        initializer,
        layer = Object.create(doodle.ElementNode()),
        layer_name = "layer" + layer_count;

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
			id = undefined;
    } else if (arg_len > 2) {
      throw new SyntaxError("[object Layer]: Invalid number of parameters.");
    }

    Object.defineProperties(layer, layer_properties);
    //properties that require privacy
    Object.defineProperties(layer, {
      'element': {
        get: function () {
          return element;
        },
        set: function (canvas) {
          check_canvas_type(canvas, this+'.element');
          element = canvas;
        }
      }
    });

		//init
    layer.element = element || document.createElement('canvas');
		//need to stack canvas elements inside div
    layer.element.style.position = "absolute";

    //passed an initialization object: function
    if (initializer) {
      initializer.call(layer);
    }

		if (!layer.id) {
			layer.id = (typeof id === 'string') ? id : "layer" + String('00'+layer_count).slice(-2);
			layer_count += 1;
		}

    return layer;
  };

  
  /*
   * CLASS METHODS
   */

  /* Test if an object is an node.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isLayer = doodle.Layer.isLayer = function (obj) {
    return obj.toString() === '[object Layer]';
  };

  /* Check if object inherits from node.
   * @param {Object} obj
   * @return {Boolean}
   */
  inheritsLayer = doodle.Layer.inheritsLayer = function (obj) {
    while (obj) {
      if (isLayer(obj)) {
        return true;
      } else {
        if (typeof obj !== 'object') {
          return false;
        }
        obj = Object.getPrototypeOf(obj);
      }
    }
    return false;
  };

  doodle.utils.types.check_layer_type = function (layer, caller_name) {
    if (!inheritsLayer(layer)) {
      caller_name = (caller_name === undefined) ? "check_layer_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a layer.");
    } else {
      return true;
    }
  };


  (function () {
    var check_number_type = doodle.utils.types.check_number_type,
        check_string_type = doodle.utils.types.check_string_type;
    
    layer_properties = {
      /*
       * PROPERTIES
       */

      'context': {
        get: function () {
          return this.element.getContext('2d');
        }
      },

      /*
       * METHODS
       */

      /* Returns the string representation of the specified object.
       * @return {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object Layer]";
        }
      }
      
    };//end layer_properties
  }());
}());//end class closure

var last_event;

(function () {

  var display_properties,
      check_block_element = doodle.utils.types.check_block_element,
      get_element = doodle.utils.get_element;

//Stage
//frameRate
//fullScreen? //make large div

  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Display = function (element) {
    var arg_len = arguments.length,
        initializer,
        display = Object.create(doodle.ElementNode());

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
			element = undefined;
    } else if (arg_len > 1) {
			throw new SyntaxError("[object Display]: Invalid number of parameters.");
		}

    Object.defineProperties(display, display_properties);
    //properties that require privacy
    Object.defineProperties(display, {
      'element': {
        get: function () {
          return element;
        },
        set: function (id) {
          //get by name or actual element
          //element = document.getElementById(id);
          var e = get_element(id, '[object Display]');
          if (check_block_element(e, this+'.element')) {
            element = e;
          }
          //we need to stack the canvas elements on top of each other
          element.style.position = "relative";
          //init rest - can you transfer layers to another div?
          this.root = this;
          
          //add event listeners
          element.onmousedown = dispatch_mouse_event;
        }
      }
    });

		
    //passed an initialization object: function
    if (initializer) {
      initializer.call(display);
    } else {
			//init
			display.element = element;
    }

		if (!display.element) {
			throw new ReferenceError("[object Display]: Requires a HTML element.");
		}
    
    return display;
  };

	

  (function () {

    var check_string_type = doodle.utils.types.check_string_type,
        check_number_type = doodle.utils.types.check_number_type,
				check_layer_type = doodle.utils.types.check_layer_type;
    
    
    display_properties = {

      /*
       * PROPERTIES
       */

      'width': {
        get: function () {
          //just using css style properties for now
          return parseInt(this.element.style.width);
        },
        set: function (n) {
          check_number_type(n, this+'.width');
          this.element.style.width = n + "px"; //css style takes a string
          //re-adjust all layer child nodes as well
          this.children.forEach(function (layer) {
            layer.width = n;
          });
        }
      },
      
      'height': {
        get: function () {
          return parseInt(this.element.style.height);
        },
        set: function (n) {
          check_number_type(n, this+'.height');
          this.element.style.height = n + "px";
          this.children.forEach(function (layer) {
            layer.height = n;
          });
        }
      },

			'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object Display]";
        }
      },

      'toDataUrl': {
        value: function () {
          //iterate over each canvas layer,
          //output image data and merge in new file
          //output that image data
          return;
        }
      },

      'backgroundColor': {
        get: function () {
          var color = this.element.style.backgroundColor,
          rgb;
          if (/rgba?\(.*\)/.test(color)) {
            rgb = color.match(/(\d{1,3})/g);
            color = doodle.utils.rgb_to_hex(rgb[0], rgb[1], rgb[2]);
          }
          return color;
        },
        set: function (color) {
          //check color
          this.element.style.backgroundColor = color;
        }
      },

      'backgroundImage': {
        get: function () {
          //returns the captured substring match
          var image_url = this.element.style.backgroundImage.match(/^url\((.*)\)$/);
          return image_url ? image_url[1] : false;
        },
        set: function (image_url) {
          //check image
          //defaults to no-repeat, top-left
          //other options must change the element.style.background- properties
          var element_style = this.element.style;
          if (!element_style.backgroundRepeat ||
              /(\srepeat\s)|(\srepeat-[xy]\s)/.test(element_style.background)) {
            element_style.backgroundRepeat = 'no-repeat';
          }
          element_style.backgroundImage = "url(" + image_url + ")";
        }
      },

      'addChildAt': {
        value: function (layer, index) {
          check_layer_type(layer, this+'.addChildAt');
          check_number_type(index, this+'.addChildAt');
          
          //if has previous parent, remove from it's children
          if (layer.parent !== null && layer.parent !== this) {
            layer.parent.removeChild(node);
          }
          //set ancestry
          layer.root = this;
          layer.parent = this;
          //set layer size to display size
          layer.width = this.width;
          layer.height = this.height;
          //add to children
          this.children.splice(index, 0, layer);
          //add dom element
          this.element.appendChild(layer.element);
          return this;
        }
      },

      'removeChildAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (index) {
          check_number_type(index, this+'.removeChildAt');
          var layer = this.children[index];
          layer.root = null;
          layer.parent = null;
          //remove from children
          this.children.splice(index, 1);
          //remove from dom
          this.element.removeChild(layer.element);
        }
      },

      'swapChildrenAt': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (index1, index2) {
          check_number_type(arguments, this+'.swapChildrenAt');
          var a = this.children;
          a[index1] = a.splice(index2, 1, a[index1])[0];
          //swap dom elements
          if (index1 > index2) {
            this.element.insertBefore(a[index2].element, a[index1].element);
          } else {
            this.element.insertBefore(a[index1].element, a[index2].element);
          }
        }
      },

      /* Convenience methods.
       */
      'addLayer': {
        value: function (id) {
          var layer = doodle.Layer(id); //layer will auto-name
          this.addChild(layer);
					return layer;
        }
      },

      'removeLayer': {
        value: function (id) {
          check_string_type(id, this+'.removeLayer');
          this.removeChildById(id);
        }
      }
      
    };//end display_properties
  }());
}());//end class closure



//test mouse click collision with sprite bounds
var dispatch_mouse_event = function (event) {
  console.log(event.type + "!");
  last_event = event;
  //position on canvas element
  //offset is relative to div, however this implementation adds 1 to y?
  var global_x = event.globalX = event.offsetX,
      global_y = event.globalY = event.offsetY,
      dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
      local_pt;
  
  dispatcher_queue.forEach(function (obj) {
    if (obj.hasEventListener(event.type)) {
      //needs to be a sprite
      if (obj.hitArea && obj.hitArea.containsPoint({x: global_x, y: global_y})) {
        //check z-index to determine who's on top?
        local_pt = obj.globalToLocal({x: global_x, y: global_y});
        event.localX = local_pt.x;
        event.localY = local_pt.y;
        obj.handleEvent(event);
      }
    }
  });
}
