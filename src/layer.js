
(function () {

  var layer_properties,
      isLayer,
      inheritsLayer,
      layer_count = 0,
      check_canvas_type = doodle.utils.types.check_canvas_type;

  
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
      }
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

  
  /*
   * CLASS METHODS
   */

  /* Test if an object is an node.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isLayer = doodle.Layer.isLayer = function (obj) {
    return obj.toString() === '[object Layer]';
  };

  /* Check if object inherits from node.
   * @param {Object} obj
   * @return {Boolean}
   */
  inheritsLayer = doodle.Layer.inheritsLayer = function (obj) {
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

  doodle.utils.types.check_layer_type = function (layer, caller_name) {
    if (!inheritsLayer(layer)) {
      caller_name = (caller_name === undefined) ? "check_layer_type" : caller_name;
      throw new TypeError(caller_name + ": Parameter must be a layer.");
    } else {
      return true;
    }
  };


  (function () {
    var check_number_type = doodle.utils.types.check_number_type,
        check_string_type = doodle.utils.types.check_string_type;
    
    layer_properties = {
      /*
       * PROPERTIES
       */

      'context': {
        get: function () {
          return this.element.getContext('2d');
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
  }());
}());//end class closure
