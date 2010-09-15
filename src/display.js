/*globals doodle, document, setInterval, clearInterval, Stats*/

(function () {
  var display_static_properties,
      display_count = 0,
      frame_count = 0,
      mouseX = 0,
      mouseY = 0,
      dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
      create_frame,
      clear_scene_graph,
      draw_scene_graph,
      draw_bounding_box,
      redraw_scene_graph,
      dispatch_mouse_event,
      dispatch_keyboard_event,
      /*DEBUG*/
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_layer_type = doodle.utils.types.check_layer_type,
      check_block_element = doodle.utils.types.check_block_element,
      /*END_DEBUG*/
      isLayer = doodle.Layer.isLayer,
      inheritsSprite = doodle.Sprite.inheritsSprite,
      get_element = doodle.utils.get_element,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property,
      doodle_Event = doodle.Event,
      doodle_MouseEvent = doodle.MouseEvent,
      doodle_TouchEvent = doodle.TouchEvent,
			//recycle these event objects
			evt_mouseEvent = doodle.MouseEvent(''),
			evt_keyboardEvent = doodle.KeyboardEvent(''),
      ENTER_FRAME = doodle.Event.ENTER_FRAME,
			MOUSE_OVER = doodle.MouseEvent.MOUSE_OVER,
			MOUSE_OUT = doodle.MouseEvent.MOUSE_OUT,
			MOUSE_MOVE = doodle.MouseEvent.MOUSE_MOVE,
      enterFrame = doodle_Event(ENTER_FRAME);
  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Display = function (element) {
    var display,
        display_name;

    /*DEBUG*/
    if (arguments.length > 1) {
      throw new SyntaxError("[object Display](element): Invalid number of parameters.");
    }
    /*END_DEBUG*/
    
    if (typeof element !== 'function') {
      element = get_element(element);
      /*DEBUG*/
      check_block_element(element, '[object Display](element)');
      /*END_DEBUG*/
      if (element) {
        display_name = get_element_property(element, 'id');
      }
    }

    display_name = (typeof display_name === 'string') ? display_name : "display"+ String('00'+display_count).slice(-2);
    display = Object.create(doodle.ElementNode(display_name));


    Object.defineProperties(display, display_static_properties);
    //properties that require privacy
    Object.defineProperties(display, {
      'element': (function () {
        var dom_element = null,
            disp_mouse_evt = dispatch_mouse_event.bind(display);

        function update_mouse_position (evt) {
          mouseX = evt.offsetX;
          mouseY = evt.offsetY;
        }
        
        function add_handlers () {
          //MouseEvents
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_MOVE, update_mouse_position, false);
          //add listeners to dom events that we'll re-dispatch to the scene graph
          dom_element.addEventListener(doodle_MouseEvent.CLICK, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.DOUBLE_CLICK, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.CONTEXT_MENU, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_DOWN, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_UP, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_WHEEL, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_MOVE, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_OUT, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_OVER, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_ENTER, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_MouseEvent.MOUSE_LEAVE, disp_mouse_evt, false);
          //TouchEvents
          dom_element.addEventListener(doodle_TouchEvent.TOUCH_START, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_TouchEvent.TOUCH_MOVE, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_TouchEvent.TOUCH_END, disp_mouse_evt, false);
          dom_element.addEventListener(doodle_TouchEvent.TOUCH_CANCEL, disp_mouse_evt, false);
        }

        function remove_handlers () {
          //MouseEvents
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_MOVE, update_mouse_position, false);
          dom_element.removeEventListener(doodle_MouseEvent.CLICK, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.DOUBLE_CLICK, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.CONTEXT_MENU, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_DOWN, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_UP, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_WHEEL, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_MOVE, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_OUT, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_OVER, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_ENTER, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_MouseEvent.MOUSE_LEAVE, disp_mouse_evt, false);
          //TouchEvents
          dom_element.removeEventListener(doodle_TouchEvent.TOUCH_START, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_TouchEvent.TOUCH_MOVE, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_TouchEvent.TOUCH_END, disp_mouse_evt, false);
          dom_element.removeEventListener(doodle_TouchEvent.TOUCH_CANCEL, disp_mouse_evt, false);
        }
        
        return {
          get: function () { return dom_element; },
          set: function (displayArg) {
            if (displayArg === null) {
              if (dom_element !== null) {
                remove_handlers();
              }
              dom_element = null;
            } else {
              dom_element = get_element(displayArg);
              /*DEBUG*/
              check_block_element(dom_element, this+'.element');
              /*END_DEBUG*/

              //need to stack the canvas elements on top of each other
              set_element_property(dom_element, 'position', 'relative');

              //only check user styles, computed styles include window size
              var w = get_element_property(dom_element, 'width', 'int', false),
                  h = get_element_property(dom_element, 'height', 'int', false);
              if (w !== null) { this.width = w; }
              if (h !== null) { this.height = h; }

              add_handlers();
            }
          }
        };
      }()),

      /* Determines the interval to dispatch the event type Event.ENTER_FRAME.
       * This event is dispatched simultaneously to all display objects listenting
       * for this event. It does not go through a "capture phase" and is dispatched
       * directly to the target, whether the target is on the display list or not.
       */
      'frameRate': (function () {
        var frame_rate = false, //fps
            framerate_interval_id;
        return {
          get: function () { return frame_rate; },
          set: function (fps) {
            //turn off interval
            if (fps === 0 || fps === false) {
              frame_rate = false;
              clearInterval(framerate_interval_id);
            } else if (typeof fps === 'number' && isFinite(1000/fps)) {
              frame_rate = fps;
              clearInterval(framerate_interval_id);
              framerate_interval_id = setInterval(create_frame.bind(this), 1000/frame_rate);
            } else {
              throw new TypeError('[object Display].frameRate: Parameter must be a valid number or false.');
            }
          }
        };
      }()),

      'mouseX': {
        enumerable: false,
        configurable: false,
        get: function () {
          return mouseX;
        }
      },

      'mouseY': {
        enumerable: false,
        configurable: false,
        get: function () {
          return mouseY;
        }
      },

      /* For debugging
       */
      'debug': {
        enumerable: true,
        configurable: false,
        value: Object.create(null, {
          'stats': (function () {
            var debug_stats = false; //stats object
            return {
              enumerable: true,
              configurable: false,
              get: function () { return debug_stats; },
              set: function (useStats) {
                /*DEBUG*/
                check_boolean_type(useStats, display+'.debug.stats');
                /*END_DEBUG*/
                if (useStats && !debug_stats) {
                  //fps counter from http://github.com/mrdoob/stats.js
                  debug_stats = new Stats();
                  display.element.appendChild(debug_stats.domElement);
                } else if (!useStats && debug_stats) {
                  display.element.removeChild(debug_stats.domElement);
                  debug_stats = false;
                }
              }
            };
          }()),
          'boundingBox': (function () {
            var debug_bounding_box = false;
            return {
              enumerable: true,
              configurable: false,
              get: function () {
                return debug_bounding_box;
              },
              set: function (showBoundingBox) {
                /*DEBUG*/
                check_boolean_type(showBoundingBox, display+'.debug.boundingBox');
                /*END_DEBUG*/
                debug_bounding_box = showBoundingBox;
              }
            };
          }())
        })
      }//end debug
    });//end defineProperties
    

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arguments.length > 1) {
        throw new SyntaxError("[object Display](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      arguments[0].call(display);
      element = undefined;
    } else {
      //standard instantiation
      /*DEBUG*/
      if (arguments.length > 1) {
        throw new SyntaxError("[object Display](element): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      display.element = element;
    }

    /*DEBUG*/
    //can't proceed with initialization without an element to work with
    check_block_element(display.element, '[object Display].element');
    /*END_DEBUG*/

    display.root = display;
    display_count += 1;

    

    /* Redraw scene graph when children are added and removed.
     */
    display.addEventListener(doodle.Event.ADDED, redraw_scene_graph.bind(display));
    display.addEventListener(doodle.Event.REMOVED, redraw_scene_graph.bind(display));

    /* Add keyboard listeners to document.
     */
    document.addEventListener(doodle.KeyboardEvent.KEY_PRESS, dispatch_keyboard_event, false);
    document.addEventListener(doodle.KeyboardEvent.KEY_DOWN, dispatch_keyboard_event, false);
    document.addEventListener(doodle.KeyboardEvent.KEY_UP, dispatch_keyboard_event, false);

    
    //draw_scene_graph(display);
    redraw_scene_graph.call(display);
    
    return display;

  };//end doodle.Display

  
  display_static_properties = {
    'width': {
      get: function () {
        return get_element_property(this.element, 'width', 'int');
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.width');
        /*END_DEBUG*/
        set_element_property(this.element, 'width', n+"px");
        //cascade down to our canvas layers
        this.children.forEach(function (layer) {
          layer.width = n;
        });
        return n;
      }
    },

    'height': {
      get: function () {
        return get_element_property(this.element, 'height', 'int');
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.height');
        /*END_DEBUG*/
        set_element_property(this.element, 'height', n+"px");
        //cascade down to our canvas layers
        this.children.forEach(function (layer) {
          layer.height = n;
        });
        return n;
      }
    },

    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Display]";
      }
    },

    'toDataUrl': {
      value: function () {
        //iterate over each canvas layer,
        //output image data and merge in new file
        //output that image data
        return;
      }
    },

    'addChildAt': {
      value: function (layer, index) {
        /*DEBUG*/
        check_layer_type(layer, this+'.addChildAt', '*layer*, index');
        check_number_type(index, this+'.addChildAt', 'layer, *index*');
        /*END_DEBUG*/
        
        //if has previous parent, remove from it's children
        if (layer.parent !== null && layer.parent !== this) {
          layer.parent.removeChild(layer);
        }
        //set ancestry
        layer.root = this;
        layer.parent = this;
        //set layer size to display size
        layer.width = this.width;
        layer.height = this.height;
        //add to children
        this.children.splice(index, 0, layer);
        //add dom element
        this.element.appendChild(layer.element);
        return this;
      }
    },

    'removeChildAt': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (index) {
        /*DEBUG*/
        check_number_type(index, this+'.removeChildAt', '*index*');
        /*END_DEBUG*/
        var layer = this.children[index];
        layer.root = null;
        layer.parent = null;
        //remove from children
        this.children.splice(index, 1);
        //remove from dom
        this.element.removeChild(layer.element);
      }
    },

    'swapChildrenAt': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (index1, index2) {
        /*DEBUG*/
        check_number_type(index1, this+'.swapChildrenAt', '*index1*, index2');
        check_number_type(index2, this+'.swapChildrenAt', 'index1, *index2*');
        /*END_DEBUG*/
        var a = this.children;
        a[index1] = a.splice(index2, 1, a[index1])[0];
        //swap dom elements
        if (index1 > index2) {
          this.element.insertBefore(a[index2].element, a[index1].element);
        } else {
          this.element.insertBefore(a[index1].element, a[index2].element);
        }
      }
    },

    /* Convenience methods.
     */
    'addLayer': {
      value: function (id) {
        var layer = doodle.Layer(id);
        this.addChild(layer);
        return layer;
      }
    },

    'removeLayer': {
      value: function (id) {
        /*DEBUG*/
        check_string_type(id, this+'.removeLayer', '*id*');
        /*END_DEBUG*/
        this.removeChildById(id);
      }
    }
    
  };//end display_static_properties


  /* Clear, move, draw.
   * Dispatches Event.ENTER_FRAME to all objects listening to it,
   * reguardless if it's on the scene graph or not.
   */
  create_frame = function () {
    clear_scene_graph(this);
    dispatcher_queue.forEach(function dispatch_enterframe_evt (obj) {
      if (obj.hasEventListener(ENTER_FRAME)) {
        enterFrame.__setTarget(obj);
        obj.handleEvent(enterFrame);
      }
    });
    draw_scene_graph.call(this, this);
    frame_count += 1;
    
    /*DEBUG*/
    //update stats monitor if needed
    if (this.debug.stats !== false) {
      this.debug.stats.update();
    }
    /*END_DEBUG*/
  };
  
  clear_scene_graph = function (node, context) {
    /* Brute way, clear entire layer in big rect.
     */
    node.children.forEach(function (layer) {
      var ctx = layer.context;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0); //reset
      ctx.clearRect(0, 0, layer.width, layer.height);
      ctx.restore();
    });
    /*
      node.children.forEach(function (child) {
      context = context || child.context;
      context.clearRect(0, 0, child.width, child.height);
      });
    */
    
    /* Clear each object individually by clearing it's bounding box.
     * Will need to test speed, and it's not working now.
     *
     node.children.forEach(function (child) {
     
     context = context || child.context;
     check_context_type(context, this+'.clear_scene_graph', 'context');
     context.save();
     context.setTransform(1, 0, 0, 1, 0, 0); //reset
     
     if (typeof child.getBounds === 'function') {
     var bounds = child.getBounds(display);
     //console.log(bounds.toString());
     //take into account bounding box border
     context.clearRect(bounds.x-1, bounds.y-1, bounds.width+2, bounds.height+2);
     //context.fillRect(bounds.x-1, bounds.y-1, bounds.width+2, bounds.height+2);
     }
     context.restore();
     clear_scene_graph(child, context);
     });
    */
  };
  
  draw_scene_graph = function (node, context) {
    var display = this,
        m; //child transform matrix
    
    node.children.forEach(function draw_child (child) {
      //if node is invisible, don't draw it or it's children
      //this is the behavior in as3
      if (child.visible) {
        context = context || child.context;
        m = child.transform.toArray();
        context.save();
        context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);

        if (display.debug.boundingBox) {
          draw_bounding_box.call(display, child, context);
        }
        
        //apply alpha to node and it's children
        if (!isLayer(child)) {
          if (child.alpha !== 1) {
            context.globalAlpha = child.alpha;
          }
        }
        
        if (typeof child.__draw === 'function') {
          child.__draw(context);
        }
        
        draw_scene_graph.call(display, child, context); //recursive
        context.restore();
      }
    });
  };

  draw_bounding_box = function (sprite, context) {
    if (typeof sprite.getBounds === 'function') {
      //calculate bounding box relative to parent
      var bbox = sprite.getBounds(this); //this = display
      
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0); //reset
      //bounding box
      context.lineWidth = 0.5;
      context.strokeStyle = sprite.debug.boundingBox;
      context.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
      context.restore();
    }
  };
  
  redraw_scene_graph = function () {
    clear_scene_graph(this);
    draw_scene_graph.call(this, this);
  };

  /* Event dispatching - not ready for prime-time.
   */
  dispatch_mouse_event = function (evt) {
		//recycle our doodle.MouseEvent object
		evt_mouseEvent.__copyMouseEventProperties(evt);

		var display = this,
		//evt_mouseEvent = doodle.MouseEvent(evt),
				evt_type = evt_mouseEvent.type,
				/* Hack --
				 * The idea is that I only want to dispatch a mouse event to the display
				 * if there are no other objects under the point to dispatch to.
				 */
				evt_dispatched_p = false;

		
    dispatcher_queue.forEach(function (obj) {
      if (inheritsSprite(obj)) {
				//position on canvas element
				//offset is relative to div, however this implementation adds 1 to y?
        var pt_in_bounds = obj.getBounds(display).containsPoint({x: evt_mouseEvent.offsetX,
                                                                 y: evt_mouseEvent.offsetY});
				//dom sets target as canvas element
        evt_mouseEvent.__setTarget(null);

        if (pt_in_bounds && obj.hasEventListener(evt_type)) {
          obj.dispatchEvent(evt_mouseEvent);
          evt_dispatched_p = true;
        }
        
        //have to manufacture mouse over/out since dom element won't know
        if (pt_in_bounds && obj.hasEventListener(MOUSE_OVER)) {
          // __mouse_over property is only used here
          if (!obj.__mouse_over) {
            obj.__mouse_over = true;
            evt_mouseEvent.__setType(MOUSE_OVER);
            obj.dispatchEvent(evt_mouseEvent);
            evt_dispatched_p = true;
          }
        }
        if (!pt_in_bounds && obj.hasEventListener(MOUSE_OUT)) {
          if (obj.__mouse_over) {
            obj.__mouse_over = false;
            evt_mouseEvent.__setType(MOUSE_OUT);
            obj.dispatchEvent(evt_mouseEvent);
            evt_dispatched_p = true;
          }
        }
        
      } else if (obj.hasEventListener(evt_type)) {
        //if in queue and not sprite, could be ElementNode - display, layer
        //don't want these going off if sprite is in front
        evt_mouseEvent.__setTarget(null);
        obj.dispatchEvent(evt_mouseEvent);
        evt_dispatched_p = true;
      }
    });

    //dispatch to display if no other object under cursor has
    dispatcher_queue.forEach(function (obj) {
      if (obj === display && !evt_dispatched_p && obj.hasEventListener(MOUSE_MOVE)) {
        if (evt_type === MOUSE_MOVE) {
          evt_mouseEvent.__setType(MOUSE_MOVE);
        }
        evt_mouseEvent.__setTarget(null);
        obj.dispatchEvent(evt_mouseEvent);
        evt_dispatched_p = true;
      }
    });
  };

	
  dispatch_keyboard_event = function (evt) {
		//recycle our doodle.KeyboardEvent object
		evt_keyboardEvent.__copyKeyboardEventProperties(evt);
    
    dispatcher_queue.forEach(function (obj) {
      if (obj.hasEventListener(evt_keyboardEvent.type)) {
        obj.handleEvent(evt_keyboardEvent);
      }
    });
  };


  /*
   * CLASS METHODS
   */
  
  doodle.Display.isDisplay = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object Display]');
  };
  
}());//end class closure
