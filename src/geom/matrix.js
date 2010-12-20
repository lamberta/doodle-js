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
