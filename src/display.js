
var last_event;

(function () {

  var display_properties,
      check_block_element = doodle.utils.types.check_block_element,
      get_element = doodle.utils.get_element,
      check_context_type = doodle.utils.types.check_context_type,
      Event = doodle.Event,
      ENTER_FRAME = Event.ENTER_FRAME,
      enterFrame = Event(ENTER_FRAME),
      dispatcher_queue = doodle.EventDispatcher.dispatcher_queue;
  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Display = function (element) {
    var arg_len = arguments.length,
        initializer,
        display = Object.create(doodle.ElementNode()),
        frame_count = 0;

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
      element = undefined;
    } else if (arg_len > 1) {
      throw new SyntaxError("[object Display]: Invalid number of parameters.");
    }

    Object.defineProperties(display, display_properties);
    //properties that require privacy
    Object.defineProperties(display, {
      'element': {
        get: function () {
          return element;
        },
        set: function (id) {
          //get by name or actual element
          //element = document.getElementById(id);
          var e = get_element(id, '[object Display]');
          if (check_block_element(e, this+'.element')) {
            element = e;
          }
          //we need to stack the canvas elements on top of each other
          element.style.position = "relative";
          //init rest - can you transfer layers to another div?
          this.root = this;

          //add listeners to dom events that we'll re-dispatch to the scene graph
          for (var type in doodle.MouseEvent) {
            element.addEventListener(doodle.MouseEvent[type], dispatch_mouse_event_to_sprite, false);
          }
          //add keyboard listeners to document
          //how to make this work for multiple displays?
          document.addEventListener(doodle.KeyboardEvent.KEY_PRESS, dispatch_keyboard_event, false);
          document.addEventListener(doodle.KeyboardEvent.KEY_DOWN, dispatch_keyboard_event, false);
          document.addEventListener(doodle.KeyboardEvent.KEY_UP, dispatch_keyboard_event, false);
          
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
            } else if (typeof fps === 'number' && fps !== frame_rate && isFinite(1000/fps)) {
              frame_rate = fps;
              clearInterval(framerate_interval_id);
              framerate_interval_id = setInterval(create_frame, 1000/frame_rate);
            } else {
              throw new TypeError('[object Display].frameRate: Parameter must be a valid number or false.');
            }
          }
        }
      }())
    });

    
    //passed an initialization object: function
    if (initializer) {
      initializer.call(display);
    } else {
      //init
      display.element = element;
    }

    if (!display.element) {
      throw new ReferenceError("[object Display]: Requires a HTML element.");
    }


    /* Redraw scene graph when children are added and removed.
     */
    display.addEventListener(Event.ADDED, redraw_scene_graph);
    display.addEventListener(Event.REMOVED, redraw_scene_graph);
    

    /* Clear, move, draw.
     * Dispatches Event.ENTER_FRAME to all objects listening to it,
     * reguardless if it's on the scene graph or not.
     */
    function create_frame () {
      clear_scene_graph(display);
      dispatcher_queue.forEach(function (obj) {
        if (obj.hasEventListener(ENTER_FRAME)) {
          enterFrame.__setTarget(obj);
          obj.handleEvent(enterFrame);
        }
      });
      draw_scene_graph(display);
      frame_count += 1;
    }
    function clear_scene_graph (node, context) {
      node.children.forEach(function (child) {
        context = context || child.context;
        check_context_type(context, this+'.clear_scene_graph', 'context');
        
        if (typeof child.getBounds === 'function') {
          var bounds = child.getBounds(node);
          //take into account bounding box border
          context.clearRect(bounds.x-1, bounds.y-1, bounds.width+2, bounds.height+2);
        }
        clear_scene_graph(child, context);
      });
    }
    function draw_scene_graph (node, context) {
      var m, //child transform matrix
          bounding_box,
          global_pt; //transformed point for bounding box
      
      node.children.forEach(function (child) {
        context = context || child.context;
        m = child.transform.toArray();
        context.save();
        context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        
        if (typeof child.__draw === 'function') {
          child.__draw(context);
        };

        //if (this.debug) { }; //draw bounding box, reg-point, axis
        (function () {
          if (typeof child.getBounds === 'function') {
            //calculate bounding box relative to parent
						bounding_box = child.getBounds(node);
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0); //reset
            //bounding box
            context.lineWidth = 0.5;
            context.strokeStyle = "#0000ff";
            context.strokeRect(bounding_box.x, bounding_box.y,
															 bounding_box.width, bounding_box.height);
            //registraion point
            context.fillStyle = "#000000";
            context.beginPath();
            context.arc(child.x, child.y, 3, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
            
            context.restore();
          }
        }());
        
        draw_scene_graph(child, context);
        context.restore();
      });
    }
    function redraw_scene_graph (evt) {
      clear_scene_graph(display);
      draw_scene_graph(display);
    }
    
    return display;
  };


  (function () {

    var check_string_type = doodle.utils.types.check_string_type,
        check_number_type = doodle.utils.types.check_number_type,
        check_layer_type = doodle.utils.types.check_layer_type;
    
    
    display_properties = {

      /*
       * PROPERTIES
       */

      'width': {
        get: function () {
          //just using css style properties for now
          return parseInt(this.element.style.width);
        },
        set: function (n) {
          check_number_type(n, this+'.width');
          this.element.style.width = n + "px"; //css style takes a string
          //re-adjust all layer child nodes as well
          this.children.forEach(function (layer) {
            layer.width = n;
          });
        }
      },
      
      'height': {
        get: function () {
          return parseInt(this.element.style.height);
        },
        set: function (n) {
          check_number_type(n, this+'.height');
          this.element.style.height = n + "px";
          this.children.forEach(function (layer) {
            layer.height = n;
          });
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

      'backgroundColor': {
        get: function () {
          var color = this.element.style.backgroundColor,
          rgb;
          if (/rgba?\(.*\)/.test(color)) {
            rgb = color.match(/(\d{1,3})/g);
            color = doodle.utils.rgb_to_hex(rgb[0], rgb[1], rgb[2]);
          }
          return color;
        },
        set: function (color) {
          //check color
          this.element.style.backgroundColor = color;
        }
      },

      'backgroundImage': {
        get: function () {
          //returns the captured substring match
          var image_url = this.element.style.backgroundImage.match(/^url\((.*)\)$/);
          return image_url ? image_url[1] : false;
        },
        set: function (image_url) {
          //check image
          //defaults to no-repeat, top-left
          //other options must change the element.style.background- properties
          var element_style = this.element.style;
          if (!element_style.backgroundRepeat ||
              /(\srepeat\s)|(\srepeat-[xy]\s)/.test(element_style.background)) {
            element_style.backgroundRepeat = 'no-repeat';
          }
          element_style.backgroundImage = "url(" + image_url + ")";
        }
      },

      'addChildAt': {
        value: function (layer, index) {
          check_layer_type(layer, this+'.addChildAt');
          check_number_type(index, this+'.addChildAt');
          
          //if has previous parent, remove from it's children
          if (layer.parent !== null && layer.parent !== this) {
            layer.parent.removeChild(node);
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
          check_number_type(index, this+'.removeChildAt');
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
          check_number_type(arguments, this+'.swapChildrenAt');
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
          var layer = doodle.Layer(id); //layer will auto-name
          this.addChild(layer);
          return layer;
        }
      },

      'removeLayer': {
        value: function (id) {
          check_string_type(id, this+'.removeLayer');
          this.removeChildById(id);
        }
      }
      
    };//end display_properties
  }());
}());//end class closure


var inheritsSprite = doodle.Sprite.inheritsSprite;
//test mouse click collision with sprite bounds
var dispatch_mouse_event_to_sprite = function (event) {
  last_event = event;
  //position on canvas element
  //offset is relative to div, however this implementation adds 1 to y?
  var global_x = event.offsetX,
      global_y = event.offsetY,
      dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
      evt = doodle.MouseEvent(event), //wrap dom event in doodle event
      local_pt;

  //console.log("coords: "+[,] +"type: " + event.type + ", bubbles: " + event.bubbles);
  
  dispatcher_queue.forEach(function (obj) {
    if (obj.hasEventListener(evt.type) && inheritsSprite(obj)) {
      if (obj.hitArea.containsPoint({x: global_x, y: global_y})) {
        //check z-index to determine who's on top?
        local_pt = obj.globalToLocal({x: global_x, y: global_y});
        //evt.localX = local_pt.x;
        //evt.localY = local_pt.y;
        console.log("go!");
        evt.__setTarget(null); //dom setting target as canvas element
        obj.dispatchEvent(evt);
      }
    }
  });
}

var dispatch_keyboard_event = function (event) {
  //console.log("event type: " + event.type + ", bubbles: " + event.bubbles);
  var dispatcher_queue = doodle.EventDispatcher.dispatcher_queue,
      evt = doodle.KeyboardEvent(event); //wrap dom event in doodle event
  dispatcher_queue.forEach(function (obj) {
    if (obj.hasEventListener(evt.type)) {
      obj.handleEvent(evt);
    }
  });
};
