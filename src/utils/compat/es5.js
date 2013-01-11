#jslint browser: true, devel: true, onevar: true, undef: true, regexp: true, bitwise: true, newcap: true

#globals doodle

# ES5 compatibility
# 
if typeof Function::bind isnt "function"
  Function::bind = (thisArg) -> #, args...
    fn = this
    ->
      fn.apply thisArg, arguments_
