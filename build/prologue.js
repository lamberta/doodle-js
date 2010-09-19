"use strict";

/* Intro
 *
 */

//the global object
var doodle = {};
//packages
doodle.geom = {};

(function () {
  /* Need to use these functions in packages before they're created.
   */
  var create_scene_path, //Node
      check_display_type; //Node

  /*
   * @param {Node} node
   * @param {Array} array Array to store the path nodes in.
   * @param {Boolean} clearArray Empty array passed as parameter before storing nodes in it.
   * @return {Array} The array passed to the function (modified in place).
   */
  create_scene_path = function (node, array, clearArray) {
    var i = node.children.length;
    if (clearArray) {
      array.splice(0, array.length);
    }
    if (i !== 0) {
      while (i--) {
        create_scene_path(node.children[i], array);
      }
    }
    array.push(node);
    return array; //return for further operations on array (reverse)
  };
  
