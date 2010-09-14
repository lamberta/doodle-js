/*globals doodle, document*/

(function () {
  var layer_static_properties,
      layer_count = 0,
      isLayer,
      inheritsLayer,
      /*DEBUG*/
      check_number_type = doodle.utils.types.check_number_type,
      check_canvas_type = doodle.utils.types.check_canvas_type,
      /*END_DEBUG*/
      get_element = doodle.utils.get_element,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property;
  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.Layer = function (id, element) {
    var layer_name = (typeof id === 'string') ? id : "layer"+ String('00'+layer_count).slice(-2),
        layer = Object.create(doodle.ElementNode(layer_name));
    
    /*DEBUG*/
    if (arguments.length > 2) {
      throw new SyntaxError("[object Layer](id, element): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(layer, layer_static_properties);
    //properties that require privacy
    Object.defineProperties(layer, {
      'element': (function () {
        var dom_element = null;
        return {
          get: function () {
            return dom_element;
          },
          set: function (canvasArg) {
            if (canvasArg === null) {
              dom_element = null;
            } else {
              canvasArg = get_element(canvasArg);
              /*DEBUG*/
              check_canvas_type(canvasArg, this+'.element');
              /*END_DEBUG*/
              dom_element = canvasArg;
              set_element_property(dom_element, 'id', layer_name, 'html');
              if (this.parent) {
                //set to display dimensions
                this.width = this.parent.width;
                this.height = this.parent.height;
              }
              //need to stack canvas elements inside div
              set_element_property(dom_element, 'position', 'absolute');
            }
          }
        };
      }())
    });

    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arguments.length > 1) {
        throw new SyntaxError("[object Layer](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      arguments[0].call(layer);
      id = undefined;
    }
    
    //layer defaults - if not set in init function
    if (layer.element === null) {
      layer.element = document.createElement('canvas');
    }
    
    layer_count += 1;

    return layer;
  };

  
  layer_static_properties = {
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
  };//end layer_static_properties

  /*
   * CLASS METHODS
   */

  /* Test if an object is an node.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isLayer = doodle.Layer.isLayer = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object Layer]');
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
  
  doodle.utils.types.check_layer_type = function (layer, caller, param) {
    if (inheritsLayer(layer)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_layer_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be a Layer.");
    }
  };
  
}());//end class closure
