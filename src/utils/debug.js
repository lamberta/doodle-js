#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

#DEBUG
doodle.utils.debug = {}
(->
  
  #
  #   * Throws a given error type if the test fails.
  #   * @param {boolean} testp
  #   * @param {function} Error_constructor Error constructor.
  #   * @return {boolean} True on success.
  #   * @throws {Error} On test being false.
  #   
  assert_error = (testp, Error_constructor) ->
    return true  if testp is true
    throw new Error_constructor()
  
  #
  #   * Throws a TypeError if object doesn't match type.
  #   * @param {object} obj
  #   * @param {string} type
  #   * @param {boolean} inheritsp Check object prototypes if it matches type.
  #   * @throws {TypeError} On test being false.
  #   * @throws {SyntaxError} On invalid invocation.
  #   
  assert_object_type = (obj, type, inheritsp) ->
    if typeof obj is "object"
      type = "[object " + type + "]"
      inheritsp = (if (typeof inheritsp is "boolean") then inheritsp else false)
      while obj
        if obj.toString() is type
          return true
        else
          obj = (if inheritsp then Object.getPrototypeOf(obj) else null)
    throw new TypeError()
  
  #
  #   * Tests an object to see if it's an Event type.
  #   * For DOM events it tests the constuctor name.
  #   
  assert_event_type = (obj, type, inheritsp) ->
    if typeof obj is "object"
      type_str = "[object " + type + "]"
      inheritsp = (if (typeof inheritsp is "boolean") then inheritsp else false)
      while obj
        if obj.toString() is type_str or (obj.constructor and obj.constructor.name is type)
          return true
        else
          obj = (if inheritsp then Object.getPrototypeOf(obj) else null)
    throw new TypeError()
  
  #
  #   * @param {*} arg Object to check type of.
  #   * @param {string} type Supported type.
  #   * @return {boolean}
  #   * @throws {TypeError} On type failure.
  #   * @throws {SyntaxError} On invalid invocation.
  #   
  test_type = (arg, type, inheritsp) ->
    switch type
      
      #any type will match
      when "*"
        return true
      
      # JavaScript types
      #       
      when "undefined"
        assert_error arg is `undefined`, TypeError
      when "null"
        assert_error arg is null, TypeError
      when "number", "string"
    , "boolean"
    , "function"
    , "object"
        assert_error typeof arg is type, TypeError
      when "array"
        assert_error Array.isArray(arg), TypeError
      
      # Geom objects are defined by key numeric properties, not by instantiation.
      #       
      when "Point"
        assert_error typeof arg.x is "number", TypeError
        assert_error typeof arg.y is "number", TypeError
      when "Rectangle"
        assert_error typeof arg.x is "number", TypeError
        assert_error typeof arg.y is "number", TypeError
        assert_error typeof arg.width is "number", TypeError
        assert_error typeof arg.height is "number", TypeError
      when "Matrix"
        assert_error typeof arg.a is "number", TypeError
        assert_error typeof arg.b is "number", TypeError
        assert_error typeof arg.c is "number", TypeError
        assert_error typeof arg.d is "number", TypeError
        assert_error typeof arg.tx is "number", TypeError
        assert_error typeof arg.ty is "number", TypeError
      
      #Events
      when "Event", "UIEvent"
    , "MouseEvent"
    , "TouchEvent"
    , "TextEvent"
    , "KeyboardEvent"
        assert_event_type arg, type, inheritsp
      
      #Doodle objects
      when "Emitter", "Node"
    , "Sprite"
    , "Graphics"
    , "ElementNode"
    , "Layer"
    , "Display"
    
    #Doodle primitives
    , "Image"
    , "Text"
    
    #Doodle filters
    , "ColorFilter"
        assert_object_type arg, type, inheritsp
      
      # HTML types
      #       
      when "block"
        assert_error doodle.utils.get_style_property(arg, "display") is "block", TypeError
      when "canvas", "HTMLCanvasElement"
        assert_object_type arg, "HTMLCanvasElement", inheritsp
      when "context", "CanvasRenderingContext2D"
        assert_object_type arg, "CanvasRenderingContext2D", inheritsp
      else
        throw new SyntaxError("check_arg_type(arg, *type*, inheritsp): Unknown type '" + type + "'.")
    true
  
  ###
  Options object checks run for all types.
  @param {object} options
  @param {number} arg_count Number of arguments we're checking, indicates TypeError.
  ###
  check_options = (options, arg_count) ->
    
    #check options
    throw new TypeError("check_options(options): Argument must be an object.")  if typeof options isnt "object"
    if options.trace is `undefined`
      options.trace = true
    else throw new TypeError("check_options: options.trace must be a boolean.")  if typeof options.trace isnt "boolean"
    throw new TypeError("check_options: options.label must be a string.")  if options.label isnt `undefined` and typeof options.label isnt "string"
    throw new TypeError("check_options: options.id must be a string.")  if options.id isnt `undefined` and typeof options.id isnt "string"
    throw new TypeError("check_options: options.message must be a string.")  if options.message isnt `undefined` and typeof options.message isnt "string"
    if options.params isnt `undefined`
      options.params = [options.params]  if typeof options.params is "string"
      throw new TypeError("check_options: options.params must be a string or an array of strings.")  unless Array.isArray(options.params)
    if typeof arg_count is "number"
      
      #passed args must come in pairs and have at least 2
      throw new SyntaxError("type_check(arg, type, [arg, type, ... options, callback]): Invalid arguments.")  if arg_count < 2 or arg_count % 2 isnt 0
      throw new TypeError("type_check: options.inherits must be a boolean.")  if options.inherits isnt `undefined` and typeof options.inherits isnt "boolean"
      throw new SyntaxError("check_options: options.params must correspond to the supplied args.")  if not Array.isArray(options.params) or options.params.length isnt arg_count / 2  if options.params isnt `undefined`
  format_type_error_message = (err, options, arg, type, index, arg_count) ->
    check_options options, arg_count
    if options.message
      err.message = options.message
    else
      err.message = arg + " must be of type '" + type + "'."
    if options.label
      options.label = "[id=" + options.id + "] " + options.label  if options.id
      if options.params
        
        #highlight the parameter invalid parameter
        options.params[index / 2] = "*" + options.params[index / 2] + "*"
        options.label = options.label + "(" + options.params.toString() + ")"
      err.message = options.label + ": " + err.message
  format_error_message = (err, options) ->
    check_options options
    if options.message
      err.message = options.message
    else
      err.message = "Invalid arguments."
    if options.label
      options.label = "[id=" + options.id + "] " + options.label  if options.id
      options.label = options.label + "(" + options.params.toString() + ")"  if options.params
      err.message = options.label + ": " + err.message
  
  ###
  @name type_check
  @param {*} Argument to type check.
  @param {type} arg type Name of type.
  @param {object=} options Error message printing options
  options: {
  //logging
  trace: {boolean}, Print stack trace to console, default true
  label: {string}, Function name to print in error message.
  params: {array}, Function parameter names to print in error message.
  message: {string}, Custom error message to print.
  //type test
  inherits: {boolean} Does the arg inherit from the prototype, default false.
  }
  @param {function(*, string, object)=} callback Function to run if a TypeError is thrown.
  @throws {SyntaxError}
  @throws {TypeError}
  ###
  doodle.utils.debug.type_check = (arg, type, options, callback) -> #[arg, type, ...]
    arg = Array::slice.call(arguments_)
    callback = (if (typeof arg[arg.length - 1] is "function") then arg.pop() else null)
    options = (if (typeof arg[arg.length - 1] is "object") then arg.pop() else trace: true)
    i = 0
    len = arg.length
    
    #iterate args taking 2 at a time
    while i < len
      if i % 2 is 0
        try
          test_type arg[i], arg[i + 1], options.inherits
        catch error
          if error instanceof TypeError
            format_type_error_message error, options, arg[i], arg[i + 1], i, len
            console.trace()  if options.trace
            if callback
              callback error, arg[i], arg[i + 1]
              return false
          throw error
      i++
    true

  
  ###
  @name range_check
  ###
  doodle.utils.debug.range_check = (test, options, callback) -> #[test, ...]
    test = Array::slice.call(arguments_)
    callback = (if (typeof test[test.length - 1] is "function") then test.pop() else null)
    options = (if (typeof test[test.length - 1] is "object") then test.pop() else trace: true)
    i = 0
    len = test.length
    
    #iterate args taking 2 at a time
    while i < len
      try
        assert_error test[i], RangeError
      catch error
        if error instanceof RangeError
          format_error_message error, options
          console.trace()  if options.trace
          if callback
            callback error
            return false
        throw error
      i++
    true

  
  ###
  @name reference_check
  ###
  doodle.utils.debug.reference_check = (test, options, callback) -> #[test, ...]
    test = Array::slice.call(arguments_)
    callback = (if (typeof test[test.length - 1] is "function") then test.pop() else null)
    options = (if (typeof test[test.length - 1] is "object") then test.pop() else trace: true)
    i = 0
    len = test.length
    
    #iterate args taking 2 at a time
    while i < len
      try
        assert_error test[i], ReferenceError
      catch error
        if error instanceof ReferenceError
          format_error_message error, options
          console.trace()  if options.trace
          if callback
            callback error
            return false
        throw error
      i++
    true
)()

#END_DEBUG
