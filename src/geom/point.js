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
  function Point (x, y) {
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
              if (idArg !== null) {
                type_check(idArg,'string', {label:'Point.id', id:this.id});
              }
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
  }//end Point definition

  doodle.geom.Point = Point;
  
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
