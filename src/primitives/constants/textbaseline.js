#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

###
@name doodle.TextBaseline
@class
@static
@see <a href="http://dev.w3.org/html5/canvas-api/canvas-2d-api.html#dom-context-2d-textbaseline">context.textBaseline</a> [Canvas API]
###
Object.defineProperty doodle, "TextBaseline",
  enumerable: true
  writable: false
  configurable: false
  value: Object.create(null,
    
    ###
    Let the anchor point's vertical position be the top of the em box of the first available font of the inline box.
    @name TOP
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    TOP:
      enumerable: true
      writable: false
      configurable: false
      value: "top"

    
    ###
    Let the anchor point's vertical position be half way between the bottom and the top of the em box of the first available font of the inline box.
    @name MIDDLE
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    MIDDLE:
      enumerable: true
      writable: false
      configurable: false
      value: "middle"

    
    ###
    Let the anchor point's vertical position be the bottom of the em box of the first available font of the inline box.
    @name BOTTOM
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    BOTTOM:
      enumerable: true
      writable: false
      configurable: false
      value: "bottom"

    
    ###
    Let the anchor point's vertical position be the hanging baseline of the first available font of the inline box.
    @name HANGING
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    HANGING:
      enumerable: true
      writable: false
      configurable: false
      value: "hanging"

    
    ###
    Let the anchor point's vertical position be the alphabetic baseline of the first available font of the inline box.
    @name ALPHABETIC
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    ALPHABETIC:
      enumerable: true
      writable: false
      configurable: false
      value: "alphabetic"

    
    ###
    Let the anchor point's vertical position be the ideographic baseline of the first available font of the inline box.
    @name IDEOGRAPHIC
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    IDEOGRAPHIC:
      enumerable: true
      writable: false
      configurable: false
      value: "ideographic"
  )

