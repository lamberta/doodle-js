/*globals doodle*/

(function () {
  var rect_static_properties,
      isRect,
      temp_array = new Array(4),
      /*DEBUG*/
      check_rect_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_point_type = doodle.utils.types.check_point_type,
      /*END_DEBUG*/
      //lookup help
      doodle_Rectangle,
      max = Math.max,
      min = Math.min;
  
  /* Rectangle
   * @constructor
   * @param {Number=} x
   * @param {Number=} y
   * @param {Number=} width
   * @param {Number=} height
   * @return {Rectangle}
   */
  doodle_Rectangle = doodle.geom.Rectangle = function (x, y, width, height) {
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

        'width': {
          enumerable: true,
          configurable: false,
          get: function () { return width; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.width');
            /*END_DEBUG*/
            width = n;
          }
        },

        'height': {
          enumerable: true,
          configurable: false,
          get: function () { return height; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.height');
            /*END_DEBUG*/
            height = n;
          }
        },

        /* Same as toArray, but reuses array object.
         */
        '__toArray': {
          enumerable: false,
          writable: false,
          configurable: false,
          value: function () {
            var rect = $temp_array;
            rect[0] = x;
            rect[1] = y;
            rect[2] = width;
            rect[3] = height;
            return rect;
          }
        }
        
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
        check_rect_type(init_obj, '[object Rectangle](rect)');
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
    'top': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.y;
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.top');
        /*END_DEBUG*/
        this.y = n;
        this.height -= n;
      }
    },
    
    'right': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.x + this.width;
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.right');
        /*END_DEBUG*/
        this.width = n - this.x;
      }
    },
    
    'bottom': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.y + this.height;
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.bottom');
        /*END_DEBUG*/
        this.height = n - this.y;
      }
    },
    
    'left': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.x;
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.left');
        /*END_DEBUG*/
        this.x = n;
        this.width -= n;
      }
    },
    
    /*
     * METHODS
     */
    
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "(x="+ this.x +", y="+ this.y +", w="+ this.width +", h="+ this.height +")";
      }
    },
    
    'toArray': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return this.__toArray().concat();
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
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (x, y, width, height) {
        /*DEBUG*/
        check_number_type(x, this+'.compose', '*x*, y, width, height');
        check_number_type(y, this+'.compose', 'x, *y*, width, height');
        check_number_type(width, this+'.compose', 'x, y, *width*, height');
        check_number_type(height, this+'.compose', 'x, y, width, *height*');
        /*END_DEBUG*/
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
      }
    },

    /* Same as compose, but takes a rectangle parameter.
     */
    '__compose': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        check_rect_type(rect, this+'.__compose', '*rect*');
        /*END_DEBUG*/
        this.compose.apply(this, rect.__toArray());
        return this;
      }
    },

    'clone': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return doodle_Rectangle(this.x, this.y, this.width, this.height);
      }
    },

    /* Adjusts the location of the rectangle, as determined by
     * its top-left corner, by the specified amounts.
     * @param {Number} dx
     * @param {Number} dy
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

    /* Increases the size of the rectangle by the specified amounts, in pixels.
     * The center point of the Rectangle object stays the same, and its size
     * increases to the left and right by the dx value, and to the top and the
     * bottom by the dy value.
     * @param {Number} dx
     * @param {Number} dy
     */
    'inflate': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (dx, dy) {
        /*DEBUG*/
        check_number_type(dx, this+'.inflate', '*dx*, dy');
        check_number_type(dy, this+'.inflate', 'dx, *dy*');
        /*END_DEBUG*/
        this.x -= dx;
        this.width += 2 * dx;
        this.y -= dy;
        this.height += 2 * dy;
        return this;
      }
    },

    /* Determines whether the rectangle argument is equal to this rectangle.
     * @param {Rectangle} rect
     * @return {Boolean}
     */
    'equals': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        check_rect_type(rect, this+'.equals', '*rect*');
        /*END_DEBUG*/
        return (this.x === rect.x && this.y === rect.y &&
                this.width === rect.width && this.height === rect.height);
      }
    },

    /* Determines whether or not this Rectangle object is empty.
     */
    'isEmpty': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return (this.width >= 0 || this.height >= 0);
      }
    },

    /* Determines whether the specified point is contained within the
     * rectangular region defined by this Rectangle object.
     */
    'contains': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (x, y) {
        /*DEBUG*/
        check_number_type(x, this+'.contains', '*x*, y');
        check_number_type(y, this+'.contains', 'x, *y*');
        /*END_DEBUG*/
        return (x >= this.left && x <= this.right &&
                y >= this.top && y <= this.bottom);
      }
    },

    /* Determines whether the specified point is contained within this rectangle object.
     * @param {Point} pt
     * @return {Boolean}
     */
    'containsPoint': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (pt) {
        /*DEBUG*/
        check_point_type(pt, this+'.containsPoint', '*point*');
        /*END_DEBUG*/
        return this.contains(pt.x, pt.y);
      }
    },

    /* Determines whether the rectangle argument is contained within this rectangle.
     * @param {Rectangle} rect
     * @return {Boolean}
     */
    'containsRect': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        check_rect_type(rect, this+'.containsRect', '*rect*');
        /*END_DEBUG*/
        //check each corner
        return (this.contains(rect.x, rect.y) &&           //top-left
                this.contains(rect.right, rect.y) &&       //top-right
                this.contains(rect.right, rect.bottom) &&  //bot-right
                this.contains(rect.x, rect.bottom));       //bot-left
      }
    },

    /* Determines whether the rectangle argument intersects with this rectangle.
     * @param {Rectangle} rect
     * @return {Boolean}
     */
    'intersects': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        check_rect_type(rect, this+'.intersects', '*rect*');
        /*END_DEBUG*/
        //check each corner
        return (this.contains(rect.x, rect.y) ||           //top-left
                this.contains(rect.right, rect.y) ||       //top-right
                this.contains(rect.right, rect.bottom) ||  //bot-right
                this.contains(rect.x, rect.bottom));       //bot-left
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
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        check_rect_type(rect, this+'.intersection', '*rect*');
        /*END_DEBUG*/
        var r = doodle_Rectangle(0, 0, 0, 0);
        if (this.intersects(rect)) {
          r.left = max(this.left, rect.left);
          r.top = max(this.top, rect.top);
          r.right = min(this.right, rect.right);
          r.bottom = min(this.bottom, rect.bottom);
        }
        return r;
      }
    },

    /* Same as intersection, but modifies this rectangle in place.
     */
    '__intersection': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        check_rect_type(rect, this+'.intersection', '*rect*');
        /*END_DEBUG*/
        if (this.intersects(rect)) {
          this.left = max(this.left, rect.left);
          this.top = max(this.top, rect.top);
          this.right = min(this.right, rect.right);
          this.bottom = min(this.bottom, rect.bottom);
        }
        return this;
      }
    },

    /* Adds two rectangles together to create a new Rectangle object,
     * by filling in the horizontal and vertical space between the two.
     * @param {Rectangle} rect
     * @return {Rectangle}
     */
    'union': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        check_rect_type(rect, this+'.union', '*rect*');
        /*END_DEBUG*/
        var r = doodle_Rectangle(0, 0, 0, 0);
        r.left = min(this.left, rect.left);
        r.top = min(this.top, rect.top);
        r.right = max(this.right, rect.right);
        r.bottom = max(this.bottom, rect.bottom);
        return r;
      }
    },

    /* Same as union, but modifies this rectangle in place.
     */
    '__union': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (rect) {
        /*DEBUG*/
        check_rect_type(rect, this+'.__union', '*rect*');
        /*END_DEBUG*/
        //a bit tricky, if applied directly it doesn't work
        var l = min(this.left, rect.left),
            t = min(this.top, rect.top),
            r = max(this.right, rect.right),
            b = max(this.bottom, rect.bottom);
        this.left = l;
        this.top = t;
        this.right = r;
        this.bottom = b;
        
        return this;
      }
    }
    
  };//end rect_static_properties definition

  /*
   * CLASS FUNCTIONS
   */

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

  /*DEBUG*/
  check_rect_type = doodle.utils.types.check_rect_type = function (rect, caller_name) {
    if (!isRect(rect)) {
      caller_name = (caller_name === undefined) ? "check_rect_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a rectangle.");
    } else {
      return true;
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
