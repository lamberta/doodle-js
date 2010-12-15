function Ball3D (radius, color) {
  radius = (radius === undefined) ? 40 : radius;
  color = (color === undefined) ? "#ff0000" : color;
  return doodle.Sprite(function () {
    this.radius = radius;
    this.xpos = 0;
    this.ypos = 0;
    this.zpos = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.mass = 1;

    this.graphics.lineStyle(1);
    this.graphics.beginFill(color);
    this.graphics.circle(0, 0, this.radius);
    this.graphics.endFill();

    /* Just a temporary implementation to conform with the book demo.
     * Redraws circle using a new color value.
     */
    this.color_transform = function (colorValue) {
      this.graphics.clear();
      this.graphics.lineStyle(1);
      this.graphics.beginFill(colorValue);
      this.graphics.circle(0, 0, this.radius);
      this.graphics.endFill();
    }
  });
}
