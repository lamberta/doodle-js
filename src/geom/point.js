
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
    return (pt && typeof pt.x === 'number' && typeof pt.y === 'number');
  }

  doodle.utils.types.check_point_type = function (pt, caller, param) {
    if (!isPoint(pt)) {
			caller = (caller === undefined) ? "check_point_type" : caller;
			param = (param === undefined) ? "" : '('+param+')';
			throw new TypeError(caller + param +": Parameter must be a point.");
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
