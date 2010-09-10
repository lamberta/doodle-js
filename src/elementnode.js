(function () {
  var node_static_properties,
      doodle_utils = doodle.utils,
      check_number_type = doodle_utils.types.check_number_type,
      check_string_type = doodle_utils.types.check_string_type,
      check_boolean_type = doodle_utils.types.check_boolean_type,
      rgb_str_to_hex = doodle_utils.rgb_str_to_hex,
      rgb_str_to_rgb = doodle_utils.rgb_str_to_rgb,
      rgb_to_rgb_str = doodle_utils.rgb_to_rgb_str,
      hex_to_rgb_str = doodle_utils.hex_to_rgb_str,
      get_element = doodle_utils.get_element,
      get_style_property = doodle_utils.get_style_property,
      get_element_property = doodle_utils.get_element_property,
      set_element_property = doodle_utils.set_element_property;
  
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

    Object.defineProperties(element_node, node_static_properties);
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

  
  node_static_properties = {
    'id': {
      get: function () {
        return get_element_property(this.element, 'id');
      },
      set: function (name) {
        /*DEBUG*/
        check_string_type(name, this+'.id');
        /*END_DEBUG*/
        return set_element_property(this.element, 'id', name, 'html');
      }
    },
    
    'width': {
      get: function () {
        return get_element_property(this.element, 'width', 'int');
      },
      set: function (n) {
        /*DEBUG*/
        check_number_type(n, this+'.width');
        /*END_DEBUG*/
        set_element_property(this.element, 'width', n+"px");
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
        return n;
      }
    },

    'backgroundColor': {
      get: function () {
        return rgb_str_to_hex(get_element_property(this.element, 'backgroundColor'));
      },
      set: function (color) {
        if (typeof color === 'number') {
          color = hex_to_rgb_str(color);
        }
        return set_element_property(this.element, 'backgroundColor', color);
      }
    },

    'backgroundImage': (function () {
      var url_regexp = new RegExp("^url\\((.*)\\)");
      return {
        get: function () {
          var url = get_element_property(this.element, 'backgroundImage');
          url = (url === "none") ? null : url.match(url_regexp);
          //returns the captured substring match
          return url ? url[1] : null;
        },
        set: function (image) {
          if (!image) {
            return set_element_property(this.element, 'backgroundImage', null);
          }
          //a string can be a page element or url
          if (typeof image === 'string') {
            if (image[0] === '#') {
              image = get_element(image).src;
            }
          } else if (image && image.tagName === 'IMG') {
            //passed an image element
            image = image.src;
          }
          /*DEBUG*/
          check_string_type(image, this+'.backgroundImage');
          /*END_DEBUG*/

          //url path at this point, make sure it's in the proper format
          if (!url_regexp.test(image)) {
            image = "url("+ encodeURI(image) +")";
          }
          return set_element_property(this.element, 'backgroundImage', image);
        }
      };
    }()),

    /* Default is repeat.
     */
    'backgroundRepeat': {
      get: function () {
        return get_element_property(this.element, 'backgroundRepeat');
      },
      set: function (repeat) {
        /*DEBUG*/
        check_string_type(repeat, this+'.backgroundRepeat');
        if (repeat === 'repeat' || repeat === 'repeat-x' || repeat === 'repeat-y' ||
            repeat === 'no-repeat' || repeat === 'inherit' ){
          true;
        } else {
          throw new SyntaxError(this+'.backgroundRepeat: Invalid CSS value.');
        }
        /*END_DEBUG*/
        return set_element_property(this.element, 'backgroundRepeat', repeat);
      }
    },

		'alpha': {
      get: function () {
        return get_element_property(this.element, 'opacity', 'float');
      },
      set: function (alpha) {
        /*DEBUG*/
        check_number_type(alpha, this+'.alpha');
				alpha = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
        /*END_DEBUG*/
        return set_element_property(this.element, 'opacity', alpha);
      }
    },

    'visible': {
      get: function () {
        switch (get_element_property(this.element, 'visibility')) {
        case 'visible':
          return true;
        case 'hidden':
          return false;
        default:
          throw new ReferenceError(this+".visible: Unable to determine visibility.");
        }
      },
      set: function (isVisible) {
        /*DEBUG*/
        check_boolean_type(isVisible, this+'.visible');
        /*END_DEBUG*/
        if (isVisible) {
          set_element_property(this.element, 'visibility', 'visible');
        } else {
          set_element_property(this.element, 'visibility', 'hidden');
        }
        return isVisible;
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
    
  };//end node_static_properties
}());//end class closure
