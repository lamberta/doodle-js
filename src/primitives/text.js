/*globals doodle*/

(function () {
  var text_sprite_static_properties,
      /*DEBUG*/
      check_number_type = doodle.utils.types.check_number_type,
      check_string_type = doodle.utils.types.check_string_type,
      /*END_DEBUG*/
      rgb_str_to_hex = doodle.utils.rgb_str_to_hex,
      hex_to_rgb_str = doodle.utils.hex_to_rgb_str,
      FontStyle = doodle.FontStyle,
      FontVariant = doodle.FontVariant,
      FontWeight = doodle.FontWeight,
      TextAlign = doodle.TextAlign,
      TextBaseline = doodle.TextBaseline;

  /**
   * A text sprite to display.
   * @name doodle.Text
   * @class
   * @augments doodle.Sprite
   * @param {string=} text Text to display.
   * @return {doodle.Text} A text object.
   * @throws {SyntaxError} Invalid parameters.
   * @throws {TypeError} Text argument not a string.
   */
  doodle.Text = function (text) {
    var text_sprite = Object.create(doodle.Sprite());

    Object.defineProperties(text_sprite, text_sprite_static_properties);
    //properties that require privacy
    Object.defineProperties(text_sprite, (function () {
      var $text = '',
          font_family = "sans-serif",
          font_size = 10,//px
          font_height = font_size,
          font_style = FontStyle.NORMAL,
          font_variant = FontVariant.NORMAL,
          font_weight = FontWeight.NORMAL,
          text_align = TextAlign.START,
          text_baseline = TextBaseline.ALPHABETIC,
          text_color = "#000000",
          text_strokecolor = "#000000",
          text_strokewidth = 1,
          text_bgcolor;

      /**
       * @name redraw
       * @private
       */
      function redraw () {
        //if not part of the scene graph we'll have to whip up a context
        var $ctx = text_sprite.context || document.createElement('canvas').getContext('2d'),
            sprite_width,
            sprite_height,
            graphics = text_sprite.graphics,
            extrema_minX = 0,
            extrema_maxX = 0,
            extrema_minX = 0,
            extrema_maxY = 0;
        
        //need to apply font style to measure width, but don't save it
        $ctx.save();
        $ctx.font = (font_style +' '+ font_variant +' '+ font_weight +' '+
                     font_size+"px" +' '+ font_family);
        sprite_width = $ctx.measureText($text).width;
        sprite_height = font_size;
        //estimate font height since there's no built-in functionality
        font_height = $ctx.measureText("m").width;
        $ctx.restore();

        //clears sprite dimensions and drawing commands
        text_sprite.graphics.clear();
        text_sprite.graphics.draw(function (ctx) {
          if (text_bgcolor) {
            ctx.fillStyle = text_bgcolor;
            ctx.fillRect(0, 0, sprite_width, sprite_height);
          }
          ctx.lineWidth = text_strokewidth; //why do i need to set this?
          ctx.textAlign = text_align;
          ctx.textBaseline = text_baseline;
          ctx.font = (font_style +' '+ font_variant +' '+ font_weight +' '+
                      font_size+"px" +' '+ font_family);
          if (text_color) {
            ctx.fillStyle = text_color;
            ctx.fillText($text, 0, 0);
          }
          if (text_strokecolor) {
            ctx.strokeStyle = text_strokecolor;
            ctx.strokeText($text, 0, 0);
          }
        });
        
        //assign sprite dimensions after graphics.clear()
        text_sprite.width = sprite_width;
        text_sprite.height = sprite_height;

        //calculate bounding box extrema
        switch (text_baseline) {
        case TextBaseline.TOP:
          extrema_minY = font_size - font_height;
          extrema_maxY = font_size;
          break;
        case TextBaseline.MIDDLE:
          extrema_minY = -font_height/2;
          extrema_maxY = font_height/2;
          break;
        case TextBaseline.BOTTOM:
          extrema_minY = -font_size;
          break;
        case TextBaseline.HANGING:
          extrema_minY = font_size - font_height;
          extrema_maxY = font_size;
          break;
        case TextBaseline.ALPHABETIC:
          extrema_minY = -font_height;
          break;
        case TextBaseline.IDEOGRAPHIC:
          extrema_minY = -font_size;
          break;
        }

        switch (text_align) {
        case TextAlign.START:
          break;
        case TextAlign.END:
          extrema_minX = -sprite_width;
          break;
        case TextAlign.LEFT:
          break;
        case TextAlign.RIGHT:
          extrema_minX = -sprite_width;
          break;
        case TextAlign.CENTER:
          extrema_minX = -sprite_width/2;
          break;
        }
        
        //set extrema for bounds
        graphics.__minX = extrema_minX;
        graphics.__maxX = extrema_maxX;
        graphics.__minY = extrema_minY;
        graphics.__maxY = extrema_maxY;
      }
      
      return {
        /**
         * @name text
         * @return {String}
         * @throws {TypeError}
         * @property
         */
        'text': {
          enumerable: true,
          configurable: false,
          get: function () { return $text; },
          set: function (textVar) {
            /*DEBUG*/
            check_string_type(textVar, this+'.text');
            /*END_DEBUG*/
            $text = textVar;
            redraw();
          }
        },

        /**
         * @name font
         * @return {String}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @throws {ReferenceError}
         * @property
         */
        'font': {
          enumerable: true,
          configurable: false,
          get: function () {
            return (font_style +' '+ font_variant +' '+ font_weight +' '+
                    font_size+"px" +' '+ font_family);
          },
          set: function (fontVars) {
            var len;
            /*DEBUG*/
            check_string_type(fontVars, this+'.font');
            /*END_DEBUG*/
            //parse elements from string
            fontVars = fontVars.split(' ');
            len = fontVars.length;
            /*DEBUG*/
            if (len < 2 || len > 5) {
              throw new SyntaxError(this+".font: Invalid font string.");
            }
            /*END_DEBUG*/
            //fill in unspecified values with defaults
            if (len === 2) {
              fontVars.unshift(FontStyle.NORMAL, FontVariant.NORMAL, FontWeight.NORMAL);
            } else if (len === 3) {
              fontVars.splice(1, 0, FontVariant.NORMAL, FontWeight.NORMAL);
            } else if (len === 4) {
              fontVars.splice(1, 0, FontVariant.NORMAL);
            }
            /*DEBUG*/
            if (fontVars.length !== 5) {
              throw new ReferenceError(this+".font::fontArgs: Unable to parse font string.");
            }
            /*END_DEBUG*/
            text_sprite.fontStyle = fontVars[0];
            text_sprite.fontVariant = fontVars[1];
            text_sprite.fontWeight = fontVars[2];
            text_sprite.fontSize = fontVars[3];
            text_sprite.fontFamily = fontVars[4];
          }
        },

        /**
         * @name fontFamily
         * @return {String}
         * @throws {TypeError}
         * @property
         */
        'fontFamily': {
          enumerable: true,
          configurable: false,
          get: function () { return font_family; },
          set: function (fontFamilyVar) {
            /*DEBUG*/
            check_string_type(fontFamilyVar, this+'.fontFamily');
            /*END_DEBUG*/
            font_family = fontFamilyVar;
            redraw();
          }
        },

        /**
         * @name fontSize
         * @return {Number} In pixels.
         * @throws {TypeError}
         * @property
         */
        'fontSize': {
          enumerable: true,
          configurable: false,
          get: function () { return font_size; },
          set: function (fontSizeVar) {
            if (typeof fontSizeVar === 'string') {
              fontSizeVar = parseInt(fontSizeVar);
            }
            /*DEBUG*/
            check_number_type(fontSizeVar, this+'.fontSize');
            /*END_DEBUG*/
            font_size = fontSizeVar;
            redraw();
          }
        },

        /**
         * @name fontStyle
         * @return {FontStyle}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'fontStyle': {
          enumerable: true,
          configurable: false,
          get: function () { return font_style; },
          set: function (fontStyleVar) {
            /*DEBUG*/
            check_string_type(fontStyleVar, this+'.fontStyle');
            switch (fontStyleVar) {
            case FontStyle.NORMAL:
            case FontStyle.ITALIC:
            case FontStyle.OBLIQUE:
              break;
            default:
              throw new SyntaxError(this+".fontStyle: Invalid FontStyle property.");
            }
            /*END_DEBUG*/
            font_style = fontStyleVar;
            redraw();
          }
        },

        /**
         * @name fontVariant
         * @return {FontVariant}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'fontVariant': {
          enumerable: true,
          configurable: false,
          get: function () { return font_variant; },
          set: function (fontVariantVar) {
            /*DEBUG*/
            check_string_type(fontVariantVar, this+'.fontVariant');
            switch (fontVariantVar) {
            case FontVariant.NORMAL:
            case FontVariant.SMALL_CAPS:
              break;
            default:
              throw new SyntaxError(this+".fontVariant: Invalid FontVariant property.");
            }
            /*END_DEBUG*/
            font_variant = fontVariantVar;
            redraw();
          }
        },

        /**
         * @name fontWeight
         * @return {FontWeight}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'fontWeight': {
          enumerable: true,
          configurable: false,
          get: function () { return font_weight; },
          set: function (fontWeightVar) {
            /*DEBUG*/
            if (typeof fontWeightVar === 'string') {
              switch (fontWeightVar) {
              case FontWeight.NORMAL:
              case FontWeight.BOLD:
              case FontWeight.BOLDER:
              case FontWeight.LIGHTER:
                break;
              default:
                throw new SyntaxError(this+".fontWeight: Invalid FontWeight property.");
              }
            } else {
              check_number_type(fontWeightVar, this+'.fontWeight');
              switch (fontWeightVar) {
              case 100:
              case 200:
              case 300:
              case 400:
              case 500:
              case 600:
              case 700:
              case 800:
              case 900:
                break;
              default:
                throw new SyntaxError(this+".fontWeight: Invalid font weight.");
              }
            }
            /*END_DEBUG*/
            font_weight = fontWeightVar;
            redraw();
          }
        },

        /**
         * @name align
         * @return {TextAlign}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'align': {
          enumerable: true,
          configurable: false,
          get: function () { return text_align; },
          set: function (alignVar) {
            /*DEBUG*/
            check_string_type(alignVar, this+'.textAlign');
            switch (alignVar) {
            case TextAlign.START:
            case TextAlign.END:
            case TextAlign.LEFT:
            case TextAlign.RIGHT:
            case TextAlign.CENTER:
              break;
            default:
              throw new SyntaxError(this+".textAlign: Invalid TextAlign property.");
            }
            /*END_DEBUG*/
            text_align = alignVar;
            redraw();
          }
        },

        /**
         * @name baseline
         * @return {TextBaseline}
         * @throws {TypeError}
         * @throws {SyntaxError}
         * @property
         */
        'baseline': {
          enumerable: true,
          configurable: false,
          get: function () { return text_baseline; },
          set: function (baselineVar) {
            /*DEBUG*/
            check_string_type(baselineVar, this+'.textBaseline');
            switch (baselineVar) {
            case TextBaseline.TOP:
            case TextBaseline.MIDDLE:
            case TextBaseline.BOTTOM:
            case TextBaseline.HANGING:
            case TextBaseline.ALPHABETIC:
            case TextBaseline.IDEOGRAPHIC:
              break;
            default:
              throw new SyntaxError(this+".textBaseline: Invalid TextBaseline property.");
            }
            /*END_DEBUG*/
            text_baseline = baselineVar;
            redraw();
          }
        },

        /**
         * @name strokeWidth
         * @return {Number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'strokeWidth': {
          enumerable: true,
          configurable: false,
          get: function () { return text_strokewidth; },
          set: function (widthVar) {
            /*DEBUG*/
            check_number_type(widthVar, this+'.strokeWidth');
            if (widthVar <= 0) {
              throw new RangeError(this+".strokeWidth: Value must be greater than zero.");
            }
            /*END_DEBUG*/
            text_strokewidth = widthVar;
          }
        },

        /**
         * @name color
         * @return {Color}
         * @throws {TypeError}
         * @property
         */
        'color': {
          enumerable: true,
          configurable: false,
          get: function () { return text_color; },
          set: function (color) {
            if (typeof color === 'number') {
              color = hex_to_rgb_str(color);
            }
            /*DEBUG*/
            if (color !== null && color !== false) {
              check_string_type(color, this+'.color');
            }
            /*END_DEBUG*/
            text_color = color;
          }
        },

        /**
         * @name strokeColor
         * @return {Color}
         * @throws {TypeError}
         * @property
         */
        'strokeColor': {
          enumerable: true,
          configurable: false,
          get: function () { return text_strokecolor; },
          set: function (color) {
            if (typeof color === 'number') {
              color = hex_to_rgb_str(color);
            }
            /*DEBUG*/
            if (color !== null && color !== false) {
              check_string_type(color, this+'.strokeColor');
            }
            /*END_DEBUG*/
            text_strokecolor = color;
          }
        },

        /**
         * @name backgroundColor
         * @return {Color}
         * @throws {TypeError}
         * @property
         */
        'backgroundColor': {
          enumerable: true,
          configurable: false,
          get: function () { return text_bgcolor; },
          set: function (color) {
            if (typeof color === 'number') {
              color = hex_to_rgb_str(color);
            }
            /*DEBUG*/
            if (color !== null && color !== false) {
              check_string_type(color, this+'.backgroundColor');
            }
            /*END_DEBUG*/
            text_bgcolor = color;
          }
        }
        
      };
    }()));
    
    switch (arguments.length) {
    case 0:
      break;
    case 1:
      //passed function or text string
      if (typeof arguments[0] === 'function') {
        arguments[0].call(text_sprite);
        text = undefined;
      } else {
        /*DEBUG*/
        check_string_type(text, '[object Text]', '*text*');
        /*END_DEBUG*/
        text_sprite.text = text;
      }
      break;
    default:
      /*DEBUG*/
      throw new SyntaxError("[object Text](text): Invalid number of parameters.");
      /*END_DEBUG*/
    }
    
    return text_sprite;
  };

  
  text_sprite_static_properties = {
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
        return "[object Text]";
      }
    }
  };

}());//end class closure
