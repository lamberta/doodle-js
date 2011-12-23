This project is currently *inactive*, but feel free to fork and contribute.  
I continue to reference the code in this project a lot, and in fact Doodle.js lead directly to the book *Foundation HTML5 Animation with JavaScript*, the examples can be found here: https://github.com/lamberta/html5-animation
The difference being that the book does not use any external libraries, just JavaScript and the Canvas API, while Doodle.js implements some of the ActionScript API since I came over from the Flash world. Personally, I now just add these methods as needed instead of importing the entire library, but your preference my differ.  
In summary, while the code here can be useful, if you are just beginning to animate with the canvas, I'd suggest you take a look at the examples in the html5-animation repo, and buy the book to get a better understanding how they work ;)

# Doodle-js
__A JavaScript Animation Library for HTML5 Canvas.__

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

[Reference API](http://lamberta.org/doodle-js/doc/api/)  
[Some Examples](http://lamberta.org/doodle-js/doc/examples/)

Questions?
Mailing list: [http://groups.google.com/group/doodlejs](http://groups.google.com/group/doodlejs)  
Or, ask me on Twitter: [http://twitter.com/billyist](http://twitter.com/billyist)

From [hello-world.html](./doodle-js/blob/master/doc/examples/hello-world.html):

    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          #display { width: 400px; height: 400px; }
        </style>
      </head>
      <body>
        <div id="display"></div>
        <script src="./build/doodle.js"></script>
        <script>
          doodle.ready(function () {
            var display = doodle.createDisplay('#display'),
                text = doodle.createText("Hello, World!").appendTo(display);
            //center text
            text.x = display.width / 2;
            text.y = display.height / 2;
            //game loop
            display.on('animationFrame', function () {
              text.rotation += 4;
            });
          });
        </script>
      </body>
    </html>
