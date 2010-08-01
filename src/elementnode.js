
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
          //check_canvas_type(canvas, this+'.element');
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
          check_string_type(name, this+'.id');
          this.element.id = name;
        }
      },

      'width': {
        get: function () {
          return this.element.width;
        },
        set: function (n) {
          check_number_type(n, this+'.width');
          this.element.width = n;
        }
      },
      
      'height': {
        get: function () {
          return this.element.height;
        },
        set: function (n) {
          check_number_type(n, this+'.height');
          this.element.height = n;
        }
      },

      'alpha': {
        get: function () {
          var color = this.element.style.backgroundColor,
              alpha = 1.0;
          if (/rgba\(.*\)/.test(color)) {
            //i really hate javascript numbers
            alpha = parseFloat(parseFloat(color.split(/,/g)[3]).toFixed(2));
          }
          return alpha;
        },
        set: function (alpha) {
          check_number_type(alpha, this+'.alpha');
          //is color ever stored as hex?
          var rgb = this.element.style.backgroundColor.match(/(\d{1,3})/g);
          
          this.element.style.backgroundColor = "rgba("+ rgb[0] +","+ rgb[1] +","+ rgb[2] +"," + alpha +")";
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
          check_boolean_type(isVisible, this+'.visible');
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
