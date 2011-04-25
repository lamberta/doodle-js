/*jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true*/
/*globals doodle*/
(function () {
  var image_sprite_static_properties,
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      /*END_DEBUG*/
      get_element = doodle.utils.get_element,
      createEvent = doodle.events.createEvent,
      LOAD = doodle.events.Event.LOAD,
      CHANGE = doodle.events.Event.CHANGE;

  /**
   * A image sprite to display.
   * @name doodle.createImage
   * @class
   * @augments doodle.Sprite
   * @param {string=} imageSrc Image element or url.
   * @return {doodle.Image} A text object.
   * @throws {SyntaxError} Invalid parameters.
   * @throws {TypeError} Text argument not a string.
   */
  doodle.Image = doodle.createImage = function (imageSrc) {
    var image_sprite = Object.create(doodle.createSprite());

    Object.defineProperties(image_sprite, image_sprite_static_properties);
    //properties that require privacy
    Object.defineProperties(image_sprite, (function () {
      var img_element = null;

      function add_image_element (img) {
        img_element = img;
        if (img_element.id !== '') {
          /*DEBUG*/
          console.assert(typeof img_element.id === 'string', "img_element.id is a string", img_element.id);
          /*END_DEBUG*/
          image_sprite.id = img_element.id;
        }
        image_sprite.width = img_element.width;
        image_sprite.height = img_element.height;
        image_sprite.graphics.draw(function (ctx) {
          ctx.drawImage(img_element, 0, 0);
        });
        image_sprite.emit(createEvent(LOAD));
      }

      function remove_image_element () {
        if (img_element !== null) {
          img_element = null;
          image_sprite.graphics.clear();
          image_sprite.emit(createEvent(CHANGE));
        }
      }
      
      function load_image (img_elem) {
        var image = get_element(img_elem);
        //element id
        if (typeof img_elem === 'string') {
          image_sprite.id = img_elem;
        }
        /*DEBUG*/
        if (!image || (image && image.tagName !== 'IMG')) {
          throw new TypeError(this+"::load_image(*img_elem*): Parameter must be an image object, or element id.");
        }
        /*END_DEBUG*/

        //check if image has already been loaded
        if (image.complete) {
          add_image_element(image);
        } else {
          //if not, assign load handlers
          image.onload = function () {
            add_image_element(image);
          };
          image.onerror = function () {
            throw new URIError('[object Image](imageSrc): Unable to load ' + image.src);
          };
          image.onabort = function () {
            throw new URIError('[object Image](imageSrc): Unable to load ' + image.src);
          };
        }
      }
      
      return {
        /**
         * @name element
         * @return {HTMLImageElement}
         * @throws {TypeError}
         * @throws {URIError}
         * @property
         */
        'element': {
          enumerable: true,
          configurable: false,
          get: function () { return img_element; },
          set: function (imageVar) {
            if (imageVar === null || imageVar === false) {
              remove_image_element();
            } else {
              load_image(imageVar);
            }
          }
        },
        
        /**
         * @name src
         * @return {string}
         * @throws {TypeError}
         * @throws {URIError}
         * @property
         */
        'src': {
          enumerable: true,
          configurable: false,
          get: function () { return (img_element === null) ? null : img_element.src; },
          set: function (srcVar) {
            if (srcVar === null || srcVar === false) {
              remove_image_element();
            } else {
              /*DEBUG*/
              type_check(srcVar, 'string', {label:'Image.id', id:this.id});
              /*END_DEBUG*/
              var image = new window.Image();
              image.src = window.encodeURI(srcVar);
              load_image(image);
            }
          }
        }
        
      };
    }()));//end defineProperties

    
    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function or text string
      if (typeof arguments[0] === 'function') {
        arguments[0].call(image_sprite);
        imageSrc = undefined;
      } else {
        //constructor param can be an image element or url
        if (typeof imageSrc !== 'string') {
          image_sprite.element = imageSrc;
        } else if (typeof imageSrc === 'string' && imageSrc[0] === '#') {
          image_sprite.element = imageSrc;
        } else {
          image_sprite.src = imageSrc;
        }
      }
      break;
    default:
      /*DEBUG*/
      throw new SyntaxError("[object Image](imageSrc): Invalid number of parameters.");
      /*END_DEBUG*/
    }
    
    return image_sprite;
  };

  
  image_sprite_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     * @override
     */
    'toString': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function () {
        return "[object Image]";
      }
    }
  };

}());//end class closure
