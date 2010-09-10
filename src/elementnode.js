
(function () {

  var elementnode_properties;
  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.ElementNode = function (element) {
    var arg_len = arguments.length,
        initializer,
        element_node = Object.create(doodle.Node());

    //check if passed an init function
    if (arg_len === 1 && typeof arguments[0] === 'function') {
      initializer = arguments[0];
      element = undefined;
    } else if (arg_len > 1) {
      throw new SyntaxError("[object ElementNode]: Invalid number of parameters.");
    }

    Object.defineProperties(element_node, elementnode_properties);
    //properties that require privacy
    Object.defineProperties(element_node, {
      'element': {
        get: function () {
          return element;
        },
        set: function (elem) {
          element = elem;
        }
      }
    });

    //passed an initialization object: function
    if (initializer) {
      initializer.call(element_node);
    }

    return element_node;
  };


  (function () {
    var check_number_type = doodle.utils.types.check_number_type,
        check_string_type = doodle.utils.types.check_string_type,
        check_boolean_type = doodle.utils.types.check_boolean_type,
        rgb_str_to_rgb = doodle.utils.rgb_str_to_rgb,
        rgb_to_rgb_str = doodle.utils.rgb_to_rgb_str,
        get_style_property = doodle.utils.get_style_property;
    
    elementnode_properties = {
      /*
       * PROPERTIES
       */

      'id': {
        get: function () {
          return this.element.id;
        },
        set: function (name) {
          /*DEBUG*/
          check_string_type(name, this+'.id');
          /*END_DEBUG*/
          this.element.id = name;
        }
      },

      'width': {
        get: function () {
          return this.element.width;
        },
        set: function (n) {
          /*DEBUG*/
          check_number_type(n, this+'.width');
          /*END_DEBUG*/
          this.element.width = n;
        }
      },
      
      'height': {
        get: function () {
          return this.element.height;
        },
        set: function (n) {
          /*DEBUG*/
          check_number_type(n, this+'.height');
          /*END_DEBUG*/
          this.element.height = n;
        }
      },

      /* Layer must have it's own alpha since a canvas by
       * default is rgba(0,0,0,0)
       */
      'alpha': {
        get: function () {
          var color = rgb_str_to_rgb(get_style_property(this.element, 'backgroundColor')),
              alpha = color[3];
          return (typeof alpha === 'number') ? alpha : 1;
        },
        set: function (alpha) {
          /*DEBUG*/
          check_number_type(alpha, this+'.alpha');
          /*END_DEBUG*/
          var color = get_style_property(this.element, 'backgroundColor'),
              rgb = rgb_str_to_rgb(color),
              rgba_str = rgb_to_rgb_str(rgb[0], rgb[1], rgb[2], alpha);
          this.element.style.backgroundColor = rgba_str;
        }
      },

      /*
       * @param {Boolean}
       * @return {Boolean}
       */
      'visible': {
        get: function () {
          switch (get_style_property(this.element, 'visibility')) {
          case 'visible':
            return true;
          case 'hidden':
            return false;
          default:
            throw new Error(this+".visible: Unable to determine visibility.");
          }
        },
        set: function (isVisible) {
          /*DEBUG*/
          check_boolean_type(isVisible, this+'.visible');
          /*END_DEBUG*/
          if (isVisible) {
            this.element.style.visibility = 'visible';
          } else {
            this.element.style.visibility = 'hidden';
          }
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
          return "[object ElementNode]";
        }
      }
      
    };//end layer_properties
  }());
}());//end class closure
