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
  function Rectangle (x, y, width, height) {
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
  }//end Rectangle definition

  doodle.geom.Rectangle = Rectangle;

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
