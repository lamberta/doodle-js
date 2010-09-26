/*jslint nomen: false, plusplus: false*/
/*globals doodle, document, setInterval, clearInterval, Stats*/

(function () {
  var display_static_properties,
      display_count = 0,
      isDisplay,
      create_frame,
      clear_scene_graph,
      draw_scene_graph,
      draw_bounding_box,
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
      create_scene_path = doodle.utils.create_scene_path,
      isLayer = doodle.Layer.isLayer,
      get_element = doodle.utils.get_element,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property,
      doodle_Layer = doodle.Layer,
      //doodle_TouchEvent = doodle.TouchEvent,
      //recycle these event objects
      evt_enterFrame = doodle.Event(doodle.Event.ENTER_FRAME),
      evt_mouseEvent = doodle.MouseEvent(''),
      //evt_touchEvent = doodle.TouchEvent(''),
      evt_keyboardEvent = doodle.KeyboardEvent('');
  
  /**
   * @name Display
   * @description
   * @param {HTMLElement} element
   * @return {Display}
   *
   * @constructor
   * @namespace doodle
   * @extends doodle.ElementNode
   */
  doodle.Display = function (element) {
    var display,
        id;

    //extract id from element
    if (element && typeof element !== 'function') {
      element = get_element(element);
      /*DEBUG*/
      check_block_element(element, '[object Display](element)');
      /*END_DEBUG*/
      id = get_element_property(element, 'id');
    }

    id = (typeof id === 'string') ? id : "display"+ String('00'+display_count++).slice(-2);
    //won't assign element until after display properties are set up
    display = Object.create(doodle.ElementNode(undefined, id));

    
    Object.defineProperties(display, display_static_properties);
    //properties that require privacy
    Object.defineProperties(display, (function () {
      var width = 0,
          height = 0,
          dom_element = null, //just a reference
          layers = display.children,
          dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
          display_scene_path = [], //all descendants
          mouseX = 0,
          mouseY = 0,
          //chrome mouseevent has offset info, otherwise need to calculate
          evt_offset_p = document.createEvent('MouseEvent').offsetX !== undefined,
          //move to closer scope since they're called frequently
          $display = display,
          $dispatch_mouse_event = dispatch_mouse_event,
          $dispatch_mousemove_event = dispatch_mousemove_event,
          $dispatch_mouseleave_event = dispatch_mouseleave_event,
          $dispatch_keyboard_event = dispatch_keyboard_event,
          $create_frame = create_frame,
          //recycled event objects
          $evt_enterFrame = evt_enterFrame,
          $evt_mouseEvent = evt_mouseEvent,
          $evt_keyboardEvent = evt_keyboardEvent;

      /* @param {MouseEvent} evt
       */
      function on_mouse_event (evt) {
        $dispatch_mouse_event(evt, $evt_mouseEvent,
                              display_scene_path, display_scene_path.length,
                              mouseX, mouseY, $display);
      }

      /* @param {MouseEvent} evt
       */
      function on_mouse_move (evt) {
        var x, y;
        mouseX = x = evt_offset_p ? evt.offsetX : evt.clientX - dom_element.offsetLeft;
        mouseY = y = evt_offset_p ? evt.offsetY : evt.clientY - dom_element.offsetTop;
        
        $dispatch_mousemove_event(evt, $evt_mouseEvent,
                                  display_scene_path, display_scene_path.length,
                                  x, y, $display);
      }

      /* @param {MouseEvent} evt
       */
      function on_mouse_leave (evt) {
        $dispatch_mouseleave_event(evt, $evt_mouseEvent, display_scene_path, layers, layers.length, $display);
      }

      function on_keyboard_event (evt) {
        $dispatch_keyboard_event(evt, $evt_keyboardEvent, $display);
      }

      /*
       */
      function on_create_frame () {
        $create_frame(layers, layers.length,
                      dispatcher_queue, dispatcher_queue.length, $evt_enterFrame,
                      display_scene_path, display_scene_path.length,
                      $display);
      }
      
      //Add display handlers
      //Redraw scene graph when children are added and removed.
      $display.addEventListener(doodle.Event.ADDED, on_create_frame);
      $display.addEventListener(doodle.Event.REMOVED, on_create_frame);
      //Add keyboard listeners to document.
      document.addEventListener(doodle.KeyboardEvent.KEY_PRESS, on_keyboard_event, false);
      document.addEventListener(doodle.KeyboardEvent.KEY_DOWN, on_keyboard_event, false);
      document.addEventListener(doodle.KeyboardEvent.KEY_UP, on_keyboard_event, false);
      
      return {
        /* Display always returns itself as root.
         * @override
         */
        'root': {
          enumerable: true,
          writable: false,
          configurable: false,
          value: $display
        },
        
        /**
         * Mouse x position on display.
         */
        'mouseX': {
          enumerable: true,
          configurable: false,
          get: function () { return mouseX; }
        },

        /**
         * Mouse y position on display.
         */
        'mouseY': {
          enumerable: true,
          configurable: false,
          get: function () { return mouseY; }
        },
        
        /**
         * Display width. Setting this affects all it's children layers.
         * @param {Number} n
         * @return {Number}
         * @override
         */
        'width': {
          get: function () { return width; },
          set: function (n) {
            var i = layers.length;
            /*DEBUG*/
            check_number_type(n, this+'.width');
            /*END_DEBUG*/
            set_element_property(this.element, 'width', n+"px");
            width = n;
            //cascade down to our canvas layers
            while(i--) {
              layers[i].width = n;
            }
            return n;
          }
        },

        /**
         * Display height. Setting this affects all it's children layers.
         * @param {Number} n
         * @return {Number}
         * @override
         */
        'height': {
          get: function () { return height; },
          set: function (n) {
            var i = layers.length;
            /*DEBUG*/
            check_number_type(n, this+'.height');
            /*END_DEBUG*/
            set_element_property(this.element, 'height', n+"px");
            height = n;
            //cascade down to our canvas layers
            while(i--) {
              layers[i].height = n;
            }
            return n;
          }
        },
        
        /* Gets size of display element and adds event handlers.
         * Called in ElementNode.element
         * @param {HTMLElement}
         * @override
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
            
            //computed style will return the entire window size
            var w = get_element_property(elementArg, 'width', 'int', false) || elementArg.width,
                h = get_element_property(elementArg, 'height', 'int', false) || elementArg.height;
            //setting this also sets child layers
            if (typeof w === 'number') { this.width = w; }
            if (typeof h === 'number') { this.height = h; }

            //add event handlers
            //MouseEvents
            elementArg.addEventListener(doodle.MouseEvent.MOUSE_MOVE, on_mouse_move, false);
            //this dispatches mouseleave and mouseout for display and layers
            elementArg.addEventListener(doodle.MouseEvent.MOUSE_OUT, on_mouse_leave, false);
            //
            elementArg.addEventListener(doodle.MouseEvent.CLICK, on_mouse_event, false);
            elementArg.addEventListener(doodle.MouseEvent.DOUBLE_CLICK, on_mouse_event, false);
            elementArg.addEventListener(doodle.MouseEvent.MOUSE_DOWN, on_mouse_event, false);
            elementArg.addEventListener(doodle.MouseEvent.MOUSE_UP, on_mouse_event, false);
            elementArg.addEventListener(doodle.MouseEvent.CONTEXT_MENU, on_mouse_event, false);
            elementArg.addEventListener(doodle.MouseEvent.MOUSE_WHEEL, on_mouse_event, false);
            /*//TouchEvents
            elementArg.addEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
            elementArg.addEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
            elementArg.addEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
            elementArg.addEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
            */
            dom_element = elementArg;
          }
        },

        /* Removes event handlers from display element.
         * @param {HTMLElement}
         */
        '__removeDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) {
            //remove event handlers
            //MouseEvents
            elementArg.removeEventListener(doodle.MouseEvent.MOUSE_MOVE, on_mouse_move, false);
            //
            elementArg.removeEventListener(doodle.MouseEvent.MOUSE_OUT, on_mouse_leave, false);
            //
            elementArg.removeEventListener(doodle.MouseEvent.CLICK, on_mouse_event, false);
            elementArg.removeEventListener(doodle.MouseEvent.DOUBLE_CLICK, on_mouse_event, false);
            elementArg.removeEventListener(doodle.MouseEvent.MOUSE_DOWN, on_mouse_event, false);
            elementArg.removeEventListener(doodle.MouseEvent.MOUSE_UP, on_mouse_event, false);
            elementArg.removeEventListener(doodle.MouseEvent.CONTEXT_MENU, on_mouse_event, false);
            elementArg.removeEventListener(doodle.MouseEvent.MOUSE_WHEEL, on_mouse_event, false);
            /*//TouchEvents
            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_START, on_touch_event, false);
            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_MOVE, on_touch_event, false);
            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_END, on_touch_event, false);
            elementArg.removeEventListener(doodle_TouchEvent.TOUCH_CANCEL, on_touch_event, false);
            */
            dom_element = null;
          }
        },

        /**
         * All descendants of the display, in scene graph order.
         */
        'allChildren': {
          enumerable: true,
          configurable: false,
          get: function () { return display_scene_path; }
        },

        /* Re-creates the display's scene path.
         * Called when adding child nodes.
         */
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

        /**
         * Returns a list of nodes under a given display position.
         * @param {Point} point
         * @return {Array}
         */
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
              if(node.__getBounds(this).contains(x, y)) {
                nodes.push(node);
              }
            }
            return nodes;
          }
        },

        /**
         * Add a layer to the display's children at the given array position.
         * Layer inherits the dimensions of the display.
         * @param {Layer} layer
         * @param {Number} index
         * @return {Layer}
         * @override
         */
        'addChildAt': {
          enumerable: true,
          configurable: false,
          value: (function () {
            var super_addChildAt = $display.addChildAt;
            return function (layer, index) {
              /*DEBUG*/
              check_layer_type(layer, this+'.addChildAt', '*layer*, index');
              check_number_type(index, this+'.addChildAt', 'layer, *index*');
              /*END_DEBUG*/
              //inherit display dimensions
              layer.width = this.width;
              layer.height = this.height;
              //add dom element
              this.element.appendChild(layer.element);
              return super_addChildAt.call(this, layer, index);
            };
          }())
        },

        /**
         * Remove a layer from the display's children at the given array position.
         * @param {Number} index
         * @override
         */
        'removeChildAt': {
          enumerable: true,
          writable: false,
          configurable: false,
          value: (function () {
            var super_removeChildAt = $display.removeChildAt;
            return function (index) {
              /*DEBUG*/
              check_number_type(index, this+'.removeChildAt', '*index*');
              /*END_DEBUG*/
              //remove from dom
              this.element.removeChild(layers[index].element);
              return super_removeChildAt.call(this, index);
            };
          }())
        },

        /**
         * Change the display order of two child layers at the given index. 
         * @override
         */
        'swapChildrenAt': {
          enumerable: true,
          writable: false,
          configurable: false,
          value: (function () {
            var super_swapChildrenAt = $display.swapChildrenAt;
            return function (idx1, idx2) {
              /*DEBUG*/
              check_number_type(idx1, this+'.swapChildrenAt', '*index1*, index2');
              check_number_type(idx2, this+'.swapChildrenAt', 'index1, *index2*');
              /*END_DEBUG*/
              //swap dom elements
              if (idx1 > idx2) {
                this.element.insertBefore(layers[idx2].element, layers[idx1].element);
              } else {
                this.element.insertBefore(layers[idx1].element, layers[idx2].element);
              }
              return super_swapChildrenAt.call(this, idx1, idx2);
            };
          }())
        },

        /*DEBUG_STATS*/
        'debug': {
          enumerable: true,
          configurable: false,
          value: Object.create(null, {
            /*DEBUG*/
            /**
             * Color of the bounding box outline for nodes on the display.
             * Display a particular node's bounds with node.debug.boundingBox = true
             * @param {String} color
             * @return {String}
             */
            'boundingBox': (function () {
              var bounds_color = "#ff0000";
              return {
                enumerable: true,
                configurable: false,
                get: function () { return  bounds_color; },
                set: function (boundingBoxColor) {
                  bounds_color = boundingBoxColor;
                }
              };
            }()),
            /*END_DEBUG*/

            /**
             * Overlay a stats meter on the display.
             * See http://github.com/mrdoob/stats.js for more info.
             * To include in a compiled build, use ./build/make-doodle -S
             * @param {Boolean}
             * @return {Stats|Boolean}
             */
            'stats': (function () {
              var debug_stats = false; //stats object
              return {
                enumerable: true,
                configurable: false,
                get: function () { return debug_stats; },
                set: function (useStats) {
                  /*DEBUG*/
                  check_boolean_type(useStats, $display+'.debug.stats');
                  /*END_DEBUG*/
                  if (useStats && !debug_stats) {
                    debug_stats = new Stats();
                    $display.element.appendChild(debug_stats.domElement);
                  } else if (!useStats && debug_stats) {
                    $display.element.removeChild(debug_stats.domElement);
                    debug_stats = false;
                  }
                }
              };
            }())
          })
        },
        /*END_DEBUG_STATS*/

        /**
         * Determines the interval to dispatch the event type Event.ENTER_FRAME.
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
                  framerate_interval_id = setInterval(on_create_frame, 1000/fps);
                  frame_rate = fps;
                }
              }
            }
          };
        }())
        
      };//end return object
    }()));//end defineProperties

    //check args
    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function
      if (typeof arguments[0] === 'function') {
        arguments[0].call(element);
        element = undefined;
      } else {
        //passed element
        /*DEBUG*/
        check_block_element(element, '[object Display](element)');
        /*END_DEBUG*/
        display.element = element;
      }
      break;
    default:
      throw new SyntaxError("[object Display](element): Invalid number of parameters.");
    }

    /*DEBUG*/
    //can't proceed with initialization without an element to work with
    check_block_element(display.element, '[object Display].element');
    /*END_DEBUG*/
    
    //draw at least 1 frame
    create_frame(display.children, display.children.length,
                 doodle.EventDispatcher.dispatcher_queue,
                 doodle.EventDispatcher.dispatcher_queue.length,
                 evt_enterFrame,
                 display.allChildren, display.allChildren.length,
                 display);
    
    return display;
  };//end doodle.Display

  
  display_static_properties = {
    /* A Display has no parent.
     * @override
     */
    'parent': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: null
    },
    
    /**
     * Returns the string representation of the specified object.
     * @override
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () { return "[object Display]"; }
    },

    /**
     * Add a new layer to the display's children.
     * @param {String} id
     * @return {Layer}
     */
    'addLayer': {
      value: function (id) {
        /*DEBUG*/
        if (id !== undefined) {
          check_string_type(id, this+'.addLayer', '*id*');
        }
        /*END_DEBUG*/
        return this.addChild(doodle_Layer(id));
      }
    },

    /**
     * Remove a layer with a given name from the display's children.
     * @param {String} id
     */
    'removeLayer': {
      value: function (id) {
        /*DEBUG*/
        check_string_type(id, this+'.removeLayer', '*id*');
        /*END_DEBUG*/
        return this.removeChildById(id);
      }
    },

    /* The bounds of a display is always it's dimensions.
     * @return {Rectangle} This object is reused with each call.
     * @override
     */
    '__getBounds': {
      enumerable: false,
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
   * @this {Display}
   */
  create_frame = (function () {
    var frame_count = 0;
    return function make_frame (layers, layer_count,
                                receivers, recv_count, enterFrame,
                                scene_path, path_count,
                                display, clearRect) {
      /*** new way
      var node,
          i,
          bounds,
          ctx;
      //clear scene - only need top level nodes
      while (layer_count--) {
        ctx = layers[layer_count].context;

        node = layers[layer_count].children; //array - top level nodes
        i = node.length;

        while (i--) {
          ctx.clearRect.apply(ctx, node[i].__getBounds(display).inflate(2, 2).__toArray());
        }
      }

      //update position
      while (recv_count--) {
        if (receivers[recv_count].eventListeners.hasOwnProperty('enterFrame')) {
          receivers[recv_count].handleEvent(enterFrame.__setTarget(receivers[recv_count]));
        }
      }

      //draw
      while (path_count--) {
        node = scene_path[path_count];
        ctx = node.context;
        
        if (ctx && node.visible) {
          ctx.save();
          ctx.transform.apply(ctx, node.__allTransforms.__toArray());
        
          //apply alpha to node and it's children
          if (!isLayer(node)) {
            if (node.alpha !== 1) {
              ctx.globalAlpha = node.alpha;
            }
          }
          if (typeof node.__draw === 'function') {
            node.__draw(ctx);
          }

          //DEBUG//
          if (node.debug.boundingBox) {
            bounds = node.__getBounds(display);
            if (bounds) {
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0); //reset
              //bounding box
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = display.debug.boundingBox;
              ctx.strokeRect.apply(ctx, bounds.__toArray());
              ctx.restore();
            }
            
          }
          //END_DEBUG//
          ctx.restore();
        }
      }
      ****/

      /*** old way ***/
      clear_scene_graph(layers, layer_count);
      
      while (recv_count--) {
        if (receivers[recv_count].eventListeners.hasOwnProperty('enterFrame')) {
          receivers[recv_count].handleEvent(enterFrame.__setTarget(receivers[recv_count]));
        }
      }

      draw_scene_graph(scene_path, path_count);
      
      /*DEBUG_STATS*/
      if (display.debug.stats !== false) {
        //update stats monitor if needed
        display.debug.stats.update();
      }
      /*END_DEBUG_STATS*/
      frame_count++;
      /**end old way**/
      
    };
  }());

  
  /*
   * @param {Node} node
   */
  clear_scene_graph = function (layers, count) {
    /* Brute way, clear entire layer in big rect.
     */
    var ctx;
    while (count--) {
      ctx = layers[count].context;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0); //reset
      ctx.clearRect(0, 0, layers[count].width, layers[count].height);
      ctx.restore();
    }
  };

  /*
   *
   */
  draw_scene_graph = function (scene_path, count) {
    var node,
        display,
        ctx,
        bounds;
    
    while (count--) {
      node = scene_path[count];
      display = node.root;
      ctx = node.context;
      
      if (ctx && node.visible) {
        ctx.save();
        ctx.transform.apply(ctx, node.__allTransforms.__toArray());
        
        //apply alpha to node and it's children
        if (!isLayer(node)) {
          if (node.alpha !== 1) {
            ctx.globalAlpha = node.alpha;
          }
        }
        if (typeof node.__draw === 'function') {
          node.__draw(ctx);
        }
        
        ctx.restore();
        
        /*DEBUG*/
        if (node.debug.boundingBox) {
          draw_bounding_box(node, ctx, node.root);
          bounds = node.__getBounds(display);
          if (bounds) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0); //reset
            //bounding box
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = display.debug.boundingBox;
            ctx.strokeRect.apply(ctx, bounds.__toArray());
            ctx.restore();
          }
          
        }
        /*END_DEBUG*/
      }
    }
  };
  

  /*
   * EVENT DISPATCHING
   */

  /* Dispatches the following dom mouse events to doodle nodes on the display path:
   * 'click', 'doubleclick', 'mousedown', 'mouseup', 'contextmenu', 'mousewheel'.
   * An event is dispatched to the first node on the display path which
   * mouse position is within their bounds. The event then follows the event path.
   * The doodle mouse event is recycled by copying properties from the dom event.
   *
   * @param {MouseEvent} evt DOM mouse event to copy properties from.
   * @param {MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
   * @param {Array} path Reference to the display's scene path.
   * @param {Number} count Number of nodes in the scene path array.
   * @param {Number} x Position of the mouse x coordiante.
   * @param {Number} y Position of the mouse y coorindate.
   * @param {Display} display Reference to the display object.
   * @return {Boolean} True if event gets dispatched.
   * @private
   */
  dispatch_mouse_event = function (evt, mouseEvent, path, count, x, y, display) {
    while (count--) {
      if(path[count].__getBounds(display).contains(x, y)) {
        path[count].dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      }
    }
    return false;
  };

  /* Called on every mousemove event from the dom.
   * Dispatches the following events to doodle nodes on the display path:
   * 'mousemove', 'mouseover', 'mouseenter', 'mouseout', 'mouseleave'
   * Maintains mouse over/out information by assigning a boolean value to
   * the node.__pointInBounds property. This is only accessed in this function,
   * and is reset in 'dispatch_mouseleave_event'.
   *
   * @param {MouseEvent} evt DOM mouse event to copy properties from.
   * @param {MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
   * @param {Array} path Reference to the display's scene path.
   * @param {Number} count Number of nodes in the scene path array.
   * @param {Number} x Position of the mouse x coordiante.
   * @param {Number} y Position of the mouse y coorindate.
   * @param {Display} display Reference to the display object.
   * @return {Boolean} True on dispatch. (Always true because display will trigger it.)
   * @private
   */
  dispatch_mousemove_event = function (evt, mouseEvent, path, count, x, y, display) {
    var node;
    while (count--) {
      node = path[count];
      if(node.__getBounds(display).contains(x, y)) {
        //point in bounds
        if (!node.__pointInBounds) {
          /* @type {Boolean} */
          node.__pointInBounds = true;
          //dispatch events to node and up parent chain
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseover'));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseenter'));
          return true;
        }
        //while in-bounds, dispatch mousemove
        node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null));
        return true;
      } else {
        //point not on sprite
        if (node.__pointInBounds) {
          /* @type {Boolean} */
          node.__pointInBounds = false;
          //dispatch events to node and up parent chain
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
          node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
          return true;
        }
      }
    }
  };

  /* Called when the mouse leaves the display element.
   * Dispatches 'mouseout' and 'mouseleave' to the display and resets
   * the __pointInBounds property for all nodes.
   *
   * @param {MouseEvent} evt DOM mouse event to copy properties from.
   * @param {MouseEvent} mouseEvent Doodle mouse event to re-dispatch to nodes.
   * @param {Array} path Reference to the display's scene path.
   * @param {Array} layers Reference to display's children array.
   * @param {Number} layer_count Number of nodes in the layers array. Later reused to be node scene path count.
   * @param {Node} top_node Reference to the display object. Later reused to be the top layer.
   * @return {Boolean} True on dispatch. (Always true because display will trigger it.)
   * @private
   */
  dispatch_mouseleave_event = function (evt, mouseEvent, path, layers, layer_count, top_node) {
    if (layer_count === 0) {
      //no layers so no scene path, display will dispatch
      /* @type {Boolean} */
      top_node.__pointInBounds = false;
      top_node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
      top_node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
      return true;
    } else {
      //reusing var - this is the top layer
      top_node = layers[layer_count-1];
      //reusing var - scene path count
      layer_count = path.length;
      while (layer_count--) {
        //all nodes out-of-bounds
        /* @type {Boolean} */
        path[layer_count].__pointInBounds = false;
      }
      //top layer dispatch
      top_node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseout'));
      top_node.dispatchEvent(mouseEvent.__copyMouseEventProperties(evt, null, 'mouseleave'));
      return true;
    }
  };

  /* Called when the dom detects a keypress.
   * Doodle KeyboardEvent is reused by copying the dom event properties.
   * @param {Event} evt DOM keyboard event to copy properties from.
   * @return {Boolean}
   * @private
   */
  dispatch_keyboard_event = function (evt, keyboardEvent, display) {
    display.broadcastEvent(keyboardEvent.__copyKeyboardEventProperties(evt, null));
    return true;
  };

  /*
   * CLASS METHODS
   */

  /**
   * Test if an object is of the display type.
   * @param {Object} obj Object to test.
   * @return {Boolean} True if object is a Doodle Display.
   */
  isDisplay = doodle.Display.isDisplay = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object Display]');
  };

  /*DEBUG*/
  /**
   * Type-checking for a Doodle Display object. Throws a TypeError if the test fails.
   * @param {Object} display Object to test.
   * @param {String=} caller Function name to print in error message.
   * @param {String=} param Parameters to print in error message.
   * @return {Boolean} True if object is a Doodle Display.
   */
  doodle.utils.types.check_display_type = function (display, caller, params) {
    if (isDisplay(display)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_display_type" : caller;
      params = (params === undefined) ? "" : '('+params+')';
      throw new TypeError(caller + params +": Parameter must be a Display.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
