function Ball (radius, color) {
  color = color || "#ff0000";
  return doodle.Sprite(function () {
    this.vx = 0;
    this.vy = 0;
    this.radius = (radius === undefined) ? 40 : radius;
    this.mass = 1;
    
    this.graphics.beginFill(color);
    this.graphics.circle(0, 0, this.radius);
    this.graphics.endFill();
  });
}
