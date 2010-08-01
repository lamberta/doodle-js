
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
