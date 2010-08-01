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

(function () {

  var sprite_properties,
			bounds_properties,
      isSprite,
      inheritsSprite,
      hex_to_rgb = doodle.utils.hex_to_rgb,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_function_type = doodle.utils.types.check_function_type,
      check_rect_type = doodle.utils.types.check_rect_type,
			check_context_type = doodle.utils.types.check_context_type,
			Rectangle = doodle.geom.Rectangle;


  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Sprite = function (id) {
    var arg_len = arguments.length,
        initializer,
        sprite,
				width = 0,
				height = 0,
        hit_area = null,
				draw_commands = [];

    //inherits from doodle.Node, if string pass along id
    sprite = (typeof id === 'string') ?
      Object.create(doodle.Node(id)) : Object.create(doodle.Node());

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
      id = undefined;
    } else if (arg_len > 1) {
      throw new SyntaxError("[object Sprite]: Invalid number of parameters.");
    }

    Object.defineProperties(sprite, sprite_properties);
    //properties that require privacy
    Object.defineProperties(sprite, {
      /*
       * PROPERTIES
       */

			/* Indicates the width of the sprite, in pixels.
       * @param {Number}
       */
      'width': {
        enumerable: true,
        configurable: false,
        get: function () {
          return width;
        },
        set: function (n) {
          check_number_type(n, this+'.width');
          width = n;
        }
      },

      /* Indicates the height of the sprite, in pixels.
       * @param {Number}
       */
      'height': {
        enumerable: true,
        configurable: false,
        get: function () {
          return height;
        },
        set: function (n) {
          check_number_type(n, this+'.height');
          height = n;
        }
      },
      
      'bounds': {
        enumerable: false,
        configurable: false,
        get: (function () {
					//we'll be reusing these vars
					var bounding_box = Rectangle(),
							min = Math.min,
							max = Math.max,
							x, y, w, h,
							//transform_point,
							tr0, tr1, tr2, tr3;
					
					return function () {
						//var transform_point = this.transform.transformPoint;
						//x = this.x;
						//y = this.y;
						w = this.width;
						h = this.height;
						
						//re-calculate bounding box

						//transform corners: tl, tr, br, bl
						//relative to x/y of sprite!
						//this matrix has dx/dy to apply
						tr0 = this.transform.transformPoint({x: 0, y: 0});
						tr1 = this.transform.transformPoint({x: w, y: 0});
						tr2 = this.transform.transformPoint({x: w, y: h});
						tr3 = this.transform.transformPoint({x: 0, y: h});
						
						//set rect with extremas
						bounding_box.left = min(tr0.x, tr1.x, tr2.x, tr3.x);
						bounding_box.right = max(tr0.x, tr1.x, tr2.x, tr3.x);
						bounding_box.top = min(tr0.y, tr1.y, tr2.y, tr3.y);
						bounding_box.bottom = max(tr0.y, tr1.y, tr2.y, tr3.y);
						
						return bounding_box;
					}
				}())
      },
      
      'hitArea': {
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
          rect = (rect === false) ? null : rect;
          //accepts null or rectangle area for now
          if (rect === null || check_rect_type(rect, this+'.hitArea')) {
            hit_area = rect;
          }
        }
      },

			//drawing context to use
			'context': {
				get: function () {
					//will keep checking parent for context till found or null
					var node = this.parent,
							ctx;
					while (node) {
						if (node.context) {
							ctx = node.context;
							check_context_type(ctx, this+'.context (traversal)')
							return ctx;
						}
						node = node.parent;
					}
					return null;
				}
			},

      /*
       * METHODS
       */

      /* When called execute all the draw commands in the stack.
       * @param {Context} context 2d canvas context to draw on.
       */
      'draw': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          var self = this,
							ctx = this.context,
							mat = this.transform.toArray();

					if (!ctx) {
						throw new ReferenceError(this+".draw: Unable to find 2d Render Context.");
					}

					//need to move context around
					ctx.save();
					ctx.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5]);
					
          draw_commands.forEach(function (cmd) {
            //draw function, provide self for this and context as arg
            if (typeof cmd === "function") {
              cmd.call(self, ctx);
              return;
            }
            //draw object, given canvas.context command and param
            var prop = Object.keys(cmd)[0];
            switch (typeof ctx[prop]) {
            case "function":
              //context method
              ctx[prop].apply(ctx, cmd[prop]);
              break;
            case "string":
              //context property
              ctx[prop] = cmd[prop];
              break;
            }
          });
					ctx.restore();
        }
      },

			'clear': {
				value: function () {
					var b_box = this.bounds;

					this.context.clearRect(b_box.x, b_box.y, b_box.width, b_box.height);
				}
			},

      /*
       * GRAPHICS
       */
      'graphics': {
        value: Object.create(null, {
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
              if (check_function_type(fn, sprite+'.graphics.draw')) {
                draw_commands.push(fn);
              }
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
							//reset dimensions
							sprite.width = 0;
							sprite.height = 0;
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
              check_number_type(alpha, sprite+'.graphics.beginFill');

              var rgb = hex_to_rgb(color),
                  rgb_str = 'rgba('+ rgb[0] +','+ rgb[1] +','+ rgb[2] +','+ alpha +')';
              
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
              check_number_type(arguments, sprite+'.graphics.rect');
              //relative to registration point of sprite

							var new_w = x + w,
									new_h = y + h;
              //check for new bounds extrema
							if (new_w > sprite.width) {
								sprite.width = new_w;
							}
							if (new_h > sprite.height) {
								sprite.height = new_h;
							}
              
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
              check_number_type(arguments, sprite+'.graphics.circle');
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
              check_number_type(arguments, sprite+'.graphics.ellipse');
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
              check_number_type(arguments, sprite+'.graphics.roundRect');
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
              check_number_type(arguments, sprite+'.graphics.lineTo');
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
              check_number_type(arguments, sprite+'.graphics.moveTo');
              draw_commands.push({'moveTo': [x, y]});
            }
          }
        })
      }//end graphics object
    });//end sprite property definitions w/ privact


    //passed an initialization object: function
    if (initializer) {
      initializer.call(sprite);
    }
		
    return sprite;
  };

  
  /*
   * CLASS METHODS
   */
  
  isSprite = doodle.Sprite.isSprite = function (obj) {
    return obj.toString() === '[object Sprite]';
  };

  /* Check if object inherits from Sprite.
   * @param {Object} obj
   * @return {Boolean}
   */
  inheritsSprite = doodle.Sprite.inheritsSprite = function (obj) {
    while (obj) {
      if (isSprite(obj)) {
        return true;
      } else {
        if (typeof obj !== 'object') {
          return false;
        }
        obj = Object.getPrototypeOf(obj);
      }
    }
    return false;
  };

  doodle.utils.types.check_sprite_type = function (sprite, caller_name) {
    if (!inheritsSprite(sprite)) {
      caller_name = (caller_name === undefined) ? "check_sprite_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a sprite.");
    } else {
      return true;
    }
  };
  

  (function () {
    
    sprite_properties = {
      /*
       * PROPERTIES
       */

			'rotation': {
				enumerable: true,
        configurable: false,
        get: function () {
          return this.transform.rotation * 180/Math.PI; //return degress
        },
        set: function (deg) {
          if (check_number_type(deg, this+'.rotation')) {
            this.transform.rotation = deg * Math.PI/180; //deg-to-rad
          }

					//re-calc bounding box
					new_xy = this.transform.transformPoint({x: this.x, y: this.y});
					
        }
			},

      /*
       * METHODS
       */

      /* Returns the string representation of the specified object.
       * @param {String}
       */
      'toString': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function () {
          return "[object Sprite]";
        }
      },

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
          check_number_type(arguments, this+'.compose')
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          return this;
        }
      }
    };//end sprite_properties
		
  }());
}());//end class closure
