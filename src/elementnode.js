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
      check_node_type = doodle.utils.types.check_node_type,
      /*END_DEBUG*/
      //lookup help
      doodle_Rectangle = doodle.geom.Rectangle,
      rgb_str_to_hex = doodle.utils.rgb_str_to_hex,
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      get_element = doodle.utils.get_element,
      get_element_property = doodle.utils.get_element_property,
      set_element_property = doodle.utils.set_element_property;
  
  /**
   * @class ElementNode
   * @param {HTMLElement|Function} element
	 * @param {String} id
   * @return {ElementNode}
   * @throws {SyntaxError}
   */
  doodle.ElementNode = function (element, id/*optional*/) {
    var element_node = Object.create(doodle.Node((typeof id === 'string') ? id : undefined));

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
        /**
         * @name element
         * @return {HTMLElement}
         * @property
         */
        'element': {
          enumerable: true,
          configurable: true,
          get: function () { return dom_element; },
          set: function (elementArg) {
            var color,
                image,
                id,
                w, h;
            
            if (elementArg === null) {
              //check if removing an element
              if (dom_element !== null) {
                //class specific tasks when removing an element
                if (typeof this.__removeDomElement === 'function') {
                  this.__removeDomElement(dom_element);
                }
                //reset some values on the doodle object
                bg_color = null;
                bg_image = null;
                bg_repeat = 'repeat';
                //keep values of parent
                if (!this.parent) {
                  width = 0;
                  height = 0;
                }
              }
              //element be'gone!
              dom_element = null;
              
            } else {
              //assign a dom element
              elementArg = get_element(elementArg);
              /*DEBUG*/
              if (!elementArg) {
                throw new ReferenceError(this+".element: Invalid element.");
              }
              /*END_DEBUG*/
              dom_element = elementArg;
              
              /* Some classes require special handling of their element.
               */
              this.__addDomElement(dom_element); //may be overridden

              /* These go for every dom element passed.
               */
              id = get_element_property(dom_element, 'id');
              //if element has an id, rename node. Else, set element to this id.
              if (id) {
                node_id = id;
              } else {
                this.id = node_id;
              }
              //background color and image
              bg_repeat = get_element_property(dom_element, 'backgroundRepeat') || bg_repeat;
              color = get_element_property(dom_element, 'backgroundColor', false, false);
              bg_color = color ? rgb_str_to_hex(color) : bg_color;
              //parse image path from url format
              image = get_element_property(dom_element, 'backgroundImage');
              image = (!image || image === "none") ? null : bg_image.match(url_regexp);
              bg_image = image ? image[1] : bg_image;
            }
          }
        },
        
        /* Evidently it's not very efficent to query the dom for property values,
         * as it might initiate a re-flow. Cache values instead.
         */

        /**
         * @name id
         * @return {String}
         * @throws {TypeError}
         * @override
         * @property
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

        /**
         * @name width
         * @return {Number}
         * @throws {TypeError}
         * @override
         * @property
         */
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

        /**
         * @name height
         * @return {Number}
         * @throws {TypeError}
         * @override
         * @property
         */
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

        /**
         * @name backgroundColor
         * @return {Color}
         * @property
         */
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

        /**
         * @name backgroundImage
         * @return {HTMLImage}
         * @throws {TypeError}
         * @property
         */
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

        /**
         * @name backgroundRepeat
         * @return {String}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
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

        /**
         * @name alpha
         * @return {Number}
         * @throws {TypeError}
         * @override
         * @property
         */
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

        /**
         * @name visible
         * @return {Boolean}
         * @throws {TypeError}
         * @override
         * @property
         */
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
        },

        /**
         * Called when a dom element is added. This function will be overridden
         * for sub-class specific behavior.
         * @name __addDomElement
         * @param {HTMLElement} elementArg
         * @private
         */
        '__addDomElement': {
          enumerable: false,
          configurable: true,
          value: function (elementArg) {
            //default method obtaining element dimensions  
            var w = get_element_property(elementArg, 'width', 'int') || elementArg.width,
                h = get_element_property(elementArg, 'height', 'int') || elementArg.height;
            if (typeof w === 'number') { width = w; }
            if (typeof h === 'number') { height = h; }
          }
        },

        /**
         * @name __addDomElement
         * @param {HTMLElement} elementArg
         * @return {Rectangle} Rectangle object is reused for each call.
         * @throws {TypeError} targetCoordSpace must inherit from Node.
				 * @override
         * @private
         */
        '__getBounds': {
          enumerable: true,
          configurable: true,
          value: (function () {
            var rect = doodle_Rectangle(); //recycle
            return function (targetCoordSpace) {
              /*DEBUG*/
              check_node_type(targetCoordSpace, this+'.__getBounds', '*targetCoordSpace*');
              /*END_DEBUG*/
              var children = this.children,
                  len = children.length,
                  bounding_box = rect,
                  child_bounds,
                  w = this.width,
                  h = this.height,
                  tl = {x: 0, y: 0},
                  tr = {x: w, y: 0},
                  br = {x: w, y: h},
                  bl = {x: 0, y: h},
                  min = Math.min,
                  max = Math.max;
              
              //transform corners to global
              this.__localToGlobal(tl); //top left
              this.__localToGlobal(tr); //top right
              this.__localToGlobal(br); //bot right
              this.__localToGlobal(bl); //bot left
              //transform global to target space
              targetCoordSpace.__globalToLocal(tl);
              targetCoordSpace.__globalToLocal(tr);
              targetCoordSpace.__globalToLocal(br);
              targetCoordSpace.__globalToLocal(bl);

              //set rect with extremas
              bounding_box.left = min(tl.x, tr.x, br.x, bl.x);
              bounding_box.right = max(tl.x, tr.x, br.x, bl.x);
              bounding_box.top = min(tl.y, tr.y, br.y, bl.y);
              bounding_box.bottom = max(tl.y, tr.y, br.y, bl.y);

              //add child bounds to this
              while (len--) {
                child_bounds = children[len].__getBounds(targetCoordSpace);
                if (child_bounds !== null) {
                  bounding_box.__union(child_bounds);
                }
              }
              return bounding_box;
            };
          }())
        }
        
      };
    }()));//end defineProperties

    //check args
    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function
      if (typeof arguments[0] === 'function') {
        arguments[0].call(element_node);
        element = undefined;
      } else {
        //passed element
        element_node.element = element;
      }
      break;
    case 2:
      //standard instantiation (element, id)
      if (element) {
        //can be undefined
        element_node.element = element;
      }
      break;
    default:
      throw new SyntaxError("[object ElementNode](element, id): Invalid number of parameters.");
    }

    return element_node;
  };

  
  node_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {String}
     * @override
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

  /**
   * Test if an object is an ElementNode.
   * @name isElementNode
   * @param {Object} obj
   * @return {Boolean}
   * @static
   */
  isElementNode = doodle.ElementNode.isElementNode = function (obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.toString !== 'function') {
      return false;
    }
    return (obj.toString() === '[object ElementNode]');
  };

  /**
   * Check if object inherits from ElementNode.
   * @name inheritsNode
   * @param {Object} obj
   * @return {Boolean}
   * @static
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
  /**
   * @name check_elementnode_type
   * @param {Node} node
   * @param {String} caller
   * @param {String} params
   * @return {Boolean}
   * @throws {TypeError}
   * @memberOf utils.types
   * @static
   */
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
