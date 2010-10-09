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
      set_element_property = doodle.utils.set_element_property;
  
  /**
   * @name doodle.Layer
   * @class
   * @augments doodle.ElementNode
   * @param {string=} id
   * @param {HTMLCanvasElement=} element
   * @return {doodle.Layer}
   * @throws {SyntaxError}
   */
  doodle.Layer = function (id, element) {
    var layer_name = (typeof id === 'string') ? id : "layer"+ String('00'+layer_count).slice(-2),
        layer = Object.create(doodle.ElementNode(undefined, layer_name));

    Object.defineProperties(layer, layer_static_properties);
    //properties that require privacy
    Object.defineProperties(layer, (function () {
      //defaults
      var width = 0,
          height = 0,
          context = null;
      
      return {
        /**
         * Canvas dimensions need to apply to HTML attributes.
         * @name width
         * @return {number}
         * @throws {TypeError}
         * @property
         * @override
         */
        'width': {
          enumerable: true,
          configurable: true,
          get: function () { return width; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.width');
            /*END_DEBUG*/
            width = set_element_property(this.element, 'width', n, 'html');
          }
        },

        /**
         * 
         * @name height
         * @return {number}
         * @throws {TypeError}
         * @property
         * @override
         */
        'height': {
          enumerable: true,
          configurable: true,
          get: function () { return height; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.height');
            /*END_DEBUG*/
            height = set_element_property(this.element, 'height', n, 'html');
          }
        },

        /**
         * 
         * @name context
         * @return {CanvasRenderingContext2D}
         * @property
         * @override
         */
        'context': {
          enumerable: true,
          configurable: true,
          get: function () { return context; }
        },

        /**
         * Layer specific things to setup when adding a dom element.
         * Called in ElementNode.element
         * @name __addDomElement
         * @param {HTMLElement} elementArg
         * @throws {TypeError}
         * @override
         * @private
         */
        '__addDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) {
            /*DEBUG*/
            check_canvas_type(elementArg, this+'.element');
            /*END_DEBUG*/
            //need to stack canvas elements inside div
            set_element_property(elementArg, 'position', 'absolute');
            //set to display dimensions if there
            if (this.parent) {
              this.width = this.parent.width;
              this.height = this.parent.height;
            }
            //set rendering context
            context = elementArg.getContext('2d');
          }
        },

        /**
         * Layer specific things to setup when removing a dom element.
         * Called in ElementNode.element
         * @name __removeDomElement
         * @param {HTMLElement} elementArg
         * @override
         * @private
         */
        '__removeDomElement': {
          enumerable: false,
          writable: false,
          value: function (elementArg) {
            context = null;
          }
        }
        
      };
    }()));//end defineProperties

    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function or id string
      if (typeof arguments[0] === 'function') {
        arguments[0].call(layer);
        id = undefined;
      }
      break;
    case 2:
      /*DEBUG*/
      check_canvas_type(element, '[object Layer]', 'id, *element*');
      /*END_DEBUG*/
      layer.element = element;
      break;
    default:
      throw new SyntaxError("[object Layer](id, element): Invalid number of parameters.");
    }

    if (layer.element === null) {
      layer.element = document.createElement('canvas');
    }
    
    layer_count += 1;

    return layer;
  };

  
  layer_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Layer]";
      }
    },

    /**
     * This is always the same size, so we'll save some computation.
     * @name __getBounds
     * @return {Rectangle}
     * @override
     * @private
     */
    '__getBounds': {
      enumerable: true,
      configurable: true,
      value: (function () {
        var rect = doodle.geom.Rectangle(0, 0, 0, 0); //recycle
        return function () {
          return rect.compose(0, 0, this.width, this.height);
        };
      }())
    }
  };//end layer_static_properties

  /*
   * CLASS METHODS
   */

  /**
   * Test if an object is a Layer.
   * @name isLayer
   * @param {Object} obj
   * @return {boolean}
   * @static
   */
  isLayer = doodle.Layer.isLayer = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object Layer]');
  };

  /**
   * Check if object inherits from layer.
   * @name inheritsLayer
   * @param {Object} obj
   * @return {boolean}
   * @static
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

  /*DEBUG*/
  /**
   * @name check_layer_type
   * @param {Layer} layer
   * @param {string} caller
   * @param {string} params
   * @return {boolean}
   * @throws {TypeError}
   * @memberOf utils.types
   * @static
   */
  doodle.utils.types.check_layer_type = function (layer, caller, param) {
    if (inheritsLayer(layer)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_layer_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be a Layer.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
