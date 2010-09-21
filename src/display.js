/*jslint nomen: false, plusplus: false*/
/*globals doodle, document, setInterval, clearInterval, Stats, check_display_type*/

(function () {
  var display_static_properties,
      display_count = 0,
      frame_count = 0,
      isDisplay,
      dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,//needed?
      create_frame,
      clear_scene_graph,
      draw_scene_graph,
      draw_bounding_box,
      redraw_scene_graph,
      dispatch_mouse_event,
      dispatch_mousemove_event,
      dispatch_mouseleave_event,
      dispatch_keyboard_event,
      /*DEBUG*/
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_layer_type = doodle.utils.types.check_layer_type,
      check_block_element = doodle.utils.types.check_block_element,
      check_point_type = doodle.utils.types.check_point_type,
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
    display = Object.create(doodle.ElementNode(element, display_name));


    Object.defineProperties(display, display_static_properties);
    //properties that require privacy
    Object.defineProperties(display, (function () {
      var display_scene_path = [],
          mouseX = 0,
          mouseY = 0,
          //recycle
          mouseEvent = evt_mouseEvent,
          //lookup help
          this_display = display,
          create_scene_path = doodle.utils.create_scene_path,
          //move to a closer scope since we're calling these often
          dispatch_mouse_evt = dispatch_mouse_event,
          dispatch_mousemove_evt = dispatch_mousemove_event,
          dispatch_mouseleave_evt = dispatch_mouseleave_event;

      function on_mouse_event (evt) {
        var path = display_scene_path,
            path_count = path.length;
        dispatch_mouse_evt(evt, mouseEvent, path, path_count, evt.offsetX, evt.offsetY, this_display);
      }

      function on_mouse_move (evt) {
        var path = display_scene_path,
            path_count = path.length,
            x, y;
        mouseX = x = evt.offsetX;
        mouseY = y = evt.offsetY;
        dispatch_mousemove_evt(evt, mouseEvent, path, path_count, x, y, this_display);
      }

      function on_mouse_leave (evt) {
        var path = display_scene_path,
            node_count = path.length,
            display = this_display,
            layers = display.children,
            layer_count = layers.length;
        dispatch_mouseleave_evt(evt, mouseEvent, path, node_count, layers, layer_count, display);
      }

      function add_dom_handlers (element) {
        //MouseEvents
        element.addEventListener(doodle_MouseEvent.MOUSE_MOVE, on_mouse_move, false);
        //this dispatches mouseleave and mouseout for display and layers
        element.addEventListener(doodle_MouseEvent.MOUSE_OUT, on_mouse_leave, false);
        //
        element.addEventListener(doodle_MouseEvent.CLICK, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.DOUBLE_CLICK, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_DOWN, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_UP, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.CONTEXT_MENU, on_mouse_event, false);
        element.addEventListener(doodle_MouseEvent.MOUSE_WHEEL, on_mouse_event, false);
        /*//TouchEvents
        element.addEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
        element.addEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
        element.addEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
        element.addEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
        */
      }

      function remove_dom_handlers (element) {
        //MouseEvents
        element.removeEventListener(doodle_MouseEvent.MOUSE_MOVE, on_mouse_move, false);
        //
        element.removeEventListener(doodle_MouseEvent.MOUSE_OUT, on_mouse_leave, false);
        //
        element.removeEventListener(doodle_MouseEvent.CLICK, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.DOUBLE_CLICK, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_DOWN, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_UP, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.CONTEXT_MENU, on_mouse_event, false);
        element.removeEventListener(doodle_MouseEvent.MOUSE_WHEEL, on_mouse_event, false);
        /*//TouchEvents
        element.removeEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
        element.removeEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
        element.removeEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
        element.removeEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
        */
      }
      
      return {

        /* Display specific things to setup when adding a dom element.
         * Called in ElementNode.element
         */
        '__addDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) {
            /*DEBUG*/
            check_block_element(elementArg, this+'.element');
            /*END_DEBUG*/
            //need to stack the canvas elements on top of each other
            set_element_property(elementArg, 'position', 'relative');
            add_dom_handlers(elementArg);
          }
        },

        '__removeDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) {
            remove_dom_handlers(elementArg);
          }
        },
        
        /* Determines the interval to dispatch the event type Event.ENTER_FRAME.
         * This event is dispatched simultaneously to all display objects listenting
         * for this event. It does not go through a "capture phase" and is dispatched
         * directly to the target, whether the target is on the display list or not.
         * @param {Number|false} fps
         * @return {Number|false}
         */
        'frameRate': (function () {
          var frame_rate = false, //fps
              framerate_interval_id;
          return {
            get: function () { return frame_rate; },
            set: function (fps) {
              /*DEBUG*/
              if (fps !== false && fps !== 0) {
                check_number_type(fps, this+'.frameRate');
                if (fps < 0 || !isFinite(1000/fps)) {
                  throw new RangeError(this+'.frameRate: Invalid framerate.');
                }
              }
              /*END_DEBUG*/
              if (fps === 0 || fps === false) {
                //turn off interval
                frame_rate = false;
                if (framerate_interval_id !== undefined) {
                  clearInterval(framerate_interval_id);
                }
              } else {
                //non-zero number, ignore if given same value
                if (fps !== frame_rate) {
                  if (framerate_interval_id !== undefined) {
                    clearInterval(framerate_interval_id);
                  }
                  framerate_interval_id = setInterval(create_frame.bind(this), 1000/fps);
                  frame_rate = fps;
                }
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

        'allChildren': {
          enumerable: true,
          configurable: false,
          get: function () {
            return display_scene_path;
          }
        },
        
        '__sortAllChildren': {
          enumerable: false,
          configurable: false,
          value: function () {
            create_scene_path(this, display_scene_path, true).reverse();
            /*DEBUG*/
            if (display_scene_path.length === 0) {
              throw new RangeError(this+'.__sortAllChildren: display_scene_path array should never be zero.');
            }
            /*END_DEBUG*/
          }
        },

        'getNodesUnderPoint': {
          enumerable: true,
          configurable: false,
          value: function (point) {
            /*DEBUG*/
            check_point_type(point, this+'.getNodesUnderPoint', '*point*');
            /*END_DEBUG*/
            var nodes = [],
                scene_path = display_scene_path,
                i = scene_path.length,
                x = point.x,
                y = point.y,
                node;
            
            while (i--) {
              node = scene_path[i];
              if(node.__getBounds(this).__containsPoint(x, y)) {
                nodes.push(node);
              }
            }
            return nodes;
          }
        },

        /* Debugging options
         */
        'debug': {
          enumerable: true,
          configurable: false,
          value: Object.create(null, {
            /*DEBUG*/
            //color of the bounding box
            //individual bounds are displayed with node.debug.boundingBox = true
            'boundingBox': (function () {
              var bounds_color = "#ff0000";
              return {
                enumerable: true,
                configurable: false,
                get: function () {
                  return  bounds_color;
                },
                set: function (boundingBoxColor) {
                  bounds_color = boundingBoxColor;
                }
              };
            }()),
            /*END_DEBUG*/

            /* Overlay a stats meter on the display. [http://github.com/mrdoob/stats.js]
             * Not marked as DEBUG because it's useful in a compiled script.
             * @param {Boolean}
             * @return {Stats|false}
             */
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
                    debug_stats = new Stats();
                    display.element.appendChild(debug_stats.domElement);
                  } else if (!useStats && debug_stats) {
                    display.element.removeChild(debug_stats.domElement);
                    debug_stats = false;
                  }
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
        /*DEBUG*/
        if (id !== undefined) {
          check_string_type(id, this+'.addLayer', '*id*');
        }
        /*END_DEBUG*/
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
    },

    /* This is always the same, so we'll save some computation.
     */
    '__getBounds': {
      enumerable: true,
      configurable: true,
      value: (function () {
        var rect = doodle.geom.Rectangle(); //recycle
        return function () {
          return rect.compose(0, 0, this.width, this.height);
        };
      }())
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
      
      /*DEBUG*/
      if (child.debug.boundingBox) {
        draw_bounding_box.call(display, child, context);
      }
      /*END_DEBUG*/

      //if node is invisible, don't draw it or it's children
      //this is the behavior in as3
      if (child.visible) {
        context = context || child.context;
        m = child.transform.toArray();
        context.save();
        context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        
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

  draw_bounding_box = function (node, context) {
    //calculate bounding box relative to parent
    var bbox = node.__getBounds(this); //this = display
    if (bbox) {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0); //reset
      //bounding box
      context.lineWidth = 0.5;
      context.strokeStyle = this.debug.boundingBox;
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

 dispatch_mouse_event = function (evt/*dom*/, mouseEvent/*doodle*/,
                                  scene_path, count, x, y, display) {
    var node;
   
    while (count--) {
      node = scene_path[count];
      //recycle rect object
      if(node.__getBounds(display).__containsPoint(x, y)) {
        node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      }
    }
  };

  
  dispatch_mousemove_event = function (evt/*dom*/, mouseEvent/*doodle*/,
                                       scene_path, count, x, y, display) {
    var node;

    while (count--) {
      node = scene_path[count];

      if(node.__getBounds(display).__containsPoint(x, y)) {
        //point in bounds
        if (!node.__pointInBounds) {
          node.__pointInBounds = true;
          //dispatch events to node and up parent chain
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseover'));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseenter'));
          return true;
        }
      } else {
        //point not on sprite
        if (node.__pointInBounds) {
          node.__pointInBounds = false;
          //dispatch events to node and up parent chain
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
          return true;
        }
      }
    }
  };

  dispatch_mouseleave_event = function (evt, mouseEvent, scene_path, node_count,
                                        layers, layer_count, display) {
    //mouse left display
    while (node_count--) {
      scene_path[node_count].__pointInBounds = false;
    }
    if (layer_count === 0) {
      //no layers, so display will dispatch
      display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
      display.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
      return true;
    } else {
      //top layer
      layers[layer_count-1].dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
      layers[layer_count-1].dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
      return true;
    }
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
  
  isDisplay = doodle.Display.isDisplay = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object Display]');
  };

  /* check_display_type is a doodle global defined in prologue.js
   */
  /*DEBUG*/
  check_display_type = doodle.utils.types.check_display_type = function (display, caller, param) {
    if (isDisplay(display)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_display_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be a Display.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
