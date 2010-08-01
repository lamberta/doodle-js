
Object.defineProperty(doodle.geom, 'Matrix', {
  configurable: false,
  enumerable: true,
  value: {}
});

/* Super constructor
 */
doodle.geom.Matrix1 = function (initializer) {
	var a = 1,
			b = 0,
			c = 0,
			d = 1,
			tx = 0,
			ty = 0,
			matrix = {};

	Object.defineProperties(matrix, matrix_properties);
	Object.defineProperties(matrix, {
		//props
		'a': {
      enumerable: true,
      configurable: false,
      get: function () { return a; },
			set: function (n) {
				if (typeof n !== 'number') {
					throw new TypeError("matrix.a: Parameter must be a number.");
				}
				a = n;
			}
    },

		'b': {
      enumerable: true,
      configurable: false,
      get: function () { return b; },
			set: function (n) {
				if (typeof n !== 'number') {
					throw new TypeError("matrix.b: Parameter must be a number.");
				}
				b = n;
			}
    },

		'c': {
      enumerable: true,
      configurable: false,
      get: function () { return c; },
			set: function (n) {
				if (typeof n !== 'number') {
					throw new TypeError("matrix.c: Parameter must be a number.");
				}
				c = n;
			}
    },

		'd': {
      enumerable: true,
      configurable: false,
      get: function () { return d; },
			set: function (n) {
				if (typeof n !== 'number') {
					throw new TypeError("matrix.d: Parameter must be a number.");
				}
				d = n;
			}
    },

		'tx': {
      enumerable: true,
      configurable: false,
      get: function () { return tx; },
			set: function (n) {
				if (typeof n !== 'number') {
					throw new TypeError("matrix.tx: Parameter must be a number.");
				}
				tx = n;
			}
    },

		'ty': {
      enumerable: true,
      configurable: false,
      get: function () { return ty; },
			set: function (n) {
				if (typeof n !== 'number') {
					throw new TypeError("matrix.ty: Parameter must be a number.");
				}
				ty = n;
			}
    }
		
	});
	
	if (typeof initializer === 'function') {
		initializer.call(matrix);
	}
	return matrix;
};

/* Check if a given object contains a numeric matrix properties.
 * Does not check if a matrix is actually a doodle.geom.matrix.
 * @param {Matrix} m Object with numeric matrix parameters.
 * @param {String} fn_name Function name to show in TypeError message.
 * @return {Boolean}
 */
doodle.geom.Matrix.isMatrix = function (m, fn_name) {
  if (typeof m.a  !== "number" || typeof m.b  !== "number" ||
      typeof m.c  !== "number" || typeof m.d  !== "number" ||
      typeof m.tx !== "number" || typeof m.ty !== "number") {
    throw new TypeError(fn_name + ": Parameter must be a matrix.");
  } else {
    return true;
  }
};


