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
      isMatrix = doodle.geom.Matrix.isMatrix,
      check_matrix_type = doodle.utils.types.check_matrix_type,
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
        hit_area = null,
				draw_commands = [],
				bounds_offsetX = 0, //offsets used in getBounds and graphics shapes
				bounds_offsetY = 0;

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
      'width': (function () {
				var width = 0;
				return {
					enumerable: true,
					configurable: false,
					get: function () {
						return width;
					},
					set: function (n) {
						check_number_type(n, this+'.width');
						width = n;
					}
				};
      }()),

      /* Indicates the height of the sprite, in pixels.
       * @param {Number}
       */
      'height': (function () {
				var height = 0;
				return {
					enumerable: true,
					configurable: false,
					get: function () {
						return height;
					},
					set: function (n) {
						check_number_type(n, this+'.height');
						height = n;
					}
				};
      }()),

      /*
       * @param {Node|Matrix} targetCoordSpace
       * @return {Rectangle}
       */
      'getBounds': {
        enumerable: true,
        writable: true,
        configurable: false,
        value: function (targetCoordSpace) {
          var min = Math.min, max = Math.max,
              bounding_box = Rectangle(),
              w = this.width,
              h = this.height,
              //transform corners to global
              tl = this.localToGlobal({x: bounds_offsetX, y: bounds_offsetY}), //top left
              tr = this.localToGlobal({x: bounds_offsetX+w, y: bounds_offsetY}), //top right
              br = this.localToGlobal({x: bounds_offsetX+w, y: bounds_offsetY+h}), //bot right
              bl = this.localToGlobal({x: bounds_offsetX, y: bounds_offsetY+h}); //bot left
          
          //transform global to target space
          tl = targetCoordSpace.globalToLocal(tl);
          tr = targetCoordSpace.globalToLocal(tr);
          br = targetCoordSpace.globalToLocal(br);
          bl = targetCoordSpace.globalToLocal(bl);

          //set rect with extremas
          bounding_box.left = min(tl.x, tr.x, br.x, bl.x);
          bounding_box.right = max(tl.x, tr.x, br.x, bl.x);
          bounding_box.top = min(tl.y, tr.y, br.y, bl.y);
          bounding_box.bottom = max(tl.y, tr.y, br.y, bl.y);

          return bounding_box;
        }
      },
      
      'hitArea': {
        enumerable: true,
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
              check_context_type(ctx, this+'.context (traversal)');
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
       * This draws from screen 0,0 - transforms are applied when the
       * entire scene graph is drawn.
       * @private
       * @param {Context} ctx 2d canvas context to draw on.
       */
      '__draw': {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function (ctx) {
          check_context_type(ctx, this+'.__draw', 'context');

          draw_commands.forEach(function (cmd) {
            //draw function, provide self for this and context as arg
            if (typeof cmd === 'function') {
              cmd.call(sprite, ctx);
              return;
            }
            //draw object, given canvas.context command and param
            var prop = Object.keys(cmd)[0];
            switch (typeof ctx[prop]) {
            case 'function':
              //context method
              ctx[prop].apply(ctx, cmd[prop]);
              break;
            case 'string':
              //context property
              ctx[prop] = cmd[prop];
              break;
            }
          });
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
            value: (function (fn) {
              check_function_type(fn, this+'.graphics.draw', 'function');
              draw_commands.push(fn);
            }).bind(sprite)
          },

          /* Remove all drawing commands for sprite.
           */
          'clear': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function () {
              //should probably test, better to assign new empty array?
              var i = draw_commands.length;
              while ((i=i-1) >= 0) {
                draw_commands.splice(i, 1);
              }
              //reset dimensions
              this.width = 0;
              this.height = 0;
							//and getBounds offset
							bounds_offsetX = 0;
							bounds_offsetY = 0;
            }).bind(sprite)
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
            value: (function (color, alpha) {
              alpha = alpha ? alpha : 1.0;
              check_number_type(alpha, this+'.graphics.beginFill', 'color, alpha');

              var rgb = hex_to_rgb(color),
                  rgb_str = 'rgba('+ rgb[0] +','+ rgb[1] +','+ rgb[2] +','+ alpha +')';
              
              draw_commands.push({'fillStyle': rgb_str});
            }).bind(sprite)
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
            value: (function (x, y, width, height) {
							var max = Math.max,
									min = Math.min,
									w = this.width,
									h = this.height;
							
              check_number_type(arguments, this+'.graphics.rect', 'x,y,width,height');

              //relative to registration point of sprite
							bounds_offsetX = min(0, x);
							bounds_offsetY = min(0, y);

							if (x >= 0) {
								this.width = max(w, width, x+width);
							} else {
								this.width = max(w, width, -x + w);
							}
							if (y >= 0) {
								this.height = max(h, height, y+height);
							} else {
								this.height = max(h, height, -y + h);
							}
              
              draw_commands.push({'fillRect': [x, y, width, height]});
            }).bind(sprite)
          },

          /*
           * @param {Number} x The x location of the center of the circle relative to the registration point of the parent display object (in pixels).
           * @param {Number} y The y location of the center of the circle relative to the registration point of the parent display object (in pixels).
           * @param {Number} radius
           */
          'circle': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y, radius) {
							var max = Math.max,
									min = Math.min
									w = this.width,
									h = this.height;
							
              check_number_type(arguments, this+'.graphics.circle', 'x,y,radius');

							//relative to registration point of sprite - radius
							bounds_offsetX = min(0, -radius+x);
							bounds_offsetY = min(0, -radius+y);

							if (x <= 0) {
								this.width = max(w, radius*2, -x + w + radius);
							} else if (x > 0 && x < radius) {
								this.width = max(w, radius*2, x + w);
							} else if (x >= radius) {
								this.width = max(w, radius*2, x + radius);
							}
							if (y <= 0) {
								this.height = max(h, radius*2, -y + h + radius);
							} else if (y > 0 && y < radius) {
								this.height = max(h, radius*2, y + h);
							} else if (y >= radius) {
								this.height = max(h, radius*2, y + radius);
							}
              
              draw_commands.push({'beginPath': null});
              //x, y, radius, start_angle, end_angle, anti-clockwise
              draw_commands.push({'arc': [x, y, radius, 0, Math.PI*2, true]});
              draw_commands.push({'closePath': null});
              draw_commands.push({'fill': null});
              
            }).bind(sprite)
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
            value: (function (x, y, width, height) {
              check_number_type(arguments, this+'.graphics.ellipse', 'x,y,width,height');
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
            }).bind(sprite)
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
            value: (function (x, y, width, height, rx, ry) {
              check_number_type(arguments, this+'.graphics.roundRect', 'x,y,width,height,rx,ry');
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
            }).bind(sprite)
          },

          /*
           * @param {Number} x
           * @param {Number} y
           */
          'lineTo': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y) {
              check_number_type(arguments, this+'.graphics.lineTo', 'x,y');
              draw_commands.push({'lineTo': [x, y]});
            }).bind(sprite)
          },

          /*
           * @param {Number} x
           * @param {Number} y
           */
          'moveTo': {
            enumerable: false,
            writable: false,
            configurable: false,
            value: (function (x, y) {
              check_number_type(arguments, this+'.graphics.moveTo', 'x,y');
              draw_commands.push({'moveTo': [x, y]});
            }).bind(sprite)
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
