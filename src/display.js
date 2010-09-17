/*jslint nomen: false, plusplus: false*/
/*globals doodle, document, setInterval, clearInterval, Stats*/

(function () {
  var display_static_properties,
      display_count = 0,
      frame_count = 0,
      dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
      create_frame,
      clear_scene_graph,
      draw_scene_graph,
      draw_bounding_box,
      redraw_scene_graph,
      dispatch_mouse_event,
      dispatch_mousemove_event,
      dispatch_mouse_boundary_event,
      dispatch_keyboard_event,
      /*DEBUG*/
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_layer_type = doodle.utils.types.check_layer_type,
      check_block_element = doodle.utils.types.check_block_element,
      /*END_DEBUG*/
      isLayer = doodle.Layer.isLayer,
      get_element = doodle.utils.get_element,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property,
      doodle_Event = doodle.Event,
      doodle_MouseEvent = doodle.MouseEvent,
      //doodle_TouchEvent = doodle.TouchEvent,
      //recycle these event objects
      evt_mouseEvent = doodle.MouseEvent(''),
      //evt_touchEvent = doodle.TouchEvent(''),
      evt_keyboardEvent = doodle.KeyboardEvent(''),
      enterFrame = doodle_Event(doodle.Event.ENTER_FRAME),
      ENTER_FRAME = doodle.Event.ENTER_FRAME;
      
  
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
    Object.defineProperties(display, (function () {
      var mouseX = 0,
          mouseY = 0,
          dom_element = null,
          //lookup help
          mouseEvent = evt_mouseEvent,
          disp = display,
          disp_mouse_evt = dispatch_mouse_event,
          disp_mousemove_evt = dispatch_mousemove_event,
          disp_mouse_boundary_evt = dispatch_mouse_boundary_event,
          hasOwnProperty = Object.prototype.hasOwnProperty;

      function on_mouse_event (evt) {
        var d = disp,
            layers = d.children;    
        //dom event, recycle event, display, layers, layer_count, mouseX, mouseY, fn
        disp_mouse_evt(evt, mouseEvent, evt.type, d, layers, layers.length,
                       evt.offsetX, evt.offsetY, hasOwnProperty);
      }

      function on_mouse_move (evt) {
        var d = disp,
            layers = d.children,
            x, y;
        mouseX = x = evt.offsetX;
        mouseY = y = evt.offsetY;
        disp_mousemove_evt(evt, mouseEvent, d, layers, layers.length, x, y, hasOwnProperty);
      }

      /* Mouse leaves dom element.
       * Test display and layers for handlers.
       */
      function on_mouse_element_boundary (evt) {
        var d = disp,
            layers = d.children;
        disp_mouse_boundary_evt(evt, mouseEvent, evt.type, d, layers, layers.length, hasOwnProperty);
      }

      
      function add_handlers (element) {
        //MouseEvents
        element.addEventListener(doodle_MouseEvent.MOUSE_MOVE, on_mouse_move, false);
        element.addEventListener(doodle_MouseEvent.CLICK, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.DOUBLE_CLICK, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_DOWN, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_UP, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.CONTEXT_MENU, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_WHEEL, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_OUT, on_mouse_element_boundary, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_OVER, on_mouse_element_boundary, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_ENTER, on_mouse_element_boundary, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_LEAVE, on_mouse_element_boundary, false);
        /*//TouchEvents
        element.addEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
        element.addEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
        element.addEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
        element.addEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
        */
      }

      function remove_handlers (element) {
        //MouseEvents
        element.removeEventListener(doodle_MouseEvent.MOUSE_MOVE, on_mouse_move, false);
        element.removeEventListener(doodle_MouseEvent.CLICK, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.DOUBLE_CLICK, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_DOWN, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_UP, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.CONTEXT_MENU, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_WHEEL, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_OUT, on_mouse_element_boundary, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_OVER, on_mouse_element_boundary, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_ENTER, on_mouse_element_boundary, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_LEAVE, on_mouse_element_boundary, false);
        /*//TouchEvents
        element.removeEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
        element.removeEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
        element.removeEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
        element.removeEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
        */
      }
      
      return {
        'element': {
          get: function () { return dom_element; },
          set: function (displayArg) {
            if (displayArg === null) {
              if (dom_element !== null) {
                remove_handlers(dom_element);
              }
              dom_element = null;
            } else {
              /*DEBUG*/
              check_block_element(displayArg, this+'.element');
              /*END_DEBUG*/
              dom_element = get_element(displayArg);
              
              //need to stack the canvas elements on top of each other
              set_element_property(displayArg, 'position', 'relative');
              
              //only check user styles, computed styles include window size
              var w = get_element_property(displayArg, 'width', 'int', false),
                  h = get_element_property(displayArg, 'height', 'int', false);
              if (w !== null) { this.width = w; }
              if (h !== null) { this.height = h; }

              add_handlers(displayArg);
            }
          }
        },
        
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
      };//end return object
    }()));//end defineProperties
    

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
    document.addEventListener(doodle.KeyboardEvent.KEY_PRESS, dispatch_keyboard_event.bind(display), false);
    document.addEventListener(doodle.KeyboardEvent.KEY_DOWN, dispatch_keyboard_event.bind(display), false);
    document.addEventListener(doodle.KeyboardEvent.KEY_UP, dispatch_keyboard_event.bind(display), false);

    
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
  

  /*
   * EVENT DISPATCHING
   */

  /*
   * CLICK, DOUBLE_CLICK, CONTEXT_MENU, MOUSE_DOWN, MOUSE_UP, MOUSE_WHEEL, MOUSE_MOVE
   */
  dispatch_mouse_event = function (evt/*dom*/, mouseEvent/*doodle*/, evt_type,
                                   display, layers, layer_count, x, y, hasOwnProperty/*fn*/) {
    var layer,
        layer_handler = false,
        sprites,
        sprite_count,
        sprite;

    //reverse loop
    while (layer_count--) {
      layer = layers[layer_count];
      //only testing top layer sprites
      sprites = layer.children;
      sprite_count = sprites.length;

      //check sprites
      while (sprite_count--) {
        sprite = sprites[sprite_count];
        if (sprite.getBounds && sprite.getBounds(display).containsPoint({x: x, y: y})) {
          //hit a sprite, dispatch event to it and it's chain
          sprite.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
          return true;
        }
      }
      //check layers while we're down here, hasEventListener
      if (!layer_handler && hasOwnProperty.call(layer.eventListeners, evt_type)) {
        layer_handler = layer;
      }
    }
    //layer dispatch
    if (layer_handler) {
      layer_handler.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
      return true;
    }
    //finally try the display
    if (hasOwnProperty.call(display.eventListeners, evt_type)) {
      display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
      return true;
    }
    //if it gets here, there are no handlers for the event type
    return false;
  };

  /* Since a mousemove event can trigger a mouseover or mouseout, we
   * need to check it more thoroughly.
   */
  dispatch_mousemove_event = function (evt/*dom*/, mouseEvent/*doodle*/,
                                       display, layers, layer_count, x, y, hasOwnProperty/*fn*/) {
    var layer,
        layer_handler = false,
        sprites,
        sprite_count,
        sprite;
    
    while (layer_count--) {
      layer = layers[layer_count];
      sprites = layer.children;
      sprite_count = sprites.length;

      //check sprites
      while (sprite_count--) {
        sprite = sprites[sprite_count];
        if (sprite.getBounds && sprite.getBounds(display).containsPoint({x: x, y: y})) {
          //point in bounds
          if (!sprite.__pointInBounds) {
            sprite.__pointInBounds = true;
            //dispatch events to sprite and up parent chain
            sprite.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
            sprite.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseover'));
            sprite.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseenter'));
            return true;
          }
        } else {
          //point not on sprite
          if (sprite.__pointInBounds) {
            sprite.__pointInBounds = false;
            //dispatch events to sprite and up parent chain
            sprite.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
            sprite.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
            return true;
          }
        }
      }
      //check layers
      if (!layer_handler && hasOwnProperty.call(layer.eventListeners, 'mousemove')) {
        layer_handler = layer;
      }
    }
    //layer dispatch
    if (layer_handler) {
      layer_handler.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
      return true;
    }
    //finally try the display
    if (hasOwnProperty.call(display.eventListeners, 'mousemove')) {
      display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
      return true;
    }
    //if it gets here, there are no handlers for mousemove
    return false;
  };
  

  /* When the mouse leaves the dom element,
   * check display and layers for event handlers
   */
  dispatch_mouse_boundary_event = function (evt/*dom*/, mouseEvent/*doodle*/, evt_type,
                                            display, layers, layer_count, hasOwnProperty/*fn*/) {
    var layer;
    
    //reverse loop
    while (layer_count--) {
      layer = layers[layer_count];
      //check layers
      if (hasOwnProperty.call(layer.eventListeners, evt_type)) {
        layer.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      }
    }
    //finally try the display
    if (hasOwnProperty.call(display.eventListeners, evt_type)) {
      display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
      return true;
    }
    //nuthin doin'
    return false;
  };

  /*
   */
  dispatch_keyboard_event = function (evt) {
    this.broadcastEvent(evt_keyboardEvent.__copyKeyboardEventProperties(evt, null));
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
