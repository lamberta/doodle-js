"use strict";

/* Intro
 *
 */

//the global object
window.doodle = {};
//packages
doodle.utils = {};
doodle.geom = {};
doodle.events = {};
doodle.filters = {};

(function () {
  var ready_queue = [],
      dom_loaded = function () {
        var queue = ready_queue,
            len = queue.length,
            i = 0;
        if (len > 0) {
          for (; i < len; i++) {
            queue[i](doodle); //pass the global object to alias the namespace
          }
          queue.length = 0;
        }
      },
      on_dom_loaded = function () {
        dom_loaded();
        document.removeEventListener('DOMContentLoaded', on_dom_loaded, false);
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
      dom_loaded();
    }
  };

  //if we missed the event, no need to listen for it
  if (document.readyState !== "complete") {
    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', on_dom_loaded, false);
    } else {
      console.error("document.addEventListener not supported.");
    }
  }
}());
