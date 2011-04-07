# Doodle-js
## A JavaScript Animation Library for HTML5 Canvas.

Tested on Chrome/WebKit, looking good on Firefox 4.  
Requires a browser with support for HTML5 Canvas and some ECMAScript 5 capabilities.

Some of the features:

* Use the Canvas drawing API with sprites and a scene graph.
* Event handling and dispatch for objects.
* Nodes maintain transforms, bounds, and other useful properties.
* A clean api with a focus on good JavaScript style.
* Influenced by ActionScript 3, jQuery, Node.js, and JSLint.
* Easy to add to an existing page element where Flash no longer displays.
* Integrated runtime information provided by [Stats.js](https://github.com/mrdoob/stats.js).

Basic build instructions (minified version with the [Closure Compiler](http://code.google.com/closure/compiler/) installed):

    git clone git://github.com/billyist/doodle-js.git
    ./build/make-doodle => ./build/doodle.js

Debugging version (type-checking and some useful error messages):

    ./build/make-doodle -D => ./build/doodle-debug.js

For more options: `./build/make-doodle -h`

Reference: http://lamberta.org/doodle-js/doc/api/  
Examples: http://lamberta.org/doodle-js/doc/demos/making\_things\_move/

Questions?
Mailing list: http://groups.google.com/group/doodlejs  
Or, ask me on Twitter: http://twitter.com/billyist

`hello-world.html`:

    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
      </head>
      <body>
        <div id="display"></div>
        <script src="./build/doodle.js"></script>
        <script>
          doodle.ready(function () {
            var display = doodle.createDisplay('#display', {width:400, height:400, frameRate:20}),
                layer = display.createLayer(),
                text = doodle.createText("Hello, World!").appendTo(layer);
            //center text
            text.x = display.width / 2;
            text.y = display.height / 2;
            //game loop
            display.on(doodle.events.Event.ENTER_FRAME, function () {
              text.rotation += 4;
            });
          });
        </script>
      </body>
    </html>
