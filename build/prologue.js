"use strict";

/* Intro
 *
 */

//the global object
var doodle = {};
doodle.utils = {};
//packages
doodle.geom = {};
doodle.events = {};

(function () {
  var ready_queue = [],
      on_dom_loaded = function () {
        var queue = ready_queue,
            len = queue.length,
            i = 0;
        if (len > 0) {
          for (; i < len; i++) {
            queue[i](doodle); //pass the global object to alias the namespace
          }
          queue.length = 0;
        }
      };

  /**
   * Pushes a function on the waiting list, will execute when the DOM is ready.
   * Alias the doodle namespace by passing an argument to the function.
   * @param {function} fn
   */
  doodle.ready = function (fn) {
    /*DEBUG*/
    if (typeof fn !== 'function') {
      console.error("doodle.ready(fn): Parameter must be a function.");
    }
    /*END_DEBUG*/
    ready_queue.push(fn);
    //already loaded
    if (document.readyState === "complete") {
      on_dom_loaded();
    }
  };

  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", on_dom_loaded, false);
  } else {
    console.error("document.addEventListener not supported.");
  }
}());
