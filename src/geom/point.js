/*globals doodle*/

(function () {
  var point_static_properties,
      distance,
      isPoint,
      temp_array = new Array(2),
      temp_point = {x:0, y:0},
      /*DEBUG*/
      check_point_type,
      check_number_type = doodle.utils.types.check_number_type,
      /*END_DEBUG*/
      //lookup help
      doodle_Point,
      cos = Math.cos,
      sin = Math.sin,
      sqrt = Math.sqrt;
  
  /**
   * @class Point
   * @extends Object
   * @param {Number} x
   * @param {Number} y
   * @return {Point}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  doodle_Point = doodle.geom.Point = function (x, y) {
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
         * @return {Number}
         * @throws {TypeError}
         * @property
         */
        'x': {
          enumerable: true,
          configurable: false,
          get: function () { return x; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.x');
            /*END_DEBUG*/
            x = n;
          }
        },

        /**
         * The vertical coordinate of the point.
         * @name y
         * @return {Number}
         * @throws {TypeError}
         * @property
         */
        'y': {
          enumerable: true,
          configurable: false,
          get: function () { return y; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.y');
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
            var pt = $temp_array;
            pt[0] = x;
            pt[1] = y;
            return pt;
          }
        }
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
        check_point_type(init_obj, '[object Point](point)');
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
     * The length of the line segment from (0,0) to this point.
     * @name length
     * @return {Number}
     * @property
     */
    'length': {
      enumerable: true,
      configurable: false,
      get: function () {
        return distance(temp_point, this);
      }
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
      value: function () {
        return this.__toArray().concat();
      }
    },
    
    /**
     * Returns a string that contains the values of the x and y coordinates.
     * @name toString
     * @return {String}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "(x=" + this.x + ", y=" + this.y + ")";
      }
    },

    /**
     * Set point coordinates.
     * @name compose
     * @param {Number} x
     * @param {Number} y
     * @return {Point}
     * @throws {TypeError}
     */
    'compose': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (x, y) {
        /*DEBUG*/
        check_number_type(x, this+'.compose', '*x*, y');
        check_number_type(y, this+'.compose', 'x, *y*');
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
      value: function () {
        return doodle_Point(this.x, this.y);
      }
    },

    /**
     * Determines whether two points are equal.
     * @name equals
     * @param {Point} pt The point to be compared.
     * @return {Boolean}
     * @throws {TypeError}
     */
    'equals': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        check_point_type(pt, this+'.equals', '*point*');
        /*END_DEBUG*/
        return ((this && pt &&
                 this.x === pt.x &&
                 this.y === pt.y) ||
                (!this && !pt));
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
        check_point_type(pt, this+'.add', '*point*');
        /*END_DEBUG*/
        return doodle_Point(this.x + pt.x, this.y + pt.y);
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
        check_point_type(pt, this+'.subtract', '*point*');
        /*END_DEBUG*/
        return doodle_Point(this.x - pt.x, this.y - pt.y);
      }
    },

    /**
     * @name offset
     * @param {Number} dx
     * @param {Number} dy
     * @throws {TypeError}
     */
    'offset': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (dx, dy) {
        /*DEBUG*/
        check_number_type(dx, this+'.offset', '*dx*, dy');
        check_number_type(dy, this+'.offset', 'dx, *dy*');
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
     * @param {Number} thickness The scaling value.
     * @return {Point}
     * @throws {TypeError}
     */
    'normalize': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (thickness) {
        /*DEBUG*/
        check_number_type(thickness, this+'.normalize', '*thickness*');
        /*END_DEBUG*/
        this.x = (this.x / this.length) * thickness;
        this.y = (this.y / this.length) * thickness;
        return this;
        /*correct version?
          var angle:Number = Math.atan2(this.y, this.x);
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
     * @param {Number} t The level of interpolation between the two points, between 0 and 1.
     * @return {Point}
     * @throws {TypeError}
     */
    'interpolate': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt1, pt2, t) {
        /*DEBUG*/
        check_point_type(pt1, this+'.interpolate', '*pt1*, pt2, t');
        check_point_type(pt2, this+'.interpolate', 'pt1, *pt2*, t');
        check_number_type(t, this+'.interpolate', 'pt1, pt2, *t*');
        /*END_DEBUG*/
        return doodle_Point(pt1.x + (pt2.x - pt1.x) * t,
                            pt1.y + (pt2.y - pt1.y) * t);

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
     * @param {Number} len The length coordinate of the polar pair.
     * @param {Number} angle The angle, in radians, of the polar pair.
     * @return {Point}
     * @throws {TypeError}
     */
    'polar': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (len, angle) {
        /*DEBUG*/
        check_number_type(len, this+'.polar', '*len*, angle');
        check_number_type(angle, this+'.polar', 'len, *angle*');
        /*END_DEBUG*/
        return doodle_Point(len*cos(angle), len*sin(angle));
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
   * @return {Number}
   * @throws {TypeError}
   * @static
   */
  distance = doodle.geom.Point.distance = function (pt1, pt2) {
    /*DEBUG*/
    check_point_type(pt1, this+'.distance', '*pt1*, pt2');
    check_point_type(pt2, this+'.distance', 'pt1, *pt2*');
    /*END_DEBUG*/
    var dx = pt2.x - pt1.x,
        dy = pt2.y - pt1.y;
    return sqrt(dx*dx + dy*dy);
  };

  /**
   * Check if a given object contains a numeric x and y property.
   * Does not check if a point is actually a doodle.geom.point.
   * @name isPoint
   * @param {Point} pt
   * @return {Boolean}
   * @static
   */
  isPoint = doodle.geom.Point.isPoint = function (pt) {
    return (pt && typeof pt.x === 'number' && typeof pt.y === 'number');
  };

  /*DEBUG*/
  /**
   * @name check_point_type
   * @param {Object} pt
   * @param {String} caller
   * @param {String} params
   * @return {Boolean}
   * @throws {TypeError}
   * @memberOf utils.types
   * @static
   */
  check_point_type = doodle.utils.types.check_point_type = function (pt, caller, param) {
    if (!isPoint(pt)) {
      caller = (caller === undefined) ? "check_point_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be a point.");
    } else {
      return true;
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
