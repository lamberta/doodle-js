(function () {
  var matrix_static_properties,
      isMatrix,
      check_matrix_type,
      doodle_Point = doodle.geom.Point,
      check_number_type = doodle.utils.types.check_number_type,
      check_point_type = doodle.utils.types.check_point_type,
      sin = Math.sin,
      cos = Math.cos,
      atan2 = Math.atan2,
      tan = Math.tan;
  
  /* Super constructor
   * @param {Number|Array|Matrix|Function} (a, b, c, d, tx, ty)|initializer
   * @return {Object}
   */
  doodle_Matrix = doodle.geom.Matrix = function (a, b, c, d, tx, ty) {
    var matrix = {},
        arg_len = arguments.length,
        init_obj; //function, array, matrix

    /*DEBUG*/
    if (arg_len !== 0 && arg_len !== 1 && arg_len !== 6) {
      throw new SyntaxError("[object Matrix](a, b, c, d, tx, ty): Invalid number of parameters.");
    }
    /*END_DEBUG*/
    
    Object.defineProperties(matrix, matrix_static_properties);
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
          /*DEBUG*/
          check_number_type(n, this+'.a');
          /*END_DEBUG*/
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
          /*DEBUG*/
          check_number_type(n, this+'.b');
          /*END_DEBUG*/
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
          /*DEBUG*/
          check_number_type(n, this+'.c');
          /*END_DEBUG*/
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
          /*DEBUG*/
          check_number_type(n, this+'.d');
          /*END_DEBUG*/
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
          /*DEBUG*/
          check_number_type(n, this+'.tx');
          /*END_DEBUG*/
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
          /*DEBUG*/
          check_number_type(n, this+'.ty');
          /*END_DEBUG*/
          ty = n;
        }
      }
    });//end defineProperties

    //initialize matrix
    if (arg_len === 0) {
      //default instantiation: 1,0,0,1,0,0
      matrix.identity();
    } else if (arg_len === 6) {
      //standard instantiation
      matrix.compose(a, b, c, d, tx, ty);
    } else {
      //passed an initialization obj
      init_obj = arguments[0];
      a = undefined;
      
      if (typeof init_obj === 'function') {
        matrix.identity();
        init_obj.call(matrix);
      }  else if (Array.isArray(init_obj)) {
        /*DEBUG*/
        if (init_obj.length !== 6) {
          throw new SyntaxError("[object Matrix]([a, b, c, d, tx, ty]): Invalid array parameter.");
        }
        /*END_DEBUG*/
        matrix.compose.apply(matrix, init_obj);
      } else {
        /*DEBUG*/
        check_matrix_type(init_obj, '[object Matrix](matrix)');
        /*END_DEBUG*/
        matrix.compose(init_obj.a, init_obj.b, init_obj.c,
                       init_obj.d, init_obj.tx, init_obj.ty);
      }
    }
    
    return matrix;
  };

  
  matrix_static_properties = {
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
        /*DEBUG*/
        check_number_type(a, this+'.compose', '*a*, b, c, d, tx, ty');
        check_number_type(b, this+'.compose', 'a, *b*, c, d, tx, ty');
        check_number_type(c, this+'.compose', 'a, b, *c*, d, tx, ty');
        check_number_type(d, this+'.compose', 'a, b, c, *d*, tx, ty');
        check_number_type(tx, this+'.compose', 'a, b, c, d, *tx*, ty');
        check_number_type(ty, this+'.compose', 'a, b, c, d, tx, *ty*');
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
        /*DEBUG*/
        check_matrix_type(m, this+'.equals', '*matrix*');
        /*END_DEBUG*/
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
        return doodle_Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
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
        /*DEBUG*/
        check_matrix_type(m, this+'.multiply', '*matrix*');
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

    /* Applies a rotation transformation to the Matrix object.
     * @param {Number} angle The rotation angle in radians.
     * @return {Matrix}
     */
    'rotate': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (radians) {
        /*DEBUG*/
        check_number_type(radians, this+'.rotate', '*radians*');
        /*END_DEBUG*/
        var c = cos(radians),
            s = sin(radians),
            m = doodle_Matrix(c, s, -s, c, 0, 0);
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
        /*DEBUG*/
        check_number_type(radians, this+'.deltaRotate', '*radians*');
        /*END_DEBUG*/
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
        /*DEBUG*/
        check_number_type(radians, this+'.rotation', '*radians*');
        /*END_DEBUG*/
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
        /*DEBUG*/
        check_number_type(sx, this+'.scale', '*sx*, sy');
        check_number_type(sy, this+'.scale', 'sx, *sy*');
        /*END_DEBUG*/
        var m = doodle_Matrix(sx, 0, 0, sy, 0, 0);
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
        /*DEBUG*/
        check_number_type(sx, this+'.deltaScale', '*sx*, sy');
        check_number_type(sy, this+'.deltaScale', 'sx, *sy*');
        /*END_DEBUG*/
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
        /*DEBUG*/
        check_number_type(dx, this+'.translate', '*dx*, dy');
        check_number_type(dy, this+'.translate', 'dx, *dy*');
        /*END_DEBUG*/
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
        /*DEBUG*/
        check_number_type(skewX, this+'.skew', '*skewX*, skewY');
        check_number_type(skewY, this+'.skew', 'skewX, *skewY*');
        /*END_DEBUG*/
        var sx = tan(skewX),
            sy = tan(skewY),
            m = doodle_Matrix(1, sy, sx, 1, 0, 0);
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
        /*DEBUG*/
        check_number_type(skewX, this+'.deltaSkew', '*skewX*, skewY');
        check_number_type(skewY, this+'.deltaSkew', 'skewX, *skewY*');
        /*END_DEBUG*/
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
        /*DEBUG*/
        check_matrix_type(m, this+'.add', '*matrix*');
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
        /*DEBUG*/
        check_point_type(pt, this+'.transformPoint', '*point*');
        /*END_DEBUG*/
        return doodle_Point(this.a * pt.x + this.c * pt.y + this.tx,
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
        /*DEBUG*/
        check_point_type(pt, this+'.deltaTransformPoint', '*point*');
        /*END_DEBUG*/
        return doodle_Point(this.a * pt.x + this.c * pt.y,
                            this.b * pt.x + this.d * pt.y);
      }
    },
    
    'rotateAroundExternalPoint': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt, radians) {
        /*DEBUG*/
        check_point_type(pt, this+'.rotateAroundExternalPoint', '*point*, radians');
        check_number_type(radians, this+'.rotateAroundExternalPoint', 'point, *radians*');
        /*END_DEBUG*/
        var parent_matrix = doodle_Matrix().rotate(radians), //global space
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
        /*DEBUG*/
        check_point_type(pt, this+'.rotateAroundInternalPoint', '*point*, radians');
        check_number_type(radians, this+'.rotateAroundInternalPoint', 'point, *radians*');
        /*END_DEBUG*/
        var p = this.transformPoint(pt);
        return this.rotateAroundExternalPoint(p, radians);
      }
    },
    
    'matchInternalPointWithExternal': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (pt_int, pt_ext) {
        /*DEBUG*/
        check_point_type(pt_int, this+'.matchInternalPointWithExternal', '*pt_int*, pt_ext');
        check_point_type(pt_ext, this+'.matchInternalPointWithExternal', 'pt_int, *pt_ext*');
        /*END_DEBUG*/
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
        /*DEBUG*/
        check_matrix_type(m, this+'.interpolate', '*matrix*, t');
        check_number_type(t, this+'.interpolate', 'matrix, *t*');
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

  
  /*
   * CLASS FUNCTIONS
   */
  
  /* Check if a given object contains a numeric matrix properties.
   * Does not check if a matrix is actually a doodle.geom.matrix.
   * @param {Matrix} m Object with numeric matrix parameters.
   * @return {Boolean}
   */
  isMatrix = doodle.geom.Matrix.isMatrix = function (m) {
    return (m !== undefined && m !== null &&
            typeof m.a  === 'number' && typeof m.b  === 'number' &&
            typeof m.c  === 'number' && typeof m.d  === 'number' &&
            typeof m.tx === 'number' && typeof m.ty === 'number');
  };

  check_matrix_type = doodle.utils.types.check_matrix_type = function (m, caller_name) {
    if (!isMatrix(m)) {
      caller_name = (caller_name === undefined) ? "check_matrix_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a matrix.");
    } else {
      return true;
    }
  };
  
}());//end class closure
