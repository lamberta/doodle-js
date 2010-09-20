/*globals doodle*/

(function () {
  var node_static_properties,
      url_regexp = new RegExp("^url\\((.*)\\)"),
      isElementNode,
      inheritsElementNode,
      /*DEBUG*/
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      check_boolean_type = doodle.utils.types.check_boolean_type,
      check_block_element = doodle.utils.types.check_block_element,
      check_canvas_type = doodle.utils.types.check_canvas_type,
      /*END_DEBUG*/
      //lookup help
      rgb_str_to_hex = doodle.utils.rgb_str_to_hex,
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      get_element = doodle.utils.get_element,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property;
  
  /* Super constructor
   * @param {String|Function} id|initializer
   * @return {Object}
   */
  doodle.ElementNode = function (id, element) {
    var element_node = Object.create(doodle.Node((typeof id === 'string') ? id : undefined));

    /*DEBUG*/
    if (arguments.length > 2) {
      throw new SyntaxError("[object ElementNode](id, element): Invalid number of parameters.");
    }
    /*END_DEBUG*/

    Object.defineProperties(element_node, node_static_properties);
    //properties that require privacy
    Object.defineProperties(element_node, (function () {
      //defaults
      var dom_element = null,
          node_id = element_node.id, //inherit from node
          alpha = element_node.alpha,
          visible = element_node.visible,
          width = 0,
          height = 0,
          bg_color = null,
          bg_image = null,
          bg_repeat = 'repeat';
      
      return {
        'element': {
          enumerable: true,
          configurable: true,
          get: function () { return dom_element; },
          set: function (elementArg) {
            var color,
                image,
                w, h;
            
            if (elementArg === null) {
              //if removing an element, reset some values on the doodle object
              if (dom_element !== null) {
                bg_color = null;
                bg_image = null;
                bg_repeat = 'repeat';
                //keep values of parent
                if (!this.parent) {
                  width = 0;
                  height = 0;
                }
              }
              dom_element = null;
              
            } else {
              //assign a dom element
              elementArg = get_element(elementArg);
              
              /* Layer and Display requires some special element handling.
               * Would put this in their respective classes, but accessing the
               * properties within this closure would be a pain.
               */
              switch (this.toString()) {
              case '[object Layer]':
                /*DEBUG*/
                check_canvas_type(elementArg, this+'.element');
                /*END_DEBUG*/
                set_element_property(elementArg, 'id', node_id, 'html');
                //need to stack canvas elements inside div
                set_element_property(elementArg, 'position', 'absolute');
                //set to display dimensions if there
                if (this.parent) {
                  this.width = this.parent.width;
                  this.height = this.parent.height;
                }
                break;
                
              case '[object Display]':

                break;
              default:
                /*DEBUG*/
                check_block_element(elementArg, this+'.element');
                /*END_DEBUG*/
                //get information from element - images, etc.
                node_id = get_element_property(elementArg, 'id') || node_id;
                w = get_element_property(elementArg, 'width', 'int');
                width = (w === null) ? width : w;
                h = get_element_property(elementArg, 'height', 'int');
                height = (h === null) ? height : h;
                break;
              }

              //take on these properties from all passed dom elements
              bg_repeat = get_element_property(elementArg, 'backgroundRepeat') || bg_repeat;
              color = get_element_property(elementArg, 'backgroundColor');
              bg_color = color ? rgb_str_to_hex(color) : bg_color;
              //parse image path from url format
              image = get_element_property(elementArg, 'backgroundImage');
              image = (!image || image === "none") ? null : bg_image.match(url_regexp);
              bg_image = image ? image[1] : bg_image;
              
              dom_element = elementArg;
            }
          }
        },
        
        /* Evidently it's not very efficent to query the dom for property values,
         * as it might initiate a re-flow. Cache values instead.
         */
        
        'id': {
          enumerable: true,
          configurable: true,
          get: function () { return node_id; },
          set: function (name) {
            /*DEBUG*/
            check_string_type(name, this+'.id');
            /*END_DEBUG*/
            node_id = set_element_property(this.element, 'id', name, 'html');
          }
        },
        
        'width': {
          enumerable: true,
          configurable: true,
          get: function () { return width; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.width');
            /*END_DEBUG*/
            set_element_property(this.element, 'width', n+"px");
            width = n;
          }
        },
        
        'height': {
          enumerable: true,
          configurable: true,
          get: function () { return height; },
          set: function (n) {
            /*DEBUG*/
            check_number_type(n, this+'.height');
            /*END_DEBUG*/
            set_element_property(this.element, 'height', n+"px");
            height = n;
          }
        },
        
        'backgroundColor': {
          enumerable: true,
          configurable: true,
          get: function () { return bg_color; },
          set: function (color) {
            if (typeof color === 'number') {
              color = hex_to_rgb_str(color);
            }
            set_element_property(this.element, 'backgroundColor', color);
            //the dom will convert the color to 'rgb(n,n,n)' format
            bg_color = rgb_str_to_hex(get_element_property(this.element, 'backgroundColor'));
          }
        },
        
        'backgroundImage': {
          enumerable: true,
          configurable: true,
          get: function () { return bg_image; },
          set: function (image) {
            if (!image) {
              bg_image = set_element_property(this.element, 'backgroundImage', null);
              return;
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
            bg_image = set_element_property(this.element, 'backgroundImage', image);
          }
        },

        'backgroundRepeat': {
          enumerable: true,
          configurable: true,
          get: function () { return bg_repeat; },
          set: function (repeat) {
            /*DEBUG*/
            check_string_type(repeat, this+'.backgroundRepeat');
            switch (repeat) {
            case 'repeat':
            case 'repeat-x':
            case 'repeat-y':
            case 'no-repeat':
            case 'inherit':
              break;
            default:
              throw new SyntaxError(this+'.backgroundRepeat: Invalid CSS value.');
            }
            /*END_DEBUG*/
            bg_repeat = set_element_property(this.element, 'backgroundRepeat', repeat);
          }
        },

        'alpha': {
          enumerable: true,
          configurable: true,
          get: function () { return alpha; },
          set: function (alpha) {
            /*DEBUG*/
            check_number_type(alpha, this+'.alpha');
            alpha = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
            /*END_DEBUG*/
            alpha = set_element_property(this.element, 'opacity', alpha);
          }
        },

        'visible': {
          enumerable: true,
          configurable: true,
          get: function () { return visible; },
          set: function (isVisible) {
            /*DEBUG*/
            check_boolean_type(isVisible, this+'.visible');
            /*END_DEBUG*/
            if (isVisible) {
              set_element_property(this.element, 'visibility', 'visible');
            } else {
              set_element_property(this.element, 'visibility', 'hidden');
            }
            visible =  isVisible;
          }
        }
      };
    }()));//end defineProperties
    
    //passed an initialization function
    if (typeof arguments[0] === 'function') {
      /*DEBUG*/
      if (arguments.length > 1) {
        throw new SyntaxError("[object ElementNode](function): Invalid number of parameters.");
      }
      /*END_DEBUG*/
      arguments[0].call(element_node);
      id = undefined;
    } else if (element !== undefined) {
      //standard instantiation
      element_node.element = element;
    }

    return element_node;
  };

  
  node_static_properties = {
    /* Returns the string representation of the specified object.
     * @return {String}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () {
        return "[object ElementNode]";
      }
    }
  };//end node_static_properties

  /*
   * CLASS METHODS
   */

  /* Test if an object is an node.
   * Not the best way to test object, but it'll do for now.
   * @param {Object} obj
   * @return {Boolean}
   */
  isElementNode = doodle.ElementNode.isElementNode = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object ElementNode]');
  };

  /* Check if object inherits from node.
   * @param {Object} obj
   * @return {Boolean}
   */
  inheritsElementNode = doodle.ElementNode.inheritsElementNode = function (obj) {
    while (obj) {
      if (isElementNode(obj)) {
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
  doodle.utils.types.check_elementnode_type = function (node, caller, param) {
    if (inheritsElementNode(node)) {
      return true;
    } else {
      caller = (caller === undefined) ? "check_elementnode_type" : caller;
      param = (param === undefined) ? "" : '('+param+')';
      throw new TypeError(caller + param +": Parameter must be an ElementNode.");
    }
  };
  /*END_DEBUG*/
  
}());//end class closure
