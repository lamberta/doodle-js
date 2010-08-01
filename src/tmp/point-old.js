
Object.defineProperty(doodle.geom, 'Point', {
  configurable: false,
  enumerable: true,
  value: {}
});

/* Check if a given object contains a numeric x and y property.
 * Does not check if a point is actually a doodle.geom.point.
 * @param {Point} point Object with x and y numeric parameters.
 * @param {String} fn_name Function name to show in TypeError message.
 * @return {Boolean}
 */
doodle.geom.Point.isPoint = function (pt, fn_name) {
  if (typeof pt.x !== "number" || typeof pt.y !== "number") {
    throw new TypeError(fn_name + ": Parameter must be a point.");
  } else {
    return true;
  }
};

(function () {
  //avoid lookups
  var Point = doodle.geom.Point,
      isPoint = Point.isPoint;

  Object.defineProperties(Point, {

    /*
     * PROPERTIES
     */
    
    /* The horizontal coordinate of the point.
     * @param {Number} x
     */
    'x': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: 0
    },
    
    /* The vertical coordinate of the point.
     * @param {Number} y
     */
    'y': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: 0
    },

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
        if (typeof x !== "number" || typeof y !== "number") {
          throw new TypeError("point.compose: Parameter must be a number.");
        } else {
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
        return Object.create(Point).compose(this.x, this.y);
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
        if (isPoint(pt1, 'point.distance') && isPoint(pt2, 'point.distance')) {
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
        if (typeof thickness !== "number") {
          throw new TypeError("point.normalize: Parameter must be a number.");
        } else {
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
        if (isPoint(pt, 'point.equals')) {
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
        if (typeof t !== "number") {
          throw new TypeError("point.interpolate: Parameter must be a number.");
        } else if (isPoint(pt1, 'point.interpolate') &&
                   isPoint(pt2, 'point.interpolate')) {
          var x = pt1.x + (pt2.x - pt1.x) * t,
              y = pt1.y + (pt2.y - pt1.y) * t;
          return Object.create(Point).compose(x, y);

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
        if (typeof len !== "number" || typeof angle !== "number") {
          throw new TypeError("point.polar: Parameter must be a number.");
        } else {
          var x = len * Math.cos(angle),
              y = len * Math.sin(angle);
          return Object.create(Point).compose(x, y);
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
        if (isPoint(pt, 'point.add')) {
          var x = this.x + pt.x,
              y = this.y + pt.y;
          return Object.create(Point).compose(x, y);
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
        if (isPoint(pt, 'point.subtract')) {
          var x = this.x - pt.x,
              y = this.y - pt.y;
          return Object.create(Point).compose(x, y);
        }
      }
    },

    'offset': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (dx, dy) {
        if (typeof dx !== "number" || typeof dy !== "number") {
          throw new TypeError("point.offset: Parameter must be a number.");
        } else {
          this.x += dx;
          this.y += dy;
        }
      }
    }
  });//end point properties definition

}());
