#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

###
@name doodle.TextAlign
@class
@static
###
Object.defineProperty doodle, "TextAlign",
  enumerable: true
  writable: false
  configurable: false
  value: Object.create(null,
    
    ###
    @name START
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    START:
      enumerable: true
      writable: false
      configurable: false
      value: "start"

    
    ###
    @name END
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    END:
      enumerable: true
      writable: false
      configurable: false
      value: "end"

    
    ###
    @name LEFT
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    LEFT:
      enumerable: true
      writable: false
      configurable: false
      value: "left"

    
    ###
    @name RIGHT
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    RIGHT:
      enumerable: true
      writable: false
      configurable: false
      value: "right"

    
    ###
    @name CENTER
    @return {string} [read-only]
    @property
    @constant
    @static
    ###
    CENTER:
      enumerable: true
      writable: false
      configurable: false
      value: "center"
  )

