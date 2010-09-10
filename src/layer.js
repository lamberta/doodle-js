
(function () {

  var layer_properties,
      layer_count = 0,
      check_number_type = doodle.utils.types.check_number_type,
      check_canvas_type = doodle.utils.types.check_canvas_type,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property;

  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Layer = function (id, element) {
    var arg_len = arguments.length,
        initializer,
        layer = Object.create(doodle.ElementNode()),
        layer_name = "layer" + layer_count;

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
      id = undefined;
    } else if (arg_len > 2) {
      throw new SyntaxError("[object Layer]: Invalid number of parameters.");
    }

    Object.defineProperties(layer, layer_properties);
    //properties that require privacy
    Object.defineProperties(layer, {
      'element': {
        get: function () {
          return element;
        },
        set: function (canvas) {
          /*DEBUG*/
          check_canvas_type(canvas, this+'.element');
          /*END_DEBUG*/
          element = canvas;
        }
      },

      /* Layer has it's own alpha since canvas backgroundColor default is rgba(0,0,0,0)
       * What happens when I change it's background?
       */
      'alpha': (function () {
        var alpha = 1;
        return {
          get: function () { return alpha; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.alpha');
            /*END_DEBUG*/
            alpha = (n < 0) ? 0 : ((n > 1) ? 1 : n);
          }
        };
      }())
    });

    //init
    layer.element = element || document.createElement('canvas');
    //need to stack canvas elements inside div
    layer.element.style.position = "absolute";

    //passed an initialization object: function
    if (initializer) {
      initializer.call(layer);
    }

    if (!layer.id) {
      layer.id = (typeof id === 'string') ? id : "layer" + String('00'+layer_count).slice(-2);
      layer_count += 1;
    }

    return layer;
  };

  (function () {
    /*
     * CLASS METHODS
     */

    /* Test if an object is an node.
     * Not the best way to test object, but it'll do for now.
     * @param {Object} obj
     * @return {Boolean}
     */
    var isLayer = doodle.Layer.isLayer = function (obj) {
      return obj.toString() === '[object Layer]';
    };

    /* Check if object inherits from node.
     * @param {Object} obj
     * @return {Boolean}
     */
    var inheritsLayer = doodle.Layer.inheritsLayer = function (obj) {
      while (obj) {
        if (isLayer(obj)) {
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

    doodle.utils.types.check_layer_type = function (layer, caller, param) {
      if (inheritsLayer(layer)) {
        return true;
      } else {
        caller = (caller === undefined) ? "check_layer_type" : caller;
        param = (param === undefined) ? "" : '('+param+')';
        throw new TypeError(caller + param +": Parameter must be a Layer.");
      }
    };
    
  }());

  layer_properties = {
    /*
     * PROPERTIES
     */
    'context': {
      get: function () {
        return this.element.getContext('2d');
      }
    },

    /* Canvas dimensions need to apply to HTML attributes.
     */
    'width': {
        get: function () {
          return get_element_property(this.element, 'width', 'int');
        },
        set: function (n) {
          /*DEBUG*/
          check_number_type(n, this+'.width');
          /*END_DEBUG*/
          set_element_property(this.element, 'width', n, 'html');
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
          set_element_property(this.element, 'height', n, 'html');
          return n;
        }
      },

    /*
     * METHODS
     */

    /* Returns the string representation of the specified object.
     * @return {String}
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Layer]";
      }
    }
    
  };//end layer_properties
  
}());//end class closure
