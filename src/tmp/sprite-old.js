/*not implemented
  id: null,
  //node has matrix - x,y
  showBoundingBox: null,

  clickable: false,
  useHandCursor: false, //on mouse over
  hitArea: null, //if null use this, otherwise use another sprite
  hitTestPoint: null, //point intersects with obj bounds
  hitTestObject: null, //another object intersects with obj bounds
*/

/*
my_props = function () {
	return {
		z: (function () {
			var _z = [];
			return {
				get: function () {
					return _z;
				},
				set: function (a) {
					_z.push(a);
				}
			};
		}())
	}
};
Object.create(inherit_from, my_props() );
*/

(function () {

  var isRect = doodle.geom.rectangle.isRect;


	//super constructor
	/*doodle.Sprite = function () {
		var priv;
		//base class, methods require no private vars
		var self = Object.create(doodle.prototypes.sprite, {
			//augment
			//properties
		});
		//augment self
		return self;
	};*/
	

  Object.defineProperty(doodle, 'sprite', {
    configurable: false,
    enumerable: true,
    //constructor
    get: function () {
      //how do i combine doodle.eventdispatcher with node?
      var sprite = Object.create(doodle.node),
          sprite_private_props,
          graphics_private_props,
          //private vars
          draw_commands = [], //draw stack
          hit_area = null;    //alternative hit area for sprite

      //define sprite properties and methods
      Object.defineProperties(sprite, sprite_properties);
      //require closure for private vars, arrays passed by reference
      sprite_private_props = define_sprite_properties(draw_commands);
      Object.defineProperties(sprite, sprite_private_props);

      //define methods for sprite.graphics, all require closure
      graphics_private_props = define_graphics_properties(draw_commands);
      //can't declare in props object for some reason
      sprite.graphics = Object.defineProperties({}, graphics_private_props);

      //requires a closure for private var...
      /* Designates another rectangle to serve as the hit area for a sprite.
       * If null, use the bounds rectangle.
       */
      Object.defineProperty(sprite, 'hitArea', {
        enumerable: false,
        configurable: false,
        get: function () {
          if (hit_area === null) {
            return this.bounds;
          } else {
            return hit_area;
          }
        },
        set: function (rect) {
          //only accepts a rectangle area for now
          if (isRect(rect, 'sprite.hitArea')) {
            hit_area = rect;
          }
        }
      });

      //initialize size, defaults to x:0, y:0, w:0, h:0
      //can't list in properties object for whatever reason
      sprite.bounds = Object.create(doodle.geom.rectangle);
      sprite.compose(sprite.x, sprite.y, sprite.width, sprite.height);
      
      return sprite;
    }
  });

  var sprite_properties = {
    /*
     * PROPERTIES
     */

    /* Indicates the x coordinate of the sprite instance relative to the
     * local coordinates of the parent node. Updates apply to bounding box as well.
     * @param {Number}
     */
    'x': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.transform.tx;
      },
      set: function (d) {
        this.transform.tx = d;
        this.bounds.x = d;
      }
    },

    /* Indicates the y coordinate of the sprite instance relative to the
     * local coordinates of the parent node. Updates apply to bounding box as well.
     * @param {Number}
     */
    'y': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.transform.ty;
      },
      set: function (d) {
        this.transform.ty = d;
        this.bounds.y = d;
      }
    },

    /* Indicates the width of the sprite, in pixels.
     * @param {Number}
     */
    'width': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.bounds.width;
      },
      set: function (n) {
        this.bounds.width = n;
      }
    },

    /* Indicates the height of the sprite, in pixels.
     * @param {Number}
     */
    'height': {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.bounds.height;
      },
      set: function (n) {
        this.bounds.height = n;
      }
    },

    /*
     * METHODS
     */

    /* Updates the position and size of this sprite.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @return {Sprite}
     */
    'compose': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
      }
    }
  };

  /* These are created every time an object is instantiated
   * because it needs a closure for private vars.
   */
  function define_sprite_properties (draw_commands) {
    //static property description
    return {
      /*
       * METHODS
       */

      /* When called execute all the draw commands in the stack.
       */
      'draw': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          var self = this;
          draw_commands.forEach(function (cmd) {
            //draw function, provide self for this and context as arg
            if (typeof cmd === "function") {
              cmd.call(self, context);
              return;
            }
            //draw object, given canvas.context command and param
            var prop = Object.keys(cmd)[0];
            switch (typeof context[prop]) {
            case "function":
              //context method
              context[prop].apply(context, cmd[prop]);
              break;
            case "string":
              //context property
              context[prop] = cmd[prop];
              break;
            }
          });
        }
      }
      
    };//end sprite_property_object
  }//end define_sprite_properties


  /* These are created every time an object is instantiated
   * because it needs a closure for private vars.
   */
  function define_graphics_properties (draw_commands) {
    return {
      /*
       * METHODS
       */
      
      /* Provide direct access to the canvas drawing api.
       * Canvas context is called as the first argument to function.
       * Unable to set bounds from a user supplied function unless explictly set.
       * @param {Function} fn
       * Ex:
       * x = Object.create(doodle.sprite);
       * x.graphics.draw(function (ctx) {
       *   ctx.fillStyle = "#ff0000";
       *   ctx.fillRect(this.x, this.y, 100, 100);
       * });
       * x.draw();
       */
      'draw': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (fn) {
          draw_commands.push(fn);
        }
      },

      /* Remove all drawing commands for sprite.
       */
      'clear': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          //should probably test, better to assign new empty array?
          var i = draw_commands.length;
          while ((i=i-1) >= 0) {
            draw_commands.splice(i, 1);
          }
        }
      },

      /* Specifies a simple one-color fill that subsequent calls to other
       * graphics methods use when drawing.
       * @param {Color} color In hex format.
       * @param {Number} alpha
       */
      'beginFill': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (color, alpha) {
          alpha = alpha ? alpha : 1.0;
          //hex to rgb
          var r = (color & 0xff0000) >> 16,
          g = (color & 0x00ff00) >> 8,
          b = color & 0x0000ff,
          rgb_str = 'rgba('+ r +','+ g +','+ b +','+ alpha +')';
          
          draw_commands.push({'fillStyle': rgb_str});
        }
      },

      /*
       * @param {Number} x
       * @param {Number} y
       * @param {Number} w
       * @param {Number} h
       */
      'rect': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, w, h) {
          //relative to registration point of sprite
          
          //check for new bounds extrema
          //if (w > right) { right = w; }
          //if (h > bottom) { bottom = h; }
          
          draw_commands.push({'fillRect': [x,y,w,h]});
        }
      },

      /*
       * @param {Number} x
       * @param {Number} y
       * @param {Number} radius
       */
      'circle': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, radius) {
          var startAngle = 0,
          endAngle = Math.PI * 2,
          anticlockwise = true;
          draw_commands.push({'beginPath': null});
          draw_commands.push({'arc': [x, y, radius, startAngle, endAngle, anticlockwise]});
          draw_commands.push({'closePath': null});
          draw_commands.push({'fill': null});
        }
      },

      /*
       * @param {Number} x
       * @param {Number} y
       * @param {Number} width
       * @param {Number} height
       */
      'ellipse': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height) {
          var kappa = 0.5522847498,
          rx = width / 2,
          ry = height / 2,
          krx = kappa * rx,
          kry = kappa * ry;
          
          draw_commands.push({'beginPath': null});
          draw_commands.push({'moveTo': [x+rx, y]});
          //(cp1), (cp2), (pt)
          draw_commands.push({'bezierCurveTo': [x+rx, y-kry, x+krx, y-ry, x, y-ry]});
          draw_commands.push({'bezierCurveTo': [x-krx, y-ry, x-rx, y-kry, x-rx, y]});
          draw_commands.push({'bezierCurveTo': [x-rx, y+kry, x-krx, y+ry, x, y+ry]});
          draw_commands.push({'bezierCurveTo': [x+krx, y+ry, x+rx, y+kry, x+rx, y]});
          draw_commands.push({'closePath': null});
          draw_commands.push({'fill': null});
        }
      },

      /*
       * @param {Number} x
       * @param {Number} y
       * @param {Number} width
       * @param {Number} height
       * @param {Number} rx
       * @param {Number} ry
       */
      'roundRect': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y, width, height, rx, ry) {
          var x3 = x + width,
          x2 = x3 - rx,
          x1 = x + rx,
          y3 = y + height,
          y2 = y3 - ry,
          y1 = y + ry;
          
          //clockwise
          draw_commands.push({'moveTo': [x1, y]});
          draw_commands.push({'beginPath': null});
          draw_commands.push({'lineTo': [x2, y]});
          draw_commands.push({'quadraticCurveTo': [x3, y, x3, y1]});
          draw_commands.push({'lineTo': [x3, y2]});
          draw_commands.push({'quadraticCurveTo': [x3, y3, x2, y3]});
          draw_commands.push({'lineTo': [x1, y3]});
          draw_commands.push({'quadraticCurveTo': [x, y3, x, y2]});
          draw_commands.push({'lineTo': [x, y1]});
          draw_commands.push({'quadraticCurveTo': [x, y, x1, y]});
          draw_commands.push({'closePath': null});
          draw_commands.push({'fill': null});
        }
      },

      /*
       * @param {Number} x
       * @param {Number} y
       */
      'lineTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          draw_commands.push({'lineTo': [x, y]});
        }
      },

      /*
       * @param {Number} x
       * @param {Number} y
       */
      'moveTo': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (x, y) {
          draw_commands.push({'moveTo': [x, y]});
        }
      }
      
    };//end graphics property object
  }//end define_graphics_properties

}());
