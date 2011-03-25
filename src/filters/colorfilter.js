/*globals doodle*/
(function () {
  var filter_static_properties = {},
      /*DEBUG*/
      type_check = doodle.utils.debug.type_check,
      range_check = doodle.utils.debug.range_check,
      /*END_DEBUG*/
      temp_array = new Array(8);
  
  /**
   * @name doodle.filters.ColorFilter
   * @class
   * @augments Object
   * @param {number=} x
   * @param {number=} y
   * @return {doodle.filters.ColorFilter}
   * @throws {TypeError}
   * @throws {SyntaxError}
   */
  function ColorFilter (redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier,
                        redOffset, greenOffset, blueOffset, alphaOffset) {
    var filter = {},
        arg_len = arguments.length,
        init_obj;

    Object.defineProperties(filter, filter_static_properties);
    //properties that require privacy
    Object.defineProperties(filter, (function () {
      var id = null,
          $temp_array = temp_array, //local ref
          red_multiplier = 1,
          green_multiplier = 1,
          blue_multiplier = 1,
          alpha_multiplier = 1,
          red_offset = 0,
          green_offset = 0,
          blue_offset = 0,
          alpha_offset = 0;
      
      return {
        /**
         * @name redMultiplier
         * @return {number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'redMultiplier': {
          enumerable: true,
          configurable: false,
          get: function () { return red_multiplier; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ColorFilter.redMultiplier', id:this.id});
            range_check(isFinite(n), {label:'ColorFilter.redMultiplier', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            red_multiplier = n;
          }
        },

        /**
         * @name greenMultiplier
         * @return {number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'greenMultiplier': {
          enumerable: true,
          configurable: false,
          get: function () { return green_multiplier; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ColorFilter.greenMultiplier', id:this.id});
            range_check(isFinite(n), {label:'ColorFilter.greenMultiplier', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            green_multiplier = n;
          }
        },

        /**
         * @name blueMultiplier
         * @return {number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'blueMultiplier': {
          enumerable: true,
          configurable: false,
          get: function () { return blue_multiplier; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ColorFilter.blueMultiplier', id:this.id});
            range_check(isFinite(n), {label:'ColorFilter.blueMultiplier', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            blue_multiplier = n;
          }
        },

        /**
         * @name alphaMultiplier
         * @return {number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'alphaMultiplier': {
          enumerable: true,
          configurable: false,
          get: function () { return alpha_multiplier; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ColorFilter.alphaMultiplier', id:this.id});
            range_check(isFinite(n), {label:'ColorFilter.alphaMultiplier', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            alpha_multiplier = n;
          }
        },

        /**
         * @name redOffset
         * @return {number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'redOffset': {
          enumerable: true,
          configurable: false,
          get: function () { return red_offset; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ColorFilter.redOffset', id:this.id});
            range_check(isFinite(n), {label:'ColorFilter.redOffset', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            red_offset = n;
          }
        },

        /**
         * @name greenOffset
         * @return {number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'greenOffset': {
          enumerable: true,
          configurable: false,
          get: function () { return green_offset; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ColorFilter.greenOffset', id:this.id});
            range_check(isFinite(n), {label:'ColorFilter.greenOffset', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            green_offset = n;
          }
        },

        /**
         * @name blueOffset
         * @return {number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'blueOffset': {
          enumerable: true,
          configurable: false,
          get: function () { return blue_offset; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ColorFilter.blueOffset', id:this.id});
            range_check(isFinite(n), {label:'ColorFilter.blueOffset', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            blue_offset = n;
          }
        },

        /**
         * @name alphaOffset
         * @return {number}
         * @throws {TypeError}
         * @throws {RangeError}
         * @property
         */
        'alphaOffset': {
          enumerable: true,
          configurable: false,
          get: function () { return alpha_offset; },
          set: function (n) {
            /*DEBUG*/
            type_check(n,'number', {label:'ColorFilter.alphaOffset', id:this.id});
            range_check(isFinite(n), {label:'ColorFilter.alphaOffset', id:this.id, message:"Parameter must be a finite number."});
            /*END_DEBUG*/
            alpha_offset = n;
          }
        },

        /**
         * @name id
         * @return {string}
         * @throws {TypeError}
         * @property
         */
        'id': {
          enumerable: true,
          configurable: false,
          get: function () { return (id === null) ? this.toString() : id; },
          set: function (idArg) {
            /*DEBUG*/
            if (idArg !== null) {
              type_check(idArg,'string', {label:'ColorFilter.id', id:this.id});
            }
            /*END_DEBUG*/
            id = idArg;
          }
        },

        /**
         * Applies filter to a specified region of a context.
         * Called when rendering the scene.
         * @name __applyFilter
         * @param {CanvasRenderingContext2D} ctx
         * @throws {TypeError}
         * @private
         */
        '__applyFilter': {
          enumerable: true,
          configurable: false,
          value: function (ctx, x, y, width, height) {
            /*DEBUG*/
            console.assert(ctx.toString() === "[object CanvasRenderingContext2D]", "ColorFilter.__applyFilter: context available.");
            console.assert(typeof x === 'number', "ColorFilter.__applyFilter: x is a number.");
            console.assert(typeof y === 'number', "ColorFilter.__applyFilter: y is a number.");
            console.assert(typeof width === 'number', "ColorFilter.__applyFilter: width is a number.");
            console.assert(typeof height === 'number', "ColorFilter.__applyFilter: height is a number.");
            /*END_DEBUG*/
            var img = ctx.getImageData(x, y, width, height),
                img_data = img.data,
                pixels = width * height,
                p,
                //faster lookup, but more vars
                rm = red_multiplier,
                ro = red_offset,
                gm = green_multiplier,
                go = green_offset,
                bm = blue_multiplier,
                bo = blue_offset,
                am = alpha_multiplier,
                ao = alpha_offset;
            
            while (--pixels) {
              p = pixels << 2;
              img_data[p] = img_data[p] * rm + ro;
              img_data[p+1] = img_data[p+1] * gm + go;
              img_data[p+2] = img_data[p+2] * bm + bo;
              img_data[p+3] = img_data[p+3] * am + ao;
            }
            img.data = img_data;
            ctx.putImageData(img, x, y);
          }
        },

        /**
         * Same as toArray, but reuses array object.
         * @name __toArray
         * @return {Point}
         * @private
         */
        '__toArray': {
          enumerable: false,
          writable: false,
          configurable: false,
          value: function () {
            $temp_array[0] = red_multiplier;
            $temp_array[1] = green_multiplier;
            $temp_array[2] = blue_multiplier;
            $temp_array[3] = alpha_multiplier;
            $temp_array[4] = red_offset;
            $temp_array[5] = green_offset;
            $temp_array[6] = blue_offset;
            $temp_array[7] = alpha_offset;
            return $temp_array;
          }
        }
      };
    }()));//end defineProperties

    //initialize filter
    switch (arg_len) {
    case 0:
      //defaults to 1,1,1,1,0,0,0,0
      break;
    case 8:
      //standard instantiation
      filter.compose(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset);
      break;
    case 1:
      //passed an initialization obj: ColorFilter, array, function
      init_obj = arguments[0];
      redMultiplier = undefined;
      
      if (typeof init_obj === 'function') {
        init_obj.call(filter);
      } else if (Array.isArray(init_obj)) {
        /*DEBUG*/
        if (init_obj.length !== 8) {
          throw new SyntaxError("[object ColorFilter]([redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset]): Invalid array parameter.");
        }
        /*END_DEBUG*/
        filter.compose.apply(filter, init_obj);
      } else {
        /*DEBUG*/
        type_check(init_obj,'ColorFilter', {label: 'doodle.filters.ColorFilter', id:this.id, message:"Unable to initialize from ColorFilter object."});
        /*END_DEBUG*/
        filter.compose.apply(filter, init_obj.__toArray());
      }
      break;
    default:
      /*DEBUG*/
      throw new SyntaxError("[object ColorFilter](redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset): Invalid number of parameters.");
      /*END_DEBUG*/
    }

    return filter;
  }//end ColorFilter definition

  doodle.filters.ColorFilter = ColorFilter;

  filter_static_properties = {
    /**
     * Returns the string representation of the specified object.
     * @name toString
     * @return {string}
     */
    'toString': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return "[object ColorFilter]"; }
    },

    /**
     * Returns an array that contains the values of the color multipliers and offsets.
     * @name toArray
     * @return {Array}
     */
    'toArray': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return this.__toArray().concat(); }
    },

    /**
     * Set ColorFilter values.
     * @name compose
     * @param {number} redMultiplier
     * @param {number} greenMultiplier
     * @param {number} blueMultiplier
     * @param {number} alphaMultiplier
     * @param {number} redOffset
     * @param {number} blueOffset
     * @param {number} greenOffset
     * @param {number} alphaOffset
     * @return {ColorFilter}
     * @throws {TypeError}
     * @throws {RangeError}
     */
    'compose': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
        /*DEBUG*/
        type_check(redMultiplier,'number', greenMultiplier,'number', blueMultiplier,'number', alphaMultiplier,'number',
                   redOffset,'number', blueOffset,'number', greenOffset,'number', alphaOffset,'number',
                   {label:'ColorFilter.compose', params:['redMultiplier','greenMultiplier','blueMultiplier','alphaMultiplier','redOffset','greenOffset','blueOffset','alphaOffset'], id:this.id});
        range_check(isFinite(redMultiplier), isFinite(greenMultiplier), isFinite(blueMultiplier), isFinite(alphaMultiplier),
                    isFinite(redOffset), isFinite(greenOffset), isFinite(blueOffset), isFinite(alphaOffset),
                    {label:'ColorFilter.compose', params:['redMultiplier','greenMultiplier','blueMultiplier','alphaMultiplier','redOffset','greenOffset','blueOffset','alphaOffset'], id:this.id, message:"Parameters must be finite numbers."});
        /*END_DEBUG*/
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaMultiplier = alphaMultiplier;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
        this.alphaOffset = alphaOffset;
        return this;
      }
    },

    /**
     * Creates a copy of this ColorFilter object.
     * @name clone
     * @return {ColorFilter}
     */
    'clone': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function () { return ColorFilter(this.__toArray()); }
    },

    /**
     * Determines whether two ColorFilters are equal.
     * @name equals
     * @param {ColorFilter} filter The ColorFilter to be compared.
     * @return {boolean}
     * @throws {TypeError}
     */
    'equals': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function (filter) {
        /*DEBUG*/
        type_check(filter,'ColorFilter', {label:'ColorFilter.equals', params:'filter', id:this.id});
        /*END_DEBUG*/
        return (this.redMultiplier === filter.redMultiplier &&
                this.greenMultiplier === filter.greenMultiplier &&
                this.blueMultiplier === filter.blueMultiplier &&
                this.alphaMultiplier === filter.alphaMultiplier &&
                this.redOffset === filter.redOffset &&
                this.greenOffset === filter.greenOffset &&
                this.blueOffset === filter.blueOffset &&
                this.alphaOffset === filter.alphaOffset);
      }
    }
    
  };//end filter_static_properties definition

}());//end class closure