(function () {
  //avoid lookups
  var Matrix = doodle.geom.Matrix,
      isMatrix = Matrix.isMatrix,
      Point = doodle.geom.Point,
      isPoint = Point.isPoint;

  Object.defineProperties(Matrix, {

    /*
     * PROPERTIES
     */
    
    /* The value that affects the positioning of pixels along the x axis
     * when scaling or rotating an image.
     * @param {Number} a
     */
    'a': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: 1
    },
    
    /* The value that affects the positioning of pixels along the y axis
     * when rotating or skewing an image.
     * @param {Number} b
     */
    'b': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: 0
    },
    
    /* The value that affects the positioning of pixels along the x axis
     * when rotating or skewing an image.
     * @param {Number} c
     */
    'c': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: 0
    },
    
    /* The value that affects the positioning of pixels along the y axis
     * when scaling or rotating an image.
     * @param {Number} d
     */
    'd': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: 1
    },
    
    /* The distance by which to translate each point along the x axis.
     * @param {Number} tx
     */
    'tx': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: 0
    },
    
    /* The distance by which to translate each point along the y axis.
     * @param {Number} ty
     */
    'ty': {
      enumerable: true,
      writable: true,
      configurable: false,
      value: 0
    },

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
        if (typeof a  !== "number" || typeof b  !== "number" ||
            typeof c  !== "number" || typeof d  !== "number" ||
            typeof tx !== "number" || typeof ty !== "number") {
          throw new TypeError("matrix.compose: Parameter must be a number.");
        } else {
          this.a  = a;
          this.b  = b;
          this.c  = c;
          this.d  = d;
          this.tx = tx;
          this.ty = ty;
          return this;
        }
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
        if(isMatrix(m, 'matrix.equals')) {
          return ((this && m && 
                   this.a === m.a &&
                   this.b === m.b &&
                   this.c === m.c &&
                   this.d === m.d &&
                   this.tx === m.tx &&
                   this.ty === m.ty) || 
                  (!this && !m));
        }
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
        return Object.create(Matrix).compose(this.a, this.b, this.c,
                                             this.d, this.tx, this.ty);
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
        if (isMatrix(m, 'matrix.multiply')) {
          var a  = this.a  * m.a + this.b  * m.c,
              b  = this.a  * m.b + this.b  * m.d,
              c  = this.c  * m.a + this.d  * m.c,
              d  = this.c  * m.b + this.d  * m.d,
              tx = this.tx * m.a + this.ty * m.c + m.tx,
              ty = this.tx * m.b + this.ty * m.d + m.ty;
          return this.compose(a, b, c, d, tx, ty);
        }
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
      value: function (angle) {
        if (typeof angle !== "number") {
          throw new TypeError("matrix.rotate: Parameter must be a number.");
        } else {
          var cos = Math.cos(angle),
              sin = Math.sin(angle),
              m = Object.create(Matrix).compose(cos, sin, -sin, cos, 0, 0);
          return this.multiply(m);
        }
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
      value: function (angle) {
        if (typeof angle !== "number") {
          throw new TypeError("matrix.deltaRotate: Parameter must be a number.");
        } else {
          var x = this.tx,
              y = this.ty;
          this.rotate(angle);
          this.tx = x;
          this.ty = y;
          return this;
        }
      }
    },

    /* Return the angle of rotation in radians.
     * @return {Number} radians
     */
    'rotation': {
      enumerable: true,
      configurable: false,
      get: function () {
        return Math.atan2(this.b, this.a);
      },
      /* Set a new rotation for matrix.
       * @param {Number} angle, in radians
       * @return {Matrix}
       */
      set: function (angle) {
        if (typeof angle !== "number") {
          throw new TypeError("matrix.rotation: Parameter must be a number.");
        } else {
          var cos = Math.cos(angle),
              sin = Math.sin(angle);
          return this.compose(cos, sin, -sin, cos, 0, 0);
        }
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
        if (typeof sx !== "number" || typeof sy !== "number") {
          throw new TypeError("matrix.scale: Parameter must be a number.");
        } else {
          var m = Object.create(Matrix).compose(sx, 0, 0, sy, 0, 0);
          return this.multiply(m);
        }
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
        if (typeof sx !== "number" || typeof sy !== "number") {
          throw new TypeError("matrix.deltaScale: Parameter must be a number.");
        } else {
          var x = this.tx,
              y = this.ty;
          this.scale(sx, sy);
          this.tx = x;
          this.ty = y;
          return this;
        }
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
        if (typeof dx !== "number" || typeof dy !== "number") {
          throw new TypeError("matrix.translate: Parameter must be a number.");
        } else {
          this.tx += dx;
          this.ty += dy;
          return this;
        }
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
        if (typeof skewX !== "number" || typeof skewY !== "number") {
          throw new TypeError("matrix.skew: Parameter must be a number.");
        } else {
          var sx = Math.tan(skewX),
              sy = Math.tan(skewY),
              m = Object.create(Matrix).compose(1, sy, sx, 1, 0, 0);
          return this.multiply(m);
        }
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
        if (typeof skewX !== "number" || typeof skewY !== "number") {
          throw new TypeError("matrix.deltaSkew: Parameter must be a number.");
        } else {
          var x = this.tx,
              y = this.ty;
          this.skew(skewX, skewY);
          this.tx = x;
          this.ty = y;
          return this;
        }
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
        if(isMatrix(m, 'matrix.add')) {
          this.a  += m.a;
          this.b  += m.b;
          this.c  += m.c;
          this.d  += m.d;
          this.tx += m.tx;
          this.ty += m.ty;
          return this;
        }
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
        if (isPoint(pt, 'matrix.transformPoint')) {
          return Object.create(Point).compose(pt.x * this.a + pt.y * this.b + this.tx,
                                              pt.x * this.c + pt.y * this.d + this.ty);
        }
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
        if (isPoint(pt, 'matrix.deltaTransformPoint')) {
          return Object.create(Point).compose(pt.x * this.a + pt.y * this.b,
                                              pt.x * this.c + pt.y * this.d);
        }
      }
    },
    
    'rotateAroundExternalPoint': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt, angle) {
        if (typeof angle !== "number") {
          throw new TypeError("matrix.rotateAroundExternalPoint: Parameter must be a number.");
        } else if (isPoint(pt, 'matrix.rotateAroundExternalPoint')) {
          this.translate(pt.x, pt.y);
          this.rotate(angle * Math.PI/180);
          return this.translate(-pt.x, -pt.y);
        }
      }
    },
    
    'rotateAroundInternalPoint': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt, angle) {
        if (typeof angle !== "number") {
          throw new TypeError("matrix.rotateAroundInternalPoint: Parameter must be a number.");
        } else if (isPoint(pt, 'matrix.rotateAroundInternalPoint')) {
          var p = this.transformPoint(pt);
          return this.rotateAroundExternalPoint(p, angle);
        }
      }
    },
    
    'matchInternalPointWithExternal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt_int, pt_ext) {
        if (isPoint(pt_int, 'matrix.matchInternalPointWithExternal') &&
            isPoint(pt_ext, 'matrix.matchInternalPointWithExternal')) {
          var pt = this.transformPoint(pt_int),
              dx = pt_ext.x - pt.x,
              dy = pt_ext.y - pt.y;
          return this.translate(dx, dy);
        }
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
        if (typeof t !== "number") {
          throw new TypeError("matrix.interpolate: Parameter must be a number.");
        } else if (isMatrix(m, 'matrix.interpolate')) {
          this.a  = this.a  + (m.a  - this.a)  * t;
          this.b  = this.b  + (m.b  - this.b)  * t;
          this.c  = this.c  + (m.c  - this.c)  * t;
          this.d  = this.d  + (m.d  - this.d)  * t;
          this.tx = this.tx + (m.tx - this.tx) * t;
          this.ty = this.ty + (m.ty - this.ty) * t;
          return this;
        }
      }
    }
    
  });//end matrix properties defintion
}());
