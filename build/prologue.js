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
